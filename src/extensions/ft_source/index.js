const swal = require('sweetalert');
const PARENT_CLASS = "controls_controls-container_3ZRI_";
const FT_BUTTON_ID = "ft_connect_button";
const ftConnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjguODQyIDEuMDU2Ny01LjIzMDIgNS4yMzAyLTIuODQ4Ni0yLjg0ODZjLTEuMTk1NS0xLjE5NTUtMi45NjA3LTEuMTk1NS00LjE1NjEgMGwtMy43MzU4IDMuNzM1OC0xLjQ5NDMtMS40OTQzLTIuMTAxNCAyLjEwMTQgMTQuOTQzIDE0Ljk0MyAyLjEwMTQtMi4xMDE0LTEuNDk0My0xLjQ5NDMgMy43MzU4LTMuNzM1OGMxLjE5NTUtMS4xOTU1IDEuMTk1NS0yLjk2MDYgMC00LjE1NjFsLTIuODQ4Ni0yLjg0ODYgNS4yMzAyLTUuMjMwMnptLTIxLjIwMSA4LjM1ODktMi4xMDE0IDIuMTAxNCAxLjQ5NDMgMS40OTQzLTMuNTk1NyAzLjU5NTdjLTEuMTk1NSAxLjE5NTUtMS4xOTU1IDIuOTYwNyAwIDQuMTU2MWwyLjg0ODYgMi44NDg2LTUuMjMwMiA1LjIzMDIgMi4xMDE0IDIuMTAxNCA1LjIzMDItNS4yMzAyIDIuODQ4NiAyLjg0ODZjMS4xOTU1IDEuMTk1NSAyLjk2MDcgMS4xOTU1IDQuMTU2MSAwbDMuNTk1Ny0zLjU5NTcgMS40OTQzIDEuNDk0MyAyLjEwMTQtMi4xMDE0eiIgZmlsbD0iIzFhZmYxNCIgb3ZlcmZsb3c9InZpc2libGUiIHN0cm9rZT0iIzAyOTEwMCIgc3Ryb2tlLXdpZHRoPSIxLjQ5NDMiIHN0eWxlPSJ0ZXh0LWluZGVudDowO3RleHQtdHJhbnNmb3JtOm5vbmUiLz4KPC9zdmc+Cg==';
const ftNoWebUSBIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjQuOTg3IDEuMjMwMi05LjA4MTggOS4yMDU5LTkuMDIyOC05LjE5ODItNS41NTg0IDUuNDgwOCA5LjA5OSA5LjI3NDYtOS4xNTggOS4yODIyIDUuNTQ1IDUuNDk2IDkuMDc5OS05LjIwNTkgOS4wODk1IDkuMjY1IDUuNTU4NC01LjQ4MDgtOS4xNjM3LTkuMzQxNCA5LjE1NjEtOS4yODIyeiIgY29sb3I9IiMwMDAwMDAiIGNvbG9yLXJlbmRlcmluZz0iYXV0byIgZG9taW5hbnQtYmFzZWxpbmU9ImF1dG8iIGZpbGw9IiNmZjE0MTQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaW1hZ2UtcmVuZGVyaW5nPSJhdXRvIiBzaGFwZS1yZW5kZXJpbmc9ImF1dG8iIHNvbGlkLWNvbG9yPSIjMDAwMDAwIiBzdHJva2U9IiM3MDAwMDAiIHN0cm9rZS13aWR0aD0iMS40NjM4IiBzdHlsZT0iZm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDtmb250LXZhcmlhbnQtYWx0ZXJuYXRlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtcG9zaXRpb246bm9ybWFsO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1wYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1pbmRlbnQ6MDt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO3RleHQtdHJhbnNmb3JtOm5vbmU7d2hpdGUtc3BhY2U6bm9ybWFsIi8+Cjwvc3ZnPgo=';
const ftDisconnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjAuMjAyIDAuOTQ3NWMtMC43NDcwNyAwLTEuNTAzNCAwLjI5MDU2LTIuMTAxMiAwLjg5MDQ1bC0yLjI0MTIgMi4yNDk2LTEuNDk0Mi0xLjQ5OTctMi4xMDEyIDIuMTA4OSAzLjQ1NTIgMy40NjgxLTMuOTIyMSAzLjg4OTggMi4xMDEyIDIuMTA4OSAzLjg3NTQtMy45MzY3IDMuOTIyMSAzLjkzNjctMy45MjIxIDMuODg5OCAyLjEwMTIgMi4xMDg5IDMuODc1NC0zLjkzNjcgMy40NTUyIDMuNDY4MSAyLjEwMTItMi4xMDg5LTEuNDk0Mi0xLjQ5OTcgMi4yNDEyLTIuMjQ5NmMxLjE5NTQtMS4xOTk3IDEuMTk1NC0yLjk3MTIgMC00LjE3MTFsLTIuODQ4Mi0yLjg1ODggMy43MzU0LTMuNzQ5Mi0yLjEwMTItMi4xMDg5LTMuNzM1NCAzLjc0OTItMi44NDgyLTIuODU4OGMtMC41OTc2NS0wLjU5OTg4LTEuMzA3NC0wLjg5MDQ1LTIuMDU0NC0wLjg5MDQ1em0tMTUuNTQ5IDExLjM4OC0yLjEwMTIgMi4xMDg5IDEuNDk0MiAxLjQ5OTctMi4xMDEyIDIuMTA4OWMtMS4xOTUzIDEuMTk5Ny0xLjE5NTMgMi45NzEyIDAgNC4xNzExbDIuODQ4MiAyLjg1ODgtMy43MzU0IDMuNzQ5MiAyLjEwMTIgMi4xMDg5IDMuNzM1NC0zLjc0OTIgMi44NDgyIDIuODU4OGMxLjE5NTQgMS4xOTk3IDIuOTYwMiAxLjE5OTcgNC4xNTU2IDBsMi4xMDEyLTIuMTA4OSAxLjQ5NDIgMS40OTk3IDIuMTAxMi0yLjEwODl6IiBmaWxsPSIjZmZiNDE0IiBzdHJva2U9IiM5MTYzMDAiIHN0cm9rZS13aWR0aD0iMS40OTY5IiBzdHlsZT0idGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lIi8+Cjwvc3ZnPgo=';
const BLEDevice = require('../ft_source/bluetoothcontrol.js');
const USBDevice = require('../ft_source/usbcontrol.js');
const Translation = require('../ft_source/translation');
const WebUSBDevice = require('../ft_source/webusbcontrol.js')
translate = new Translation();
controller=undefined; // only gloablly defined variable
extensionnumber = 0; // number of extensions
openedextensions= [] // name of all extensions which are open 
type=undefined // defined globally because extensions have to access it 
var port
var count=0
var controllerknown=false
var connection='BLE';
var notis  //Permission and API supported--> 0 cant be used(not granted or supported); 1 API supported; 2 supported and Permission granted--> can be used
//img
function connectingknownusbdevice(){
	if(controller==undefined){
		navigator.serial.getPorts({}).then((ports) => {
			if(ports.length>0){
				controller= new USBDevice()
				connection='USB'
				count=20
			if(controller!=undefined){
				controller.autoconnect().then(device=> { //Connect function is async--> then
					console.log(device);
					port=device
					img.setAttribute("src", ftConnectedIcon); //Button changes 
					navigator.serial.addEventListener('disconnect', onDisconnected);
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
	if(img.getAttribute("src")== ftConnectedIcon){
		if(connection=='BLE'){
			controller.disconnect();
			img.setAttribute("src", ftDisconnectedIcon);
		}
	}else{
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
	}
	else if(type=='BTReceiver'||type=='Robby'){
		value= 'bt'
	}else if(type=='LT'||'ftduino'){
		value= 'webusb'
	}else if(type=='TX'){
		value= 'usb'
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
					controller= new WebUSBDevice()
					break;
			}
			if(controller!=undefined){
				controller.controllertype=type; //setting controllertype
				controller.connect().then(device=> { //Connect function is async--> then
					port=device
					console.log(device);
					img.setAttribute("src", ftConnectedIcon); //Button chnages 
					if(connection=='USB' || 'webusb'){// Eventlistener depending on connection type
						navigator.serial.addEventListener('disconnect', onDisconnected);
					}else{
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
					controller=undefined;
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
					}
				});
			}
		
	}
}

function onDisconnected(event) {// reset everything
	connection='BLE'
	const ev = event.target;
	console.log(`Device ${ev.name} is disconnected.`);
	img.setAttribute("src", ftDisconnectedIcon);
	console.log(type)
	controller=undefined;
	if(notis==2){
		const disconnect = new Notification(translate._getText('disconnected',this.locale),{
			body: translate._getText('reconnect',this.locale),
		})
	}else{
		swal(translate._getText('disconnected',this.locale));
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
			Notification.requestPermission().then(x=>{
				if(Notification.permission == "granted"){
					notis=2
				}
			})
		}
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

	_formatMenuCounter (counterInt) {
		const m = [];
        for (let i = 0; i <= counterInt -1; i++) {
            const obj = {};
            obj.text = 'C'+(i+1).toString();
            obj.value = i.toString();
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
		button = document.getElementById(FT_BUTTON_ID).addEventListener("click", stud);
		if(controller==undefined){
			img.setAttribute("src", ftDisconnectedIcon);
		}else{
			img.setAttribute("src", ftConnectedIcon);
		}
	}
	
	addButton(initial = true) {//Function which creates the button
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
				console.log("Button added");
			}else{
                translate.setup();
				this.setButton(this.button_state, this.error_msg);
				console.log("Button added2");
				if(extensionnumber > 1) {
					this.addselections();
				}
			}
			} else{
				swal("ft: controls-container class not found!");
			}
		}
    }

	addselections() {
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
	}
}

module.exports = Main;