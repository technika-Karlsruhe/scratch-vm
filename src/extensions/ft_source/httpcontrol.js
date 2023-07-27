
require ("core-js");
require ("regenerator-runtime")
var success=false
var list = new Array(); //order of tasks
var valWrite = new Array(); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(); //values of In-modes
var stor = new Array() // memory 
var charZust=0;
var inputchange = new Array()
var funcstate= new Array()
var changing= new Array()
var numruns = new Array()
var read=0
var notificationTimer=0
var url

class txt40{
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); // setup translation
    }   
        usburl='http://192.168.7.2'
        wlanurl='http://192.168.8.2'
        indIn=8 // Number of Inputs
        inLength=24
        indServo=3
        indOut= 12 // Number of outputs
        indSum=10
        readfunc(){ 
            fetch(url+':8000', 
            {
              method: 'GET',

            }).then(x=>{ return x.text()
            }).then(x=>{ 
                if(JSON.parse(x).i1/200000*255>255){
                    valIn[0+this.indOut] = 255
                }else{
                    valIn[0+this.indOut] = JSON.parse(x).i1/200000*255
                }
                if(JSON.parse(x).i1/200000*255>255){
                    valIn[1+this.indOut] = 255
                }else{
                    valIn[1+this.indOut] = JSON.parse(x).i1/200000*255
                }
                if(JSON.parse(x).i1/200000*255>255){
                    valIn[2+this.indOut] = 255
                }else{
                    valIn[2+this.indOut] = JSON.parse(x).i1/200000*255
                }
                if(JSON.parse(x).i1/200000*255>255){
                    valIn[3+this.indOut] = 255
                }else{
                    valIn[3+this.indOut] = JSON.parse(x).i1/200000*255
                }
                if(JSON.parse(x).i1/200000*255>255){
                    valIn[4+this.indOut] = 255
                }else{
                    valIn[4+this.indOut] = JSON.parse(x).i1/200000*255
                }
                if(JSON.parse(x).i1/200000*255>255){
                    valIn[5+this.indOut] = 255
                }else{
                    valIn[5+this.indOut] = JSON.parse(x).i1/200000*255
                }
                if(JSON.parse(x).i1/200000*255>255){
                    valIn[6+this.indOut] = 255
                }else{
                    valIn[6+this.indOut] = JSON.parse(x).i1/200000*255
                }
                if(JSON.parse(x).i1/200000*255>255){
                    valIn[7+this.indOut] = 255
                }else{
                    valIn[7+this.indOut] = JSON.parse(x).i1/200000*255
                }
                valIn[8+this.indOut+this.indServo] = JSON.parse(x).c1;
                valIn[9+this.indOut+this.indServo] = JSON.parse(x).c2;
                valIn[10+this.indOut+this.indServo] = JSON.parse(x).c3;
                valIn[11+this.indOut+this.indServo] = JSON.parse(x).c4;
                success = true
                charZust=0
            }).catch(error=>{
                charZust=0
                console.log(error)
                main.disconnect()
            })
        }
        getwriteOut(ind, val){
            value = val/127*512
            if(ind < this.indOut/3){
               var string = {port : "m"+(ind+1).toString(), val:  value}
            }else{
                var string = {port: "o"+((ind-this.indOut/3)+1).toString() ,val : value}
            }
            console.log(JSON.stringify(string))
            return JSON.stringify(string)
        }
        getwriteInMode(ind, value){
            var string;
            string = {port : "i"+(ind+1).toString(), val: value}
            console.log(string)
            return JSON.stringify(string)
        }
        getwriteCounterreset(ind){
            var string;
            string = {port: "c"+(ind+1).toString()}
            return JSON.stringify(string)
        }
        getwriteServo(ind, value){
            value = value/127*512
            string = {port : "s"+(ind+1).toString(), val: value}
            console.log(string)
            return JSON.stringify(string)
        }
}

async function listen(){//function which calls itself and regularly reads inputs(it might be helpful to include another function which can restart the listening process to prevent connection loss)
    if(charZust==0){
        charZust=1;
       type.readfunc()
       setTimeout(()=>{// call again after short delay
        if(controller!=undefined &&controller.connected==true){
            listen()
        }else {
            console.log(controller)
            console.log(controller.connected)
        }
        },5)
    }else{
       setTimeout(()=>{// if we were unable to read, try again 
        if(controller!=undefined &&controller.connected==true){
            listen()
        }else {
            console.log(controller)
            console.log(controller.connected)
        }
        },5)
    }
}

class HttpDevice{
    reset(){// clear storage and set all outputs to 0
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
    connection = undefined
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
        }            console.log(parseInt(args.INPUT))

        console.log(funcstate[parseInt(args.INPUT)])
        if(funcstate[parseInt(args.INPUT)]==0){ // not already chaning 
            console.log("ok1")
            read=0// reset the read variable which indicates if the input value has already been read after the imode was changed 
            inputchange[parseInt(args.INPUT)].push(val); // set current value 
            console.log("ok2")
            funcstate[parseInt(args.INPUT)]=1; // chnaing 
            console.log("ok3")

            list.splice(0, 0, (parseInt(args.INPUT))) // more important than other changes 
            stor[(parseInt(args.INPUT))].splice(0, 0,val)
            if(charZust==0){
                this.write()
            }
        }
        console.log(valWrite[parseInt(args.INPUT)])
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
                            fetch(url+':8000', {
                                method: 'POST', 
                                body: data
                            }).then(x=>{
                                data =  type.getwriteOut(ind , stor[ind][0])
                                return  fetch(url+':8000', {
                                    method: 'POST', 
                                    body: data})
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
                                setTimeout(()=>{
                                    this.write()
                                },2)
                                console.log(error)
                            })
                        }else{
                            data =  type.getwriteOut(ind,stor[ind][0])
                            fetch(url+':8000', {
                                method: 'POST', 
                                body: data
                            }).then(x=>{ 
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
                                setTimeout(()=>{
                                    this.write()
                                },2)
                                console.log(error)
                        })
                        }
                    }else if(ind<(type.indOut+type.indIn)){
                        data= type.getwriteInMode(ind-type.indOut, stor[pos][0])
                        fetch(url+':8000', {
                            method: 'POST', 
                            body: data
                        }).then(x=>{
                            charZust=0;
                            valWrite[pos]=val
                            list.shift();
                            stor[pos].shift();
                            setTimeout(()=>{// write function will call itself after delay 
                                this.write()
                            },2)
                        }).catch(error=>{
                            setTimeout(()=>{
                                this.write()
                            },2)
                            console.log(error)
                           })
                }else if (ind<(type.indOut+type.indIn+type.indServo)){
                    console.log("foo")
                     data= type.getwriteServo(ind-type.indOut-type.indIn, stor[pos][0])
                        fetch(url+':8000', {
                            method: 'POST', 
                            body: data
                        }).then(x=>{
                            charZust=0;
                            valWrite[pos]=val
                            list.shift();
                            stor[pos].shift();
                            setTimeout(()=>{// write function will call itself after delay 
                                this.write()
                            },2)
                        }).catch(error=>{
                            setTimeout(()=>{
                                this.write()
                            },2)
                            console.log(error)
                           })
                }else{
                    data= type.getwriteCounterreset(ind-type.indOut-type.indIn-type.indServo)
                    fetch(url+':8000', {
                        method: 'POST', 
                        body: data
                    }).then(x=>{ 
                        charZust=0;
                        valWrite[pos]=val
                        list.shift();
                        stor[pos].shift();
                        setTimeout(()=>{// write function will call itself after delay 
                            this.write()
                        },2)
                    }).catch(error=>{
                        setTimeout(()=>{
                            this.write()
                        },2)
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
        //rdV6pJ
        var apikey 
        switch(this.controllertype){
            case 'TXT40':
                type= new txt40;
            break;
        }
        return connect = new Promise ((resolve, reject) =>{
            var formData= new FormData()
            swal(translate._getText('connect',this.locale), { //lets the user choose between Ble and usb
                buttons: {
                    cancel: translate._getText('cancel',this.locale),
                    usb: {
                        text: "USB",
                        value: "usb",
                    },
                    bt: {
                        text: "WLAN AP",
                        value: "wlan",
                    },
                },
            }).then(value=>{
            if(value =="usb"){
                url = type.usburl
                var rawstr = 'from fischertechnik.controller.Motor import Motorxxxx##from lib.controller import *xxxximport fischertechnik.factories as txt_factoryxxxximport jsonxxxxfrom http.server import HTTPServer, BaseHTTPRequestHandlerxxxximport socketserverxxxxHOST = "192.168.7.2"  # txt 4.0xxxx##HOST  = "127.0.0.1"xxxxPORT = 8000  # Port to listen on (non-privileged ports are > 1023)xxxxinputs = [0x0b, 0x0b, 0x0b, 0x0b,0x0b, 0x0b,0x0b, 0x0b]xxxxinput = []xxxxcounter  = []xxxxoutput = []xxxxservo = []xxxxclass NewHTTP(BaseHTTPRequestHandler):xxxx    def do_GET(self):xxxx        self.send_response(200)xxxx        self.send_header("Content-type", "application/json")xxxx        self.send_header("Access-Control-Allow-Origin", "*"),xxxx        self.end_headers()xxxx        ##TXT_M_I1_color_sensor.get_voltage()xxxx        ##result = { "i1":str(TXT_M_I1_mini_switch.get_resistance())}xxxx        result = dict()xxxx        for i in range(8):xxxx            if(inputs[i]==0x0b):xxxx                 result.update({ "i"+str(i+1) : str(input[i].get_resistance())})xxxx            else:xxxx                result.update({ "i"+str(i+1) : str(input[i].get_voltage())})xxxx        for n in range(4):xxxx            result.update({ "c"+str(n+1) : str(counter[n].get_count())})xxxx        self.wfile.write(bytes(json.dumps(result), "utf-8"))xxxxxxxx    def do_OPTIONS(self):xxxx        self.send_response(200)xxxx        self.send_header("Access-Control-Allow-Origin", "*"),xxxx        self.send_header("Access-Control-Allow-Headers", "*"),xxxx        self.end_headers()xxxxxxxxxxxx    def do_POST(self):xxxx        content_len = int(self.headers.get("Content-Length"))xxxx        post_body = self.rfile.read(content_len)xxxx        self.send_response(200)xxxx        self.send_header("Access-Control-Allow-Origin", "*"),xxxx        self.end_headers()xxxx        post_body = json.loads(post_body.decode("utf-8"))xxxx        if(str(post_body["port"])[0] == "i"):xxxx            self.wfile.write(self.changein(post_body))xxxx        elif(str(post_body["port"])[0] == "c"):xxxx            counter[int(str(post_body["port"])[1])-1].reset()xxxx            self.wfile.write(bytes("ok", "utf-8"))xxxx        elif(str(post_body["port"])[0] == "o"):xxxx            self.wfile.write(self.setout(post_body))xxxx        elif(str(post_body["port"])[0] == "m"):xxxx            self.wfile.write(self.setmotor(post_body))xxxx        elif(str(post_body["port"])[0] == "s"):xxxx            self.wfile.write(self.setservo(post_body))xxxx        else:xxxx            self.wfile.write(bytes("undefined", "utf-8"))xxxxxxxx    def changein(self, post_body):xxxx        try:xxxx            val = post_body["val"]xxxx            if(val == 0x0a):xxxxxxxx                input[int(str(post_body["port"])[1])-1] = txt_factory.input_factory.create_color_sensor(TXT_M, int(str(post_body["port"])[1]))xxxx                inputs[int(str(post_body["port"])[1])-1] = 0x0axxxx                return bytes("ok", "utf-8")xxxx            elif(val == 0x0b):xxxx                input[int(str(post_body["port"])[1])-1] = txt_factory.input_factory.create_photo_resistor(TXT_M, int(str(post_body["port"])[1]))xxxx                inputs[int(str(post_body["port"])[1])-1] = 0x0bxxxx                return bytes("ok", "utf-8")xxxx            else:xxxx                return bytes("mode not defined", "utf-8")xxxx        except Exception as e:xxxx            return bytes("error:"+str(e), "utf-8")xxxxxxxx    def setout(self, post_body):xxxx        try:xxxx            val = int(str(post_body["val"]))xxxx            output[int(str(post_body["port"])[1])-1].set_brightness(val)xxxx            return bytes("ok", "utf-8")xxxx        except Exception as e:xxxx            return bytes("error:"+str(e), "utf-8")xxxxxxxx    def setmotor(self, post_body):xxxx        try:xxxx            val = int(str(post_body["val"]))xxxx            if(val>0):xxxx                output[int(str(post_body["port"])[1])].set_brightness(0)xxxx                output[int(str(post_body["port"])[1])-1].set_brightness(val)xxxx            else:xxxx                output[int(str(post_body["port"])[1])].set_brightness(val*(-1))xxxx                output[int(str(post_body["port"])[1])-1].set_brightness(0)xxxx            return bytes("ok", "utf-8")xxxx        except Exception as e:xxxx            return bytes("error:"+str(e), "utf-8")xxxxxxxx    def setservo(self, post_body):xxxx        try:xxxx            val = int(str(post_body["val"]))xxxx            servo[int(str(post_body["port"])[1])-1].set_position(val)xxxx            return bytes("ok", "utf-8")xxxx        except Exception as e:xxxx            return bytes("error:"+str(e), "utf-8")xxxxxxxxserver = HTTPServer((HOST, PORT ), NewHTTP) ##server is startedxxxxtxt_factory.init()xxxxtxt_factory.init_input_factory()xxxxtxt_factory.init_motor_factory()xxxxtxt_factory.init_counter_factory()xxxxtxt_factory.init_usb_factory()xxxxtxt_factory.init_camera_factory()xxxxtxt_factory.init_output_factory()xxxxtxt_factory.init_servomotor_factory()xxxxxxxxxxxxTXT_M = txt_factory.controller_factory.create_graphical_controller()xxxxfor x in range (8):xxxx    input.append(txt_factory.input_factory.create_photo_resistor(TXT_M, x+1))xxxxfor x in range (4):xxxx    counter.append(txt_factory.counter_factory.create_mini_switch_counter(TXT_M, x+1))xxxxfor x in range (8):xxxx    output.append(txt_factory.output_factory.create_led(TXT_M,x+1))xxxxfor x in range(3):xxxx    servo.append(txt_factory.servomotor_factory.create_servomotor(TXT_M,x+1))xxxxtxt_factory.initialized()xxxxserver.serve_forever() ##runs infinitelyxxxx'
            }else if(value =="wlan"){
                url = type.wlanurl
                var rawstr = 'from fischertechnik.controller.Motor import Motorxxxx##from lib.controller import *xxxximport fischertechnik.factories as txt_factoryxxxximport jsonxxxxfrom http.server import HTTPServer, BaseHTTPRequestHandlerxxxximport socketserverxxxxHOST = "192.168.8.2"  # txt 4.0xxxx##HOST  = "127.0.0.1"xxxxPORT = 8000  # Port to listen on (non-privileged ports are > 1023)xxxxinputs = [0x0b, 0x0b, 0x0b, 0x0b,0x0b, 0x0b,0x0b, 0x0b]xxxxinput = []xxxxcounter  = []xxxxoutput = []xxxxservo = []xxxxclass NewHTTP(BaseHTTPRequestHandler):xxxx    def do_GET(self):xxxx        self.send_response(200)xxxx        self.send_header("Content-type", "application/json")xxxx        self.send_header("Access-Control-Allow-Origin", "*"),xxxx        self.end_headers()xxxx        ##TXT_M_I1_color_sensor.get_voltage()xxxx        ##result = { "i1":str(TXT_M_I1_mini_switch.get_resistance())}xxxx        result = dict()xxxx        for i in range(8):xxxx            if(inputs[i]==0x0b):xxxx                 result.update({ "i"+str(i+1) : str(input[i].get_resistance())})xxxx            else:xxxx                result.update({ "i"+str(i+1) : str(input[i].get_voltage())})xxxx        for n in range(4):xxxx            result.update({ "c"+str(n+1) : str(counter[n].get_count())})xxxx        self.wfile.write(bytes(json.dumps(result), "utf-8"))xxxxxxxx    def do_OPTIONS(self):xxxx        self.send_response(200)xxxx        self.send_header("Access-Control-Allow-Origin", "*"),xxxx        self.send_header("Access-Control-Allow-Headers", "*"),xxxx        self.end_headers()xxxxxxxxxxxx    def do_POST(self):xxxx        content_len = int(self.headers.get("Content-Length"))xxxx        post_body = self.rfile.read(content_len)xxxx        self.send_response(200)xxxx        self.send_header("Access-Control-Allow-Origin", "*"),xxxx        self.end_headers()xxxx        post_body = json.loads(post_body.decode("utf-8"))xxxx        if(str(post_body["port"])[0] == "i"):xxxx            self.wfile.write(self.changein(post_body))xxxx        elif(str(post_body["port"])[0] == "c"):xxxx            counter[int(str(post_body["port"])[1])-1].reset()xxxx            self.wfile.write(bytes("ok", "utf-8"))xxxx        elif(str(post_body["port"])[0] == "o"):xxxx            self.wfile.write(self.setout(post_body))xxxx        elif(str(post_body["port"])[0] == "m"):xxxx            self.wfile.write(self.setmotor(post_body))xxxx        elif(str(post_body["port"])[0] == "s"):xxxx            self.wfile.write(self.setservo(post_body))xxxx        else:xxxx            self.wfile.write(bytes("undefined", "utf-8"))xxxxxxxx    def changein(self, post_body):xxxx        try:xxxx            val = post_body["val"]xxxx            if(val == 0x0a):xxxxxxxx                input[int(str(post_body["port"])[1])-1] = txt_factory.input_factory.create_color_sensor(TXT_M, int(str(post_body["port"])[1]))xxxx                inputs[int(str(post_body["port"])[1])-1] = 0x0axxxx                return bytes("ok", "utf-8")xxxx            elif(val == 0x0b):xxxx                input[int(str(post_body["port"])[1])-1] = txt_factory.input_factory.create_photo_resistor(TXT_M, int(str(post_body["port"])[1]))xxxx                inputs[int(str(post_body["port"])[1])-1] = 0x0bxxxx                return bytes("ok", "utf-8")xxxx            else:xxxx                return bytes("mode not defined", "utf-8")xxxx        except Exception as e:xxxx            return bytes("error:"+str(e), "utf-8")xxxxxxxx    def setout(self, post_body):xxxx        try:xxxx            val = int(str(post_body["val"]))xxxx            output[int(str(post_body["port"])[1])-1].set_brightness(val)xxxx            return bytes("ok", "utf-8")xxxx        except Exception as e:xxxx            return bytes("error:"+str(e), "utf-8")xxxxxxxx    def setmotor(self, post_body):xxxx        try:xxxx            val = int(str(post_body["val"]))xxxx            if(val>0):xxxx                output[int(str(post_body["port"])[1])].set_brightness(0)xxxx                output[int(str(post_body["port"])[1])-1].set_brightness(val)xxxx            else:xxxx                output[int(str(post_body["port"])[1])].set_brightness(val*(-1))xxxx                output[int(str(post_body["port"])[1])-1].set_brightness(0)xxxx            return bytes("ok", "utf-8")xxxx        except Exception as e:xxxx            return bytes("error:"+str(e), "utf-8")xxxxxxxx    def setservo(self, post_body):xxxx        try:xxxx            val = int(str(post_body["val"]))xxxx            servo[int(str(post_body["port"])[1])-1].set_position(val)xxxx            return bytes("ok", "utf-8")xxxx        except Exception as e:xxxx            return bytes("error:"+str(e), "utf-8")xxxxxxxxserver = HTTPServer((HOST, PORT ), NewHTTP) ##server is startedxxxxtxt_factory.init()xxxxtxt_factory.init_input_factory()xxxxtxt_factory.init_motor_factory()xxxxtxt_factory.init_counter_factory()xxxxtxt_factory.init_usb_factory()xxxxtxt_factory.init_camera_factory()xxxxtxt_factory.init_output_factory()xxxxtxt_factory.init_servomotor_factory()xxxxxxxxxxxxTXT_M = txt_factory.controller_factory.create_graphical_controller()xxxxfor x in range (8):xxxx    input.append(txt_factory.input_factory.create_photo_resistor(TXT_M, x+1))xxxxfor x in range (4):xxxx    counter.append(txt_factory.counter_factory.create_mini_switch_counter(TXT_M, x+1))xxxxfor x in range (8):xxxx    output.append(txt_factory.output_factory.create_led(TXT_M,x+1))xxxxfor x in range(3):xxxx    servo.append(txt_factory.servomotor_factory.create_servomotor(TXT_M,x+1))xxxxtxt_factory.initialized()xxxxserver.serve_forever() ##runs infinitelyxxxx'
            }else{
                throw("cancelled")
            }
            var str = rawstr.replace(/xxxx/g, "\n") // python file written as one line string is now formatted
            console.log(str)
         
            scratchserver = new File ([str], "/scratchserver.py")
            formData.append('files', scratchserver, '/scratchserver.py') // file is added to form data object which will be send to the TXT4.0
            controllerfile = new File([''] , "lib/controller.py", {
            })
            formData.append('files', controllerfile, 'lib/controller.py')
            //get apikey
            return this.getapikey()
            }).then(api=>{
            apikey = api // variable apikey is defined in the entire function api only in the first then call
            //sending http requests to send and start the python code
             return fetch(url+ '/api/v1/controller/discovery', 
            {
            method: 'GET',
            headers:{"X-API-KEY":apikey}
            }
            )
            }).then(x=>{
            if(x.status == 200){
            return fetch(url+'/api/v1/ping', 
            {
            method: 'GET',
            headers: {
                "X-API-KEY":apikey
            },
            }
        )
    }else{
        throw("check api key")        
    }
        }).then(x=>{
            console.log(x)
        return fetch(url+'/api/v1/stop', 
        {
        method: 'DELETE',
        headers: {
            "X-API-KEY":apikey
        },
        }
        )
        }).then(x=>{
            console.log(x)
        return fetch(url+'/api/v1/workspaces/scratchserver', 
        {
        method: 'GET',
        headers: {
            "X-API-KEY":apikey
        },
        }
        )}).then(x=>{
            console.log(x)
        return fetch(url+'/api/v1/workspaces?workspace_name=scratchserver', 
        {
        method: 'POST',
        headers: {
            "X-API-KEY":apikey
        },
        }
        )
        }).then(x=>{
            console.log(x)
            return fetch(url+'/api/v1/workspaces/scratchserver/files', 
        {
            method: 'POST',
            headers: {
                "X-API-KEY":apikey
            },
            body: formData
        }
        )
        }).then(x=>{
            return fetch(url+'/api/v1/application/scratchserver/start',
            {
                method: 'POST',
            headers: {
                "X-API-KEY":apikey
            },
            })
        }).then(x=>{
            console.log(x)
            for(var i=0; i<(type.indOut+type.indIn+type.indServo+type.indOut/3); i=i+1){// set all varibles 
                inputchange[i]=[]
                inputchange[i][0]=0
                funcstate[i]=0;
                changing[i]=false
                numruns[i]=0
                valWrite[i]=0x0b
                stor[i]=[]
            }
            charZust=0;
            read=0
            this.connecthand()
            //listen()// setup the two selfcalling functions 
            //this.write()
            buttonpressed = false 
            resolve("TXT40")
        }).catch(error=>{
            reject(error)
        })
    })     
    }

    getapikey() {
		return new Promise((resolve,reject) => {
			swal({
				text: translate._getText('apikeytxt', this.locale),
				content: {
					element: 'input',
					attributes: {
						placeholder: translate._getText('apikey', this.locale),
						type: 'text',
					},
				},
				button: {
					text: 'OK',
					closeModal: true,
				},
			}).then((value) => {
				if (value) {
					console.log('API key:', value);
					resolve(value);
				} else {
					console.log('No API key entered.');
					reject(null);
				}
			});
		});
	}

    connecthand(){
        console.log("foo")
        try{
            fetch(url+':8000').then(x=>{
                listen()// setup the two selfcalling functions 
                this.write()
                this.connected=true
                console.log(this.connected)
            }).catch(err=>{
                console.log(err)
                setTimeout(()=>{   
                    this.connecthand()
                },100)
            })
        }catch(err){
            console.log(err)
            }
    }
    async autoconnect(){// connect to controller 
        return autoconnect = new Promise ((resolve, reject) =>{
            reject("no")
        })
    }
}
module.exports = HttpDevice;