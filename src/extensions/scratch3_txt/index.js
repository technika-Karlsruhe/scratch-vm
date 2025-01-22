/*
  scratch3_txt/index.js
  get info method is called by scratch upon opening the extensions menu. Once the extension called TXT is opened a 
  connection can be established to a fischertechnik TXT controller by clicking the orange connect button. Then, holt the red "Select"-Button
  on the TXT until the blinking blue LED blinks with a much higher frequency. You should see the right controller now in the bluetooth connection 
  window of the browser. Select and pair our controller. Wait until the LED on the TXT turns orange. Depending on whether you allowed notifications,
  you will either receive a notification or an alert when the connection is finished and the controller ready to be used.

  Currently only English and German translations are available.

*/
const Block = require('../ft_source/block');
const Main = require('../ft_source/index.js');
const Menus = require('../ft_source/menus.js');
//const blockIconURI = require('./txt_small.png').default;
const blockIconURI = 'data:image/png+xml;base64,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'
var b = new Block();  // access block.js 
var main = new Main(); // access index.js
var m = new Menus(); // access menus.js

var outInt = 12; // number of outputs *3 --> 4 for each individual output 2 for each motor set 

var inInt = 8; // number of inputs

var servoInt = 0; // number of servos

var counterInt = 4; // number of counters

b.defaultValue(outInt, inInt, servoInt)

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

/**
 * Class for the txt blocks in Scratch 3.0
 * @constructor
 */

const EXTENSION_ID = 'txt';

class Scratch3TXTBlocks {
	constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
		this.runtime.on('PROJECT_STOP_ALL', this.reset.bind(this));// necessary to use the reset button 
    
		extensionnumber++; // increase the number of extensions
		openedextensions.push("TXT")
		if(extensionnumber > 1) {
			main.addselections();
		}else{
			type="TXT"
		}
		main.addButton();
		main.knownUsbDeviceConnected('none');// try autoconnection 
		navigator.usb.addEventListener("connect", main.knownUsbDeviceConnected)// set up an Eventlistener which will attempt to autoconnect once a paired device is detected
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
            name: 'TXT',
            blockIconURI: blockIconURI,
	    	showStatusButton: false, // we are using our own
	    	docsURI: 'https://technika-karlsruhe.github.io/',


			blocks: [ //the blocks are already defined in the block.js file and accessed like that:
				b.getBlock_onOpenClose(),
				b.getBlock_onCounter(),
				b.getBlock_onInput(),
				b.getBlock_getCounter(),
				b.getBlock_getSensor(),
				b.getBlock_isClosed(),
				b.getBlock_doPlaySound(),
				b.getBlock_doPlaySoundWait(),
				b.getBlock_dosetLamp2(),
				b.getBlock_doSetOutput2(),
				b.getBlock_doResetCounter(),
				b.getBlock_doConfigureInput(),
				b.getBlock_doSetMotorSpeed(),
				b.getBlock_doSetMotorSpeedDir(),
				b.getBlock_doSetMotorDir(),
				b.getBlock_doStopMotor(),
				b.getBlock_doSetMotorSpeedDirDist(),
				b.getBlock_doSetMotorSpeedDirSync(),
				b.getBlock_doSetMotorSpeedDirDistSync(),
				b.getBlock_doStopMotorAndReset(),
			],

			menus:{ // defining the different Menus, identified by the blocks through their name
				counterID: {
					items: main._formatMenuCounter(counterInt, servoInt, outInt, inInt)
				},
				motorID: {
					items: main._formatMenuM(outInt)
				},
				outputID: {
					items: main._formatMenuOut(outInt)
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

	doSetLamp2(args){
		b.doSetLamp(args,controller)
    }

	doSetOutput2(args) {
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

	onCounter(args) { // COUNTER_ID, OPERATOR, VALUE
		b.onCounter(args, controller)
	}

	getCounter(args) { // COUNTER_ID
		b.getCounter(args, controller)
	}

	doPlaySound(args) { // SOUND_ID
		b.doPlaySound(args, controller)
	}

	doPlaySoundWait(args) { // SOUND_ID
		b.doPlaySoundWait(args, controller)
	}

	doResetCounter(args) { // COUNTER_ID
		b.doResetCounter(args, controller)
	}

	doSetMotorSpeedDirDist(args) { // MOTOR_ID, SPEED, DIRECTION, DISTANCE
		b.doSetMotorSpeedDirDist(args, controller)
	}

	doSetMotorSpeedDirSync(args) { // MOTOR_ID, SPEED, DIRECTION, SYNC
		b.doSetMotorSpeedDirSync(args, controller)
	}

	doSetMotorSpeedDirDistSync(args) { // MOTOR_ID, SPEED, DIRECTION, DISTANCE, SYNC
		b.doSetMotorSpeedDirDistSync(args, controller)
	}

	doStopMotorAndReset(args) { // MOTOR_ID
		b.doStopMotorAndReset(args, controller)
	}

	reset() {// reset function triggered by pressing the red stop button
		if(controller!=undefined){
			controller.reset()
		}
	}
}

module.exports = Scratch3TXTBlocks;
