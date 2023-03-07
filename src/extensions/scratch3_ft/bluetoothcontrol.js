require ("core-js");
require ("regenerator-runtime")

var connecteddevice;
var valWrite = new Array(); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(); //values of In-modes
var e=0;
var g=0;
var f=0;
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
//Controller specifications 
class BTSmart {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;  
    }
    uuidLED='8ae87e32-ad7d-11e6-80f5-76304dec7eb7' 
    uuidsOut= new Array('8ae8860c-ad7d-11e6-80f5-76304dec7eb7','8ae88b84-ad7d-11e6-80f5-76304dec7eb7')
    uuidsIn = new Array('8ae89a2a-ad7d-11e6-80f5-76304dec7eb7','8ae89bec-ad7d-11e6-80f5-76304dec7eb7','8ae89dc2-ad7d-11e6-80f5-76304dec7eb7','8ae89f66-ad7d-11e6-80f5-76304dec7eb7')
    uuidsIM = new Array('8ae88efe-ad7d-11e6-80f5-76304dec7eb7','8ae89084-ad7d-11e6-80f5-76304dec7eb7','8ae89200-ad7d-11e6-80f5-76304dec7eb7','8ae89386-ad7d-11e6-80f5-76304dec7eb7')
    indIn=4 // Number of Inputs
    indOut=2 // Number of outputs
    indWrite=6  //2 motor outputs+4 Input mode calibrations
    indSum=10 // Sum of all characteristics which are permanently accessed (not LED)
    name='BT Smart Controller'//name for BLE connection 
    serviceOutuuid='8ae883b4-ad7d-11e6-80f5-76304dec7eb7'
    serviceInuuid='8ae8952a-ad7d-11e6-80f5-76304dec7eb7'
    serviceIModeuuid='8ae88d6e-ad7d-11e6-80f5-76304dec7eb7'
    serviceLEDuuid='8ae87702-ad7d-11e6-80f5-76304dec7eb7'

}

/*var inMode = {
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
};*/


var input = { // event handler; if a controller with more inputs is added, further input functions have to be added
	in_0: function (event){
    valIn[2] = event.target.value.getUint8(0); // closed --><255
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
				e=0;
			}
		}
	)
}

function connectOut(){
	characteristic=serviceOut.getCharacteristic(type.uuidsOut[f]).then(
        function connect (characteristic){
            //characteristic.addEventListener('characteristicvaluechanged', inMode['inm_'+g]);
            charWrite[f]=characteristic;
            charWrite[f].writeValue(new Uint8Array([0]));
            valWrite[f]=0;
        }
        ).then(
        function fhoeher(){
            f=f+1;
            if(f<type.indOut){
                connectOut();
            }else{
                f=0;
            }
        }
        )
}

function connectIMo(){ // connection of IModes
	characteristic=serviceIMode.getCharacteristic(type.uuidsIM[g]).then(
	function connect (characteristic){
		//characteristic.addEventListener('characteristicvaluechanged', inMode['inm_'+g]);
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
			g=0;
		}
	}
	)
}


class BLEDevice {
    reset(){
    for(var i=0; i<type.indWrite; i=i+1){
        for(var n=0; n<stor[i].length; n=n+1){
            stor[i].shift()
        }
    }
    for(var n=0; n<type.indOut; n=n+1){
        this.write_Value(n, 0)
    }

}
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
    if(valWrite[ind]==stor[ind][0]){
        stor[ind].shift()
        if(stor[ind].length>0){ // if there are still elements in the storage do it again 
            this.write (ind)
        }
    }else{
	if(charZust[ind]==0&&stor[ind].length>0){ // if nothing is being changed and storage is not empty
		charZust[ind]=1; // switch to currently changing
		if(ind<type.indOut){
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
   }
changeInMode (args){ // Called By Hats to handle wrong input modes
    if(funcstate[parseInt(args.INPUT)]==0){
        funcstate[parseInt(args.INPUT)]=1
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
			changing[parseInt(args.INPUT)]=false;
			funcstate[parseInt(args.INPUT)]=0;
			numruns[parseInt(args.INPUT)]=0;
			
		});	
	})
    }else{
    }
}

write_Value(ind, val){ // writing handler--> this is the method any block should call
    if((ind<type.indOut)&&val>127){
		if(Notification.permission == "granted"){
			const help = new Notification('Output values range from 0 to 8',{
				body: 'keep in mind that the maximum output value is 8',
			})
		}
		var res=127
	}else{
        var res=val
	}
    if(stor[ind].length<5){//if the que gets to long (values are added faster than deleted, we only safe the last values )
	stor[ind].push(res)// add value to queue
    if (charZust[ind]==0){ // if nothig is being changed
		this.write(ind);
	}
}else{
    stor[ind].splice(4,1)
    stor[ind].push(res)
}
}
    
async connect (){
    switch(this.controllertype){
        case 'BTSmart':
            type= new BTSmart;
            break;
    }
    return connect = new Promise ((resolve, reject) =>{
    navigator.bluetooth.requestDevice({
        filters: [{ name: type.name }],
        optionalServices: [type.serviceOutuuid, type.serviceInuuid, type.serviceIModeuuid, type.serviceLEDuuid, ]
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
            if(services[i].uuid==type.serviceOutuuid){
                serviceOut=services[i]
                    i=10}}; // wichtig... müssen wir für jeden service so implementieren, dann alle Characteristics einzeln einmal übernemen, dann kann man die recht simpel überschreiben 
        for(i=0; i<4; i=i+1){
            console.log(i+services[i].uuid);
            if(services[i].uuid==type.serviceInuuid){
                serviceIn=services[i]
                    i=10}};
        for(i=0; i<4; i=i+1){
            console.log(i+services[i].uuid);
            if(services[i].uuid== type.serviceIModeuuid){
                serviceIMode=services[i]
                    i=10}};
        for(i=0; i<4; i=i+1){
            console.log(i+services[i].uuid);
            if(services[i].uuid==type.serviceLEDuuid){
                return services[i].getCharacteristic(type.uuidLED);
            }};
    }).then(characteristic => {
        console.log("Characteristic found.");
        characteristic.writeValue(new Uint8Array([1]));
        d=characteristic;
        return 5;
    }).then(x => {
        connectOut()
        return 5;
    }).then(x => {
        connectIn();
        return 5; 
    }).then(x => {
        connectIMo();
        for(var i=0; i<type.indWrite; i=i+1){
            charZust[i]=0;
            funcstate[i]=0;
            changing[i]=false
            numruns[i]=0
            stor[i]=[]
        }
        return 5;
    }).then(x => {
        resolve(connecteddevice);
       }).catch(error => {
        reject(error);
    })
    })
   
}
}

module.exports = BLEDevice;