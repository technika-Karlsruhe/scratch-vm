/*
  scratch3_btsmart/index.js
  get info method is called by scratch upon opening the extensions menu. Once the extension called BT-Smart is opened a 
  connection can be established to a fischertechnik BT-Smart controller by clicking the orange connect button. Then, holt the red "Select"-Button
  on the BT-Smart until the blinking blue LED blinks with a much higher frequency. You should see the right controller now in the bluetooth connection 
  window of the browser. Select and pair our controller. Wait until the LED on the BT-Smart turns orange. Depending on whether you allowed notifications,
  you will either receive a notification or an alert when the connection is finished and the controller ready to be used.

  Currently only English and German translations are available.

*/
const swal = require('sweetalert');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Block = require('../ft_source/block');
const Translation = require('../ft_source/translation');
const formatMessage = require('format-message');
const BLEDevice = require('../ft_source/bluetoothcontrol.js');
const USBDevice = require('../ft_source/usbcontrol.js');
const Main = require('../ft_source/index.js');
const blockIconURI = require('./btsmart_small.png');
const PARENT_CLASS = "controls_controls-container_3ZRI_";
const FT_BUTTON_ID = "ft_connect_button";
const ftConnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjguODQyIDEuMDU2Ny01LjIzMDIgNS4yMzAyLTIuODQ4Ni0yLjg0ODZjLTEuMTk1NS0xLjE5NTUtMi45NjA3LTEuMTk1NS00LjE1NjEgMGwtMy43MzU4IDMuNzM1OC0xLjQ5NDMtMS40OTQzLTIuMTAxNCAyLjEwMTQgMTQuOTQzIDE0Ljk0MyAyLjEwMTQtMi4xMDE0LTEuNDk0My0xLjQ5NDMgMy43MzU4LTMuNzM1OGMxLjE5NTUtMS4xOTU1IDEuMTk1NS0yLjk2MDYgMC00LjE1NjFsLTIuODQ4Ni0yLjg0ODYgNS4yMzAyLTUuMjMwMnptLTIxLjIwMSA4LjM1ODktMi4xMDE0IDIuMTAxNCAxLjQ5NDMgMS40OTQzLTMuNTk1NyAzLjU5NTdjLTEuMTk1NSAxLjE5NTUtMS4xOTU1IDIuOTYwNyAwIDQuMTU2MWwyLjg0ODYgMi44NDg2LTUuMjMwMiA1LjIzMDIgMi4xMDE0IDIuMTAxNCA1LjIzMDItNS4yMzAyIDIuODQ4NiAyLjg0ODZjMS4xOTU1IDEuMTk1NSAyLjk2MDcgMS4xOTU1IDQuMTU2MSAwbDMuNTk1Ny0zLjU5NTcgMS40OTQzIDEuNDk0MyAyLjEwMTQtMi4xMDE0eiIgZmlsbD0iIzFhZmYxNCIgb3ZlcmZsb3c9InZpc2libGUiIHN0cm9rZT0iIzAyOTEwMCIgc3Ryb2tlLXdpZHRoPSIxLjQ5NDMiIHN0eWxlPSJ0ZXh0LWluZGVudDowO3RleHQtdHJhbnNmb3JtOm5vbmUiLz4KPC9zdmc+Cg==';
const ftNoWebUSBIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjQuOTg3IDEuMjMwMi05LjA4MTggOS4yMDU5LTkuMDIyOC05LjE5ODItNS41NTg0IDUuNDgwOCA5LjA5OSA5LjI3NDYtOS4xNTggOS4yODIyIDUuNTQ1IDUuNDk2IDkuMDc5OS05LjIwNTkgOS4wODk1IDkuMjY1IDUuNTU4NC01LjQ4MDgtOS4xNjM3LTkuMzQxNCA5LjE1NjEtOS4yODIyeiIgY29sb3I9IiMwMDAwMDAiIGNvbG9yLXJlbmRlcmluZz0iYXV0byIgZG9taW5hbnQtYmFzZWxpbmU9ImF1dG8iIGZpbGw9IiNmZjE0MTQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaW1hZ2UtcmVuZGVyaW5nPSJhdXRvIiBzaGFwZS1yZW5kZXJpbmc9ImF1dG8iIHNvbGlkLWNvbG9yPSIjMDAwMDAwIiBzdHJva2U9IiM3MDAwMDAiIHN0cm9rZS13aWR0aD0iMS40NjM4IiBzdHlsZT0iZm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDtmb250LXZhcmlhbnQtYWx0ZXJuYXRlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtcG9zaXRpb246bm9ybWFsO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1wYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1pbmRlbnQ6MDt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO3RleHQtdHJhbnNmb3JtOm5vbmU7d2hpdGUtc3BhY2U6bm9ybWFsIi8+Cjwvc3ZnPgo=';
const ftDisconnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjAuMjAyIDAuOTQ3NWMtMC43NDcwNyAwLTEuNTAzNCAwLjI5MDU2LTIuMTAxMiAwLjg5MDQ1bC0yLjI0MTIgMi4yNDk2LTEuNDk0Mi0xLjQ5OTctMi4xMDEyIDIuMTA4OSAzLjQ1NTIgMy40NjgxLTMuOTIyMSAzLjg4OTggMi4xMDEyIDIuMTA4OSAzLjg3NTQtMy45MzY3IDMuOTIyMSAzLjkzNjctMy45MjIxIDMuODg5OCAyLjEwMTIgMi4xMDg5IDMuODc1NC0zLjkzNjcgMy40NTUyIDMuNDY4MSAyLjEwMTItMi4xMDg5LTEuNDk0Mi0xLjQ5OTcgMi4yNDEyLTIuMjQ5NmMxLjE5NTQtMS4xOTk3IDEuMTk1NC0yLjk3MTIgMC00LjE3MTFsLTIuODQ4Mi0yLjg1ODggMy43MzU0LTMuNzQ5Mi0yLjEwMTItMi4xMDg5LTMuNzM1NCAzLjc0OTItMi44NDgyLTIuODU4OGMtMC41OTc2NS0wLjU5OTg4LTEuMzA3NC0wLjg5MDQ1LTIuMDU0NC0wLjg5MDQ1em0tMTUuNTQ5IDExLjM4OC0yLjEwMTIgMi4xMDg5IDEuNDk0MiAxLjQ5OTctMi4xMDEyIDIuMTA4OWMtMS4xOTUzIDEuMTk5Ny0xLjE5NTMgMi45NzEyIDAgNC4xNzExbDIuODQ4MiAyLjg1ODgtMy43MzU0IDMuNzQ5MiAyLjEwMTIgMi4xMDg5IDMuNzM1NC0zLjc0OTIgMi44NDgyIDIuODU4OGMxLjE5NTQgMS4xOTk3IDIuOTYwMiAxLjE5OTcgNC4xNTU2IDBsMi4xMDEyLTIuMTA4OSAxLjQ5NDIgMS40OTk3IDIuMTAxMi0yLjEwODl6IiBmaWxsPSIjZmZiNDE0IiBzdHJva2U9IiM5MTYzMDAiIHN0cm9rZS13aWR0aD0iMS40OTY5IiBzdHlsZT0idGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lIi8+Cjwvc3ZnPgo=';
var b = new Block();  // access block.js 
var translate = new Translation();
var main = new Main();
var controller=undefined;
var connecteddevice
var controllerknown=false
var connection='BLE';
var notis  //Permission and API supported--> 0 cant be used(not granted or supported); 1 API supported; 2 supported and Permission granted--> can be used

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

/**
 * Class for the btsmart blocks in Scratch 3.0
 * @constructor
 */

const EXTENSION_ID = 'btsmart';


class Scratch3BtsmartBlocks {
	constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
		this.runtime.on('PROJECT_STOP_ALL', this.reset.bind(this));// necessary to use the reset button 
    
		// this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
		main.addButton();
		main.knownUsbDeviceConnected('none');// try autoconnection 
		navigator.usb.addEventListener("connect", main.knownUsbDeviceConnected)// set up an Eventlistener which will attempt to autoconnect once a paired device is detected
		//this.setButton(0, "");
    }
    
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
		if(!("Notification" in window)){
			notis=0
		}else{
			notis=1
		}
		if(notis==1){
			Notification.requestPermission().then(x=>{
				if(Notification.permission == "granted"){
					notis=2
				}
			})
		}
		//navigator.usb.addEventListener("connect", knownUsbDeviceConnected)
		translate.setup(); // setup translation
		b.setup(); // setup translation for blocks
        return { //Information returned to scratch gui
            id: EXTENSION_ID,
            name: 'BT-Smart',
            blockIconURI: blockIconURI,
	    	showStatusButton: false, // we are using our own
	    	docsURI: 'https://technika-karlsruhe.github.io/',


			blocks: [ //the blocks are already defined in the block.js file and accessed like that:
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

			menus: { // defining the different Menus, identified by the blocks through their name
				outputID: [// the outputs reveice the first Ids, in this case 0 and 1
					{text: 'M1', value: '0'},
					{text: 'M2', value: '1'}
				],
				inputID: [//the inputs receive the next ones, here 2-5
					{text: 'I1', value: '2'}, {text: 'I2', value: '3'},
					{text: 'I3', value: '4'}, {text: 'I4', value: '5'}
				],
				inputModes: [
					{text: translate._getText('Digitalvoltage',this.locale), value: 'd10v'}, {text:  translate._getText('Digitalresistance',this.locale), value: 'd5k'},
					{text: translate._getText('Analoguevoltage',this.locale), value: 'a10v'}, {text: translate._getText('Analogueresistance',this.locale), value: 'a5k'}
				],
				inputAnalogSensorTypes: [
					{text: translate._getText('ColorSensor'), value: 'sens_color'}, {text: translate._getText('NTCResistor'), value: 'sens_ntc'},
					{text: translate._getText('PhotoResistor'), value: 'sens_photo'}
				],
				inputDigitalSensorTypes: [
					{text: translate._getText('Button'), value: 'sens_button'}, {text: translate._getText('Lightbarrier'), value: 'sens_lightBarrier'},
					{text: translate._getText('Reedcontact'), value: 'sens_reed'}, {text: translate._getText('TrailSensor'), value:'sens_trail'}
				],
				inputDigitalSensorChangeTypes: [
					{text: translate._getText('Open'), value: 'open'}, {text: translate._getText('Closed'), value: 'closed'}
				], 
				motorDirection: [
					{text: translate._getText('Forward'), value: '1'}, {text: translate._getText('Backwards'), value: '-1'}
				],
				compares: ['<', '>']
			}
        };
    }
	//Block functions, they are also defined in the block.js file and can be accessed like this:
	onOpenClose(args){
		return b.onOpenClose(args,controller)
	}

	onInput(args) { // SENSOR, INPUT, OPERATOR, VALUE
		return b.onInput(args,controller)
	}

	getSensor(args) {
		return b.getSensor(args,controller)
    }

	isClosed(args) { // --> benötigt noch eine changeIMode funktion 
       	// SENSOR, INPUT
		return b.isClosed(args, controller)
    }

	doSetLamp(args){
		b.doSetLamp(args,controller)
    }

	doSetOutput(args) {
		b.doSetOutput(args,controller)
    }

	doConfigureInput(args) { 
       	b.doConfigureInput(args,controller)
	}

	doSetMotorSpeed(args) {
		b.doSetMotorSpeed(args, controller)
    }

    doSetMotorSpeedDir(args) {
		b.doSetMotorSpeedDir(args, controller)
    }

	doSetMotorDir(args) { 
		b.doSetMotorDir(args,controller)
    }

    doStopMotor(args) {
		b.doStopMotor(args, controller)
    }

	reset() {// reset function triggered by pressing the red stop button
		if(img.getAttribute("src")== ftConnectedIcon) {
			controller.reset()		
		}
	}
}

module.exports = Scratch3BtsmartBlocks;
