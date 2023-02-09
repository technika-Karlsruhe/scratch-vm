var connecteddevice;
var valWrite = new Array(0, 0, 0, 0, 0, 0); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(0, 0, 0, 0, 0, 0); //values of In-modes
var e=0;
var g=0;
const charWrite = new Array (0, 0, 0, 0, 0, 0); // chars of all writable (0, 1 --> Motor; 2-5--> Inputs)
const charZust = new Array (0, 0, 0 ,0 ,0 , 0); //Represents pending promises--> first two for M1; M2 next four IModes 1-4 -->0: no promise pending, characteristic can be written, | 1: wait until the promise is resolved
var stor = new Array([], [], [] , [], [], []) // memory 
const charI = new Array (0, 0, 0, 0, 0, 0); 
var serviceOut;
var serviceIn;
var serviceIMode;
const uuidsIn = new Array('8ae89a2a-ad7d-11e6-80f5-76304dec7eb7','8ae89bec-ad7d-11e6-80f5-76304dec7eb7','8ae89dc2-ad7d-11e6-80f5-76304dec7eb7','8ae89f66-ad7d-11e6-80f5-76304dec7eb7');
const uuidsIM = new Array('8ae88efe-ad7d-11e6-80f5-76304dec7eb7','8ae89084-ad7d-11e6-80f5-76304dec7eb7','8ae89200-ad7d-11e6-80f5-76304dec7eb7','8ae89386-ad7d-11e6-80f5-76304dec7eb7')
var funcstate= new Array()
var changing= new Array()
var numruns = new Array()

var inMode = {
	inm_0: function (event){
    valWrite[2] = event.target.value.getUint8(0); 
	console.log(event);
	console.log(event.target.value.getUint8(0));
},
	inm_1: function (event){
    valWrite[3] = event.target.value.getUint8(0); 
},
	inm_2: function (event){
    valWrite[4] = event.target.value.getUint8(0); 
},
	inm_3: function (event){
    valWrite[5] = event.target.value.getUint8(0); 
}
};


var input = { // event handler 
	in_0: function (event){
    valIn[2] = event.target.value.getUint8(0); // closed -->0
},
	in_1: function (event){
    valIn[3] = event.target.value.getUint8(0); 
},
	in_2: function (event){
    valIn[4] = event.target.value.getUint8(0); 
},
	in_3: function (event){
    valIn[5] = event.target.value.getUint8(0); 
	console.log(valIn[5]);
}
};

function m1change(event){
	valWrite[0] = event.target.value.getUint8(0);
}

function m2change(event){
	valWrite[1] = event.target.value.getUint8(0);
}

function connectIn(){ // automatic connection of all Inputs and event Listeners+Notifications
	characteristic=serviceIn.getCharacteristic(uuidsIn[e]).then(
		function connectI (characteristic){
			characteristic.addEventListener('characteristicvaluechanged', input['in_'+e]);
			characteristic.startNotifications();
			charI[e+2]=characteristic;
			charI[e+2].readValue();
		}
	).then(
		function ehoeher(){
			console.log("e"+e);
			e=e+1;
			if(e<4){
				connectIn();
			}else {
				e=0;
			}
		}
	)
}

function connectIMo(){ // connection of IModes
	characteristic=serviceIMode.getCharacteristic(uuidsIM[g]).then(
	function connect (characteristic){
		//characteristic.addEventListener('characteristicvaluechanged', inMode['inm_'+g]);
		charWrite[g+2]=characteristic;
		charWrite[g+2].writeValue(new Uint8Array([0x0b]));
		valWrite[g+2]=0x0b;
	}
	).then(
	function ghoeher(){
		console.log("g"+g);
		g=g+1;
		if(g<4){
			connectIMo();
		}else{
			g=0;
		}
	}
	)
}


class BLEDevice {
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

    write (ind){ // actual write method
	    if(charZust[ind]==0&&stor[ind].length>0){ // if nothing is being changed and storage is not empty
		    charZust[ind]=1; // switch to currently changing
		    if(ind==0||ind==1){
			    if (valWrite[ind]==stor[ind][0]||valWrite[ind]==0||stor[ind][0]==0){
				    charWrite[ind].writeValue(new Uint8Array([stor[ind][0]])).then(x=>{ // write value 
					    valWrite[ind]=stor[ind][0] // change memory 
					    charZust[ind]=0; // switch to no curret task
					    stor[ind].shift(); // delete from storage 
					    if(stor[ind].length>0){ // if there are still elements in the storage do it again 
						    this.write (ind)
					    }
				    })
			    }else{
			        charWrite[ind].writeValue(new Uint8Array(0)).then(x=>{ 
				        charWrite[ind].writeValue(new Uint8Array([stor[ind][0]])).then(x=>{ // write value 
					        valWrite[ind]=stor[ind][0] // change memory 
					        charZust[ind]=0; // switch to no curret task
					        stor[ind].shift(); // delete from storage 
					        if(stor[ind].length>0){ // if there are still elements in the storage do it again 
						        this.write (ind)
					        }
				        })
			        })
			    }
		    }else{
			    charWrite[ind].writeValue(new Uint8Array([stor[ind][0]])).then(x=>{
				    charZust[ind]=0;
				    valWrite[ind]=stor[ind][0];
				    stor[ind].shift();
				    if(stor[ind].length>0){
					    this.write (ind)
				    }
			    })
		    }
	    }
    }
    
    changeInMode (args, blocknum){ // Called By Hats to handle wrong input modes
        if(funcstate[blocknum]==0){
            funcstate[blocknum]=1
	        charI[parseInt(args.INPUT)].stopNotifications().then(x =>{ // no unwanted signal
		        if(valWrite[parseInt(args.INPUT)]==0x0b){ // change mode
			        var val=0x0a; 
		        }else{
			        var val=0x0b; 
		        }
                console.log("1")
		        charWrite[parseInt(args.INPUT)].writeValue(new Uint8Array([val])).then(x =>{
                    console.log("2")
                    return charI[parseInt(args.INPUT)].readValue(); // Reading a Value with the new Input mode (to avoid an "old value" being stored)
                }).then(x =>{
                    console.log("3")
                    return charI[parseInt(args.INPUT)].startNotifications()
                }).then(x =>{ // Notifications are enabled again
                    console.log("4")
                    return charI[parseInt(args.INPUT)].readValue(); 
                }).then(x =>{
                    console.log("5")
                    valWrite[parseInt(args.INPUT)]=val;
                    charZust[parseInt(args.INPUT)]=0;
                    this.write(parseInt(args.INPUT))
                    changing[blocknum]=false;
                    funcstate[blocknum]=0;
                    numruns[blocknum]=0;
		        });	
	        })
        }else{

        }
    }

    write_Value(ind, val){ // writing handler--> this is the method any block should call
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
        if (charZust[ind]==0){ // if nothig is being changed
            this.write(ind);
        }
    }
    
    connect = new Promise ((resolve, reject) =>{
        navigator.bluetooth.requestDevice({
            filters: [{ name: 'BT Smart Controller' }],
            optionalServices: ['8ae883b4-ad7d-11e6-80f5-76304dec7eb7', '8ae87702-ad7d-11e6-80f5-76304dec7eb7', '8ae8952a-ad7d-11e6-80f5-76304dec7eb7', '8ae88d6e-ad7d-11e6-80f5-76304dec7eb7', ]
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
            for(i=0; i<4; i=i+1){
                console.log(i+services[i].uuid);
                if(services[i].uuid=='8ae883b4-ad7d-11e6-80f5-76304dec7eb7'){
                    serviceOut=services[i]
                    i=10
                }
            }; // wichtig... müssen wir für jeden service so implementieren, dann alle Characteristics einzeln einmal übernemen, dann kann man die recht simpel überschreiben 
            for(i=0; i<4; i=i+1){
                console.log(i+services[i].uuid);
                if(services[i].uuid=='8ae8952a-ad7d-11e6-80f5-76304dec7eb7'){
                    serviceIn=services[i]
                    i=10
                }
            };
            for(i=0; i<4; i=i+1){
                console.log(i+services[i].uuid);
                if(services[i].uuid=='8ae88d6e-ad7d-11e6-80f5-76304dec7eb7'){
                    serviceIMode=services[i]
                    i=10
                }
            };
            for(i=0; i<4; i=i+1){
                console.log(i+services[i].uuid);
                if(services[i].uuid=='8ae87702-ad7d-11e6-80f5-76304dec7eb7'){
                    return services[i].getCharacteristic('8ae87e32-ad7d-11e6-80f5-76304dec7eb7');
                }
            };
        }).then(characteristic => {
            console.log("Characteristic found.");
            characteristic.writeValue(new Uint8Array([1]));
            d=characteristic;
            return 5;
        }).then(x => {
            return serviceOut.getCharacteristic('8ae8860c-ad7d-11e6-80f5-76304dec7eb7'); 
        }).then(characteristic =>{
            characteristic.writeValue(new Uint8Array([0]));
            charWrite[0]=characteristic;
            characteristic.addEventListener('characteristicvaluechanged',m1change);
            return 5;
        }).then(x => {
            return serviceOut.getCharacteristic('8ae88b84-ad7d-11e6-80f5-76304dec7eb7'); 
        }).then(characteristic =>{
            characteristic.writeValue(new Uint8Array([0]));
            charWrite[1]=characteristic;
            characteristic.addEventListener('characteristicvaluechanged',m2change);
            return 5;
        }).then(x => {
            connectIn();
            return 5; 
        }).then(x => {
            connectIMo();
            funcstate[0]=0;
            funcstate[1]=0;
            changing[0]=false;
            changing[1]=false;
            for(var i=0; i<6; i=i+1){
                charZust[i]=0;
            }
            return 5;
        }).then(characteristic =>{
            //alert("The controller is now connected");
        /* const greeting = new Notification('The controller is connected',{
                body: 'You can start now',
            })
            if (Notification.permission != "granted"){
                alert("The controller is now connected");
            }*/
        }).then(x => {
            resolve(connecteddevice);
        }).catch(error => {
            reject(error);
        })
    })
    
}

module.exports = BLEDevice;