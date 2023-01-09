/*
  scratch3_ft/index.js
*/
 
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Block = require('../scratch3_ft/block');
const Translation = require('../scratch3_ft/translation');
const formatMessage = require('format-message');
const  blockIconURI = require('../scratch3_ft/btsmart_small.png');
var serviceOut;
var serviceIn;
var serviceIMode;
//const charM= new Array(0, 0);
const uuidsIn= new Array('8ae89a2a-ad7d-11e6-80f5-76304dec7eb7','8ae89bec-ad7d-11e6-80f5-76304dec7eb7','8ae89dc2-ad7d-11e6-80f5-76304dec7eb7','8ae89f66-ad7d-11e6-80f5-76304dec7eb7');
const uuidsIM = new Array('8ae88efe-ad7d-11e6-80f5-76304dec7eb7','8ae89084-ad7d-11e6-80f5-76304dec7eb7','8ae89200-ad7d-11e6-80f5-76304dec7eb7','8ae89386-ad7d-11e6-80f5-76304dec7eb7')
//const charIM= new Array (0, 0, 0, 0);
const charI= new Array (0, 0, 0, 0, 0, 0); 
//var valM1=0; // Motor two current value 
//var valM2=0; // Motor one current value
var xyz=0;
var count=0;
var stor= new Array([], [] ,[] , [], [],[]) // memory 
const valIn= new Array(0, 0, 0, 0, 0, 0); //values of In-modes
//const valIMo= new Array(0, 0, 0, 0); // Values of Input Modes
const valWrite= new Array(0, 0, 0, 0, 0, 0); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
const charWrite= new Array (0, 0, 0, 0, 0, 0); // chars of all writable (0, 1 --> Motor; 2-5--> Inputs)
const charZust = new Array (0, 0, 0 ,0 ,0 , 0); //Represents pending promises--> first two for M1; M2 next four IModes 1-4 -->0: no promise pending, characteristic can be written, | 1: wait until the promise is resolved
//Die Characteristics die wir später definieren ud dann ansteuern können 

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
//const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjQwcHgiCiAgIGhlaWdodD0iNDBweCIKICAgdmlld0JveD0iMCAwIDQwIDQwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmczMiIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibG9nby5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMS4yICgwYTAwY2Y1MzM5LCAyMDIyLTAyLTA0KSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXczNCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxNi41NSIKICAgICBpbmtzY2FwZTpjeD0iMTkuOTY5Nzg5IgogICAgIGlua3NjYXBlOmN5PSIyNC44MzM4MzciCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNDEiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJldjMiIC8+CiAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1MC4yICg1NTA0NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMiI+ZXYzLWJsb2NrLWljb248L3RpdGxlPgogIDxkZXNjCiAgICAgaWQ9ImRlc2M0Ij5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICA8ZGVmcwogICAgIGlkPSJkZWZzNiIgLz4KICA8ZwogICAgIGlkPSJldjMtYmxvY2staWNvbiIKICAgICBzdHJva2U9Im5vbmUiCiAgICAgc3Ryb2tlLXdpZHRoPSIxIgogICAgIGZpbGw9Im5vbmUiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxnCiAgICAgICBpZD0iZXYzIgogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS41MDAwMDAsIDMuNTAwMDAwKSIKICAgICAgIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgIDxyZWN0CiAgICAgICAgIGlkPSJSZWN0YW5nbGUtcGF0aCIKICAgICAgICAgc3Ryb2tlPSIjN0M4N0E1IgogICAgICAgICBmaWxsPSIjRkZGRkZGIgogICAgICAgICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgICAgICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICAgICAgIHg9IjAuNSIKICAgICAgICAgeT0iMy41OSIKICAgICAgICAgd2lkdGg9IjI4IgogICAgICAgICBoZWlnaHQ9IjI1LjgxIgogICAgICAgICByeD0iMSIKICAgICAgICAgc3R5bGU9ImZpbGw6IzAwMDBmZjtzdHJva2U6IzAwMDA4MCIgLz4KICAgICAgPHRleHQKICAgICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToyMS4zMzMzcHg7bGluZS1oZWlnaHQ6MTAwJTtmb250LWZhbWlseTpzYW5zLXNlcmlmOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J3NhbnMtc2VyaWYgQm9sZCc7dGV4dC1hbGlnbjpjZW50ZXI7bGV0dGVyLXNwYWNpbmc6MHB4O3dvcmQtc3BhY2luZzowcHg7dGV4dC1hbmNob3I6bWlkZGxlO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MXB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgIHg9IjEzLjQ3MjgwOSIKICAgICAgICAgeT0iMjQuNjU3MDk5IgogICAgICAgICBpZD0idGV4dDE2MzMiPjx0c3BhbgogICAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgICAgaWQ9InRzcGFuMTYzMSIKICAgICAgICAgICB4PSIxMy40NzI4MDkiCiAgICAgICAgICAgeT0iMjQuNjU3MDk5Ij5mdDwvdHNwYW4+PC90ZXh0PgogICAgPC9nPgogIDwvZz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE4NTEiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6dGl0bGU+ZXYzLWJsb2NrLWljb248L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg=='

/**
 * Class for the ft blocks in Scratch 3.0
 * const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjQwcHgiCiAgIGhlaWdodD0iNDBweCIKICAgdmlld0JveD0iMCAwIDQwIDQwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmczMiIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibG9nby5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMS4yICgwYTAwY2Y1MzM5LCAyMDIyLTAyLTA0KSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXczNCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxNi41NSIKICAgICBpbmtzY2FwZTpjeD0iMTkuOTY5Nzg5IgogICAgIGlua3NjYXBlOmN5PSIyNC44MzM4MzciCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNDEiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJldjMiIC8+CiAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1MC4yICg1NTA0NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMiI+ZXYzLWJsb2NrLWljb248L3RpdGxlPgogIDxkZXNjCiAgICAgaWQ9ImRlc2M0Ij5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICA8ZGVmcwogICAgIGlkPSJkZWZzNiIgLz4KICA8ZwogICAgIGlkPSJldjMtYmxvY2staWNvbiIKICAgICBzdHJva2U9Im5vbmUiCiAgICAgc3Ryb2tlLXdpZHRoPSIxIgogICAgIGZpbGw9Im5vbmUiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxnCiAgICAgICBpZD0iZXYzIgogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS41MDAwMDAsIDMuNTAwMDAwKSIKICAgICAgIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgIDxyZWN0CiAgICAgICAgIGlkPSJSZWN0YW5nbGUtcGF0aCIKICAgICAgICAgc3Ryb2tlPSIjN0M4N0E1IgogICAgICAgICBmaWxsPSIjRkZGRkZGIgogICAgICAgICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgICAgICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICAgICAgIHg9IjAuNSIKICAgICAgICAgeT0iMy41OSIKICAgICAgICAgd2lkdGg9IjI4IgogICAgICAgICBoZWlnaHQ9IjI1LjgxIgogICAgICAgICByeD0iMSIKICAgICAgICAgc3R5bGU9ImZpbGw6IzAwMDBmZjtzdHJva2U6IzAwMDA4MCIgLz4KICAgICAgPHRleHQKICAgICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToyMS4zMzMzcHg7bGluZS1oZWlnaHQ6MTAwJTtmb250LWZhbWlseTpzYW5zLXNlcmlmOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J3NhbnMtc2VyaWYgQm9sZCc7dGV4dC1hbGlnbjpjZW50ZXI7bGV0dGVyLXNwYWNpbmc6MHB4O3dvcmQtc3BhY2luZzowcHg7dGV4dC1hbmNob3I6bWlkZGxlO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MXB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgIHg9IjEzLjQ3MjgwOSIKICAgICAgICAgeT0iMjQuNjU3MDk5IgogICAgICAgICBpZD0idGV4dDE2MzMiPjx0c3BhbgogICAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgICAgaWQ9InRzcGFuMTYzMSIKICAgICAgICAgICB4PSIxMy40NzI4MDkiCiAgICAgICAgICAgeT0iMjQuNjU3MDk5Ij5mdDwvdHNwYW4+PC90ZXh0PgogICAgPC9nPgogIDwvZz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE4NTEiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6dGl0bGU+ZXYzLWJsb2NrLWljb248L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg=='

 * @constructor
 */

const EXTENSION_ID = 'ft';
/*const message = {
	Digitalvoltage: {
		'en': 'digital voltage',
		'de': 'digitale Spannung'
	},
	Digitalresistance: {
		'en': 'digital resistance',
		'de': 'digitale Spannung',
	},
	Analoguevoltage: {
		'en':'analogue voltage',
		'de':'analoge Spannung'
	},
	Analogueresistance: {
		'en':'analogue resistance',
		'de':'analoger Widerstand' 
	}

};*/

function knopf() {
	  //Button der gedrückt wird ruft das auf
	if(img.getAttribute("src")== ftConnectedIcon){
		navigator.bluetooth.requestDevice({ filters: [{ name: 'BT Smart Controller' }] })
		.then(device => {
			device.addEventListener('gattserverdisconnected', onDisconnected);
			return device.gatt.disconnect();
	})
	function onDisconnected(event) {
		const device = event.target;
		console.log(`Device ${device.name} is disconnected.`);
		alert(`Device ${device.name} is disconnected.`);
		img.setAttribute("src", ftDisconnectedIcon);
	}
	}else{
		Notification.requestPermission().then(x=>{
        navigator.bluetooth.requestDevice({
            filters: [{ name: 'BT Smart Controller' }],
            optionalServices: ['8ae883b4-ad7d-11e6-80f5-76304dec7eb7', '8ae87702-ad7d-11e6-80f5-76304dec7eb7', '8ae8952a-ad7d-11e6-80f5-76304dec7eb7', '8ae88d6e-ad7d-11e6-80f5-76304dec7eb7', ]
        }).then(device => {
            console.log("Device found. Connecting ...");
            return device.gatt.connect();       
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
						i=10}}; // wichtig... müssen wir für jeden service so implementieren, dann alle Characteristics einzeln einmal übernemen, dann kann man die recht simpel überschreiben 
			for(i=0; i<4; i=i+1){
				console.log(i+services[i].uuid);
				if(services[i].uuid=='8ae8952a-ad7d-11e6-80f5-76304dec7eb7'){
					serviceIn=services[i]
						i=10}};
			for(i=0; i<4; i=i+1){
				console.log(i+services[i].uuid);
				if(services[i].uuid=='8ae88d6e-ad7d-11e6-80f5-76304dec7eb7'){
					serviceIMode=services[i]
						i=10}};
			console.log("f"+f);
			for(i=0; i<4; i=i+1){
				console.log(i+services[i].uuid);
				if(services[i].uuid=='8ae87702-ad7d-11e6-80f5-76304dec7eb7'){
					return services[i].getCharacteristic('8ae87e32-ad7d-11e6-80f5-76304dec7eb7');
				}};
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
			funcstate=0;
			funcstate2=0;
			anzupassen=false;
 			anzupassen2=false;
			for(var i=0; i<6; i=i+1){
				charZust[i]=0;
			}
			return 5;
			}).then(characteristic =>{
			img.setAttribute("src", ftConnectedIcon);
			//alert("The controller is now connected");
				const greeting = new Notification('The controller is connected',{
				body: 'You can start now',
				})
				if (Notification.permission != "granted"){
					alert("The controller is now connected");
				}
	   	}).catch(error => {
			console.log("Error: " + error);
			if(error == "NotFoundError: Web Bluetooth API globally disabled."){
			img.setAttribute("src", ftNoWebUSBIcon);
			alert("Error: " + error)
			}
		});
		//get all chars
	})}
}

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
function changeInMode (args, blocknum){ // Called By Hats to handle wrong input modes
	charI[parseInt(args.INPUT)].stopNotifications().then(x =>{// no unwanted signal
		if(valWrite[parseInt(args.INPUT)]==0x0b){ // change mode
			var val=0x0a; 
		}else{
			var val=0x0b; 
		}
		charWrite[parseInt(args.INPUT)].writeValue(new Uint8Array([val])).then(x =>{
			return charI[parseInt(args.INPUT)].readValue(); // Reading a Value with the new Input mode (to avoid an "old value" being stored)
		}).then(x =>{
			return charI[parseInt(args.INPUT)].startNotifications()
		}).then(x =>{ // Notifications are enabled again
			return charI[parseInt(args.INPUT)].readValue(); 
		}).then(x =>{
			valWrite[parseInt(args.INPUT)]=val;
			charZust[parseInt(args.INPUT)]=0;
			write(parseInt(args.INPUT))
			if(blocknum==0){ // HAT 1 oder 2
				anzupassen=false;
				funcstate=0;
				numruns=0;
			}else{
				anzupassen2=false;
				funcstate2=0;
				numruns2=0;	
			}
		});	
	})
}

function write (ind){ // actual write method
	if(charZust[ind]==0&&stor[ind].length>0){ // if nothing is being changed and storage is not empty
		charZust[ind]=1; // switch to currently changing
		if(ind==0||ind==1){
			if (valWrite[ind]==stor[ind][0]||valWrite[ind]==0){
				charWrite[ind].writeValue(new Uint8Array([stor[ind][0]])).then(x=>{ // write value 
					valWrite[ind]=stor[ind][0] // change memory 
					charZust[ind]=0; // switch to no curret task
					stor[ind].shift(); // delete from storage 
					if(stor[ind].length>0){ // if there are still elements in the storage do it again 
						write (ind)
					}
				})
			}else{
			charWrite[ind].writeValue(new Uint8Array(0)).then(x=>{ 
				charWrite[ind].writeValue(new Uint8Array([stor[ind][0]])).then(x=>{ // write value 
					valWrite[ind]=stor[ind][0] // change memory 
					charZust[ind]=0; // switch to no curret task
					stor[ind].shift(); // delete from storage 
					if(stor[ind].length>0){ // if there are still elements in the storage do it again 
						write (ind)
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
					write (ind)
				}
			})
		}
	}
}

function write_Value(ind, val){ // writing handler--> this is the method any block should call
	stor[ind].push(val) // add value to queue
	if (charZust[ind]==0){ // if nothig is being changed
		write(ind);
	}
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

const PARENT_CLASS="controls_controls-container_3ZRI_";
const FT_BUTTON_ID = "ft_connect_button";

const ftConnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjguODQyIDEuMDU2Ny01LjIzMDIgNS4yMzAyLTIuODQ4Ni0yLjg0ODZjLTEuMTk1NS0xLjE5NTUtMi45NjA3LTEuMTk1NS00LjE1NjEgMGwtMy43MzU4IDMuNzM1OC0xLjQ5NDMtMS40OTQzLTIuMTAxNCAyLjEwMTQgMTQuOTQzIDE0Ljk0MyAyLjEwMTQtMi4xMDE0LTEuNDk0My0xLjQ5NDMgMy43MzU4LTMuNzM1OGMxLjE5NTUtMS4xOTU1IDEuMTk1NS0yLjk2MDYgMC00LjE1NjFsLTIuODQ4Ni0yLjg0ODYgNS4yMzAyLTUuMjMwMnptLTIxLjIwMSA4LjM1ODktMi4xMDE0IDIuMTAxNCAxLjQ5NDMgMS40OTQzLTMuNTk1NyAzLjU5NTdjLTEuMTk1NSAxLjE5NTUtMS4xOTU1IDIuOTYwNyAwIDQuMTU2MWwyLjg0ODYgMi44NDg2LTUuMjMwMiA1LjIzMDIgMi4xMDE0IDIuMTAxNCA1LjIzMDItNS4yMzAyIDIuODQ4NiAyLjg0ODZjMS4xOTU1IDEuMTk1NSAyLjk2MDcgMS4xOTU1IDQuMTU2MSAwbDMuNTk1Ny0zLjU5NTcgMS40OTQzIDEuNDk0MyAyLjEwMTQtMi4xMDE0eiIgZmlsbD0iIzFhZmYxNCIgb3ZlcmZsb3c9InZpc2libGUiIHN0cm9rZT0iIzAyOTEwMCIgc3Ryb2tlLXdpZHRoPSIxLjQ5NDMiIHN0eWxlPSJ0ZXh0LWluZGVudDowO3RleHQtdHJhbnNmb3JtOm5vbmUiLz4KPC9zdmc+Cg==';

const ftNoWebUSBIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjQuOTg3IDEuMjMwMi05LjA4MTggOS4yMDU5LTkuMDIyOC05LjE5ODItNS41NTg0IDUuNDgwOCA5LjA5OSA5LjI3NDYtOS4xNTggOS4yODIyIDUuNTQ1IDUuNDk2IDkuMDc5OS05LjIwNTkgOS4wODk1IDkuMjY1IDUuNTU4NC01LjQ4MDgtOS4xNjM3LTkuMzQxNCA5LjE1NjEtOS4yODIyeiIgY29sb3I9IiMwMDAwMDAiIGNvbG9yLXJlbmRlcmluZz0iYXV0byIgZG9taW5hbnQtYmFzZWxpbmU9ImF1dG8iIGZpbGw9IiNmZjE0MTQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaW1hZ2UtcmVuZGVyaW5nPSJhdXRvIiBzaGFwZS1yZW5kZXJpbmc9ImF1dG8iIHNvbGlkLWNvbG9yPSIjMDAwMDAwIiBzdHJva2U9IiM3MDAwMDAiIHN0cm9rZS13aWR0aD0iMS40NjM4IiBzdHlsZT0iZm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDtmb250LXZhcmlhbnQtYWx0ZXJuYXRlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtcG9zaXRpb246bm9ybWFsO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1wYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1pbmRlbnQ6MDt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO3RleHQtdHJhbnNmb3JtOm5vbmU7d2hpdGUtc3BhY2U6bm9ybWFsIi8+Cjwvc3ZnPgo=';

const ftDisconnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjAuMjAyIDAuOTQ3NWMtMC43NDcwNyAwLTEuNTAzNCAwLjI5MDU2LTIuMTAxMiAwLjg5MDQ1bC0yLjI0MTIgMi4yNDk2LTEuNDk0Mi0xLjQ5OTctMi4xMDEyIDIuMTA4OSAzLjQ1NTIgMy40NjgxLTMuOTIyMSAzLjg4OTggMi4xMDEyIDIuMTA4OSAzLjg3NTQtMy45MzY3IDMuOTIyMSAzLjkzNjctMy45MjIxIDMuODg5OCAyLjEwMTIgMi4xMDg5IDMuODc1NC0zLjkzNjcgMy40NTUyIDMuNDY4MSAyLjEwMTItMi4xMDg5LTEuNDk0Mi0xLjQ5OTcgMi4yNDEyLTIuMjQ5NmMxLjE5NTQtMS4xOTk3IDEuMTk1NC0yLjk3MTIgMC00LjE3MTFsLTIuODQ4Mi0yLjg1ODggMy43MzU0LTMuNzQ5Mi0yLjEwMTItMi4xMDg5LTMuNzM1NCAzLjc0OTItMi44NDgyLTIuODU4OGMtMC41OTc2NS0wLjU5OTg4LTEuMzA3NC0wLjg5MDQ1LTIuMDU0NC0wLjg5MDQ1em0tMTUuNTQ5IDExLjM4OC0yLjEwMTIgMi4xMDg5IDEuNDk0MiAxLjQ5OTctMi4xMDEyIDIuMTA4OWMtMS4xOTUzIDEuMTk5Ny0xLjE5NTMgMi45NzEyIDAgNC4xNzExbDIuODQ4MiAyLjg1ODgtMy43MzU0IDMuNzQ5MiAyLjEwMTIgMi4xMDg5IDMuNzM1NC0zLjc0OTIgMi44NDgyIDIuODU4OGMxLjE5NTQgMS4xOTk3IDIuOTYwMiAxLjE5OTcgNC4xNTU2IDBsMi4xMDEyLTIuMTA4OSAxLjQ5NDIgMS40OTk3IDIuMTAxMi0yLjEwODl6IiBmaWxsPSIjZmZiNDE0IiBzdHJva2U9IiM5MTYzMDAiIHN0cm9rZS13aWR0aD0iMS40OTY5IiBzdHlsZT0idGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lIi8+Cjwvc3ZnPgo=';

var a=0;
var e=0;
var b = new Block();  // access block.js 
var translate= new Translation();
var c=127; 
var d;
var i=0;
var g=0;
var f=0;
var funcstate=0;
var funcstate2=0;
var anzupassen;
var anzupassen2;
var numruns=0;
var numruns2=0;

class Scratch3FtBlocks {
	
	setButton(state, msg=null) {
		button = document.getElementById(FT_BUTTON_ID).addEventListener("click", knopf);
	}
	
	addButton(initial = true) {
	//  check if the button already exists
	button = document.getElementById(FT_BUTTON_ID);
	
	if(button == undefined) {
	    x = document.getElementsByClassName(PARENT_CLASS);
	    if(x.length > 0) {
		var x;
		x[0]=1;
		hdrdiv = x[0];
		img = document.createElement("IMG");
		img.classList.add("green-flag_green-flag_1kiAo");
		img.setAttribute("draggable", false);
		img.setAttribute("id", FT_BUTTON_ID);
		img.setAttribute("src", ftDisconnectedIcon);
		img.setAttribute("height", "32px");
		img.setAttribute("width", "22px");
		img.style.cursor = "pointer";
		img.style.marginLeft = '15px';
		
		//img.setAttribute("", "50%");
		
		hdrdiv.appendChild(img);

		// the scratch3 gui will remove our button e.g. when the
		// language is being changed. We need to restore it then
		if(initial){
		    setInterval(() => this.addButton(false), 1000);
			this.setButton(this.button_state, this.error_msg);
		}
		else
		this.setButton(this.button_state, this.error_msg);
	    } else
		alert("ftDuino: controls-container class not found!");
	}
    }

    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    
		// this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
		this.addButton();
		
		
		//this.setButton(0, "");
    }
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
		translate.setup();// setup translation
        return {
            id: EXTENSION_ID,
            name: 'BT-Smart',
            blockIconURI: blockIconURI,
	    	showStatusButton: false,
	    	docsURI: 'https://technika-karlsruhe.github.io/',


	   	blocks: [
			b.getBlock_onOpenClose(),
			b.getBlock_onInput(),
			b.getBlock_getSensor(),
			b.getBlock_isClosed(),
			b.getBlock_dosetLamp(),
			b.getBlock_doSetOutput(),
			b.getBlock_doConfigureInput(),
			b.getBlock_doSetMotorSpeed(),
			b.getBlock_doSetMotorSpeedDir(),
			b.getBlock_doSetMotorDir(),
			b.getBlock_doStopMotor(),
        ],

        menus: {
			outputID: [
				{text: 'M1', value: '0'},
				{text: 'M2', value: '1'}
			],
            inputID: [
	 			{text: 'I1', value: '2'}, {text: 'I2', value: '3'},
		    	{text: 'I3', value: '4'}, {text: 'I4', value: '5'}
			],
			inputModes: [
				{text: translate._getText('Digitalvoltage',this.locale), value: 'd10v'}, {text:  translate._getText('Digitalresistance',this.locale), value: 'd5k'},
		    	{text: translate._getText('Analoguevoltage',this.locale), value: 'a10v'}, {text: translate._getText('Analogueresistance',this.locale), value: 'a5k'}
			],
			inputAnalogSensorTypes: [
				{text: 'Color Sensor', value: 'sens_color'}, {text: 'NTC Resistor', value: 'sens_ntc'},
		    	{text: 'Photo Resistor', value: 'sens_photo'}
			],
			inputDigitalSensorTypes: [
				{text: 'Button', value: 'sens_button'}, {text: 'Light barrier', value: 'sens_lightBarrier'},
		    	{text: 'Reed contact', value: 'sens_reed'}, {text: 'Trail Sensor', value:'sens_trail'}
			],
			inputDigitalSensorChangeTypes: [
				{text: 'open', value: 'open'}, {text: 'closed', value: 'closed'}
			], 
			motorDirection: [
				{text: 'forward', value: '1'}, {text: 'backwards', value: '-1'}
			],
			compares: ['<', '>']
	    }
        };
    }



	onOpenClose(args) {
		if(valWrite[parseInt(args.INPUT)]!=0x0b && (args.SENSOR=='sens_button'||args.SENSOR=='sens_lightBarrier'||args.SENSOR=='sens_reed')){ // check if the mode has to be changed 
			anzupassen=true;
		}
		if (valWrite[parseInt(args.INPUT)]!=0x0a && args.SENSOR=='sens_trail'){
			anzupassen=true;
		} 
		if (anzupassen==true){ // if something must be changed 
			if (funcstate==0){ // already changing?
				funcstate=1; 
				changeInMode (args, 0);
				return false;
			}else { 
				if(numruns<100){ // if we run into any uexpected problems with the changing process 
				numruns=numruns+1;
				}else{
					numruns=0; // restart the changing 
					funcstate=0;
					anzupassen=false;	
				}
			return false;
			}
		}else {// normal Hat function 
			if(args.OPENCLOSE=='closed'){
				if(valIn[parseInt(args.INPUT)]!=255){
					console.log("hallo");
					return true;
				}else return false;
			}else {
				if(valIn[parseInt(args.INPUT)]==255){
					return true;
				}else return false;
			}
		}
	}

	onInput(args) { // SENSOR, INPUT, OPERATOR, VALUE
		if(valWrite[parseInt(args.INPUT)]!=0x0b && (args.SENSOR=='sens_ntc'||args.SENSOR=='sens_photo')){ // check if the mode has to be changed 
			anzupassen2=true;
		}
		if (valWrite[parseInt(args.INPUT)]!=0x0a &&args.SENSOR=='sens_color'){
			anzupassen2=true;
		} 
		if (anzupassen2==true){ // if something must be changed 
			if (funcstate2==0){ // already changing?
				funcstate2=1; 
				changeInMode (args, 1)
				return false;
			}else { 
				console.log('i2224');
				if(numruns2<100){ // if we run into any uexpected problems with the changing process 
					numruns2=numruns2+1;
				}else{
					numruns2=0; // restart the changing 
					funcstate2=0;
					anzupassen2=false;	
				}
				return false;
			}
		}else{
	   		if(args.OPERATOR=='<'){
				if(valIn[parseInt(args.INPUT)]<args.VALUE){
					return true;
				}else return false;
			} else{
				if(valIn[parseInt(args.INPUT)]>args.VALUE){
					return true;
				}else return false;
			}
		}
	}

	getSensor(args) {
        // SENSOR, INPUT
		//-->set input to right mode and read afterwards
		switch(args.SENSOR) {
			case 'sens_color':
				write_Value(parseInt(args.INPUT) ,0x0a);
				break;
			case 'sens_ntc':
				write_Value(parseInt(args.INPUT),0x0b);
				break;
			case 'sens_photo':
				write_Value(parseInt(args.INPUT),0x0b);
				break;
		}
		
        return valIn[parseInt(args.INPUT)];
    }

	isClosed(args) { // --> benötigt noch eine changeIMode funktion 
        // SENSOR, INPUT
       return valIn[parseInt(args.INPUT)]!=255;
    }

	doSetLamp(args){
		write_Value(parseInt(args.OUTPUT), args.NUM*15.875);
    }

	doSetOutput(args) {
		write_Value(parseInt(args.OUTPUT), args.NUM*15.875);
    }

	doConfigureInput(args) { 
       	if(args.MODE=='d10v'||args.MODE=='a10v'){
			write_Value(parseInt(args.INPUT), 0x0a);
	   	}else{
			write_Value(parseInt(args.INPUT), 0x0b);
		}
	}

	doSetMotorSpeed(args) {
		write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875);
    }

    doSetMotorSpeedDir(args) {
		write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875*parseInt(args.DIRECTION));	
    }

	doSetMotorDir(args) { 
		var flex=0;
		if (stor[parseInt(args.MOTOR_ID)].length>0){
			flex=stor[parseInt(args.MOTOR_ID)][stor[parseInt(args.MOTOR_ID)].length-1];
		}else{
			flex=valWrite[parseInt(args.MOTOR_ID)];
		}
		if((args.DIRECTION=='1'&&flex<0)||(args.DIRECTION=='-1'&&flex>0)){
			write_Value(parseInt(args.MOTOR_ID), flex*-1);
		}
    }

    doStopMotor(args) {
		write_Value(parseInt(args.MOTOR_ID), 0)
    }
}

module.exports = Scratch3FtBlocks;
