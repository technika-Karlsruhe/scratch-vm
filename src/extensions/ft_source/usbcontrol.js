require ("core-js");
require ("regenerator-runtime")

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
var port
//Controller specifications 
class BTSmart {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); // setup translation
    }
    request=3
    baudRate= 115200
    value=3000000/115200
    configuration=1
    interface=0
    usbVendorId=8733
    usbProductId=5
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

class TX{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); // setup translation
    }
    request=9
    value=38400
    configuration=1
    interface=1
    vendorId=0x221D
    productId=0x1000
    writeOut = new Uint8Array([ 0x5a, 0xa5, 0x68, 0xce, 0x2a, 0x04, 0, 4,  0, 3, 0, 0]);
    writeInMode = new Uint8Array([ 0x5a, 0xa5, 0x14, 0x34, 0xff, 0x93, 0x00, 0x02, 0, 0]);
    writeLED= new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
    read= new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
    inputOffset=2 //amout of values ignored when reading
    inputHeader= new Array(90, 165, 244, 138, 22, 50, 0, 20)
    indIn=8 // Number of Inputs
    inLength=24
    indOut=4 // Number of outputs
    indWrite=8  //2 motor outputs+4 Input mode calibrations
    indSum=10 // Sum of all characteristics which are permanently accessed (not LED)
    name='ROBO TX Controller'//name for USB connection
}

async function listen(){//function which calls itself and regularly reads inputs(it might be helpful to include another function which can restart the listening process to prevent connection loss)
    if(charZust==0){
        charZust=1;
        data = type.read// get the right command 
        writer= connecteddevice.writable.getWriter()
        writer.write(data).then(x=>{ 
            writer.releaseLock()
            reader=connecteddevice.readable.getReader()
            return reader.read() // read some of the incoming values 
        }).then(ans=>{ 
            reader.releaseLock()
            n=0;
            while(n<ans.value.byteLength-1-type.inLength){// go through the array
                if(ans.value[n+type.inputOffset]==type.inputHeader[0]&&ans.value[n+type.inputOffset+1]==type.inputHeader[1]&&ans.value[n+2+type.inputOffset]==type.inputHeader[2]&&ans.value[n+3+type.inputOffset]==type.inputHeader[3]&&ans.value[n+4+type.inputOffset]==type.inputHeader[4]&&ans.value[n+5+type.inputOffset]==type.inputHeader[5]&&ans.value[n+6+type.inputOffset]==type.inputHeader[6]&&ans.value[n+7+type.inputOffset]==type.inputHeader[7]){
                    //check if the right header can be found
                    for(var i=0; i<type.indIn ; i=i+1){// read at the right positions 
                        valIn[i+type.indOut]=ans.value[n+13+4*i]
                        if(ans.value[n+11+i*4]==10){
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
    connected=false;
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
                    var val=stor[ind][0]
                    if(ind<type.indOut){ // motor outputs
                        if((valWrite[ind]!=stor[ind][0])&&(valWrite[ind]!=0)&&(stor[ind][0]!=0)){ // do we need to set it to 0 first to avoid sudden changes?
                            data = type.writeOut 
                            data[8]=ind // chnaging copy of writeOut
                            writer= connecteddevice.writable.getWriter()
                            writer.write(data).then(x=>{ 
                                writer.releaseLock()
                                return 5
                            }).then(x=>{  //Writing different motor outputs might also work with one command which simultaneously chnages output values 
                                data =  type.writeOut
                                data[8]=ind
                                data[11]=stor[ind][0] 
                                writer= connecteddevice.writable.getWriter()
                                return  writer.write(data)                               
                            }).then(x=>{
                                writer.releaseLock()
                                return 5
                            }).then(x=>{ 
                                charZust=0; 
                                valWrite[ind]=val
                                stor[ind].shift();
                                list.shift();
                                this.write()
                            }).catch(error=>{
                                    console.log(error)
                            })
                        }else{
                            data =  type.writeOut
                            data[8]=ind
                            data[11]=stor[ind][0]
                            writer= connecteddevice.writable.getWriter()
                                 writer.write(data).then(x=>{ 
                                writer.releaseLock()
                                return 5
                            }).then(x=>{ 
                                valWrite[ind]=val
                                charZust=0;
                                stor[ind].shift();
                                list.shift();
                                this.write()
                            }).catch(error=>{
                                console.log(error)
                        })
                        }
                    }else{
                        data= type.writeInMode
                        data[8]= pos-type.indOut
                        data[9]=stor[pos][0]
                        writer= connecteddevice.writable.getWriter()
                        writer.write(data).then(x=>{ 
                            writer.releaseLock()
                            return 5
                        }).then(x=>{ 
                            charZust=0;
                            valWrite[pos]=val
                            list.shift();
                            stor[pos].shift();
                            this.write()
                        }).catch(error=>{
                            console.log(error)
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
            case 'BTReceiver':
                swal (translate._getText('usbnotsupport',this.locale))
            break;
            case 'Robby':
                swal (translate._getText('usbnotsupport',this.locale))
            break;
            case 'TX':
                type= new TX;
                break;
        }
        return connect = new Promise ((resolve, reject) =>{
            navigator.serial.requestPort({filters:[{usbVendorId: type.usbVendorId, usbProductId: type.usbProductId}] })
        .then((port) => {
            console.log(port)
            console.log(port.getInfo())
            console.log(connecteddevice)
            connecteddevice= port
            return port.open({baudRate: 115200})
        }).then((data) => { 
            writer = connecteddevice .writable.getWriter();
            data= type.writeLED
            return writer.write(data)
        }).then((data) => { 
            writer.releaseLock()
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
                this.connected=true
                resolve (connecteddevice)    
            }).catch(error => {
               reject(error);
            });
        })
    }
    async autoconnect(){// connect to controller 
        return autoconnect = new Promise ((resolve, reject) =>{ // try to automatically connect
           navigator.serial.getPorts({}).then((ports) => {// get all port we have access to 
                console.log(`Total devices: ${ports.length}`);
                ports.forEach((port) => {
                    if(port.getInfo().usbProductId==5){
                        connecteddevice=port// save device for later use
                        type= new BTSmart;
                    }//elif(){} additional usb controllers 
                }); 
                console.log(ports)
                if(connecteddevice==undefined){
                    reject('no');
                }
                console.log(connecteddevice)
                return connecteddevice.open({baudRate: type.baudRate})
            }).then((data) => { 
                writer = connecteddevice .writable.getWriter();
                data= type.writeLED
                return writer.write(data)
            }).then((data) => { 
                writer.releaseLock()
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
                    this.connected=true
                    resolve (connecteddevice)    
                }).catch(error => {
                   reject(error);
                });
        })
    }
}

module.exports = USBDevice;