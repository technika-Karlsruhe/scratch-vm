/*
  scratch3_btsmart/index.js
  get info method is called by scratch upon opening the extensions menu. Once the extension called BT-Smart is opened a 
  connection can be established to a fischertechnik BT-Smart controller by clicking the orange connect button. Then, holt the red "Select"-Button
  on the BT-Smart until the blinking blue LED blinks with a much higher frequency. You should see the right controller now in the bluetooth connection 
  window of the browser. Select and pair our controller. Wait until the LED on the BT-Smart turns orange. Depending on whether you allowed notifications,
  you will either receive a notification or an alert when the connection is finished and the controller ready to be used.

  Currently only English and German translations are available.

*/
const Block = require('../ft_source/block');
const Main = require('../ft_source/index.js');
const Menus = require('../ft_source/menus.js');
const blockIconURI = require('./btsmart_small.png');
var b = new Block();  // access block.js 
var main = new Main(); // access index.js
var m = new Menus(); // access menus.js

var outInt = 2; // number of outputs

var inInt = 4; // number of inputs

var servoInt = 0; // number of servos

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
    
		main.addButton();
		main.knownUsbDeviceConnected('none');// try autoconnection 
		navigator.usb.addEventListener("connect", main.knownUsbDeviceConnected)// set up an Eventlistener which will attempt to autoconnect once a paired device is detected
		extensionnumber++; // increase the number of extensions
		openedextensions.push("BTSmart")
		if(extensionnumber > 1) {
			main.addselections();
		}else{
			type="BTSmart"
		}
    }
    
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
		//translate.setup(); // setup translation
		b.setup(); // setup translation for blocks
		m.setup(); // setup translation for menus
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

			menus:{ // defining the different Menus, identified by the blocks through their name
				outputID: {
					items: main._formatMenuout(outInt)
				},
				inputID: {
					items: main._formatMenuin(inInt, outInt)
				},
				inputModes: {
					items: m.inputModes()
				},
				inputAnalogSensorTypes: {
					items: m.inputAnalogSensorTypes()
				},
				inputDigitalSensorTypes: {
					items: m.inputDigitalSensorTypes()
				},
				inputDigitalSensorChangeTypes: {
					items: m.inputDigitalSensorChangeTypes()
				},
				motorDirection: {
					items: m.motorDirection()
				},
				compares: {
					items: m.compares()
				},
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

	isClosed(args) { // SENSOR, INPUT
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
		if(controller!=undefined){
			controller.reset()
		}
	}
}

module.exports = Scratch3BtsmartBlocks;
