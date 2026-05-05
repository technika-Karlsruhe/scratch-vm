const swal = require('sweetalert');
const JSZip = require('jszip');
const PARENT_CLASS = "controls_controls-container_FKkXX";
const FT_BUTTON_ID = "ft_connect_button";
ftConnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjguODQyIDEuMDU2Ny01LjIzMDIgNS4yMzAyLTIuODQ4Ni0yLjg0ODZjLTEuMTk1NS0xLjE5NTUtMi45NjA3LTEuMTk1NS00LjE1NjEgMGwtMy43MzU4IDMuNzM1OC0xLjQ5NDMtMS40OTQzLTIuMTAxNCAyLjEwMTQgMTQuOTQzIDE0Ljk0MyAyLjEwMTQtMi4xMDE0LTEuNDk0My0xLjQ5NDMgMy43MzU4LTMuNzM1OGMxLjE5NTUtMS4xOTU1IDEuMTk1NS0yLjk2MDYgMC00LjE1NjFsLTIuODQ4Ni0yLjg0ODYgNS4yMzAyLTUuMjMwMnptLTIxLjIwMSA4LjM1ODktMi4xMDE0IDIuMTAxNCAxLjQ5NDMgMS40OTQzLTMuNTk1NyAzLjU5NTdjLTEuMTk1NSAxLjE5NTUtMS4xOTU1IDIuOTYwNyAwIDQuMTU2MWwyLjg0ODYgMi44NDg2LTUuMjMwMiA1LjIzMDIgMi4xMDE0IDIuMTAxNCA1LjIzMDItNS4yMzAyIDIuODQ4NiAyLjg0ODZjMS4xOTU1IDEuMTk1NSAyLjk2MDcgMS4xOTU1IDQuMTU2MSAwbDMuNTk1Ny0zLjU5NTcgMS40OTQzIDEuNDk0MyAyLjEwMTQtMi4xMDE0eiIgZmlsbD0iIzFhZmYxNCIgb3ZlcmZsb3c9InZpc2libGUiIHN0cm9rZT0iIzAyOTEwMCIgc3Ryb2tlLXdpZHRoPSIxLjQ5NDMiIHN0eWxlPSJ0ZXh0LWluZGVudDowO3RleHQtdHJhbnNmb3JtOm5vbmUiLz4KPC9zdmc+Cg==';
ftNoWebUSBIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjQuOTg3IDEuMjMwMi05LjA4MTggOS4yMDU5LTkuMDIyOC05LjE5ODItNS41NTg0IDUuNDgwOCA5LjA5OSA5LjI3NDYtOS4xNTggOS4yODIyIDUuNTQ1IDUuNDk2IDkuMDc5OS05LjIwNTkgOS4wODk1IDkuMjY1IDUuNTU4NC01LjQ4MDgtOS4xNjM3LTkuMzQxNCA5LjE1NjEtOS4yODIyeiIgY29sb3I9IiMwMDAwMDAiIGNvbG9yLXJlbmRlcmluZz0iYXV0byIgZG9taW5hbnQtYmFzZWxpbmU9ImF1dG8iIGZpbGw9IiNmZjE0MTQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaW1hZ2UtcmVuZGVyaW5nPSJhdXRvIiBzaGFwZS1yZW5kZXJpbmc9ImF1dG8iIHNvbGlkLWNvbG9yPSIjMDAwMDAwIiBzdHJva2U9IiM3MDAwMDAiIHN0cm9rZS13aWR0aD0iMS40NjM4IiBzdHlsZT0iZm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDtmb250LXZhcmlhbnQtYWx0ZXJuYXRlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtcG9zaXRpb246bm9ybWFsO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1wYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1pbmRlbnQ6MDt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO3RleHQtdHJhbnNmb3JtOm5vbmU7d2hpdGUtc3BhY2U6bm9ybWFsIi8+Cjwvc3ZnPgo=';
ftDisconnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjAuMjAyIDAuOTQ3NWMtMC43NDcwNyAwLTEuNTAzNCAwLjI5MDU2LTIuMTAxMiAwLjg5MDQ1bC0yLjI0MTIgMi4yNDk2LTEuNDk0Mi0xLjQ5OTctMi4xMDEyIDIuMTA4OSAzLjQ1NTIgMy40NjgxLTMuOTIyMSAzLjg4OTggMi4xMDEyIDIuMTA4OSAzLjg3NTQtMy45MzY3IDMuOTIyMSAzLjkzNjctMy45MjIxIDMuODg5OCAyLjEwMTIgMi4xMDg5IDMuODc1NC0zLjkzNjcgMy40NTUyIDMuNDY4MSAyLjEwMTItMi4xMDg5LTEuNDk0Mi0xLjQ5OTcgMi4yNDEyLTIuMjQ5NmMxLjE5NTQtMS4xOTk3IDEuMTk1NC0yLjk3MTIgMC00LjE3MTFsLTIuODQ4Mi0yLjg1ODggMy43MzU0LTMuNzQ5Mi0yLjEwMTItMi4xMDg5LTMuNzM1NCAzLjc0OTItMi44NDgyLTIuODU4OGMtMC41OTc2NS0wLjU5OTg4LTEuMzA3NC0wLjg5MDQ1LTIuMDU0NC0wLjg5MDQ1em0tMTUuNTQ5IDExLjM4OC0yLjEwMTIgMi4xMDg5IDEuNDk0MiAxLjQ5OTctMi4xMDEyIDIuMTA4OWMtMS4xOTUzIDEuMTk5Ny0xLjE5NTMgMi45NzEyIDAgNC4xNzExbDIuODQ4MiAyLjg1ODgtMy43MzU0IDMuNzQ5MiAyLjEwMTIgMi4xMDg5IDMuNzM1NC0zLjc0OTIgMi44NDgyIDIuODU4OGMxLjE5NTQgMS4xOTk3IDIuOTYwMiAxLjE5OTcgNC4xNTU2IDBsMi4xMDEyLTIuMTA4OSAxLjQ5NDIgMS40OTk3IDIuMTAxMi0yLjEwODl6IiBmaWxsPSIjZmZiNDE0IiBzdHJva2U9IiM5MTYzMDAiIHN0cm9rZS13aWR0aD0iMS40OTY5IiBzdHlsZT0idGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lIi8+Cjwvc3ZnPgo=';
ftConnectingIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iNDgiPjxwYXRoIGQ9Im0zMTctMTYwLTQyLTQyIDEyMS0xMjFIODB2LTYwaDMxNkwyNzUtNTA0bDQyLTQyIDE5MyAxOTMtMTkzIDE5M1ptMzI2LTI1NEw0NTAtNjA3bDE5My0xOTMgNDIgNDItMTIxIDEyMWgzMTZ2NjBINTY0bDEyMSAxMjEtNDIgNDJaIi8+PC9zdmc+';
ftDownloadIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjMDAwMDAwIj48cGF0aCBkPSJNNDgwLTMyMCAyODAtNTIwbDU2LTU4IDEwNCAxMDR2LTMyNmg4MHYzMjZsMTA0LTEwNCA1NiA1OC0yMDAgMjAwWk0yNDAtMTYwcS0zMyAwLTU2LjUtMjMuNVQxNjAtMjQwdi0xMjBoODB2MTIwaDQ4MHYtMTIwaDgwdjEyMHEwIDMzLTIzLjUgNTYuNVQ3MjAtMTYwSDI0MFoiLz48L3N2Zz4=';
const BLEDevice = require('../ft_source/bluetoothcontrol.js');
const USBDevice = require('../ft_source/usbcontrol.js');
const Translation = require('../ft_source/translation');
const WebUSBDevice = require('../ft_source/webusbcontrol.js')
const HttpDevice = require('../ft_source/httpcontrol.js')
translate = new Translation();
controller=undefined; //gloablly defined variable
extensionnumber = 0; // number of extensions
openedextensions= [] // name of all extensions which are open 
type=undefined // defined globally because extensions have to access it 
var port
var count=0
buttonpressed = false
var controllerknown=false
var connection='BLE';
var notis  //Permission and API supported--> 0 cant be used(not granted or supported); 1 API supported; 2 supported and Permission granted--> can be used
img = undefined; //img
//img

//the order of indexes: motoroutputs--> single outputs(event if controller is unable to write them)(always 2xnumber of motors)=>summarized as indOut
//--> inputs (as indIn)--> servos (indServo) --> counter indCounter 
//they all need to be defined even if 0
function isTablet() {
	const userAgent = navigator.userAgent.toLowerCase();
	return /tablet|ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isMobilePhone() {
	const userAgent = navigator.userAgent.toLowerCase();
	return /iphone|ipod|android/.test(userAgent) && !/tablet|ipad/.test(userAgent);
}

function connectingknownusbdevice() {
	const isTabletDevice = isTablet();
	const isMobileDevice = isMobilePhone();
	if (isTabletDevice || isMobileDevice) {
	  	console.log("tablet or phone");
	  	return;
	}
	console.log("pc");
	if(controller==undefined){
		navigator.serial.getPorts({}).then((ports) => {
			if(ports.length>0){
				if(type=='LT'||type=='ftduino'){
					connection= 'WebUSB'
					controller= new WebUSBDevice()
				}else{
					controller= new USBDevice()
					connection='USB'
				}
				count=20
				if(controller!=undefined){
					let img = document.getElementById(FT_BUTTON_ID);
					controller.controllertype=type;
					controller.autoconnect().then(device=> { //Connect function is async--> then
						port=device
						img.setAttribute("src", ftConnectedIcon); //Button changes 
						if (connection === 'USB') {
							navigator.serial.addEventListener('disconnect', onDisconnected);
						} else if (connection === 'WebUSB') {
							navigator.usb.addEventListener('disconnect', onDisconnected);
						}
						//navigator.serial.addEventListener('disconnect', onDisconnected);
						if(notis==2){
							const greeting = new Notification(translate._getText('connected',this.locale),{
								body: translate._getText('start',this.locale),
							})
						}else{
							swal(translate._getText('connected',this.locale))
						}
					}).catch(error => {
						controller=undefined;
						console.log("Error: " + error);
						if(error == "NotFoundError: Web Bluetooth API globally disabled."){
							img.setAttribute("src", ftNoWebUSBIcon);
							swal("Error: " + error)
						}
						if(type=='LT'||type=='ftduino'){
							if(openedextensions.includes("BTSmart")){
								type = "BTSmart"
								openedextensions.splice(openedextensions.indexOf("BTSmart"), 1)
								openedextensions.splice(0, 0, "BTSmart")
								connectingknownusbdevice()
								var main = new Main()
								main.addselections()
							}
						}else{
							if(openedextensions.includes("LT")){
								type = "LT"
								openedextensions.splice(openedextensions.indexOf("LT"), 1)
								openedextensions.splice(0, 0, "LT")
								connectingknownusbdevice()
								var main = new Main()
								main.addselections()
							}else if(openedextensions.includes("ftduino")){
								type = "ftduino"
								openedextensions.splice(openedextensions.indexOf("ftduino"), 1)
								openedextensions.splice(0, 0, "ftduino")
								connectingknownusbdevice()
								var main = new Main()
								main.addselections()
							}
						}
					});
				}
			}
			if(count<10){
				count=count+1
				connectingknownusbdevice()
			}else{
				count=0;
			}
		}).catch(error => {
			controller=undefined;
			console.log("Error: " + error);
			if(error == "NotFoundError: Web Bluetooth API globally disabled."){
				img.setAttribute("src", ftNoWebUSBIcon);
				swal("Error: " + error)
			}
		});
	}
}

async function stud() {//function of connect button
	let img = document.getElementById(FT_BUTTON_ID); // Ensure img is defined
	if(buttonpressed == false){
		if(img.getAttribute("src")== ftConnectedIcon){
			if(connection=='BLE'){
				controller.disconnect();
				img.setAttribute("src", ftDisconnectedIcon);
			}else if(connection=='Http'){
				onDisconnected("none")
			}
		}else{
			img.setAttribute("src", ftConnectingIcon);
			buttonpressed = true 
			controller=undefined;
			if(type=='BTSmart'){
				value= await swal(translate._getText('connect',this.locale), { //lets the user choose between Ble and usb
					buttons: {
						cancel: translate._getText('cancel',this.locale),
						usb: {
							text: "USB",
							value: "usb",
						},
						bt: {
							text: "BT",
							value: "bt",
						},
					},
				})
				if(value==null){
					img.setAttribute("src", ftDisconnectedIcon);
					controller=undefined;
					buttonpressed = false
				}
			}else if(type=='BTReceiver'||type=='Robby'){
				value= 'bt'
			}else if(type=='LT'||type=='ftduino'){
				value= 'webusb'
			}else if(type=='TX'){
				value= 'usb'
			}else if(type =='TXT40'){
				value = "http"
			}else if(type =='RX'){
				value = await swal(translate._getText('connect',this.locale), {
					buttons: {
						cancel: translate._getText('cancel',this.locale),
						usb: {
							text: "USB",
							value: "usb",
						},
						bt: {
							text: "BT",
							value: "bt",
						},
					},
				})
				if(value==null){
					img.setAttribute("src", ftDisconnectedIcon);
					controller=undefined;
					buttonpressed = false
				}
			}else if(type == 'TXT'){
				value = "notsupported"
			}
			switch (value) {
		   	//controller is initialized
				case "usb":
					connection='USB'
					controller= new USBDevice()
					break;

				case "bt":
					controller= new BLEDevice()
					break;

				case "webusb":
					connection='WebUSB'
					controller= new WebUSBDevice()
					break;

				case "http":
					connection='Http'
					controller = new HttpDevice()
					break;
				case "notsupported":
					swal(translate._getText('notsupported',this.locale))
					img.setAttribute("src", ftDisconnectedIcon);
					break;
			}
			if(controller!=undefined){
				controller.controllertype=type; //setting controllertype
				controller.connect().then(device=> { //Connect function is async--> then
					port=device
					img.setAttribute("src", ftConnectedIcon); //Button chnages 

					if (connection === 'USB') {
						navigator.serial.addEventListener('disconnect', onDisconnected);
					} else if (connection === 'WebUSB') {
						navigator.usb.addEventListener('disconnect', onDisconnected);
					} else if (connection=='Http') {

					} else {
						device.addEventListener('gattserverdisconnected', onDisconnected);
					}
					if(notis==2){
						const greeting = new Notification(translate._getText('connected',this.locale),{
							body: translate._getText('start',this.locale),
						})
					}else{
						swal(translate._getText('connected',this.locale))
					}
					
				}).catch(error => {
					if(controller.controllertype!= undefined){
						type= controller.controllertype
					}
					img.setAttribute("src", ftDisconnectedIcon);
					controller=undefined;
					buttonpressed = false 
					console.log("Error: " + error);
					if(error == "NotFoundError: Web Bluetooth API globally disabled."){
						img.setAttribute("src", ftNoWebUSBIcon);
						swal("Error: " + error)
					}else if(error == "SecurityError: Failed to execute 'open' on 'USBDevice': Access denied."){
						if(notis==2){
							const disconnect = new Notification(translate._getText('driver',this.locale),{
								body: translate._getText('install',this.locale),
							})
						}else{
							swal(translate._getText('driver',this.locale))
						}
					}else if (error == "TypeError: navigator.bluetooth is undefined"){
						img.setAttribute("src", ftNoWebUSBIcon);
						if(notis==2){
							const disconnect = new Notification(translate._getText('browsernotwebbt',this.locale),{})
						}else{
							swal(translate._getText('browsernotwebbt',this.locale))
						}
					}else if (error == "TypeError: navigator.usb is undefined"){
						img.setAttribute("src", ftNoWebUSBIcon);
						if(notis==2){
							const disconnect = new Notification(translate._getText('browsernotwebusb',this.locale),{})
						}else{
							swal(translate._getText('browsernotwebusb',this.locale))
						}
					}else if (error == "TypeError: navigator.serial is undefined"){
						img.setAttribute("src", ftNoWebUSBIcon);
						if(notis==2){
							const disconnect = new Notification(translate._getText('browsernotwebserial',this.locale),{})
						}else{
							swal(translate._getText('browsernotwebserial',this.locale))
						}
					}else if(error == "TypeError: Cannot read properties of undefined (reading 'requestPort')"){
						img.setAttribute("src", ftNoWebUSBIcon);
						if(notis==2){
							const disconnect = new Notification(translate._getText('mobilewebserial',this.locale),{})
						}else{
							swal(translate._getText('mobilewebserial',this.locale))
						}
					}else if(error == "TypeError: Failed to fetch"){
						if(notis==2){
							const disconnect = new Notification(translate._getText('tryagain',this.locale),{})
						}else{
							swal(translate._getText('tryagain',this.locale))
						}
					}else if(error == "NetworkError: GATT Server is disconnected. Cannot retrieve services. (Re)connect first with `device.gatt.connect`."){
						if(notis==2){
							const disconnect = new Notification(translate._getText('tryagain',this.locale),{})
						}else{
							swal(translate._getText('tryagain',this.locale))
						}
					}else if(error =="NotFoundError: Bluetooth adapter not available."){
						if(notis==2){
							const disconnect = new Notification(translate._getText('noble',this.locale),{})
						}else{
							swal(translate._getText('noble',this.locale))
						}
					}else if(error =="TypeError: Cannot read properties of undefined (reading 'requestDevice')"){
						if(notis==2){
							const disconnect = new Notification(translate._getText('linuxwebbt',this.locale),{})
						}else{
							swal(translate._getText('linuxwebbt',this.locale))
						}
					}else if(error =="NetworkError: Failed to execute 'open' on 'SerialPort': Failed to open serial port."){
						if(notis==2){
							const disconnect = new Notification(translate._getText('linuxserial',this.locale),{})
						}else{
							swal(translate._getText('linuxserial',this.locale))
						}
					}
				});
			}else{
				buttonpressed = false 
			}
		}
	}
}

function onDisconnected(event) {// reset everything
	let img = document.getElementById(FT_BUTTON_ID);
	connection='BLE'
	//const ev = event.target;
	console.log(`Device is disconnected.`);
	img.setAttribute("src", ftDisconnectedIcon);
	console.log(type)
	type = controller.controllertype
	controller=undefined;
	if(notis==2){
		const disconnect = new Notification(translate._getText('disconnected',this.locale),{
			body: translate._getText('reconnect',this.locale),
		})
	}else{
		swal(translate._getText('disconnected',this.locale));
	}
}

function checkConnectionAndDisableMenu() {
	let img = document.getElementById(FT_BUTTON_ID);
	const select = document.getElementById("ft_select");
	if(select){
		const isconnected = img.getAttribute("src") === ftConnectedIcon;
		const isdisconnected = img.getAttribute("src") === ftDisconnectedIcon;
		select.disabled = isconnected;

		if(isdisconnected) {
			select.disabled = false;
		}
	}
}

class Main {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */

		if(!("Notification" in window)){ //check if notifications are supported
			notis=0
		}else{
			notis=1
		}
		if(notis==1){ //check if permission is granted
			//Notification.requestPermission().then(x=>{
			//	if(Notification.permission == "granted"){
			//		notis=2
			//	}
			//})	// delete for now
		}
		this.versionNumber = "0.1.13";
    }

	ismobile(){
		const isTabletDevice = isTablet();
		const isMobileDevice = isMobilePhone();
		if (isTabletDevice || isMobileDevice) {
			console.log("tablet or phone");
			return true
		}else 
		return false
	}

	disconnect(){
		onDisconnected("none")
	}

	_formatMenuin(inInt, outInt) {
		const m = [];
		for (let i = 0; i <= inInt -1; i++) {
		  const obj = {};
		  obj.text = 'I'+(i+1).toString();
		  obj.value = (i+outInt).toString();
		  m.push(obj);
		}
		return m;
	}

	_formatMenuservo (servoInt, outInt, inInt) {
        const m = [];
        for (let i = 0; i <= servoInt -1; i++) {
            const obj = {};
            obj.text = 'S'+(i+1).toString();
            obj.value = (i+outInt+inInt).toString();
            m.push(obj);
        }
        return m;
    }

	_formatMenuCounter (counterInt, servoInt, outInt, inInt) {
		const m = [];
        for (let i = 0; i <= counterInt -1; i++) {
            const obj = {};
            obj.text = 'C'+(i+1).toString();
            obj.value = (i+servoInt+ outInt+ inInt).toString();
            m.push(obj);
        }
        return m;
	}
	
	_formatMenuM (outInt) {
        const m = [];
        for (let i = 0; i <= outInt/3 -1; i++) {
            const obj = {};
            obj.text = 'M'+(i+1).toString();
            obj.value = i.toString();
            m.push(obj);
        }
        return m;
    }

	_formatMenuOut (outInt) {
        const m = [];
        for (let i = 0; i <= outInt/3*2 -1; i++) {
            const obj = {};
            obj.text = 'O'+(i+1).toString();
            obj.value = (i+outInt/3).toString();
            m.push(obj);
        }
        return m;
    }

    knownUsbDeviceConnected(event){// an already paired USB-Device is connected-> automatically connect to it 
		connectingknownusbdevice()
    }

    setButton(state, msg=null) { //Function which changes the button
		let button = document.getElementById(FT_BUTTON_ID);
		if (button) {
			button.addEventListener("click", stud);
	
			let img = button;
			if (controller == undefined) {
				img.setAttribute("src", ftDisconnectedIcon);
			} else {
				img.setAttribute("src", ftConnectedIcon);
			}
		} else {
			console.error("Button element not found.");
		}
	}
	
	addButton(initial = true) {//Function which creates the button
		//  check if the button already exists
		let button = document.getElementById(FT_BUTTON_ID);
		
		if(!button) {
			let x = document.getElementsByClassName(PARENT_CLASS);
			if(x.length > 0) {
				//var x;
				//x[0]=1;
				let hdrdiv = x[0];
				let img = document.createElement("IMG");
				img.classList.add("green-flag_green-flag_1kiAo");
				img.setAttribute("draggable", false);
				img.setAttribute("id", FT_BUTTON_ID);
				img.setAttribute("src", ftDisconnectedIcon);
				img.setAttribute("height", "32px");
				img.setAttribute("width", "32px");
				img.setAttribute("title", translate._getText('connectbutton',this.locale));
				img.style.borderRadius = "0.25rem"; //rounding of the background when hovering over it
				img.style.padding = "0.30rem";
				img.addEventListener("mouseover", mouseOver, false);
				img.addEventListener("mouseout", mouseOut, false);
				function mouseOver()
				{
					img.style.backgroundColor = 'hsla(215, 100%, 65%, 0.15)'; //background color when hovering over it
				}
				function mouseOut()
				{
					img.style.backgroundColor = 'transparent'; //background color when not hovering over it
				}
				img.style.cursor = "pointer"; //kind of mouse when hovering over it
				img.style.marginLeft = '1px'; //distance between the stop button and the connect button
				hdrdiv.appendChild(img);

				// the scratch3 gui will remove our button e.g. when the
				// language is being changed. We need to restore it then
				if(initial){
					translate.setup();
					setInterval(() => this.addButton(false), 1000);
					this.setButton(this.button_state, this.error_msg);
				}else{
					translate.setup();
					this.setButton(this.button_state, this.error_msg);
					if(extensionnumber > 1) {
						this.addselections();
					}
				}
				this.addDownloadButton();
				this.addVersionNumber();
			}else{
				swal("ft: controls-container class not found!");
			}
		}
    }

	addselections() {
		this.removeDownloadButton();
		if ( document.getElementById("ft_select")!=undefined){
			const element=  document.getElementById("ft_select")
			element.remove()
		}
		const parentClass = PARENT_CLASS;
		const options = openedextensions;
		
		const parentElement = document.querySelector(`.${parentClass}`);
		if (!parentElement) {
			console.error(`Element with class '${parentClass}' not found`);
			return;
		}
		
		const select = document.createElement("select");
		select.setAttribute("id", 'ft_select');
		select.classList.add("green-flag_green-flag_1kiAo");
		for (const optionText of options) {
			const option = document.createElement("option");
			option.textContent = optionText;
			select.appendChild(option);
		}

		select.addEventListener("change", function() { //Eventlistener for the selection
			console.log(select.value);
			type=select.value; //setting controllertype
		});
		
		parentElement.appendChild(select);

		// Check and disable the menu initially
		checkConnectionAndDisableMenu();

		// Check and disable the menu every 400 milliseconds
		setInterval(checkConnectionAndDisableMenu, 400);
	}

	addDownloadButton() {
		const validDownloadTypes = ["ftduino", "TXT", "TX", "RX", "TXT40"];
	
		if (document.getElementById("ft_download_button")) return;
		if (!validDownloadTypes.includes(type)) return;
		if (extensionnumber > 1) return;
	
		const parentElement = document.querySelector(`.${PARENT_CLASS}`);
		if (!parentElement) {
			console.error(`Element with class '${PARENT_CLASS}' not found`);
			return;
		}
	
		this.uploadedSb3File = this.uploadedSb3File || null;
	
		const downloadButton = document.createElement("IMG");
		downloadButton.setAttribute("id", "ft_download_button");
		downloadButton.setAttribute("draggable", false);
		downloadButton.setAttribute("src", ftDownloadIcon);
		downloadButton.setAttribute("height", "32px");
		downloadButton.setAttribute("width", "32px");
		downloadButton.setAttribute("title", translate._getText('downloadbutton', this.locale));
		downloadButton.style.cursor = "pointer";
		downloadButton.style.borderRadius = "0.25rem";
		downloadButton.style.padding = "0.30rem";
		downloadButton.addEventListener("mouseover", () => {
			downloadButton.style.backgroundColor = 'hsla(215, 100%, 65%, 0.15)';
		});
		downloadButton.addEventListener("mouseout", () => {
			downloadButton.style.backgroundColor = 'transparent';
		});
	
		downloadButton.addEventListener("click", () => {
			if (type === "ftduino") {
				swal({
					text: translate._getText('ftduinoflash', this.locale),
					buttons: {
						cancel: translate._getText('cancel',this.locale),
						upload: {
							text: translate._getText('ftduinoupload', this.locale),
							value: 'upload'
						},
						flash: {
							text: 'Flash',
							value: 'flash'
						}
					},
				}).then((value) => {
					switch (value) {
						case 'upload':
							this.triggerFileUpload();
							break;
						case 'flash':
							this.handleFtduinoFlash();
							break;
						default:
							// Handle cancellation
							break;
					}
				});
			} else {
				//if (!this.uploadedSb3File) {
					this.triggerFileUpload();
				//} else {
				//	this.handleDownload(this.uploadedSb3File);
				//}
			}
		});
	
		parentElement.appendChild(downloadButton);
	}

	triggerFileUpload() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".sb3";
	
		input.addEventListener("change", (event) => {
			const file = event.target.files[0];
			if (file) {
				this.uploadedSb3File = file;
				const reader = new FileReader();
				reader.onload = (e) => {
					const fileContent = e.target.result;
					console.log("SB3 file loaded:", file.name);
					this.handleDownload(fileContent);
				};
				reader.readAsArrayBuffer(file);
			}
		});
	
		input.click();
	}
	
	handleFtduinoFlash() {
		console.log("FLASH mode for ftduino started");
		swal(translate._getText('downloadftduino', this.locale));
		// Flash Code
	}
	
	async handleDownload(fileData) {
		switch (type) {
			case "ftduino":
				console.log("ftduino download with SB3:", fileData);
				swal(translate._getText('downloadftduino', this.locale));
				break;
			case "TXT":
				console.log("TXT download with SB3:", fileData);
				try {
					const zip = await JSZip.loadAsync(fileData);
					// project.json extract
					const projectJson = await zip.file("project.json").async("string");
					const projectData = JSON.parse(projectJson);
					// blocks modify
					this.replaceBlocks(projectData);
					// Pack changed JSON back into ZIP
					zip.file("project.json", JSON.stringify(projectData, null, 2));
					// Recreate ZIP (sb3)
					const newSb3Blob = await zip.generateAsync({ type: "blob" });
					// download automatically
					this.downloadFile(newSb3Blob, "converted_project.sb3");
					swal(translate._getText('downloadtxt', this.locale));
				} catch (err) {
					console.error("Error processing SB3 file:", err);
				}
				break;
			case "TX":
				console.log("TX download with SB3:", fileData);
				swal(translate._getText('downloadtx', this.locale));
				break;
			case "RX":
				console.log("RX download with SB3:", fileData);
				swal(translate._getText('downloadrx', this.locale));
				break;
			case "TXT40":
				console.log("TXT40 download with SB3:", fileData);
				swal(translate._getText('downloadtxt40', this.locale));
				break;
			default:
				console.log("Unknown type, no download defined.");
		}
	}
	
	replaceBlocks(projectData) {
		console.log("Blocks are being replaced...");
	  
		const blockReplacements = [
			{
				fromOpcode: "txt_onOpenClose",
				toOpcode: "ftxt_onOpenClose",
				fieldChanges: {
					SENSOR: (val) => ({
						sens_button: "0",
						sens_lightBarrier: "1",
						sens_reed: "2",
						sens_trail: "3"
					}[val] ?? val),
					INPUT: (val) => (Number(val) - 12).toString(),
					OPENCLOSE: (val) => val === "open" ? "0" : "1"
				}
			},
			{
				fromOpcode: "txt_onCounter",
				toOpcode: "ftxt_onCounter",
				fieldChanges: {
					COUNTER_ID: (val) => (Number(val) - 20).toString(),
					OPERATOR: (val) => val
				},
				inputChanges: {
					VALUE: (val) => val
				}
			},
			{
				fromOpcode: "txt_onInput2",
				toOpcode: "ftxt_onInput",
				fieldChanges: {
					SENSOR: (val) => ({
						sens_color: "0",
						sens_ntc: "2",
						sens_photo: "3",
						sens_distance: "1"
					}[val] ?? val),
					INPUT: (val) => (Number(val) - 12).toString(),
					OPERATOR: (val) => val
				},
				inputChanges: {
					VALUE: (val) => val
				}
			},
			{
				fromOpcode: "txt_getCounter",
				toOpcode: "ftxt_getCounter",
				fieldChanges: {
					COUNTER_ID: (val) => (Number(val) - 20).toString()
				}
			},
			{
				fromOpcode: "txt_getSensor2",
				toOpcode: "ftxt_getSensor",
				fieldChanges: {
					SENSOR: (val) => ({
						sens_color: "0",
						sens_ntc: "2",
						sens_photo: "3",
						sens_distance: "1"
					}[val] ?? val),
					INPUT: (val) => (Number(val) - 12).toString()
				}
			},
			{
				fromOpcode: "txt_isClosed",
				toOpcode: "ftxt_isClosed",
				fieldChanges: {
					SENSOR: (val) => ({
						sens_button: "0",
						sens_lightBarrier: "1",
						sens_reed: "2",
						sens_trail: "3"
					}[val] ?? val),
					INPUT: (val) => (Number(val) - 12).toString()
				}
			},
			{
				fromOpcode: "txt_doPlaySound",
				toOpcode: "ftxt_doPlaySound",
				inputChanges: {
					NUM: (val) => val
				}
			},
			{
				fromOpcode: "txt_doPlaySoundWait",
				toOpcode: "ftxt_doPlaySoundWait",
				inputChanges: {
					NUM: (val) => val
				}
			},
			{
				fromOpcode: "txt_doSetLamp2",
				toOpcode: "ftxt_doSetLamp",
				fieldChanges: {
					OUTPUT: (val) => (Number(val) - 4).toString()
				},
				inputChanges: {
					NUM: (val) => val
				}
			},
			{
				fromOpcode: "txt_doSetOutput2",
				toOpcode: "ftxt_doSetOutput",
				fieldChanges: {
					OUTPUT: (val) => (Number(val) - 4).toString()
				},
				inputChanges: {
					NUM: (val) => val
				}
			},
			{
				fromOpcode: "txt_doResetCounter",
				toOpcode: "ftxt_doResetCounter",
				fieldChanges: {
					COUNTER_ID: (val) => (Number(val) - 20).toString()
				}
			},
			{
				fromOpcode: "txt_doConfigureInput2",
				toOpcode: "ftxt_doConfigureInput",
				fieldChanges: {
					INPUT: (val) => (Number(val) - 12).toString(),
					MODE: (val) => ({
						d10v: "0",
						d5k: "1",
						a10v: "2",
						a5k: "3",
						ultrasonic: "4"
					}[val] ?? val)
				}
			},
			{
				fromOpcode: "txt_doSetMotorSpeed",
				toOpcode: "ftxt_doSetMotorSpeed",
				fieldChanges: {
					MOTOR_ID: (val) => val
				},
				inputChanges: {
					SPEED: (val) => val
				}
			},
			{
				fromOpcode: "txt_doSetMotorSpeedDir",
				toOpcode: "ftxt_doSetMotorSpeedDir",
				fieldChanges: {
					MOTOR_ID: (val) => val,
					DIRECTION: (val) => val
				},
				inputChanges: {
					SPEED: (val) => val
				}
			},
			{
				fromOpcode: "txt_doSetMotorDir",
				toOpcode: "ftxt_doSetMotorDir",
				fieldChanges: {
					MOTOR_ID: (val) => val,
					DIRECTION: (val) => val
				}
			},
			{
				fromOpcode: "txt_doStopMotor",
				toOpcode: "ftxt_doStopMotor",
				fieldChanges: {
					MOTOR_ID: (val) => val
				}
			},
			{
				fromOpcode: "txt_doSetMotorSpeedDirDist",
				toOpcode: "ftxt_doSetMotorSpeedDirDist",
				fieldChanges: {
					MOTOR_ID: (val) => val,
					DIRECTION: (val) => val
				},
				inputChanges: {
					SPEED: (val) => val,
					STEPS: (val) => val
				}
			},
			{
				fromOpcode: "txt_doSetMotorSpeedDirSync",
				toOpcode: "ftxt_doSetMotorSpeedDirSync",
				fieldChanges: {
					MOTOR_ID: (val) => val,
					DIRECTION: (val) => val,
					MOTOR_ID2: (val) => val,
					DIRECTION2: (val) => val
				},
				inputChanges: {
					SPEED: (val) => val
				}
			},
			{
				fromOpcode: "txt_doSetMotorSpeedDirDistSync",
				toOpcode: "ftxt_doSetMotorSpeedDirDistSync",
				fieldChanges: {
					MOTOR_ID: (val) => val,
					DIRECTION: (val) => val,
					MOTOR_ID2: (val) => val,
					DIRECTION2: (val) => val
				},
				inputChanges: {
					SPEED: (val) => val,
					STEPS: (val) => val
				}
			},
			{
				fromOpcode: "txt_doStopMotorAndReset",
				toOpcode: "ftxt_doStopMotorAndReset",
				fieldChanges: {
					MOTOR_ID: (val) => val
				}
			}
		];
				  
		const targets = projectData.targets || [];

		for (const target of targets) {
			const blocks = target.blocks || {};
			for (const [blockId, block] of Object.entries(blocks)) {
				if (!block || !block.opcode) continue;

				for (const replacement of blockReplacements) {
					if (block.opcode !== replacement.fromOpcode) continue;

					block.opcode = replacement.toOpcode;

					if (replacement.fieldChanges) {
						for (const [key, transform] of Object.entries(replacement.fieldChanges)) {
							const oldVal = block.fields?.[key]?.[0];
							const newVal = typeof transform === "function" ? transform(oldVal) : transform;

							if (!block.fields) block.fields = {};
							block.fields[key] = [newVal, null];
						}
					}

					if (replacement.inputChanges) {
						for (const [key, transform] of Object.entries(replacement.inputChanges)) {
							const oldInput = block.inputs?.[key];
							if (!oldInput) continue;

							const inputValue = oldInput[1]?.[1];
							const newVal = typeof transform === "function" ? transform(inputValue) : transform;

							block.inputs[key][1][1] = newVal;
						}
					}
				}
			}
		}
		if (Array.isArray(projectData.extensions)) {
			projectData.extensions = projectData.extensions.map(ext =>
				ext === "txt" ? "ftxt" : ext
			);
		}
	}

	downloadFile(blob, filename) {
		console.log("Download started:", filename);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			URL.revokeObjectURL(url);
			document.body.removeChild(a);
		}, 100);
	}

	removeDownloadButton() {
		const downloadButton = document.getElementById("ft_download_button");
		if (downloadButton) {
			downloadButton.remove();
		}
	}

	addVersionNumber() {
        const id = "ft_version_nummer";
        const existing = document.getElementById(id);
        if (existing) {
            existing.textContent = `v.${this.versionNumber}`;
            return;
        }
        const parentElement = document.querySelector(".stage-header_stage-size-row_xfQOp");
        if (!parentElement) {
            console.error("Parent-Element not found");
            return;
        }
        const versionElement = document.createElement("span");
        versionElement.setAttribute("id", id);
        versionElement.textContent = `v.${this.versionNumber}`;
        versionElement.style.marginLeft = "5px";
        versionElement.style.fontSize = "12px";
        versionElement.style.color = "#666";
        versionElement.style.opacity = "0.7";
        versionElement.style.alignSelf = "center";
        versionElement.style.display = "flex";
        parentElement.style.display = "flex";
        parentElement.style.alignItems = "center";
        versionElement.style.backgroundColor = "transparent";
        parentElement.appendChild(versionElement);
    }
}

module.exports = Main;