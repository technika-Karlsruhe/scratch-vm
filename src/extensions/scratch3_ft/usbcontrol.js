const { resolve } = require("core-js/es6/promise");

require ("core-js/stable");
require ("regenerator-runtime/runtime")

var connecteddevice;
var list = new Array(); //order of tasks(index 6 means reading)
var valWrite = new Array(0, 0, 0, 0, 0, 0); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(0, 0, 0, 0, 0, 0); //values of In-modes
var stor = new Array([], [], [] , [], [], []) // memory 
var charZust=0;
var n=0;
var reading=false //currently reading? 
let inEndpoint = undefined;
let outEndpoint = undefined;
var alreadyread=false

async function listen(){
    if(charZust==0){
        charZust=1;
    data = new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
    connecteddevice.transferOut(outEndpoint, data).then(x=>{ 
        return connecteddevice.transferIn(inEndpoint, 60)
    }).then(ans=>{ 
        n=0;
        while(n<ans.data.byteLength-25){
            if(ans.data.getUint8(n+2)==90&&ans.data.getUint8(n+3)==165&&ans.data.getUint8(n+4)==244&&ans.data.getUint8(n+5)==138&&ans.data.getUint8(n+6)==22&&ans.data.getUint8(n+7)==50&&ans.data.getUint8(n+8)==0&&ans.data.getUint8(n+9)==20){
                
                        valIn[2]=ans.data.getUint8(n+13)
                        valIn[3]=ans.data.getUint8(n+17)
                        valIn[4]=ans.data.getUint8(n+21)
                        valIn[5]=ans.data.getUint8(n+25)
                        break;
            }else{
                n=n+1
            }
        }
            charZust=0;
    }).catch(error=>{
        console.log(error)
    })
    setTimeout(()=>{
        listen()

    },30)
}else{
    setTimeout(()=>{
        listen()

    },5)
}
}

class USBDevice{
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
    getfuncstate(){
        return funcstate
    }
    getfuncstate2(){
        return funcstate2
    }
    setfuncstate(val){
        funcstate=val
    }
    setfuncstate2(val){
        funcstate2=val;
    }
    getchanging(){
        return changing
    }
    getchanging2(){
        return changing2
    }
    setchanging(val){
        changing=val;
    }
    setchanging2(val){
        changing2=val
    }
    getnumruns(){
        return numruns
    }
    getnumruns2(){
        return numruns2
    }
    setnumruns(val){
        numruns=val;
    }
    setnumruns2(val){
        numruns2=val
    }
    getreading(){
        return reading
    }
    setalreadyread(val){
        alreadyread=val
    }



     write() { // actual write method
        if(charZust==0&&list.length>0){
            var ind=list[0]
            charZust=1
                if(ind==0||ind==1){
                    if(valWrite[ind]!=stor[ind][0]&&valWrite[ind]!=0&&stor[ind][0]!=0){
                        data = new Uint8Array([ 0x5a, 0xa5, 0x68, 0xce, 0x2a, 0x04, 0, 4,  0, 3, ind, 0 ]);
                        connecteddevice.transferOut(outEndpoint, data).then(x=>{  
                            console.log('xy')
                            return connecteddevice.transferIn(inEndpoint, 11)
                        }).then(x=>{ 
                            console.log(x.data)
                        data = new Uint8Array([ 0x5a, 0xa5, 0x68, 0xce, 0x2a, 0x04, 0, 4,  0, 3, ind, stor[ind][0] ]);
                        return connecteddevice.transferOut(outEndpoint, data)
                        }).then(x=>{
                            return connecteddevice.transferIn(inEndpoint, 11)
                        }).then(x=>{ 
                            console.log(x.data)
                        valWrite[ind]=stor[ind][0];
                        charZust=0;
                        stor[ind].shift();
                        list.shift();
                        if(list.length>0){
                            this.write()
                    }
                })
                        }else{
                    data = new Uint8Array([ 0x5a, 0xa5, 0x68, 0xce, 0x2a, 0x04, 0, 4,  0, 3, ind, stor[ind][0] ]);
                    connecteddevice.transferOut(outEndpoint, data).then(x=>{
                        console.log('xyz')
                        return connecteddevice.transferIn(inEndpoint, 11)
                    }).then(x=>{ 
                        console.log(x.data)
                    valWrite[ind]=stor[ind][0];
                    charZust=0;
                    stor[ind].shift();
                    list.shift();
                    if(list.length>0){
                        this.write()
                    }
                    
                    })
                }
                }else{
                    data = new Uint8Array([ 0x5a, 0xa5, 0x14, 0x34, 0xff, 0x93, 0x00, 0x02,  ind, stor[ind][0]]);
                    connecteddevice.transferOut(outEndpoint, data).then(x=>{ 
                        return connecteddevice.transferIn(inEndpoint, 11)
                    }).then(x=>{ 
                        console.log(x.data)
                        charZust=0;
				        valWrite[ind]=stor[ind][0];
                        list.shift();
				        stor[ind].shift();
				        if(list.length>0){
					this.write()
				}
                
                    })
                }
                }
        
    }
    

      write_Value(ind, val){
        list.push(ind)
        if((ind==0||1)&&val>127){
            if(Notification.permission == "granted"){
                const help = new Notification('Output values range from 0 to 8',{
                    body: 'keep in mind that the maximum output value is 8',
                })
            }
            
            stor[ind].push(127);
        }else{
            stor[ind].push(val) // add value to queue
        }
        if (charZust==0){// if nothig is being changed
            this.write()
            
           
        }
    
    }

    

    getvalIn(ind){
       return valIn[ind]}

    connect = new Promise ((resolve, reject) =>{
        navigator.usb.requestDevice({
            filters: [ { 'vendorId': 0x221d, 'productId': 0x0005 } ],
        }).then(dev => {
            connecteddevice = dev;              // save device for later use
            console.log(" found. Opening ...");
            return connecteddevice.open();
            }).then(function() {
                console.log("Opened. Selecting configuration 1 ...");
            return connecteddevice.selectConfiguration(1);
            }).then(function() {
                console.log("Config ok. Claiming interface 0 ...");
            return connecteddevice.claimInterface(0);
            } ).then(function() {
            console.log("Interface ok, setting bit rate to 115200 bps...");
            return connecteddevice.controlTransferOut({ requestType: 'vendor',
                   recipient: 'device',
                   request: 3,             // set baudrate 
                   value: 3000000/115200,  // to 115200 bit/s
                   index: 0 });
            } ).then(function() {
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
                data = new Uint8Array( [ 0x5a, 0xa5, 0x4e, 0xc5, 0x4e, 0xf7, 0x00, 0x01, 1]);
                return connecteddevice.transferOut(outEndpoint, data);
            }).then(ans=> {
                console.log(ans.data);
                return connecteddevice.transferIn(inEndpoint, 50)
            }).then(ans=> {
                console.log(ans.data);
                data = new Uint8Array( [ 0x5a, 0xa5, 0x90, 0x4c, 0xc3, 0xd8, 0x00, 0x09 , 0, 0, 0, 1, 0, 1, 2, 0, 1]);
                return connecteddevice.transferOut(outEndpoint, data);
            }).then(ans=> {
                console.log(ans.data);
                return connecteddevice.transferIn(inEndpoint, 50)
            }).then(ans=> {
                console.log(ans.data);
                data = new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
                return connecteddevice.transferOut(outEndpoint, data)
            }).then(ans=> {
                console.log(ans.data);
                return connecteddevice.transferIn(inEndpoint, 50)
            }).then(ans=> {
                console.log(ans.data);
                charZust=0;
                listen()
                resolve (connecteddevice)    
            }).catch(error => {
               reject(error);
            });
        })
}

module.exports = USBDevice;