const c = require("@vernier/godirect/dist/godirect.min.umd");

require ("core-js");
require ("regenerator-runtime")

var connecteddevice;
var valWrite = new Array(); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(); //values of In-modes
var e=0;
var g=0;
var f=0;
var s=0
var charWrite = new Array (); // chars of all writable (0, 1 --> Motor; 2-5--> Inputs)
var charZust = new Array (); //Represents pending promises--> first two for M1; M2 next four IModes 1-4 -->0: no promise pending, characteristic can be written, | 1: wait until the promise is resolved
var stor = new Array() // memory 
var charI = new Array (); 
var serviceOut;
var serviceIn;
var serviceIMode;
var funcstate= new Array()
var changing= new Array()
var numruns = new Array()
var type
var notificationTimer=0
//Controller specifications 
class BTSmart {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); //setup translation
    }
    uuidLED='8ae87e32-ad7d-11e6-80f5-76304dec7eb7' 
    uuidsOut= new Array('8ae8860c-ad7d-11e6-80f5-76304dec7eb7','8ae88b84-ad7d-11e6-80f5-76304dec7eb7')
    uuidsIn = new Array('8ae89a2a-ad7d-11e6-80f5-76304dec7eb7','8ae89bec-ad7d-11e6-80f5-76304dec7eb7','8ae89dc2-ad7d-11e6-80f5-76304dec7eb7','8ae89f66-ad7d-11e6-80f5-76304dec7eb7')
    uuidsIM = new Array('8ae88efe-ad7d-11e6-80f5-76304dec7eb7','8ae89084-ad7d-11e6-80f5-76304dec7eb7','8ae89200-ad7d-11e6-80f5-76304dec7eb7','8ae89386-ad7d-11e6-80f5-76304dec7eb7')
    indIn=4 // Number of Inputs
    indServo=0
    indOut=6 // Number of outputs
    indSum=10 // Sum of all characteristics which are permanently accessed (not LED)
    name='BT Smart Controller'//name for BLE connection 
    serviceOutuuid='8ae883b4-ad7d-11e6-80f5-76304dec7eb7'
    serviceInuuid='8ae8952a-ad7d-11e6-80f5-76304dec7eb7'
    serviceIModeuuid='8ae88d6e-ad7d-11e6-80f5-76304dec7eb7'
    serviceLEDuuid='8ae87702-ad7d-11e6-80f5-76304dec7eb7'
    services= [this.serviceOutuuid, this.serviceInuuid, this.serviceIModeuuid, this.serviceLEDuuid]
}

class BTReceiver{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); //setup translation
    }
    uuidLED='2e582de2-c5c5-11e6-9d9d-cec0c932ce01'
    uuidsOut= new Array('2e583378-c5c5-11e6-9d9d-cec0c932ce01','2e58358a-c5c5-11e6-9d9d-cec0c932ce01', '2e583666-c5c5-11e6-9d9d-cec0c932ce01', '2e5837b0-c5c5-11e6-9d9d-cec0c932ce01')
    indOut=9 // Number of outputs
    indServo=1//Number of servo outputs
    indSum=4 // Sum of all characteristics which are permanently accessed (not LED)
    indIn=0;
    name='BT Control Receiver'//name for BLE connection
    serviceOutuuid='2e58327e-c5c5-11e6-9d9d-cec0c932ce01'
    serviceLEDuuid='2e582b3a-c5c5-11e6-9d9d-cec0c932ce01'
    services= [this.serviceOutuuid, this.serviceLEDuuid]
}

class Robby{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); //setup translation
    }
    uuidLED='7b130101-ce8d-45bb-9158-631b769139e9'
    uuidsOut= new Array('7b130102-ce8d-45bb-9158-631b769139e9','7b130103-ce8d-45bb-9158-631b769139e9')
    uuidsIn = new Array('7b130104-ce8d-45bb-9158-631b769139e9','7b130105-ce8d-45bb-9158-631b769139e9','7b130106-ce8d-45bb-9158-631b769139e9','7b130107-ce8d-45bb-9158-631b769139e9')
    indIn=4 // Number of Inputs
    indServo=0
    indOut=6 // Number of outputs
    indSum=6 // Sum of all characteristics which are permanently accessed (not LED)
    name='Robby'//name for BLE connection
    serviceOutuuid='7b130100-ce8d-45bb-9158-631b769139e9'
    serviceInuuid='7b130100-ce8d-45bb-9158-631b769139e9'
    serviceLEDuuid='7b130100-ce8d-45bb-9158-631b769139e9'
    services= [this.serviceOutuuid, this.serviceInuuid, this.serviceLEDuuid]
}

class TXT40{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); //setup translation
    }
    uuidLED='8ae87e32-ad7d-11e6-80f5-76304dec7eb7' 
    uuidsOut= new Array('8ae8860c-ad7d-11e6-80f5-76304dec7eb7','8ae88b84-ad7d-11e6-80f5-76304dec7eb7')
    uuidsIn = new Array('8ae89a2a-ad7d-11e6-80f5-76304dec7eb7','8ae89bec-ad7d-11e6-80f5-76304dec7eb7','8ae89dc2-ad7d-11e6-80f5-76304dec7eb7','8ae89f66-ad7d-11e6-80f5-76304dec7eb7')
    uuidsIM = new Array('8ae88efe-ad7d-11e6-80f5-76304dec7eb7','8ae89084-ad7d-11e6-80f5-76304dec7eb7','8ae89200-ad7d-11e6-80f5-76304dec7eb7','8ae89386-ad7d-11e6-80f5-76304dec7eb7')
    indIn=4 // Number of Inputs
    indServo=0
    indOut=6 // Number of outputs
    indSum=10 // Sum of all characteristics which are permanently accessed (not LED)
    name='fischertechnik TXT 4.0 Controller'//name for BLE connection 
    serviceOutuuid='8ae883b4-ad7d-11e6-80f5-76304dec7eb7'
    serviceInuuid='8ae8952a-ad7d-11e6-80f5-76304dec7eb7'
    serviceIModeuuid='8ae88d6e-ad7d-11e6-80f5-76304dec7eb7'
    serviceLEDuuid='8ae87702-ad7d-11e6-80f5-76304dec7eb7'
    services= [this.serviceOutuuid, this.serviceInuuid, this.serviceIModeuuid, this.serviceLEDuuid]
}

var input = { // event handler; if a controller with more inputs is added, further input functions have to be added
	in_0: function (event){
        if (type.name == 'Robby') {
            let controllerValue = event.target.value.getUint8(0);
            // Check if button 1 is pressed
            let isButton1Pressed = (controllerValue & 0x01) !== 0;
            valIn[6] = isButton1Pressed ? 0 : 255;
            // Check if button 2 is pressed
            let isButton2Pressed = (controllerValue & 0x02) !== 0;
            valIn[7] = isButton2Pressed ? 0 : 255;
            // Check if trail sensor 1 has been triggered
            let isSensor1Triggered = (controllerValue & 0x10) !== 0;
            valIn[8] = isSensor1Triggered ? 0 : 255;
            // Check if trail sensor 2 has been triggered
            let isSensor2Triggered = (controllerValue & 0x20) !== 0;
            valIn[9] = isSensor2Triggered ? 0 : 255;
        }else{
            valIn[6] = event.target.value.getUint8(0); // closed --><255 valIN[2] is correct do not change
        }
    },
	in_1: function (event){
        valIn[7] = event.target.value.getUint8(0); // valIN[3] is correct do not change
    },
	in_2: function (event){
        valIn[8] = event.target.value.getUint8(0); // valIN[4] is correct do not change
    },
	in_3: function (event){
        valIn[9] = event.target.value.getUint8(0); // valIN[5] is correct do not change
    }
};




function connectIn(){ // automatic connection of all Inputs and event Listeners+Notifications
	characteristic=serviceIn.getCharacteristic(type.uuidsIn[e]).then(
		function connectI (characteristic){
			characteristic.addEventListener('characteristicvaluechanged', input['in_'+e]);
			characteristic.startNotifications();
			charI[e+type.indOut]=characteristic;
			charI[e+type.indOut].readValue();
		}
	).then(
		function ehoeher(){
			e=e+1;
			if(e<type.indIn){
				connectIn();
			}else {
				
			}
		}
	)
}

function connectServo(){
    if(type.indServo>0){
        serviceOut.getCharacteristics().then(x=>{
            charWrite[type.indOut+type.indIn]=   x[3]
            valWrite[type.indOut+type.indIn]=0;
            return x[3].writeValue(new Uint8Array([0]))
        }).then(x=>{
            s=s+1
            if(s<type.indServo){
                indServo();
            }else {
                
            }
        })
    }
}

function connectOut(){ //connection of all Outputs
	characteristic=serviceOut.getCharacteristic(type.uuidsOut[f]).then(
        characteristic=>{
            charWrite[f]=characteristic;
            return charWrite[f].writeValue(new Uint8Array([0]));
        }).then(x=>{
            valWrite[f]=0;
            f=f+1
            if(f<type.indOut/3){
                connectOut()
            }else{
                
            }
        })
}

function connectIMo(){ // connection of IModes
	characteristic=serviceIMode.getCharacteristic(type.uuidsIM[g]).then(
        function connect (characteristic){
            charWrite[g+type.indOut]=characteristic;
            charWrite[g+type.indOut].writeValue(new Uint8Array([0x0b]));
            valWrite[g+type.indOut]=0x0b;
        }
	).then(
	    function ghoeher(){
            g=g+1;
            if(g<type.indIn){
                connectIMo();
            }else{
                
            }
        }
	)
}


class BLEDevice {

    reset(){ //when the red button is pressed all motors are stopped and the storage is cleared 
        for(var i=0; i<(type.indOut+type.indIn+type.indServo); i=i+1){
            for(var n=0; n<stor[i].length; n=n+1){
                stor[i].shift()
            }
        }
        for(var n=0; n<type.indOut/3; n=n+1){
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
   
    disconnect() {//--> called to disconnect BLE devices
        connecteddevice.gatt.disconnect()
    }

    connecthand(){// wait util all features have been initialized 
        if (f==(type.indOut/3)&&g==type.indIn&&e==type.indIn&&s==type.indServo){
            this.connected=true 
            buttonpressed = false 
            alert("connecthand done")
            f=0
            g=0
            e=0
            s=0
        }else{
            setTimeout(()=>{   
                this.connecthand()
            },50)
        }
    }

    write (ind){ // actual write method
        if(valWrite[ind]==stor[ind][0]){ // if we would write the same value again we can skip it in order to not block the connection
            stor[ind].shift()
            if(stor[ind].length>0){ // if there are still elements in the storage do it again 
                this.write (ind)
            }
        }else{
            if(charZust[ind]==0&&stor[ind].length>0){ // if nothing is being changed and storage is not empty
                var val=stor[ind][0] // we have to save the value, if the storage is cleared while the write command is executed valWrite might receive a false value 
                charZust[ind]=1; // switch to currently changing
                if(ind<type.indOut){//an output value has to be changed  
                    if (valWrite[ind]==stor[ind][0]||valWrite[ind]==0||stor[ind][0]==0){//if none of these is true, we have to stop the motor first 
                        charWrite[ind].writeValue(new Uint8Array([stor[ind][0]])).then(x=>{ // write value 
                            valWrite[ind]=val // change memory 
                            charZust[ind]=0; // switch to no curret task
                            stor[ind].shift(); // delete from storage 
                            if(stor[ind].length>0){ // if there are still elements in the storage do it again 
                                this.write (ind)
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    }else{
                        charWrite[ind].writeValue(new Uint8Array(0)).then(x=>{ //stop motor
                            charWrite[ind].writeValue(new Uint8Array([stor[ind][0]])).then(x=>{ // write value 
                                valWrite[ind]=val // change memory 
                                charZust[ind]=0; // switch to no curret task
                                stor[ind].shift(); // delete from storage 
                                if(stor[ind].length>0){ // if there are still elements in the storage do it again 
                                    this.write (ind)
                                }
                            })
                        }).catch(error => {
                            console.log(error)
                        })
                    }
                }else{
                    charWrite[ind].writeValue(new Uint8Array([stor[ind][0]])).then(x=>{ //change Input mode
                        charZust[ind]=0;
                        valWrite[ind]=val;
                        stor[ind].shift();
                        if(stor[ind].length>0){
                            this.write (ind)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                }
            }
        }
    }

    changeInMode (args){ // Called By Hats to handle wrong input modes
        if(funcstate[parseInt(args.INPUT)]==0){ //function is called for the first time 
            funcstate[parseInt(args.INPUT)]=1
            charI[parseInt(args.INPUT)].stopNotifications().then(x =>{ // no unwanted signal
                if(valWrite[parseInt(args.INPUT)]==0x0b){ // change mode
                    var val=0x0a; 
                }else{
                    var val=0x0b; 
                }
                charWrite[parseInt(args.INPUT)].writeValue(new Uint8Array([val])).then(x =>{
                    return charI[parseInt(args.INPUT)].readValue(); //Reading a Value with the new Input mode (to avoid an "old value" being stored)
                }).then(x =>{
                    return charI[parseInt(args.INPUT)].startNotifications()//Notifications are enabled again
                }).then(x =>{ 
                    return charI[parseInt(args.INPUT)].readValue(); //to ensure that we don't read a false value, we read the current value
                }).then(x =>{
                    valWrite[parseInt(args.INPUT)]=val;
                    charZust[parseInt(args.INPUT)]=0;
                    changing[parseInt(args.INPUT)]=false;
                    funcstate[parseInt(args.INPUT)]=0;
                    numruns[parseInt(args.INPUT)]=0;
                    
                });
            })
        }else{
        }
    }

    write_Value(ind, val){ // writing handler--> this is the method any block should call
        if(((ind<type.indOut)||(ind<(type.indOut+type.indIn+type.indServo)&&(ind>=(type.indOut+type.indIn))))&&val>127){// value entered is larger than 8 
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
        if(stor[ind].length<5){//if the que gets to long (values are added faster than deleted, we only safe the last values )
            stor[ind].push(res)// add value to queue
            if (charZust[ind]==0){ // if nothig is being changed
                this.write(ind);
            }
        }else{
            stor[ind].splice(4,1)// delete value at 4. position
            stor[ind].push(res)//add newest value
        }
    }
    
    async connect (){// connection function 
        alert("Controllertype is" + this.controllertype)
        switch(this.controllertype){
            case 'BTSmart':
                type= new BTSmart; // to use the rigth variables 
            break;
            case 'BTReceiver':
                type= new BTReceiver;
            break;
            case 'Robby':
                type= new Robby;
            break;
            case 'TXT40':
                type= new TXT40;
            break;
        }
        console.log(type)
        return connect = new Promise ((resolve, reject) =>{
            navigator.bluetooth.requestDevice({
                filters: [{ name: type.name }],
                optionalServices: type.services
            }).then(device => {
                console.log("Device found. Connecting ...");
                //device.addEventListener('gattserverdisconnected', onDisconnected);
                connecteddevice=device;
                return connecteddevice.gatt.connect();       
            }).then(server => {
                console.log("Connected. Searching for output service ...");
                return server.getPrimaryServices() ;
            }).then(services => {
                console.log("Service found. Requesting characteristic ...");
                console.log (services.map(s =>s.uuid).join('\n' + ' '.repeat(19)));
                if(type.serviceOutuuid!=undefined){
                    for(i=0; i<services.length; i=i+1){
                        console.log(i+services[i].uuid);
                        if(services[i].uuid==type.serviceOutuuid){//matching services 
                            serviceOut=services[i]
                            i=10
                        }
                    }
                }; // wichtig... müssen wir für jeden service so implementieren, dann alle Characteristics einzeln einmal übernemen, dann kann man die recht simpel überschreiben 
                if(type.serviceInuuid!=undefined){
                    for(i=0; i<services.length; i=i+1){
                        console.log(i+services[i].uuid);
                        if(services[i].uuid==type.serviceInuuid){
                            serviceIn=services[i]
                            i=10
                        }
                    }
                };
                if(type.serviceIModeuuid!=undefined){
                    for(i=0; i<services.length; i=i+1){
                        console.log(i+services[i].uuid);
                        if(services[i].uuid== type.serviceIModeuuid){
                            serviceIMode=services[i]
                            i=10
                        }
                    }
                };
                if(type.serviceLEDuuid!=undefined){
                    for(i=0; i<services.length; i=i+1){
                        console.log(i+services[i].uuid);
                        if(services[i].uuid==type.serviceLEDuuid){
                            alert("Services are odered")
                            return services[i].getCharacteristic(type.uuidLED);
                        }
                    }
                };
            }).then(characteristic => {
                alert("try LED")
                console.log("Characteristic found.");
                characteristic.writeValue(new Uint8Array([1]));// change LED
                d=characteristic;
                alert("LED ready")

                return 5;
            }).then(x => {
                if(type.serviceOutuuid!=undefined){
                    connectOut();
                    connectServo()
                    return 5
                }
            }).then(x => {
                if(type.serviceInuuid!=undefined){
                    console.log(x)
                    connectIn();
                    return 5;
                }
            }).then(x => {
                if(type.serviceIModeuuid!=undefined){
                    connectIMo();
                }else{
                    g=type.indIn
                    if(type.name == 'Robby'){ //delete when robby has his own block
                        valWrite[6] = 0x0b;
                        valWrite[7] = 0x0b;
                        valWrite[8] = 0x0b;
                        valWrite[9] = 0x0b;
                    }
                }
                for(var i=0; i<(type.indOut+type.indIn+type.indServo+type.indOut/3); i=i+1){// reset all variables we will use
                    charZust[i]=0;
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                }
                return 5;
            }).then(x => {
                this.connecthand()
                resolve(connecteddevice)
            }).catch(error => {
                alert("error")
                alert(error)
                reject(error);
            })
        })
    }
}

module.exports = BLEDevice;