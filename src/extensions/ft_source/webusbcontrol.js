
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
    indOut=2
    indIn=3


}
async function listen(){//function which calls itself and regularly reads inputs(it might be helpful to include another function which can restart the listening process to prevent connection loss)
    if(charZust==0){
        charZust=1;
        connecteddevice.transferIn(inEndpoint, 6)
        .then(ans=>{ 
            console.log(ans.data)
            console.log(ans.data.getUint8(0))

            //insert input logic here 
        })
    }
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