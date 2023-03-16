require ("core-js");
require ("regenerator-runtime")

const Translation = require('./translation');
var connecteddevice;
var list = new Array(); //order of tasks: 0 to indWrite-1 normal write, indWrite to indWrite+indIn hat 1 & 10-13 hat 2
var valWrite = new Array(); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(); //values of In-modes
var stor = new Array() // memory 
var charZust=0;
var n=0; 
let inEndpoint = undefined;
let outEndpoint = undefined;
var inputchange = new Array()
var funcstate= new Array()
var changing= new Array()
var numruns = new Array()
var read=0
var notificationTimer=0
var translate = new Translation();
translate.setup();
//Controller specifications 
class BTSmart {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;  
    }
    request=3
    value=3000000/115200
    configuration=1
    interface=0
    vendorId=0x221d
    productId=0x0005
    writeOut = new Uint8Array([ 0x5a, 0xa5, 0x68, 0xce, 0x2a, 0x04, 0, 4,  0, 3, 0, 0]);
    writeInMode = new Uint8Array([ 0x5a, 0xa5, 0x14, 0x34, 0xff, 0x93, 0x00, 0x02, 0, 0]);
    writeLED= new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
    read= new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
    inputOffset=2 //amout of values ignored when reading 
    inputHeader= new Array(90, 165, 244, 138, 22, 50, 0, 20)
    indIn=4 // Number of Inputs
    inLength=24
    indOut=2 // Number of outputs
    indWrite=6  //2 motor outputs+4 Input mode calibrations
    indSum=10 // Sum of all characteristics which are permanently accessed (not LED)
    name='BT Smart Controller'//name for USB connection 
}


async function listen(){//function which calls itself and regularly reads inputs(it might be helpful to include another function which can restart the listening process to prevent connection loss)
    if(charZust==0){
        charZust=1;
        data = type.read// get the right command 
        connecteddevice.transferOut(outEndpoint, data).then(x=>{ 
            return connecteddevice.transferIn(inEndpoint, 60) // read some of the incoming values 
        }).then(ans=>{ 
            n=0;
            while(n<ans.data.byteLength-1-type.inLength){// go through the array
                if(ans.data.getUint8(n+type.inputOffset)==type.inputHeader[0]&&ans.data.getUint8(n+type.inputOffset+1)==type.inputHeader[1]&&ans.data.getUint8(n+2+type.inputOffset)==type.inputHeader[2]&&ans.data.getUint8(n+3+type.inputOffset)==type.inputHeader[3]&&ans.data.getUint8(n+4+type.inputOffset)==type.inputHeader[4]&&ans.data.getUint8(n+5+type.inputOffset)==type.inputHeader[5]&&ans.data.getUint8(n+6+type.inputOffset)==type.inputHeader[6]&&ans.data.getUint8(n+7+type.inputOffset)==type.inputHeader[7]){
                    //check if the right header can be found
                    for(var i=0; i<type.indIn ; i=i+1){// read at the right positions 
                        valIn[i+type.indOut]=ans.data.getUint8(n+13+4*i)
                        if(ans.data.getUint8(n+11+i*4)==10){
                            valWrite[i+type.indOut]=0x0a
                        }else{
                            valWrite[i+type.indOut]=0x0b
                        }
                    }
                    break;
                }else{
                    n=n+1
                }
            }
            if(read=1){// important for change function 
                read=2
            }
            charZust=0;
        }).catch(error=>{
            console.log(error)
        })
        setTimeout(()=>{// call again after short delay
            listen()
        },5)
    }else{
        setTimeout(()=>{// if we were unable to read, try again 
            listen()
        },0)
    }
}

class USBDevice{
    reset(){// clear storage and set all outputs to 0
        for(var i=0; i<type.indWrite; i=i+1){
            for(var n=0; n<stor[i].length; n=n+1){
                stor[i].shift()
            }
        }
        for(var n=0; n<type.indOut; n=n+1){
            this.write_Value(n, 0)
        }
    }    
    controllertype;
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;  
    }
    // getter and setter 
    getstor(ind){
        return stor[ind];
    }
    setstor(ind1,ind2,val){
        stor[ind1][ind2]=val;
    }
    getvalWrite(ind){
        return valWrite[ind];
    }
    setvalWrite(ind,val){
        valWrite[ind]=val
    }
    getvalIn(ind){
        console.log('xyz'+ind);
        return valIn[ind];
    }
    getfuncstate(ind){
        return funcstate[ind]
    }
    setfuncstate(ind, val){
        funcstate[ind]=val
    }
    getchanging(ind){
        return changing[ind]
    }
    setchanging(ind, val){
        changing[ind]=val;
    }
    getnumruns(ind){
        return numruns[ind]
    }
    setnumruns(ind, val){
        numruns[ind]=val;
    }
    getvalIn(ind){
       return valIn[ind]
    }
    /*getreading(){
        return reading
    }
    setalreadyread(val){
        alreadyread=val
    }*/

    changeInMode (args){ // Called By Hats to handle wrong input modes
        if(valWrite[parseInt(args.INPUT)]==0x0b){
            var val=0x0a
        }else{
            var val=0x0b
        }
        if(funcstate[parseInt(args.INPUT)]==0){ // not already chaning 
            read=0// reset the read variable which indicates if the input value has already been read after the imode was changed 
            inputchange[parseInt(args.INPUT)].push(val); // set current value 
            funcstate[parseInt(args.INPUT)]=1; // chnaing 
            list.splice(0, 0, (parseInt(args.INPUT))) // more important than other changes 
            stor[(parseInt(args.INPUT))].splice(0, 0,val)
            if(charZust==0){
                this.write()
            }
        }
        
        if(inputchange[parseInt(args.INPUT)][0]!=valWrite[parseInt(args.INPUT)]&&read==0){ // change has occured 
            read=1 // now we wait until we have read the inputs 
        }

        if(read==2){// inputs read-> reset all variables 
            read=0
            inputchange[parseInt(args.INPUT)].shift();
            funcstate[parseInt(args.INPUT)]=0;
            changing[parseInt(args.INPUT)]=false;
            numruns[parseInt(args.INPUT)]=0;
        }
    }

    write() { // actual write method
        var ind=list[0]
        if(ind>type.indWrite){ // check if called from inputchange or not 
            var pos=ind-type.indIn
        }else{
            var pos=ind
        }
        if(list.length>0){
            if(valWrite[ind]==stor[pos][0]){ //if the output is already up to date--> skip value
                stor[pos].shift()
                list.shift()
            
                this.write (ind)// write is also a selfcalling method which handels output communication
            }else{
                if(charZust==0&&list.length>0){ // check if channel is free and there are new output values  
                    charZust=1 // blocking communication
                    if(ind<type.indOut){ // motor outputs
                        if((valWrite[ind]!=stor[ind][0])&&(valWrite[ind]!=0)&&(stor[ind][0]!=0)){ // do we need to set it to 0 first to avoid sudden changes?
                            data = type.writeOut 
                            data[8]=ind // chnaging copy of writeOut
                            connecteddevice.transferOut(outEndpoint, data).then(x=>{  
                                console.log('xy')
                                return connecteddevice.transferIn(inEndpoint, 11)
                            }).then(x=>{  //Writing different motor outputs might also work with one command which simultaneously chnages output values 
                                console.log(x.data)
                                valWrite[ind]=stor[ind][0];
                                data =  type.writeOut
                                data[8]=ind
                                data[11]=stor[ind][0]
                                return connecteddevice.transferOut(outEndpoint, data)
                            }).then(x=>{
                                return connecteddevice.transferIn(inEndpoint, 11)
                            }).then(x=>{ 
                                console.log(x.data)
                                charZust=0;
                                stor[ind].shift();
                                list.shift();
                                this.write()
                            })
                        }else{
                            data =  type.writeOut
                            data[8]=ind
                            data[11]=stor[ind][0]
                            connecteddevice.transferOut(outEndpoint, data).then(x=>{
                                console.log('xyz')
                                return connecteddevice.transferIn(inEndpoint, 11)
                            }).then(x=>{ 
                                console.log(x.data)
                                valWrite[ind]=stor[ind][0];
                                charZust=0;
                                stor[ind].shift();
                                list.shift();
                                this.write()
                            })
                        }
                    }else{
                        data= type.writeInMode
                        data[8]= pos-type.indOut
                        data[9]=stor[pos][0]
                        connecteddevice.transferOut(outEndpoint, data).then(x=>{ 
                            return connecteddevice.transferIn(inEndpoint, 11)
                        }).then(x=>{ 
                            console.log(x.data+'done')
                            charZust=0;
                            valWrite[pos]=stor[pos][0];
                            list.shift();
                            stor[pos].shift();
                            this.write()
                        })
                    }
                }else{
                    setTimeout(()=>{// write function will call itself after delay 
                        this.write()
                    },2)
                }
            }
        }else{
            setTimeout(()=>{
                this.write()
            },2)
        }
    }

    write_Value(ind, val){ // writing handler--> this is the function any block should call
        if((ind<type.indOut)&&val>127){// value entered is larger than 8 
            var res=127
            if(notificationTimer==0){
                translate.setup();
                if(Notification.permission == "granted"){
                    const help = new Notification(translate._getText('range',this.locale),{
                        body: translate._getText('maximum',this.locale),
                    })
                }
            notificationTimer=1
            setTimeout(()=>{ 
                notificationTimer=0;
            },50000)
        }
        }else{
            var res=val
        }
        if(stor[ind].length<5){ //if the que gets to long (values are added faster than deleted, we only safe the last values )
            list.push(ind)
            stor[ind].push(res)// add value to queue
            if (charZust[ind]==0){ // if nothig is being changed
                this.write(ind);
            }
        }else{
            stor[ind].splice(4,1)
            stor[ind].push(res)
        }
    }



    async connect(){// connect to controller 
        switch(this.controllertype){
            case 'BTSmart':
                type= new BTSmart;
                break;
        }
        return connect = new Promise ((resolve, reject) =>{
            navigator.usb.requestDevice({
                filters: [ { 'vendorId': type.vendorId, 'productId': type.productId } ],
            }).then(dev => {
                connecteddevice = dev;              // save device for later use
                console.log(" found. Opening ...");
                return connecteddevice.open();
            }).then(function() {
                console.log("Opened. Selecting configuration 1 ...");
                return connecteddevice.selectConfiguration(type.configuration);
            }).then(function() {
                console.log("Config ok. Claiming interface 0 ...");
                return connecteddevice.claimInterface(type.interface);
            }).then(function() {
                console.log("Interface ok, setting bit rate to 115200 bps...");
                return connecteddevice.controlTransferOut({ requestType: 'vendor',
                    recipient: 'device',
                    request: type.request,             // set baudrate 
                    value: type.value,  // to 115200 bit/s
                    index: 0 });
            }).then(function() {
                console.log("Bitrate set. Setting default M1 state ...");
                for (const { alternates } of connecteddevice.configuration.interfaces) {
                    // Only support devices with out multiple alternate interfaces.
                    const alternate = alternates[0];

                    // Identify the interface implementing the USB CDC class
                    for (const endpoint of alternate.endpoints) {

                        if (endpoint.direction === "in") {
                            inEndpoint = endpoint.endpointNumber;
                            console.log('in'+inEndpoint)
                        } else if (endpoint.direction === "out") {
                            outEndpoint = endpoint.endpointNumber;
                            console.log('out'+outEndpoint)
                        }
                    }
                }
                return connecteddevice.transferIn(inEndpoint, 50)
            }).then(ans=> {
                console.log(ans.data);
                data = type.writeLED
                return connecteddevice.transferOut(outEndpoint, data)
            }).then(ans=> {
                console.log(ans.data);
                return connecteddevice.transferIn(inEndpoint, 50)// read all to clear the input stream 
            }).then(ans=> {
                console.log(ans.data);
                charZust=0;
                read=0
                for(var i=0; i<type.indWrite; i=i+1){// set all varibles 
                    inputchange[i]=[]
                    inputchange[i][0]=0
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                }
                listen()// setup the two selfcalling functions 
                this.write()
                resolve (connecteddevice)    
            }).catch(error => {
               reject(error);
            });
        })
    }
    async autoconnect(){// connect to controller 
        switch(this.controllertype){
            case 'BTSmart':
                type= new BTSmart;
                break;
        }
        return autoconnect = new Promise ((resolve, reject) =>{
            navigator.usb.getDevices().then((devices) => {
                console.log(`Total devices: ${devices.length}`);
                devices.forEach((device) => {
                    if(device.productName=='BT Smart Controller'){
                        connecteddevice=device// save device for later use
                    }
                }); 
                console.log(" found. Opening ...");
                return connecteddevice.open();
            }).then(function() {
                console.log("Opened. Selecting configuration 1 ...");
                return connecteddevice.selectConfiguration(type.configuration);
            }).then(function() {
                console.log("Config ok. Claiming interface 0 ...");
                return connecteddevice.claimInterface(type.interface);
            }).then(function() {
                console.log("Interface ok, setting bit rate to 115200 bps...");
                return connecteddevice.controlTransferOut({ requestType: 'vendor',
                    recipient: 'device',
                    request: type.request,             // set baudrate 
                    value: type.value,  // to 115200 bit/s
                    index: 0 });
            }).then(function() {
                console.log("Bitrate set. Setting default M1 state ...");
                for (const { alternates } of connecteddevice.configuration.interfaces) {
                    // Only support devices with out multiple alternate interfaces.
                    const alternate = alternates[0];

                    // Identify the interface implementing the USB CDC class
                    for (const endpoint of alternate.endpoints) {

                        if (endpoint.direction === "in") {
                            inEndpoint = endpoint.endpointNumber;
                            console.log('in'+inEndpoint)
                        } else if (endpoint.direction === "out") {
                            outEndpoint = endpoint.endpointNumber;
                            console.log('out'+outEndpoint)
                        }
                    }
                }
                return connecteddevice.transferIn(inEndpoint, 50)
            }).then(ans=> {
                console.log(ans.data);
                data = type.writeLED
                return connecteddevice.transferOut(outEndpoint, data)
            }).then(ans=> {
                console.log(ans.data);
                return connecteddevice.transferIn(inEndpoint, 50)// read all to clear the input stream 
            }).then(ans=> {
                console.log(ans.data);
                charZust=0;
                read=0
                for(var i=0; i<type.indWrite; i=i+1){// set all varibles 
                    inputchange[i]=[]
                    inputchange[i][0]=0
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                }
                listen()// setup the two selfcalling functions 
                this.write()
                resolve (connecteddevice)    
            }).catch(error => {
               reject(error);
            });
        })
    }
}

module.exports = USBDevice;