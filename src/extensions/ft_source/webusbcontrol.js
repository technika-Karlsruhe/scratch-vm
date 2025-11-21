require ("core-js");
require ("regenerator-runtime")
var success=false
var connecteddevice = undefined;
var list = new Array(); //order of tasks
var valWrite = new Array(); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(); //values of In-modes
var stor = new Array() // memory 
var charZust=0;
var n=0; 
var textDecoder= new TextDecoder()
var textEncoder= new TextEncoder()
var outEndpoint = 4
var inEndpoint = 5
var i = 0
var inputchange = new Array()
var funcstate= new Array()
var changing= new Array()
var numruns = new Array()
var read=0
var notificationTimer=0
var dir
let timeoutID;

var connect = undefined
var autoconnect = undefined

class LT{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); // setup translation
        this.prevState = { byte1: 0x00, byte2: 0x00, byte3: 0x00 };
    }

    configuration=1
    interface=0
    vendorId=0x146A
    productId=0x000A
    name='ROBO LT Controller'//name for USB connection
    writeresponse=11 // some controllers might return data which we have to read to clear input buffer 
    interface=0
    indIn=3 // Number of Inputs
    inLength=24
    indServo=0
    indOut=6 // Number of outputs

    async readInput(result) {
        const bufferLength = result.data.buffer.byteLength;
        if (bufferLength < 6) {
            //throw new RangeError(`DataView buffer is too small: ${bufferLength} bytes.`);
        }
    
        const dataView = new DataView(result.data.buffer);
        const digitalInputs = dataView.getUint8(0) & 0x07; // Byte 0
        const analog1 = dataView.getUint16(1, true); // Bytes 1-2
        const analog2 = dataView.getUint16(3, true); // Bytes 3-4
        const analog3 = (dataView.getUint16(4, true) >> 2); // Bytes 4-5
    
        var d1 = digitalInputs & 0x01;
        var d2 = digitalInputs & 0x02;
        var d3 = digitalInputs & 0x04;
    
        if (d1 > 0) {
            valIn[this.indOut] = 0;
        } else {
            valIn[this.indOut] = 255;
        }
    
        if (d2 > 0) {
            valIn[this.indOut + 1] = 0;
        } else {
            valIn[this.indOut + 1] = 255;
        }
    
        if (d3 > 0) {
            valIn[this.indOut + 2] = 0;
        } else {
            valIn[this.indOut + 2] = 255;
        }
    }

    readfunc(){
        connecteddevice.transferIn(inEndpoint, 6)
        .then(result => {
            this.readInput(result);
            charZust=0
        })
        .catch(error => {
            console.error('Error reading inputs:', error);
        });
    }

    getwriteOut(ind, val){
        let byte1 = this.prevState.byte1;
        let byte2 = this.prevState.byte2;
        let byte3 = this.prevState.byte3;

        //console.log("ind "+ind)
        //console.log("val "+val)
        //console.log("byte1 "+byte1)
        //console.log("byte2 "+byte2)
        //console.log("byte3 "+byte3)

        //let scaledVal = Math.floor((val / 100) * 7);
        //if (scaledVal > 7) {
        //    scaledVal = 7;
        //} else if (scaledVal < -7) {
        //    scaledVal = -7;
        //}

        let scaledVal = Math.floor((val / 100) * 7);
        scaledVal = Math.max(-7, Math.min(7, scaledVal));

        //console.log("scaledVal "+scaledVal)
        
        if (ind === 0 || ind === 1) { // M1, M2
            var val = -val; //invert to align with fischertechnik convention
            let oIndex = ind === 0 ? [0x01, 0x02] : [0x04, 0x08];
            if (val > 0) {
                byte1 |= oIndex[1];
                byte1 &= ~oIndex[0];
                if (ind === 0) byte2 = scaledVal; else byte3 = scaledVal;
            } else if (val < 0) {
                byte1 |= oIndex[0];
                byte1 &= ~oIndex[1];
                if (ind === 0) byte2 = scaledVal; else byte3 = scaledVal;
            } else {
                byte1 &= ~(oIndex[0] | oIndex[1]); // delete O, if speed 0
                if (ind === 0) byte2 = 0; else byte3 = 0;
            }
        } else { // O1 - O4
            //let mask = 1 << (ind - 2);
            //if (val > 0) {
            //    byte1 |= mask;
            //    if (ind === 2 || ind === 3) byte2 = scaledVal;
            //    if (ind === 4 || ind === 5) byte3 = scaledVal;
            //} else {
            //    byte1 &= ~mask;
            //    if (ind === 2 || ind === 3) byte2 = 0;
            //    if (ind === 4 || ind === 5) byte3 = 0;
            //}
            let mask = 1 << (ind - 2);
            let isO1 = ind === 2, isO2 = ind === 3, isO3 = ind === 4, isO4 = ind === 5;

            if (val > 0) {
                byte1 |= mask;
                if (isO1 || isO2) byte2 = scaledVal;
                if (isO3 || isO4) byte3 = scaledVal;
            } else {
                byte1 &= ~mask;
                
                if ((isO1 && !(byte1 & 0x04)) || (isO2 && !(byte1 & 0x02))) {
                    if (!(byte1 & (0x02 | 0x04))) byte2 = 0;
                }
                if ((isO3 && !(byte1 & 0x10)) || (isO4 && !(byte1 & 0x08))) {
                    if (!(byte1 & (0x08 | 0x10))) byte3 = 0;
                }
            }
        }

        //console.log("byte1 "+byte1)
        //console.log("byte2 "+byte2)
        //console.log("byte3 "+byte3)

        const byte0 = 0xF2;
        
        this.prevState = { byte1, byte2, byte3 };
        
        const data = [byte0, byte1, byte2, byte3, 0x00, 0x00];
        //console.log(data);
        return new Uint8Array(data);     
    }

    getwriteOut2(ind, val){
        // ind: 0 m1 | 1 m2 | 2 o1 | 3 o2 | 4 o3 | 5 o4
        console.log("ind "+ind)
        console.log("val "+val)

        let previousSequence = [0x00, 0x00, 0x00, 0x00];
        ind=ind+1
        if(val>0){
            dir=1
        }else{
            dir=2
        }
        // Input validation
        if (![1, 2].includes(ind)) {
            throw new Error("Motor ID must be 1 or 2.");
        }

        if (![1, 2].includes(dir)) {
            throw new Error("Direction must be 1 or 2.");
        }

        if (val < 0 || val > 100) {
            throw new Error("Speed must be between 0 and 100.");
        }

        // Calculate PWM values
        const pwmValue = Math.floor((val / 100) * 7); // Convert speed percentage to PWM value (0 to 7)

        // Generate byte sequence
        const byte0 = 0xF2; // start byte
        const byte1 = (1 << (ind - 1)) | previousSequence[1]; // motor id
        //byte 1: 0x01 o1 | 0x02 o2 | 0x03 o1 and o2 | 0x04 o3 | 0x05 o1 and 03 | 0x06 o2 and 03 | 0x07 o1, o2 and o3 | 0x08 o4 | 0x09 o1 and 04 | 0x0A o2 and 04 | 0x0B o1, o2 and o4 | 0x0C o3 and o4 | 0x0D o1, o3 and o4 | 0x0E o2, o3 and o4 | 0x0F o1, o2, o3 and o4
        let byte2 = (pwmValue << 4) | pwmValue | previousSequence[2]; // speed 01 and 02
        const byte3 = 0x00 | previousSequence[3]; // speed 03 and 04


        const data = [byte0, 0x0F, 0x07, 0x07, 0x00, 0x00];
        //[0xF2, 0x05, 0x1B, 0x0A, 0x00, 0x00]

        console.log(data);

        return(new Uint8Array(data));
    }

    getwriteOut3(ind, val, state=true){
        var pwm = [0, 0, 0, 0];
        var enable = [false, false, false, false];
        // constants for motor direction states
        var Off = 0;
        var Left = 1;
        var Right = 2;
        var Brake = 3;
        var pwm2=Math.round((val / 255) * 100)
        if(ind < this.indOut/3){
            var id=ind+1
            //motor (id, dir = this.Off, speed = 0)
            if(val>0){
                dir=Left
            }else{
                dir=Right
            }
            if(val==0){
                dir=Off
            }
            if (id < 1 || id > 2) {
                console.log('Motor id out of range');
            }
            if (dir < Off || dir > Brake) {
                console.log('Illegal motor direction value');
            }
            if (val < 0 || val > 100) {
                console.log('Motor speed out of range');
            }
            enable[2 * id - 2] = Boolean(dir & 1);
            enable[2 * id - 1] = Boolean(dir & 2);
            pwm[2 * id - 2] = val;
            pwm[2 * id - 1] = val;
        }else{
            id=ind+1-this.indOut/3
            //output (id, state, pwm = 0)
            if (id < 1 || id > 4) {
                console.log('Output id out of range');
            }
            if (typeof state !== 'boolean') {
                console.log('Illegal output state');
            }
            if (pwm2 < 0 || pwm2 > 100) {
                console.log('Output pwm out of range');
            }
            enable[id - 1] = state;
            pwm[id - 1] = pwm2;
            console.log(enable)
            console.log(pwm)
        }

        // assemble command sequence from pwm/enable state //// both
        const data = [0xf2, 0, 0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            if (enable[i]) {
                data[1] |= (1 << i);
            }
            data[2] |= Math.floor(pwm[0] * 8 / 101);
            data[2] |= Math.floor(pwm[1] * 8 / 101) << 3;
            data[2] |= (Math.floor(pwm[2] * 8 / 101) << 6) & 0xff;
            data[3] |= (Math.floor(pwm[2] * 8 / 101) >> 2);
            data[3] |= (Math.floor(pwm[3] * 8 / 101) << 1);

            return(new Uint8Array(data));
        }
    }

    /*// Test the function for Motor 1
    let byteSequence = generateMotorByteSequence(1, 1, 50);
    console.log(byteSequence);

    // Test the function for Motor 2 while keeping Motor 1 on
    byteSequence = generateMotorByteSequence(2, 2, 75, byteSequence);
    console.log(byteSequence);*/

    getwriteInMode(ind, val){
        data=this.writeInMode
        data[8]=ind 
        data[9]= val
        return data
    }
}

class ftduino{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); // setup translation
    }
    baudRate= 115200
    configuration=1
    interface=2
    vendorId=0x1c40
    PromiseroductId=0x0538
    indIn=8 // Number of Inputs
    inLength=24
    indServo=0
    writeresponse=0 // some controllers might return data which we have to read to clear input buffer 
    indOut= 12 // Number of outputs
    indSum=10 // Sum of all characteristics which are permanently accessed (not LED)
    textEncoder = new TextEncoder();

    async readInput(indee) {
        return new Promise(async (resolve, reject) => {
            try {
                let parms = indee > 7
                    ? { port: 'c' + (indee - 7).toString(), type: "counter" }
                    : { port: 'i' + (indee + 1).toString() };
                
                const data = this.textEncoder.encode(JSON.stringify({ get: parms }));
    
                await connecteddevice.transferOut(outEndpoint, data);
    
                const result = await connecteddevice.transferIn(5, 64);

                let res = textDecoder.decode(result.data);
    
                const jsonStart = res.indexOf('{');
                const jsonEnd = res.lastIndexOf('}');
                if (jsonStart === -1 || jsonEnd === -1) {
                    console.warn("No valid JSON response received. Skipping...");
                    return resolve();
                }
    
                const jsonString = res.substring(jsonStart, jsonEnd + 1);

                //const parsed = JSON.parse(jsonString);
                let parsed;
                try {
                    parsed = JSON.parse(jsonString);
                } catch (parseError) {
                    console.warn("Error parsing JSON data. Skipping...");
                    return resolve();
                }

                if (parsed.error !== undefined) {
                    console.warn("Error in the answer: " + parsed.error);
                    return resolve();
                }
    
                if (!parsed.port || parsed.value === undefined) {
                    console.warn("Invalid response: Missing port or value. Skipping...");
                    return resolve();
                }
    
                const portPrefix = parsed.port.charAt(0).toUpperCase();
                const portIndex = Number(parsed.port.substring(1));
                
                if (portPrefix === 'C') {
                    valIn[portIndex + 7 + this.indOut] = Number(parsed.value);
                } else {
                    const adjustedIndex = portIndex - 1 + this.indOut;
                    let calculatedValue;

                    if (valWrite[adjustedIndex] === 0x0b || valWrite[adjustedIndex] === 0x0a) {
                        calculatedValue = (parsed.value / 65535) * 255;
                        //calculatedValue = parsed.value;
                    } else {
                        calculatedValue = parsed.value;
                        //calculatedValue = (parsed.value / 65535) * 255;
                    }

                    //valIn[adjustedIndex] = Math.min(calculatedValue, 255);
                    valIn[adjustedIndex] = calculatedValue;
                }
    
                resolve();
            } catch (error) {
                if(error.name === "NetworkError") {
                    
                } else {
                    console.error("Error during readInput:", error);
                    reject(error);
                }
            }
        });
    }
    
    readfunc(){ 
        if(i>11){
            i=0
        }
        this.readInput(i).then(x=>{
            i=i+1; 
            if(i<12){
                this.readfunc()
            }else{
                i=0
                charZust=0
                success=true
            }
        }).catch(error=>{
            i=0
            charZust=0
            console.log(error)
        })
    }

    getwriteOut(ind, val){
        let data = undefined
        var state = 'HI'
        val = val/127*100
        if(val>0){ //swichts direction to align with fischertechnik convention
            var dir="right"
        }else{
            var dir="left"
            val = val*-1
        }
        if(val==0){
            var dir = "brake"
            state = 'LO'
        }
        if(ind < this.indOut/3){
            data = this.textEncoder.encode(JSON.stringify({ set: { port: "m"+(ind+1), mode: dir, value: val } }));
            textDecoder= new TextDecoder
            return data
        }else{
            data = this.textEncoder.encode(JSON.stringify({ set: { port: "o"+((ind-this.indOut/3)+1), mode: state, value: val } }));
            textDecoder= new TextDecoder
            return data
        }
    }

    getwriteInMode(ind, val){
        let data = undefined
        if(val == 0x0b){
            val = "resistance" //11
        }else{
            val = "voltage" //10
        }
        data = this.textEncoder.encode(JSON.stringify({ set: { port: "i"+(ind+1), mode:  val} })); 
        valWrite[ind + this.indOut] = (val === "resistance") ? 0x0b : 0x0a;

        //read=0
        //inputchange[ind + this.indOut].shift();
        //funcstate[ind + this.indOut]=0;
        //changing[ind + this.indOut] = false;
        //numruns[ind + this.indOut]=0;

        return data
    }

    getwriteCounterreset(ind){
        let data = undefined
        data = this.textEncoder.encode(JSON.stringify({ set: { port: "c"+(ind+1).toString()} }));
        return data
    }

    getread(port, mode){
        let data = undefined
        var parms = undefined
        textEncoder = new TextEncoder();
        parms = { "port": port };	
        if(mode == this.MODE.COUNTER) parms["type"] = "counter";

        data = this.textEncoder.encode(JSON.stringify({ get: parms }));
        return data;
    }

    getwriteLED(val){
        textEncoder = new TextEncoder();
        let data = this.textEncoder.encode(JSON.stringify({ set: { port: "led", value: val } }));
        return data
    }
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
    inputOffset=2 //amout of values ignored when reading
    indIn=8 // Number of Inputs
    inLength=24
    indOut=6 // Number of Motors*3 
    indSum=10 // Sum of all characteristics which are permanently accessed (not LED)
    name='ROBO TX Controller'//name for USB connection

    async readInput(indee){
        this.getread(true)
    }

    readfunc(){

    }

    getwriteOut(ind, val){
        if(ind<2){
            data=this.writeOut
            data[8]=ind
            data[11]=val
            return data
        }
    }

    getwriteInMode(ind, val){
        data=this.writeInMode
        data[8]=ind 
        data[9]= val
        return data
    }

    getread(){
        return this.read
    }

    getwriteLED(){
        return this.writeLED
    }
}

class RX {
    constructor(runtime) {
        this.runtime = runtime;
        translate.setup();
    }

    configuration = 1;
    interface = 1;
    vendorId = 0x221D;
    productId = 0x0029;
    name = 'ROBO RX Controller';
    writeresponse = 0;
    indIn = 8;
    inLength = 17;
    indServo = 0;
    indOut = 8;
    indSum = 16;

    outEndpoint = 2;
    inEndpoint = 2;

    getwriteOut(ind, val) {
        //console.log(`getwriteOut called with ind=${ind}, val=${val}`);
        if (typeof valWrite[0] === "undefined") {
            for (let i = 0; i < 8; i++) valWrite[i] = 0;
        }
        let pwm = Math.round((val / 100) * 7);
        pwm = Math.max(0, Math.min(7, pwm));
        valWrite[ind] = pwm;

        // Paket: [0xF4, O1, O2, O3, O4, O5, O6, O7, O8]
        const data = [0xF4];
        for (let i = 0; i < 8; i++) {
            data.push(valWrite[i] || 0);
        }
        return new Uint8Array(data);
    }

    async readInput() {
        //try {
        //    const result = await connecteddevice.transferIn(this.inEndpoint, 17);
        //    if (result.status === "ok" && result.data && result.data.byteLength >= 17) {
        //        const data = new Uint8Array(result.data.buffer);
        //        // data[0] == 0xF3
        //        for (let i = 0; i < 8; i++) {
        //            // 16 Bit Wert, Little Endian
        //            valIn[i + this.indOut] = data[1 + i * 2] | (data[2 + i * 2] << 8);
        //        }
        //    }
        //    console.log("RX readInput success:", valIn.slice(this.indOut, this.indOut + 8));
        //} catch (e) {
        //    console.error("RX readInput error:", e);
        //}
    }

    readfunc() {
        this.readInput().then(() => {
            charZust = 0;
        });
    }

    /**
     * Input modes
     *   0x00 = Digital
     *   0x01 = Analog
     *   0x02 = Resistance
     *   0x03 = Counter
     */
    getwriteInMode(ind, val) {
        //console.log(`getwriteInMode called with ind=${ind}, val=${val}`);
        return new Uint8Array([0xF6, ind & 0x07, val & 0xFF, 0, 0, 0]);
    }

    /**
     * Dummy
     */
    getwriteCounterreset(ind) {
        return new Uint8Array([0xF7, ind & 0x07, 0, 0, 0, 0]);
    }

    /**
     * Dummy
     */
    getwriteLED(val) {
        return new Uint8Array([0]);
    }
}

async function listen(){//function which calls itself and regularly reads inputs(it might be helpful to include another function which can restart the listening process to prevent connection loss)
    if(charZust==0){
        charZust=1;
        type.readfunc()
        setTimeout(()=>{// call again after short delay
            listen()
        },5)
    }else{
        setTimeout(()=>{// if we were unable to read, try again 
            listen()
        },5)
    }
}

class WebUSBDevice{
    reset(){// clear storage and set all outputs to 0
        clearTimeout(timeoutID);
        for(var i=0; i<(type.indOut+type.indIn+type.indServo); i=i+1){
            for(var n=0; n<stor[i].length; n=n+1){
                stor[i].shift()
            }
        }
        for(var n=0; n<type.indOut/3; n=n+1){
            this.write_Value(n, 0)
        }
    }    
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
    shiftstor(ind){
        stor[ind].shift()
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
    changeInMode2 (args){ // Called By Hats to handle wrong input modes
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
        
        if(inputchange[parseInt(args.INPUT)][0]==valWrite[parseInt(args.INPUT)]&&read==0){ // change has occured 
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

    changeInMode(args) {
        const input = parseInt(args.INPUT);
        const targetMode = args.TARGET_MODE;
    
        if (valWrite[input] !== targetMode) {
            if (funcstate[input] == 0) {
                read = 0;
                inputchange[input].push(targetMode);
                funcstate[input] = 1;
    
                list.unshift(input);
                stor[input].unshift(targetMode);
    
                if (charZust == 0) {
                    this.write();
                }
            }
    
            if (inputchange[input][0] == valWrite[input] && read == 0) {
                read = 1;
            }
    
            if (read == 2) {
                read = 0;
                inputchange[input].shift();
                funcstate[input] = 0;
                changing[input] = false;
                numruns[input] = 0;
            }
        }
    }

    write(){ // actual write method
        let data = undefined
        var ind=list[0]
        var pos=ind
        if(list.length>0){
            if(valWrite[ind]==stor[pos][0]&&ind<(type.indOut+type.indIn+type.indServo)){ //if the output is already up to date--> skip value
                stor[pos].shift()
                list.shift()
                this.write(ind)// write is also a selfcalling method which handels output communication
            }else{
                if(charZust==0&&list.length>0){ // check if channel is free and there are new output values  
                    charZust=1 // blocking communication
                    var val=stor[ind][0]
                    if(ind<type.indOut){ // motor outputs
                        if((valWrite[ind]!=stor[ind][0])&&(valWrite[ind]!=0)&&(stor[ind][0]!=0)){
                            data = type.getwriteOut(ind, 0)
                            connecteddevice.transferOut(outEndpoint, data).then(x=>{  
                                if(type.writeresponse==0){
                                    return 0;
                                }else{
                                    return connecteddevice.transferIn(inEndpoint, type.writeresponse)
                                }
                            }).then(x=>{
                                data = type.getwriteOut(ind , stor[ind][0])
                                return connecteddevice.transferOut(outEndpoint, data)
                            }).then(x=>{
                                if(type.writeresponse==0){
                                    return 0;
                                }else{
                                    return connecteddevice.transferIn(inEndpoint, type.writeresponse)
                                }
                            }).then(x=>{ 
                                charZust=0; 
                                valWrite[ind]=val
                                if( ind >= type.indOut/3){
                                    valWrite[Math.floor((ind-type.indOut/3)/2)] = undefined 
                                }else{
                                    valWrite[2*ind+type.indOut/3]= undefined 
                                    valWrite[(2*ind+type.indOut/3)+1]= undefined 
                                }
                                //if(this.controllertype=='LT'){
                                //    timeoutID = setTimeout(() => {
                                //        if(stor[ind].length<1){
                                //            valWrite[ind]=0
                                //            this.write_Value(ind, val)
                                //        }
                                //    }, 400);
                                //}
                                stor[ind].shift();
                                list.shift();
                                this.write()
                            }).catch(error=>{
                                console.log(error)
                                this.write()
                            })
                        }else{
                            data = type.getwriteOut(ind,stor[ind][0])
                            connecteddevice.transferOut(outEndpoint, data).then(x=>{
                                if(type.writeresponse==0){
                                    return 0;
                                }else{
                                    return connecteddevice.transferIn(inEndpoint, type.writeresponse)
                                }
                            }).then(x=>{ 
                                valWrite[ind]=val
                                if( ind >= type.indOut/3){
                                    valWrite[Math.floor((ind-type.indOut/3)/2)] = undefined 
                                }else{
                                    valWrite[2*ind+type.indOut/3]= undefined 
                                    valWrite[(2*ind+type.indOut/3)+1]= undefined 
                                }
                                //if(this.controllertype=='LT'){
                                //    timeoutID = setTimeout(() => {
                                //        if(stor[ind].length<1){
                                //            valWrite[ind]=0
                                //            this.write_Value(ind, val)
                                //        }
                                //    }, 400);
                                //}
                                charZust=0;
                                stor[ind].shift();
                                list.shift();
                                this.write()
                            }).catch(error=>{
                                console.log(error)
                                this.write()
                            })
                        }
                    }else if(ind<(type.indOut+type.indIn)){ // input mode
                        data = type.getwriteInMode(ind-type.indOut, stor[pos][0])
                        connecteddevice.transferOut(outEndpoint, data).then(x=>{ 
                            if(type.writeresponse==0){
                                return 0;
                            }else{
                                return connecteddevice.transferIn(inEndpoint, type.writeresponse)
                            }
                        }).then(x=>{ 
                            charZust=0;
                            valWrite[pos]=val
                            list.shift();
                            stor[pos].shift();
                            setTimeout(()=>{// write function will call itself after delay 
                                this.write()
                            },2)
                        }).catch(error=>{
                            this.write()
                            console.log(error)
                        })
                    }else if (ind<(type.indOut+type.indIn+type.indServo)){ // servo
                        //servomotors can be written here 
                    }else if(ind === 34){ // led
                        data = type.getwriteLED(val);
                        connecteddevice.transferOut(outEndpoint, data).then(() => {
                            charZust = 0;
                            valWrite[ind] = val;
                            stor[ind].shift();
                            list.shift();
                            this.write();
                        }).catch(error => {
                            console.log(error);
                            this.write();
                        });
                    }else{ // counter reset
                        data = type.getwriteCounterreset(ind-type.indOut-type.indIn)
                        connecteddevice.transferOut(outEndpoint, data).then(x=>{ 
                            if(type.writeresponse==0){
                                return 0;
                            }else{
                                return connecteddevice.transferIn(inEndpoint, type.writeresponse)
                            }
                        }).then(x=>{ 
                            charZust=0;
                            valWrite[pos]=val
                            list.shift();
                            stor[pos].shift();
                            setTimeout(()=>{// write function will call itself after delay 
                                this.write()
                            },2)
                        }).catch(error=>{
                            console.log(error)
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

    async connect(){
        switch(this.controllertype){
            case 'ftduino':
                type= new ftduino;
            break;
            case 'LT':
                type= new LT;
            break;
            case 'TX':
                type= new TX;
            break;
            case 'RX':
                type= new RX;
            break;
        }
        return connect = new Promise ((resolve, reject) =>{
            var filter = [{ vendorId: type.vendorId, productId: type.productId }]
            console.log(filter)
            navigator.usb.requestDevice({filters: filter}).then((device) => {
                connecteddevice=device
                console.log('Dev connected')
                return connecteddevice.open();
            }).then((device) => {
                console.log('Dev opened')
                return connecteddevice.selectConfiguration(type.configuration);
            }).then((device) => {
                console.log('Config selected')
                return connecteddevice.claimInterface(type.interface);
            }).then(() => {
                console.log('Interface claimed')
                if(this.controllertype == 'ftduino'){
                    return connecteddevice.selectAlternateInterface(2, 0)
                }else {
                    return 0
                }
            }).then((device) => {
                if(this.controllertype == 'ftduino'){
                    return connecteddevice.controlTransferOut({
                        'requestType': 'class',
                        'recipient': 'interface',
                        'request': 0x22,
                        'value': 0x01,
                        'index': 0x02
                    })
                }else {
                    return 0
                }
            }).then((device) => {
                if(this.controllertype == 'ftduino'){
                    outEndpoint = 4
                    inEndpoint = 5
                }else{
                    const { alternates } = connecteddevice.configuration.interfaces[0];
                    const alternate = alternates[0];
                    for(const endpoint of alternate.endpoints) {
                        console.log(endpoint)
                        if(endpoint.direction === "in") {
                            inEndpoint = endpoint.endpointNumber;
                            console.log("in" + inEndpoint);
                        }else if(endpoint.direction === "out") {
                            outEndpoint = endpoint.endpointNumber;
                            console.log("out" + outEndpoint);
                        }
                    }
                }
                charZust=0;
                read=0
                for(var i=0; i<(type.indOut+type.indIn+type.indServo+type.indOut/3); i=i+1){// set all varibles 
                    inputchange[i]=[]
                    inputchange[i][0]=0
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                    if(type.name == 'ROBO LT Controller'){
                        valWrite[6] = 0x0b;
                        valWrite[7] = 0x0b;
                        valWrite[8] = 0x0b;
                    }
                }
                //30-35
                for(var i=30; i<36; i=i+1){// set all varibles for sound, led etc.
                    inputchange[i]=[]
                    inputchange[i][0]=0
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                    valWrite[i]=0
                }
                if(this.controllertype=='ftduino'){
                    let data = undefined
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+1, mode:  "resistance"} }));
                    connecteddevice.transferOut(outEndpoint, data).then(x=>{
                        valWrite[0 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+2, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[1 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+4, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[2 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+3, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[3 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+5, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[4 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+6, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[5 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+7, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[6 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+8, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[7 + type.indOut] = 0x0b;
                        data = (textEncoder.encode("\x1b"));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        listen()// setup the two selfcalling functions 
                        this.write()
                        this.connected=true
                        resolve (connecteddevice)
                    })
                }else{// if needed further specifications for sigle controllers can be added here 
                    if(type.name=='ROBO LT Controller'){
                        this.write_Value(0, 0)
                        this.write_Value(1, 0)
                    }
                    listen()// setup the two selfcalling functions
                    this.write()
                    console.log(this.controllertype)
                    buttonpressed = false 
                    this.connected=true
                    resolve (connecteddevice)
                }   
                listen()// setup the two selfcalling functions 
                this.write()
                buttonpressed = false 
                this.connected=true
                resolve (connecteddevice)
            }).catch(error => {
                reject(error);
            })
        })
    }

    async autoconnect(){// connect to controller 
        return autoconnect = new Promise ((resolve, reject) =>{
            navigator.usb.getDevices().then((devices) => {
                console.log(`Total devices: ${devices.length}`);
                devices.forEach((device) => {
                    if(device.vendorId==0x1c40){
                        connecteddevice=device// save device for later use
                        type= new ftduino;
                    }
                })
                if(connecteddevice==undefined){
                    reject('no');
                }
                 return connecteddevice.open();
            }).then((device) => {
                console.log('Dev opened')
                return connecteddevice.selectConfiguration(type.configuration);
            }).then((device) => {
                console.log('Config selected')
                return connecteddevice.claimInterface(type.interface);
            }).then(() => {
                console.log('Interface claimed')
                if(this.controllertype == 'ftduino'){
                    return connecteddevice.selectAlternateInterface(2, 0)
                }else {
                    return 0
                }
            }).then((device) => {
                if(this.controllertype == 'ftduino'){
                    return connecteddevice.controlTransferOut({
                        'requestType': 'class',
                        'recipient': 'interface',
                        'request': 0x22,
                        'value': 0x01,
                        'index': 0x02
                    })
                }else {
                    return 0
                }
            }).then((device) => {
                if(this.controllertype == 'ftduino'){
                    outEndpoint = 4
                    inEndpoint = 5
                }else{
                    const { alternates } = connecteddevice.configuration.interfaces[0];
                    const alternate = alternates[0];
                    for (const endpoint of alternate.endpoints) {
                        console.log(endpoint)
                        if(endpoint.direction === "in") {
                            inEndpoint = endpoint.endpointNumber;
                            console.log("in" + inEndpoint);
                        }else if(endpoint.direction === "out") {
                            outEndpoint = endpoint.endpointNumber;
                            console.log("out" + outEndpoint);
                        }
                    }
                }
                charZust=0;
                read=0
                for(var i=0; i<(type.indOut+type.indIn+type.indServo+type.indOut/3); i=i+1){// set all varibles 
                    inputchange[i]=[]
                    inputchange[i][0]=0
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    valWrite[i]=0x0b
                    stor[i]=[]
                }
                //30-35
                for(var i=30; i<36; i=i+1){// set all varibles for sound, led etc.
                    inputchange[i]=[]
                    inputchange[i][0]=0
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                    valWrite[i]=0x0b
                }
                if(this.controllertype=='ftduino'){
                    let data = undefined
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+1, mode:  "resistance"} }));
                    connecteddevice.transferOut(outEndpoint, data).then(x=>{
                        valWrite[0 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+2, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[1 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+4, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[2 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+3, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[3 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+5, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[4 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+6, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[5 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+7, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[6 + type.indOut] = 0x0b;
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+8, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        valWrite[7 + type.indOut] = 0x0b;
                        data = (textEncoder.encode("\x1b"));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        listen()// setup the two selfcalling functions 
                        this.write()
                        this.connected=true
                        resolve (connecteddevice)
                    })
                }else{
                    listen()// setup the two selfcalling functions
                    this.write()
                    console.log(this.controllertype)
                    this.connected=true
                    resolve (connecteddevice)
                }   
            }).catch(error => {
                reject(error);
            })
        })
    }
}

module.exports = WebUSBDevice;