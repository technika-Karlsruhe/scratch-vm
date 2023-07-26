
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
var textEncoder= new TextEncoder()
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
let timeoutID;

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
    async readInput(result){
        const dataView = new DataView(result.data.buffer);
        const digitalInputs = dataView.getUint8(0) & 0x07;
        const analog1 = dataView.getUint16(1, true);
        const analog2 = dataView.getUint16(3, true);
        const analog3 = (dataView.getUint16(4, true) >> 2);

        var d1=digitalInputs & 0x01
        var d2=digitalInputs & 0x02
        var d3=digitalInputs & 0x04

        if(d1 > 0){
            valIn[this.indOut]=0
        }else{
            valIn[this.indOut]=255
        }
        if(d2 > 0){
            valIn[this.indOut+1]=0
        }else{
            valIn[this.indOut+1]=255
        }
        if(d3 > 0){
            valIn[this.indOut+2]=0
        }else{
            valIn[this.indOut+2]=255
        }
    }

    readfunc(){
        connecteddevice.transferIn(inEndpoint, 6)
        .then(result => {
            this.readInput(result);
            setTimeout(this.readfunc(), 100);
        })
        .catch(error => {
            console.error('Error reading inputs:', error);
        });
    }

    getwriteOut(ind, val){
        console.log("moin")
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
        const byte0 = 0xF2;
        const byte1 = (1 << (ind - 1)) | previousSequence[1];
        const byte2 = (pwmValue << 4) | pwmValue | previousSequence[2];
        const byte3 = 0x00 | previousSequence[3];

        // Set direction bit
        if (dir === 1) {
            byte2 |= 0x08;
        } else {
            byte2 |= 0x80;
        }

        const data = [byte0, byte1, byte2, byte3, 0x00, 0x00];
        //[0xF2, 0x05, 0x1B, 0x0A, 0x00, 0x00]

        console.log(data)
        console.log(new Uint8Array(data))
        return(new Uint8Array(data));
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

    async readInput(indee){// send a request to read an input or counter, surprisingly the read data does not always belong to the latest resopnse but it returns its port number 
        return new Promise((resolve,reject) => {
            var res
            var start= undefined
            var end = undefined
            if(indee>7){
                parms = { "port": 'c' +(indee-7).toString() , type:"counter"}
            }else{
                 parms = { "port": 'i' +(indee+1).toString()}
            }
        data = this.textEncoder.encode(JSON.stringify({ get: parms }));
        connecteddevice.transferOut(outEndpoint, data).then(result => {  
            return connecteddevice.transferIn(5, 64)
        }).then(result => {
            res = textDecoder.decode(result.data)
            for(var r=0; r< res.length; r=r+1){
                if(res.charAt(r) == '{'){
                    start=r
                    break
                }
            }
            for(var r=0; r< res.length; r=r+1){
                if(res.charAt(r) == '}'){
                    end=r
                    break
                }
            }
            if(start != undefined && end != undefined && res != undefined ){
                
            res=res.substring(start, end+1)
            //console.log(res)
                if(JSON.parse(res).port!= undefined && JSON.parse(res).value!= undefined ){
            if(JSON.parse(res).port.substring(0,1)=='C'){
                valIn[Number(JSON.parse(res).port.substring(1))+7+this.indOut]=Number(JSON.parse(res).value)
                //console.log(Number(JSON.parse(textDecoder.decode(result.data)).value))
            }else{
            if(valWrite[Number(JSON.parse(res).port.substring(1))-1+this.indOut]==0x0b){
                valIn[Number(JSON.parse(res).port.substring(1))-1+this.indOut]=JSON.parse(res).value/65535*255
            }else{
                valIn[Number(JSON.parse(res).port.substring(1))-1+this.indOut]=JSON.parse(res).value
            }
        }
        resolve()
    }else{
        reject('nodo')

    }
    }else{
        reject('noo')
    }
            }).catch(error=>{
                console.log(error)
                // connecteddevice.transferIn(5, 64)//this is where the error lies 
                    console.log('foo')
                    console.log(res)
                    setTimeout(x=>{
                        reject(error)
                    },5)
                })
                
            })
        }
    

    readfunc(){ 
        if (i>11){
            i=0
        }
   this.readInput(i).then(x=>{
       i=i+1; 
     if (i<12){
        this.readfunc()           
       } else {
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
            state = 'HI'
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
        if(val == 0x0b){
            val = "resistance"
        }else{
            val = "voltage"
        }
       
        data = this.textEncoder.encode(JSON.stringify({ set: { port: "i"+(ind+1), mode:  val} })); 
        console.log(textDecoder.decode(data))
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

    getwriteCounterreset(ind){
        data = this.textEncoder.encode(JSON.stringify({ set: { port: "c"+(ind+1).toString()} }));
        return data
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

    write() { // actual write method
        var ind=list[0]
        var pos=ind
        if(list.length>0){
            if(valWrite[ind]==stor[pos][0]&&ind<(type.indOut+type.indIn+type.indServo)){ //if the output is already up to date--> skip value
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
                                if(type.writeresponse==0){
                                    return 0;
                                }else{
                                    return connecteddevice.transferIn(inEndpoint, type.writeresponse)
                                }
                            }).then(x=>{
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
                                if(this.controllertype=='LT'){
                                    timeoutID = setTimeout(() => {
                                        if(stor[ind].length<1){
                                            valWrite[ind]=0
                                            this.write_Value(ind, val)
                                        }
                                    }, 400);
                                }
                                stor[ind].shift();
                                list.shift();
                             
                                    this.write()
 
                            }).catch(error=>{
                                console.log(error)
                                this.write()

                            })
                        }else{
                            data =  type.getwriteOut(ind,stor[ind][0])
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
                                } else {
                                    valWrite[2*ind+type.indOut/3]= undefined 
                                    valWrite[(2*ind+type.indOut/3)+1]= undefined 
                                }
                                if(this.controllertype=='LT'){
                                    timeoutID = setTimeout(() => {
                                        if(stor[ind].length<1){
                                            valWrite[ind]=0
                                            this.write_Value(ind, val)
                                        }
                                    }, 400);
                                }
                                charZust=0;
                                stor[ind].shift();
                                list.shift();
                                    this.write()
                            }).catch(error=>{
                                console.log(error)
                                this.write()

                        })
                        }
                    }else if(ind<(type.indOut+type.indIn)){
                        data= type.getwriteInMode(ind-type.indOut, stor[pos][0])
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
                }else if (ind<(type.indOut+type.indIn+type.indServo)){
                    //servomotors can be written here 
                }else{
                    data= type.getwriteCounterreset(ind-type.indOut-type.indIn)
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
        }
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
                for(var i=0; i<(type.indOut+type.indIn+type.indServo+type.indOut/3); i=i+1){// set all varibles 
                    inputchange[i]=[]
                    inputchange[i][0]=0
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                    if(type.name == 'LT'){
                        valWrite[0] = 0x0b;
                        valWrite[1] = 0x0b;
                        valWrite[3] = 0x0b;
                    }
                }
                if(this.controllertype=='ftduino'){ 
                
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+1, mode:  "resistance"} }));
                    connecteddevice.transferOut(outEndpoint, data).then(x=>{
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+2, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+4, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+3, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+5, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+6, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+7, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                        data = textEncoder.encode(JSON.stringify({ set: { port: "i"+8, mode:  "resistance"} }));
                        return connecteddevice.transferOut(outEndpoint, data)
                    
                    }).then (xc=>{
                       data=  (textEncoder.encode("\x1b"));
                        return connecteddevice.transferOut(outEndpoint, data)
                    }).then (xc=>{
                    listen()// setup the two selfcalling functions 
                    this.write()
                    this.connected=true
                    resolve (connecteddevice)
                    })
                }else{// if needed further specifications for sigle controllers can be added here 
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
                        console.log('found')
                       
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
                for(var i=0; i<(type.indOut+type.indIn+type.indServo+type.indOut/3); i=i+1){// set all varibles 
                    inputchange[i]=[]
                    inputchange[i][0]=0
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    valWrite[i]=0x0b
                    stor[i]=[]
                }
                if(this.controllertype=='ftduino'){ 
                
                data = textEncoder.encode(JSON.stringify({ set: { port: "i"+1, mode:  "resistance"} }));
                connecteddevice.transferOut(outEndpoint, data).then(x=>{
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+2, mode:  "resistance"} }));
                    return connecteddevice.transferOut(outEndpoint, data)
                }).then (xc=>{
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+4, mode:  "resistance"} }));
                    return connecteddevice.transferOut(outEndpoint, data)
                }).then (xc=>{
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+3, mode:  "resistance"} }));
                    return connecteddevice.transferOut(outEndpoint, data)
                }).then (xc=>{
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+5, mode:  "resistance"} }));
                    return connecteddevice.transferOut(outEndpoint, data)
                }).then (xc=>{
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+6, mode:  "resistance"} }));
                    return connecteddevice.transferOut(outEndpoint, data)
                }).then (xc=>{
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+7, mode:  "resistance"} }));
                    return connecteddevice.transferOut(outEndpoint, data)
                }).then (xc=>{
                    data = textEncoder.encode(JSON.stringify({ set: { port: "i"+8, mode:  "resistance"} }));
                    return connecteddevice.transferOut(outEndpoint, data)
                
                }).then (xc=>{
                   data=  (textEncoder.encode("\x1b"));
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