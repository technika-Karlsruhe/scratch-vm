//const c = require("@vernier/godirect/dist/godirect.min.umd");

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
var serviceLED;
var funcstate= new Array()
var changing= new Array()
var numruns = new Array()
var type
var notificationTimer=0

var connect = undefined
var bleWriteBusy = false;

const RX_INPUT_MODE_MAP = {
    0x0a: 0b000, // mV
    0x0b: 0b001, // Widerstand
    0x0c: 0b011, // Ultraschallsensor
};

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
    name='BTSC'//name for BLE connection 
    name2='BT Smart Controller'
    serviceOutuuid='8ae883b4-ad7d-11e6-80f5-76304dec7eb7'
    serviceOutuuidMobile='8AE883B4-AD7D-11E6-80F5-76304DEC7EB7'
    serviceInuuid='8ae8952a-ad7d-11e6-80f5-76304dec7eb7'
    serviceInuuidMobile='8AE8952A-AD7D-11E6-80F5-76304DEC7EB7'
    serviceIModeuuidMobile='8AE88D6E-AD7D-11E6-80F5-76304DEC7EB7'
    serviceIModeuuid='8ae88d6e-ad7d-11e6-80f5-76304dec7eb7'
    serviceLEDuuidMobile='8AE87702-AD7D-11E6-80F5-76304DEC7EB7'
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
    name2='BT Control Receiver'
    serviceOutuuid='2e58327e-c5c5-11e6-9d9d-cec0c932ce01'
    serviceOutuuidMobile='2E58327E-C5C5-11E6-9D9D-CEC0C932CE01'
    serviceLEDuuid='2e582b3a-c5c5-11e6-9d9d-cec0c932ce01'
    serviceLEDuuidMobile='2E582B3A-C5C5-11E6-9D9D-CEC0C932CE01'

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
    name2='Robby'
    serviceOutuuid='7b130100-ce8d-45bb-9158-631b769139e9'
    serviceOutuuidMobile='7B130100-CE8D-45BB-9158-631B769139E9'
    serviceInuuidMobile='7B130100-CE8D-45BB-9158-631B769139E9'
    serviceLEDuuidMobile='7B130100-CE8D-45BB-9158-631B769139E9'
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
    name2='fischertechnik TXT 4.0 Controller'
    serviceOutuuid='8ae883b4-ad7d-11e6-80f5-76304dec7eb7'
    serviceInuuid='8ae8952a-ad7d-11e6-80f5-76304dec7eb7'
    serviceIModeuuid='8ae88d6e-ad7d-11e6-80f5-76304dec7eb7'
    serviceLEDuuid='8ae87702-ad7d-11e6-80f5-76304dec7eb7'
    services= [this.serviceOutuuid, this.serviceInuuid, this.serviceIModeuuid, this.serviceLEDuuid]
}

class RX{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); //setup translation
    }
    uuidsOut= new Array('8fa1fb7b-7cf7-4168-aa15-c28452179b3f','7fe22550-99d9-4a74-9c05-5f7e5a10d6e6', 'aa6f95ee-98a1-4304-a224-df6ed20828c4', '7e5ec20d-7811-444b-b66c-202810180d63', '34845716-f234-41b1-b130-9ba7871abea5', '92ff9d6d-3286-4e78-8d19-da0d2a56e7bc', 'd4c25a50-d9b3-48e2-9829-2d40ed5d4c75', 'a1c0304f-7cb8-4bc2-b649-10c4b4856c7e', '659de9f7-102f-4cad-8d81-88755c2463ed', '86cb606c-eac1-4a7c-8a3a-3907ca868899', '6d6dd638-f972-49bb-9d98-769bbc2798e1', 'f2ad2cfc-a792-427b-ba85-5799a136fa37')
    uuidsIn = new Array('a15bc7b5-98cd-40b4-a6de-e7949e79e300','951c8dc7-9efd-4e6e-a60e-c9df17b9fc6e','11ec1253-c4ca-4300-b406-29461af851be','0b9dfd56-e891-41f3-84a4-0f691ffbd71f', '1725e4f7-c7c4-4936-8a58-d911ab484c11', '1fb4bec7-08cf-4176-9508-2af537f6b228', '15628e48-6cba-4d1c-9c59-50b7fb8a4cac', 'b52a6fa4-f560-4215-a318-8e67586f5681')
    uuidsIM = new Array('e16f15b7-a5bb-4451-aaa8-b9d4a2c38308')
    indIn=8 // Number of Inputs
    indServo=0
    indOut=12 // Number of outputs
    indSum=20 // Sum of all characteristics which are permanently accessed (not LED)
    name='RXC'//name for BLE connection
    name2='RXC'
    serviceOutuuid='2052de7a-d5a3-4180-918e-e1110c999756'
    serviceOutuuidMobile='2052DE7A-D5A3-4180-918E-E1110C999756'
    serviceInuuid='e5de8301-ca79-4937-b867-21df85062d52'
    serviceInuuidMobile='E5DE8301-CA79-4937-B867-21DF85062D52'
    serviceIModeuuid='e5de8301-ca79-4937-b867-21df85062d52'
    serviceIModeuuidMobile='E5DE8301-CA79-4937-B867-21DF85062D52'
    services= [this.serviceOutuuid, this.serviceInuuid, this.serviceIModeuuid]
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
        } else if (type.name == 'RXC') {
            valIn[12] = event.target.value.getUint8(0);
        }else{
            valIn[6] = event.target.value.getUint8(0); // closed --><255
        }
    },
	in_1: function (event){
        if (type.name == 'RXC') {
            valIn[13] = event.target.value.getUint8(0);
        } else {
            valIn[7] = event.target.value.getUint8(0);
        }
    },
	in_2: function (event){
        if (type.name == 'RXC') {
            valIn[14] = event.target.value.getUint8(0);
        } else {
            valIn[8] = event.target.value.getUint8(0);
        }
    },
	in_3: function (event){
        if (type.name == 'RXC') {
            valIn[15] = event.target.value.getUint8(0);
        } else {
            valIn[9] = event.target.value.getUint8(0);
        }
    },
    in_4: function (event){
        if (type.name == 'RXC') {
            valIn[16] = event.target.value.getUint8(0);
        } else {
            valIn[10] = event.target.value.getUint8(0);
        }
    },
    in_5: function (event){
        if (type.name == 'RXC') {
            valIn[17] = event.target.value.getUint8(0);
        } else {
            valIn[11] = event.target.value.getUint8(0);
        }
    },
    in_6: function (event){
        if (type.name == 'RXC') {
            valIn[18] = event.target.value.getUint8(0);
        } else {
            valIn[12] = event.target.value.getUint8(0);
        }
    },
    in_7: function (event){
        if (type.name == 'RXC') {
            valIn[19] = event.target.value.getUint8(0);
        } else {
            valIn[13] = event.target.value.getUint8(0);
        }
    }
};

function connectIn(){ // automatic connection of all Inputs and event Listeners+Notifications
    if (ismobile()) {
        setTimeout(() => {
            characteristic=serviceIn.getCharacteristic(type.uuidsIn[e]).then(
                function connectI (characteristic){
                    characteristic.addEventListener('characteristicvaluechanged', input['in_'+e]);
                    characteristic.startNotifications().then(() => {
                        if (ismobile()) {
                            return new Promise(resolve => setTimeout(resolve, 800));
                        }
                    }).then(() => {
                        charI[e+type.indOut]=characteristic;
                        return charI[e+type.indOut].readValue();
                    })
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
        }, 800);
    } else {
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
}

function connectServo(){
    if (ismobile()) {
        setTimeout(() => {
            if(type.indServo>0){
                serviceOut.getCharacteristics().then(x=>{
                    charWrite[type.indOut+type.indIn]=x[3]
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
        }, 1000);
    } else {
        if(type.indServo>0){
            serviceOut.getCharacteristics().then(x=>{
                charWrite[type.indOut+type.indIn]=x[3]
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
}

function connectOut(){ //connection of all Outputs
    let outCount = (type.name === 'RXC') ? type.indOut : type.indOut/3;
    if (ismobile()) {
        setTimeout(() => {
            characteristic=serviceOut.getCharacteristic(type.uuidsOut[f]).then(
                async characteristic => {
                    charWrite[f]=characteristic;
                    await characteristic.writeValue(new Uint8Array([0]));
                    await new Promise(resolve => setTimeout(resolve, 300));
                }).then(x=>{
                    valWrite[f]=0;
                    f=f+1
                    if(f<outCount){
                        connectOut()
                    }else{
                        
                    }
                })
        }, 500);
    } else {
        characteristic=serviceOut.getCharacteristic(type.uuidsOut[f]).then(
            characteristic=>{
                charWrite[f]=characteristic;
                return charWrite[f].writeValue(new Uint8Array([0]));
            }).then(x=>{
                valWrite[f]=0;
                f=f+1
                if(f<outCount){
                    //console.log("Connecting output " + f + " of " + outCount);
                    connectOut()
                }else{
                    
                }
            })
    }
}

function connectIMo(){ // connection of IModes
    if(type.name === 'RXC'){
        // RX: all inputs resistance (0b001), Bit 6 "Configure All Inputs"
        const rxMode = RX_INPUT_MODE_MAP[0x0b]; // 0b001 resistance
        let setupByte = (rxMode << 3) | 0x40; // Type on Bits 3-5, Bit 6 for all Inputs
        characteristic=serviceIMode.getCharacteristic(type.uuidsIM[0]).then(characteristic => {
            return characteristic.writeValue(new Uint8Array([setupByte]));
        }).then(() => {
            // For RX there are no further IModes, set g directly to indIn
            for(let i=0; i<type.indIn; i++){
                valWrite[i+type.indOut] = 0x0b; // 0x0b resistance
                charWrite[i+type.indOut] = characteristic;
            }
            g = type.indIn;
        });
    }else{
        if (ismobile()) {
            setTimeout(() => {
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
            }, 500);
        } else {
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
    }
}

function isTablet() {
	const userAgent = navigator.userAgent.toLowerCase();
	return /tablet|ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isMobilePhone() {
	const userAgent = navigator.userAgent.toLowerCase();
	return /iphone|ipod|android/.test(userAgent) && !/tablet|ipad/.test(userAgent);
}

function ismobile(){
    const isTabletDevice = isTablet();
    const isMobileDevice = isMobilePhone();
    if (isTabletDevice || isMobileDevice) {
        console.log("tablet or phone");
        return true
    }else 
    return false
}

class BLEDevice {
    reset(){ //when the red button is pressed all motors are stopped and the storage is cleared 
        for(var i=0; i<(type.indOut+type.indIn+type.indServo); i=i+1){
            for(var n=0; n<stor[i].length; n=n+1){
                stor[i].shift()
            }
        }
        let outCount = (type.name === 'RXC') ? type.indOut : type.indOut/3;
        for(var n=0; n<outCount; n=n+1){
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
   
    disconnect() { //--> called to disconnect BLE devices
        connecteddevice.gatt.disconnect()
    }

    connecthand(){ // wait until all features have been initialized
        let expectedOutCount = (type.name === 'RXC') ? type.indOut : type.indOut/3;
        if (f==expectedOutCount&&g==type.indIn&&e==type.indIn&&s==type.indServo){
            this.connected=true 
            buttonpressed = false 
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
        if (ind !== 34 && !charWrite[ind]) {
            setTimeout(() => this.write(ind), 100);
            return;
        }

        function waitForBleFree() {
            return new Promise(resolve => {
                function check() {
                    if (!bleWriteBusy) {
                        bleWriteBusy = true;
                        resolve();
                    } else {
                        setTimeout(check, 10);
                    }
                }
                check();
            });
        }
        if(valWrite[ind]==stor[ind][0]){ // if we would write the same value again we can skip it in order to not block the connection
            stor[ind].shift()
            if(stor[ind].length>0){ // if there are still elements in the storage do it again 
                this.write (ind)
            }
        }else{
            if(charZust[ind]==0&&stor[ind].length>0){ // if nothing is being changed and storage is not empty
                var val=stor[ind][0] // we have to save the value, if the storage is cleared while the write command is executed valWrite might receive a false value 
                
                // invert value for BTSC and BT Control Receiver for output values
                var writeValue = val;
                if(ind < type.indOut && (type.name === 'BTSC' || type.name === 'BT Smart Controller' || type.name === 'BT Control Receiver')) {
                    writeValue = val * -1;
                }

                charZust[ind]=1; // switch to currently changing
                if(ind<type.indOut){//an output value has to be changed  
                    if (type.name === 'RXC') {
                        // --- RX Controller: 2 Byte, -512 to 512 ---
                        let scaled = Math.round(stor[ind][0] * 512 / 127);
                        let value = Math.max(-512, Math.min(512, scaled));
                        let buffer = new ArrayBuffer(2);
                        let view = new DataView(buffer);
                        view.setInt16(0, value, true); // little endian
                        if (valWrite[ind]==stor[ind][0]||valWrite[ind]==0||stor[ind][0]==0){
                            // no stop needed
                            waitForBleFree().then(() => {
                                return charWrite[ind].writeValue(new Uint8Array(buffer));
                            }).then(x => {
                                bleWriteBusy = false;
                                valWrite[ind]=val;
                                charZust[ind]=0;
                                stor[ind].shift();
                                if (ismobile()) {
                                    return new Promise(resolve => setTimeout(resolve, 100));
                                }
                            }).then(() => {
                                if(stor[ind].length>0){
                                    this.write(ind);
                                }
                            }).catch(error => {
                                bleWriteBusy = false;
                                console.log(error)
                            });
                        } else {
                            // stop needed
                            waitForBleFree().then(() => {
                                // Stop: 2 Byte with 0
                                let stopBuffer = new ArrayBuffer(2);
                                let stopView = new DataView(stopBuffer);
                                stopView.setInt16(0, 0, true);
                                return charWrite[ind].writeValue(new Uint8Array(stopBuffer));
                            }).then(x => {
                                bleWriteBusy = false;
                                if (ismobile()) {
                                    return new Promise(resolve => setTimeout(resolve, 100));
                                }
                            }).then(() => {
                                return waitForBleFree().then(() => charWrite[ind].writeValue(new Uint8Array(buffer)));
                            }).then(x => {
                                bleWriteBusy = false;
                                valWrite[ind]=val;
                                charZust[ind]=0;
                                stor[ind].shift();
                                if (ismobile()) {
                                    return new Promise(resolve => setTimeout(resolve, 100));
                                }
                            }).then(() => {
                                if(stor[ind].length>0){
                                    this.write(ind);
                                }
                            }).catch(error => {
                                bleWriteBusy = false;
                                console.log(error);
                            });
                        }
                    } else {
                        // --- other Controller: 1 Byte ---
                        if (valWrite[ind]==stor[ind][0]||valWrite[ind]==0||stor[ind][0]==0){
                            // no stop needed
                            waitForBleFree().then(() => {
                                return charWrite[ind].writeValue(new Uint8Array([writeValue])); //writeValue [stor[ind][0]]
                            }).then(x => {
                                bleWriteBusy = false;
                                valWrite[ind]=val;
                                charZust[ind]=0;
                                stor[ind].shift();
                                if (ismobile()) {
                                    return new Promise(resolve => setTimeout(resolve, 100));
                                }
                            }).then(() => {
                                if(stor[ind].length>0){
                                    this.write(ind);
                                }
                            }).catch(error => {
                                bleWriteBusy = false;
                                console.log(error)
                            });
                        } else {
                            // stop needed
                            waitForBleFree().then(() => {
                                return charWrite[ind].writeValue(new Uint8Array([0]));
                            }).then(x => {
                                bleWriteBusy = false;
                                if (ismobile()) {
                                    return new Promise(resolve => setTimeout(resolve, 100));
                                }
                            }).then(() => {
                                return waitForBleFree().then(() => charWrite[ind].writeValue(new Uint8Array([writeValue]))); //writeValue [stor[ind][0]]
                            }).then(x => {
                                bleWriteBusy = false;
                                valWrite[ind]=val;
                                charZust[ind]=0;
                                stor[ind].shift();
                                if (ismobile()) {
                                    return new Promise(resolve => setTimeout(resolve, 100));
                                }
                            }).then(() => {
                                if(stor[ind].length>0){
                                    this.write(ind);
                                }
                            }).catch(error => {
                                bleWriteBusy = false;
                                console.log(error);
                            });
                        }
                    }
                }else if (ind >= 34) { // led
                    let getLedCharacteristic = () => serviceLED.getCharacteristic(type.uuidLED);
                    let getLedPromise = ismobile()
                        ? new Promise(resolve => setTimeout(resolve, 100)).then(getLedCharacteristic)
                        : getLedCharacteristic();

                    getLedPromise.then(characteristic => {
                        bleWriteBusy = true;
                        return characteristic.writeValue(new Uint8Array([stor[ind][0]]));
                    }).then(() => {
                        bleWriteBusy = false;
                        valWrite[ind] = val;
                        charZust[ind] = 0;
                        stor[ind].shift();
                        if (ismobile()) {
                            return new Promise(resolve => setTimeout(resolve, 100));
                        }
                    }).then(() => {
                        if (stor[ind].length > 0) {
                            this.write(ind);
                        }
                    }).catch(error => {
                        bleWriteBusy = false;
                        charZust[ind] = 0;
                        console.log("error:", error);
                    });
                }else{ // input mode
                    if(type.name === 'RXC') {
                        //console.log("RXC detected, writing input mode for ind:", ind, "value:", stor[ind][0]);
                        let rxMode = RX_INPUT_MODE_MAP[stor[ind][0]] !== undefined ? RX_INPUT_MODE_MAP[stor[ind][0]] : stor[ind][0];
                        //console.log("RX input mode:", rxMode);
                        let setupByte = ((ind-12) & 0x07) | ((rxMode & 0x07) << 3); // Port + type
                        //console.log("input: "+ind + " targetMode: " + stor[ind][0] + " input-12: "+(ind-12));
                        // all inputs: setupByte |= 0x80
                        waitForBleFree().then(() => {
                            return serviceIMode.getCharacteristic(type.uuidsIM[0]).then(characteristic => {
                                return characteristic.writeValue(new Uint8Array([setupByte]));
                            });
                        }).then(() => {
                            bleWriteBusy = false;
                            valWrite[ind] = stor[ind][0];
                            charZust[ind] = 0;
                            stor[ind].shift();
                            if (ismobile()) {
                                return new Promise(resolve => setTimeout(resolve, 100));
                            }
                        }).then(() => {
                            if (stor[ind].length > 0) {
                                this.write(ind);
                            }
                        }).catch(error => {
                            bleWriteBusy = false;
                            charZust[ind] = 0;
                            console.log("error:", error);
                        });
                    }else{
                        waitForBleFree().then(() => {
                            return charWrite[ind].writeValue(new Uint8Array([stor[ind][0]]));
                        }).then(x => {
                            bleWriteBusy = false;
                            charZust[ind] = 0;
                            valWrite[ind] = val;
                            stor[ind].shift();
                            if (ismobile()) {
                                return new Promise(resolve => setTimeout(resolve, 100));
                            }
                        }).then(() => {
                            if(stor[ind].length>0){
                                this.write(ind);
                            }
                        }).catch(error => {
                            bleWriteBusy = false;
                            console.log(error)
                        })
                    }
                }
            }
        }
    }

    changeInMode2 (args){ // Called By Hats to handle wrong input modes
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

    changeInMode(args) { // Called by Hats to handle wrong input modes
        const input = parseInt(args.INPUT);
        const targetMode = args.TARGET_MODE;
        
        if(type.name === 'RXC') {
            if (funcstate[input] == 0) { // function is called for the first time
                funcstate[input] = 1;
                //console.log("RXC detected, setting up RX input mode for input:", input, "target mode:", targetMode);
                // RX: only one Byte for all Inputs
                const rxMode = RX_INPUT_MODE_MAP[targetMode] !== undefined ? RX_INPUT_MODE_MAP[targetMode] : targetMode;
                //console.log("RX input mode:", rxMode);
                let setupByte = ((input-12) & 0x07) | ((rxMode & 0x07) << 3); // Port + type
                //console.log("input: "+input + " targetMode: " + targetMode + " input-12: "+(input-12));
                // all inputs: setupByte |= 0x80;
                serviceIMode.getCharacteristic(type.uuidsIM[0])
                    .then(characteristic => characteristic.writeValue(new Uint8Array([setupByte])))
                    .then(() => {
                        //console.log("RX input mode set successfully for input:", (input-12), "mode:", rxMode);
                        valWrite[input] = targetMode;
                        charZust[input] = 0;
                        changing[input] = false;
                        funcstate[input] = 0;
                        numruns[input] = 0;
                    })
                    .catch((err) => {
                        console.error("Error while setting RX input mode:", err);
                        funcstate[input] = 0;
                        changing[input] = false;
                    });
            }
        }else{
            if (funcstate[input] == 0) { // function is called for the first time
                funcstate[input] = 1;
        
                charI[input].stopNotifications().then(() => {
                    if (valWrite[input] != targetMode) {
                        return charWrite[input].writeValue(new Uint8Array([targetMode]));
                    } else {
                        return Promise.resolve();
                    }
                }).then(() => {
                    return charI[input].readValue();
                }).then(() => {
                    return charI[input].startNotifications();
                }).then(() => {
                    return charI[input].readValue();
                }).then(() => {
                    valWrite[input] = targetMode;
                    charZust[input] = 0;
                    changing[input] = false;
                    funcstate[input] = 0;
                    numruns[input] = 0;
                }).catch((err) => {
                    console.error("Error while reading value:", err);
                    funcstate[input] = 0;
                    changing[input] = false;
                });
            }
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
    
    async connect(){// connection function 
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
            case 'RX':
                type= new RX;
            break;
        }
        console.log(type)
        return connect = new Promise ((resolve, reject) =>{
            navigator.bluetooth.requestDevice({
                filters: [
                    { namePrefix: type.name },
                    { namePrefix: type.name2 }
                ],
                optionalServices: type.services
            }).then(device => {
                console.log("Device found. Connecting ...");
                //device.addEventListener('gattserverdisconnected', onDisconnected);
                connecteddevice=device;
                return connecteddevice.gatt.connect();       
            }).then(server => {
                console.log("Connected. Searching for output service ...");
                if (ismobile()) {
                    console.log("Mobile device detected. Waiting for GATT server to be ready...");
                    return new Promise(resolve => setTimeout(() => resolve(server), 500)).then(server => server.getPrimaryServices());
                }
                return server.getPrimaryServices();
            }).then(services => {
                console.log("Service found. Requesting characteristic ...");
                console.log (services.map(s =>s.uuid).join('\n' + ' '.repeat(19)));
                if(type.serviceOutuuid!=undefined){
                    for(var i=0; i<services.length; i=i+1){
                        console.log(i+services[i].uuid);
                        if(services[i].uuid==type.serviceOutuuid||services[i].uuid==type.serviceOutuuidMobile){//matching services 
                            serviceOut=services[i]
                            i=10 
                        }
                    }
                }; // important... we have to implement this for each service, then adopt all characteristics individually, then you can overwrite them quite easily
                if(type.serviceInuuid!=undefined){
                    for(i=0; i<services.length; i=i+1){
                        console.log(i+services[i].uuid);
                        if(services[i].uuid==type.serviceInuuid||services[i].uuid==type.serviceInuuidMobile){
                            serviceIn=services[i]
                            i=10
                        }
                    }
                };
                if(type.serviceIModeuuid!=undefined){
                    for(i=0; i<services.length; i=i+1){
                        console.log(i+services[i].uuid);
                        if(services[i].uuid== type.serviceIModeuuid||services[i].uuid== type.serviceIModeuuidMobile){
                            serviceIMode=services[i]
                            i=10
                        }
                    }
                };
                if(type.serviceLEDuuid!=undefined){
                    for(i=0; i<services.length; i=i+1){
                        console.log(i+services[i].uuid);
                        if(services[i].uuid==type.serviceLEDuuid||services[i].uuid==type.serviceLEDuuidMobile){
                            serviceLED = services[i];
                            return services[i].getCharacteristic(type.uuidLED);
                        }
                    }
                };
            }).then(characteristic => {
                console.log("Characteristic found.");
                if(type.serviceLEDuuid!=undefined){
                    characteristic.writeValue(new Uint8Array([1]));// change LED
                }
                //characteristic.writeValue(new Uint8Array([1]));// change LED
                var d=characteristic;
                return 5;
            }).then(x => {
                if(type.serviceOutuuid!=undefined){
                    console.log(x)
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
                    console.log(x)
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
                for(var i=0; i<(type.indOut+type.indIn+type.indServo+type.indOut/3); i=i+1){ // reset all variables we will use
                    charZust[i]=0;
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                }
                //30-35
                for(var i=30; i<36; i=i+1){ // set all varibles for sound, led etc.
                    charZust[i]=0;
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                }
                return 5;
            }).then(x => {
                console.log(x)
                this.connecthand()
                resolve(connecteddevice)
            }).catch(error => {
                reject(error);
            })
        })
    }
}

module.exports = BLEDevice;