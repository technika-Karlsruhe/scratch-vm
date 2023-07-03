
require ("core-js");
require ("regenerator-runtime")
var success=false
var connecteddevice;
var list = new Array(); //order of tasks
var valWrite = new Array(); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(); //values of In-modes
var stor = new Array() // memory 
var charZust=0;
var n=0; 
var textDecoder= new TextDecoder()
var outEndpoint = 4
var inEndpoint = 5
var connecteddevice
var i = 0
var inputchange = new Array()
var funcstate= new Array()
var changing= new Array()
var numruns = new Array()
var read=0
var notificationTimer=0
var dir

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
    writeresponse=11 // some controllers might return data which we have to read to clear input buffer 
    interface=0
    indIn=3 // Number of Inputs
    inLength=24
    indServo=0
    indOut=6 // Number of outputs
    readfunc (){
        data = this.getread()// get the right command 
        connecteddevice.transferOut(outEndpoint, data).then(x=>{ 
            return connecteddevice.transferIn(inEndpoint, 60) // read some of the incoming values 
        }).then(ans=>{ 
            n=0;
            while(n<ans.data.byteLength-1-this.inLength){// go through the array
                if(ans.data.getUint8(n+this.inputOffset)==this.inputHeader[0]&&ans.data.getUint8(n+this.inputOffset+1)==this.inputHeader[1]&&ans.data.getUint8(n+2+this.inputOffset)==this.inputHeader[2]&&ans.data.getUint8(n+3+this.inputOffset)==this.inputHeader[3]&&ans.data.getUint8(n+4+this.inputOffset)==this.inputHeader[4]&&ans.data.getUint8(n+5+this.inputOffset)==this.inputHeader[5]&&ans.data.getUint8(n+6+this.inputOffset)==this.inputHeader[6]&&ans.data.getUint8(n+7+this.inputOffset)==this.inputHeader[7]){
                    //check if the right header can be found
                    for(var i=0; i<this.indIn ; i=i+1){// read at the right positions 
                        valIn[i+this.indOut]=ans.data.getUint8(n+13+4*i)
                        if(ans.data.getUint8(n+11+i*4)==10){
                            valWrite[i+this.indOut]=0x0a
                        }else{
                            valWrite[i+this.indOut]=0x0b
                        }
                    }
                    success=true
                    break;
                }else{
                    n=n+1
                }
            }
            if(read==1&&success==true){// important for change function 
                read=2
            }
            charZust=0;
            success=false
        }).catch(error=>{
            console.log(error)
        })
    }
    getwriteOut(ind, val, state=true){
        pwm = [0, 0, 0, 0];
        enable = [false, false, false, false];
        // constants for motor direction states
        Off = 0;
        Left = 1;
        Right = 2;
        Brake = 3;
        pwm=val
        if(ind < this.indOut/3){
            id=ind+1
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
            if (id < 1 || id > 2) {
                console.log('Motor id out of range');
            }
            if (dir < Off || dir > Brake) {
                console.log('Illegal motor direction value');
            }
            if (val < 0 || val > 100) {
                console.log('Motor speed out of range');
            }
            console.log("dir: "+dir, "val: "+val, "id: "+id)
            enable[2 * id - 2] = Boolean(dir & 1);
            enable[2 * id - 1] = Boolean(dir & 2);
            pwm[2 * id - 2] = val;
            pwm[2 * id - 1] = val;
        }else{
            id=ind+1-this.indOut/3
            //output (id, state, pwm = 0)
            console.log('output')
            if (id < 1 || id > 4) {
                console.log('Output id out of range');
            }
            if (typeof state !== 'boolean') {
                console.log('Illegal output state');
            }
            if (pwm < 0 || pwm > 100) {
                console.log('Output pwm out of range');
            }
            console.log("state: "+state, "pwm: "+pwm, "ind: "+id)
            enable[id - 1] = state;
            pwm[id - 1] = pwm;
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
    getread(isAnalog) {
        if (isAnalog) {
            // Liest den analogen Zustand der Eingänge I1 und I3
            const result = connecteddevice.transferIn(inEndpoint, 6);
            console.log(result)
            const data = result.data;
            console.log(data)
        
            const analogInputs = [
                data[1] + 256 * (data[4] & 3),
                0.03 * (data[2] + 256 * ((data[4] >> 2) & 3))
            ];
            console.log("analog")
            console.log(analogInputs)
            return analogInputs;
            }else{
            // Liest den digitalen Zustand der Eingänge I1, I2 und I3
            const result = connecteddevice.transferIn(inEndpoint, 6);
            const data = result.data;
        
            const digitalInputs = [
                (data[0] & 1) !== 0,
                (data[0] & 2) !== 0,
                (data[0] & 4) !== 0
            ];
            console.log("digital")
            console.log(digitalInputs)
            return digitalInputs;
        }
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
    MODE = { UNSPEC:"unspecified", SWITCH:"switch", VOLTAGE:"voltage", RESISTANCE:"resistance", COUNTER:"counter" };
    input_mode = {
	    "i1":this.MODE.UNSPEC,   "i2":this.MODE.UNSPEC,   "i3":this.MODE.UNSPEC,   "i4":this.MODE.UNSPEC,
	    "i5":this.MODE.UNSPEC,   "i6":this.MODE.UNSPEC,   "i7":this.MODE.UNSPEC,   "i8":this.MODE.UNSPEC };
    baudRate= 115200
    configuration=1
    interface=2
    vendorId=0x1c40
    PromiseroductId=0x0538
    writeOut = new Uint8Array([ 0x5a, 0xa5, 0x68, 0xce, 0x2a, 0x04, 0, 4,  0, 3, 0, 0]);
    writeInMode = new Uint8Array([ 0x5a, 0xa5, 0x14, 0x34, 0xff, 0x93, 0x00, 0x02, 0, 0]);
    writeLED= new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
    read= new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
    inputHeader= new Array(90, 165, 244, 138, 22, 50, 0, 20)
    indIn=8 // Number of Inputs
    inLength=24
    indServo=0
    writeresponse=0 // some controllers might return data which we have to read to clear input buffer 
    indOut=12 // Number of outputs
    indSum=10 // Sum of all characteristics which are permanently accessed (not LED)
    textEncoder = new TextEncoder();

    async readInput(ind){
        console.log('start')
        return new Promise((resolve,reject) => {
        parms = { "port": 'i' +(ind+1).toString()}
        data = this.textEncoder.encode(JSON.stringify({ get: parms }));
       connecteddevice.transferOut(outEndpoint, data).then(result => {  
            return connecteddevice.transferIn(5, 64)
        }).then(result => {
            /*if(JSON.parse(textDecoder.decode(result.data)).value==1){
                valIn[i+this.indOut] = 0 
            }else{
                valIn[i+this.indOut] = 255
            }*/
            console.log("stop")
                resolve ()
            }).catch(error=>{
                console.log(error)
                reject()
            })
        })
        }
    

    readfunc(){  
        if (i>7){
            i=0
        }
        console.log(charZust)
   this.readInput(i).then(x=>{
       i=i+1; 
     if (i<8){
             this.readfunc()
       } else {
        i=0
        console.log("done")
        charZust=0
        success=true
       }
     }).catch(error=>{
        console.log(error)
        i=0
        charZust=0
    })
    }
    getwriteOut(ind, val){
        var state = 'HI'
        val = val/127*100
        if(val>0){
            var dir="left"
        }else{
            var dir="right"
            val = val*-1
        }
        if(val==0){
            var dir = "brake"
            state = 'LOW'
        }
        if(ind < this.indOut/3){
            data = this.textEncoder.encode(JSON.stringify({ set: { port: "m"+(ind+1), mode: dir, value: val } }));
            textDecoder= new TextDecoder
            console.log(textDecoder.decode(data))
            return data
        }else{
            data = this.textEncoder.encode(JSON.stringify({ set: { port: "o"+((ind-this.indOut/3)+1), mode: state, value: val } }));
            textDecoder= new TextDecoder
            return data
        }
    }
    getwriteInMode(ind, val){
        data=this.writeInMode
        data[8]=ind 
        data[9]= val
        return data
        // check if requested mode is already set, never change mode for counter inputs
	    /*if((port[0] == 'c') || (this.input_mode[port] == mode)) {
            // console.log("mode already matches or counter");
            return new Promise(resolve => { resolve(); });
        }
        this.input_mode[port] = mode;
        data = this.textEncoder.encode(JSON.stringify({ set: { port: ind, mode: mode } }))
        console.log(data)
        return data*/
    }
    getread(port, mode){
        textEncoder = new TextEncoder();
        parms = { "port": port };	
        if(mode == this.MODE.COUNTER) parms["type"] = "counter";

        data = this.textEncoder.encode(JSON.stringify({ get: parms }));
        console.log(data)
        return data;
    }
    getwriteLED(){
        return this.writeLED
    }
}

async function listen(){//function which calls itself and regularly reads inputs(it might be helpful to include another function which can restart the listening process to prevent connection loss)
    if(charZust==0){
        console.log('yay')
        charZust=1;
       type.readfunc()
       setTimeout(()=>{// call again after short delay
            listen()
        },5)
    }else{
        console.log('nay' + charZust)

       setTimeout(()=>{// if we were unable to read, try again 
            listen()
        },5)
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

    write() { // actual write method
        var ind=list[0]
        if(ind>(type.indOut+type.indIn+type.indServo)){ // check if called from inputchange or not 
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
                            data = type.getwriteOut(ind , 0)
                            connecteddevice.transferOut(outEndpoint, data).then(x=>{  
                                console.log('kk')
                                if(type.writeresponse==0){
                                    return 0;
                                }else{
                                    return connecteddevice.transferIn(inEndpoint, type.writeresponse)
                                }
                            }).then(x=>{
                                console.log('kkk')
                                data =  type.getwriteOut(ind , stor[ind][0])
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
                                } else {
                                    valWrite[2*ind+type.indOut/3]= undefined 
                                    valWrite[(2*ind+type.indOut/3)+1]= undefined 

                                }
                                stor[ind].shift();
                                list.shift();
                             
                                    this.write()
 
                            }).catch(error=>{
                                console.log(error)
                            })
                        }else{
                            data =  type.getwriteOut(ind,stor[ind][0])
                            connecteddevice.transferOut(outEndpoint, data).then(x=>{
                                console.log('kk')

                                if(type.writeresponse==0){
                                    return 0;
                                }else{
                                    return connecteddevice.transferIn(inEndpoint, type.writeresponse)
                                }
                            }).then(x=>{ 
                                console.log('kkk')
                                valWrite[ind]=val
                                if( ind >= type.indOut/3){
                                    valWrite[Math.floor((ind-type.indOut/3)/2)] = undefined 
                                } else {
                                    valWrite[2*ind+type.indOut/3]= undefined 
                                    valWrite[(2*ind+type.indOut/3)+1]= undefined 
                                }
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
                            if(type.writeresponse==0){
                                return 0;
                            }else{
                                return connecteddevice.transferIn(inEndpoint, type.writeresponse)
                            }
                        }).then(x=>{ 
                            console.log(x.data+'done')
                            charZust=0;
                            valWrite[pos]=val
                            list.shift();
                            stor[pos].shift();
                            setTimeout(()=>{// write function will call itself after delay 
                                this.write()
                            },2)
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
        type= new ftduino;
        return connect = new Promise ((resolve, reject) =>{
            var filter = [{ vendorId: type.vendorId, productId: type.productId }]
            console.log(filter)
            navigator.usb.requestDevice({filters: filter})
            .then((device) => {
                connecteddevice=device
                console.log('Dev connected')
                return connecteddevice.open();
            }).then((device) => {
                console.log('Dev opened')
                return connecteddevice.selectConfiguration(type.configuration);
            }).then((device) => {
                return connecteddevice.claimInterface(type.interface);
            }).then(() => {
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
                        'index': 0x02})
                    }else {
                        return 0
                    }
            }).then((device) => {
                if(this.controllertype == 'ftduino'){
                    outEndpoint = 4
                    inEndpoint = 5
                }else {
                const { alternates } = connecteddevice.configuration.interfaces[0];
                const alternate = alternates[0];
                for (const endpoint of alternate.endpoints) {
                    console.log(endpoint)
                  if (endpoint.direction === "in") {
                    inEndpoint = endpoint.endpointNumber;
                    console.log("in" + inEndpoint);
                  } else if (endpoint.direction === "out") {
                    outEndpoint = endpoint.endpointNumber;
                    console.log("out" + outEndpoint);
                  }
                }
            }
                charZust=0;
                read=0
                for(var i=0; i<(type.indOut+type.indIn+type.indServo); i=i+1){// set all varibles 
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