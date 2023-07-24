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
const blockIconURI = require('./txt_small.png').default;
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
