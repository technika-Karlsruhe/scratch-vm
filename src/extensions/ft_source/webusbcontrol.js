
require ("core-js");
require ("regenerator-runtime")
var connecteddevice;
var list = new Array(); //order of tasks: 0 to indWrite-1 normal write, indWrite to indWrite+indIn hat 1 & 10-13 hat 2
var valWrite = new Array(); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(); //values of In-modes
var stor = new Array() // memory 
var charZust=0;
var n=0; 
var outEndpoint
var inEndpoint
var connecteddevice
var inputchange = new Array()
var funcstate= new Array()
var changing= new Array()
var numruns = new Array()
var read=0
var notificationTimer=0
var dir
pwm = [0, 0, 0, 0];
enable = [false, false, false, false];

class LT{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); // setup translation
    }

    configuration=1
    interface=0
    vendorId=0x146A
    productId=0x000A
    name='ROBO LT Controller'//name for USB connection
    indWrite=5
    indOut=6 // 2 motor outputs*3
    indIn=3
    getwriteOut(ind, val, state=true){
        // constants for motor direction states
        Off = 0;
        Left = 1;
        Right = 2;
        Brake = 3;
        pwm=val
        if(ind < this.indOut/3){
            //motor (id, dir = this.Off, speed = 0)
            console.log('motor')
            if(val>0){
                dir=Left
            }else{
                dir=Right
            }
            if(val==0){
                dir=Off
            }
            if (ind < 0 || ind > 1) {
                console.log('Motor id out of range');
            }
            if (dir < Off || dir > Brake) {
                console.log('Illegal motor direction value');
            }
            if (val < 0 || val > 100) {
                console.log('Motor speed out of range');
            }
            console.log("dir: "+dir, "val: "+val, "ind: "+ind)
            enable[2 * ind - 2] = Boolean(dir & 1);
            enable[2 * ind - 1] = Boolean(dir & 2);
            pwm[2 * ind - 2] = val;
            pwm[2 * ind - 1] = val;
        }else{
            //output (id, state, pwm = 0)
            console.log('output')
            if (ind < 2 || ind > 4) {
                console.log('Output id out of range');
            }
            if (typeof state !== 'boolean') {
                console.log('Illegal output state');
            }
            if (pwm < 0 || pwm > 100) {
                console.log('Output pwm out of range');
            }
            console.log("state: "+state, "pwm: "+pwm, "ind: "+ind)
            enable[ind - 1] = state;
            pwm[ind - 1] = pwm;
        }

        // assemble command sequence from pwm/enable state //// beides
        const data = [0xf2, 0, 0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
        if (enable[i]) {
            data[1] |= (1 << i);
        }
        }
        data[2] |= Math.floor(pwm[0] * 8 / 101);
        data[2] |= Math.floor(pwm[1] * 8 / 101) << 3;
        data[2] |= (Math.floor(pwm[2] * 8 / 101) << 6) & 0xff;
        data[3] |= (Math.floor(pwm[2] * 8 / 101) >> 2);
        data[3] |= (Math.floor(pwm[3] * 8 / 101) << 1);

        console.log(data)
        console.log(new Uint8Array(data))
        return(new Uint8Array(data));
    }
    getwriteInMode(ind, val){
        data=this.writeInMode
        data[8]=ind 
        data[9]= val
        return data
    }
    getread(){
        //Returns digital state of inputs I1, I2 and I3
            /*const data = await this.transferIn(6);
            console.log(data)
            console.log(data.value[0])
            return [
              (data[0] & 1) !== 0,
              (data[0] & 2) !== 0,
              (data[0] & 4) !== 0
            ];*/
        
        //Returns analog state of inputs I1 and I3
            /*const data = await this.transferIn(6);
            return [
              data[1] + 256 * (data[4] & 3),
              0.03 * (data[2] + 256 * ((data[4] >> 2) & 3))
            ];*/
        
    }
}

async function listen(){//function which calls itself and regularly reads inputs(it might be helpful to include another function which can restart the listening process to prevent connection loss)
    /*if(charZust==0){
        charZust=1;
        data = type.getread()// get the right command 
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
    }*/
}

class WebUSBDevice{
    connected=false;

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
                        if((valWrite[ind]!=stor[ind][0])&&(valWrite[ind]!=0)&&(stor[ind][0]!=0)){
                            data = type.getwriteOut(ind, 0)
                            connecteddevice.transferOut(outEndpoint, data).then(x=>{  
                                return connecteddevice.transferIn(inEndpoint, 11)
                            }).then(x=>{
                                console.log(x.data)
                                data =  type.getwriteOut(ind,stor[ind][0])
                                return connecteddevice.transferOut(outEndpoint, data)
                            }).then(x=>{
                                return connecteddevice.transferIn(inEndpoint, 11)
                            }).then(x=>{ 
                                console.log(x.data)
                                charZust=0; 
                                valWrite[ind]=val
                                stor[ind].shift();
                                list.shift();
                                this.write()
                            }).catch(error=>{
                                console.log(error)
                            })
                        }else{
                            data =  type.getwriteOut(ind,stor[ind][0])
                            connecteddevice.transferOut(outEndpoint, data).then(x=>{
                                return connecteddevice.transferIn(inEndpoint, 11)
                            }).then(x=>{ 
                                console.log(x.data)
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
                        data= type.getwriteInMode(pos-type.indOut, stor[pos][0])
                        connecteddevice.transferOut(outEndpoint, data).then(x=>{ 
                            return connecteddevice.transferIn(inEndpoint, 11)
                        }).then(x=>{ 
                            console.log(x.data+'done')
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
    

    async connect(){
        type= new LT;
        return connect = new Promise ((resolve, reject) =>{
            navigator.usb.requestDevice({filters: [{ vendorId: type.vendorId, productId: type.productId }]})
            .then((device) => {
                connecteddevice=device
                console.log('Dev connected')
                return connecteddevice.open();
            }).then((device) => {
                console.log('Dev opened')
                return connecteddevice.selectConfiguration(1);
            }).then((device) => {
                return connecteddevice.claimInterface(0);
            }).then((device) => {
                const { alternates } = connecteddevice.configuration.interfaces[0];
                const alternate = alternates[0];
                for (const endpoint of alternate.endpoints) {
                  if (endpoint.direction === "in") {
                    inEndpoint = endpoint.endpointNumber;
                    console.log("in" + inEndpoint);
                  } else if (endpoint.direction === "out") {
                    outEndpoint = endpoint.endpointNumber;
                    console.log("out" + outEndpoint);
                  }
                }
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
            })
        })
    }
}



module.exports = WebUSBDevice;