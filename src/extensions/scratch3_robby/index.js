/*
  scratch3_robby/index.js
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
const blockIconURI = require('./robby_small.png').default;
var b = new Block();  // access block.js 
var main = new Main(); // access index.js
var m = new Menus(); // access menus.js

var outInt = 6// number of outputs

var inInt = 4; // number of inputs

var servoInt = 0; // number of servos

var counterInt = 0; // number of counters

b.defaultValue(outInt, inInt, servoInt)

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

/**
 * Class for the robby blocks in Scratch 3.0
 * @constructor
 */

const EXTENSION_ID = 'robby';

class Scratch3RobbyBlocks {
	constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
		this.runtime.on('PROJECT_STOP_ALL', this.reset.bind(this));// necessary to use the reset button 
    
		extensionnumber++; // increase the number of extensions
		openedextensions.push("Robby")
		if(extensionnumber > 1) {
			main.addselections();
		}else{
			type="Robby"
		}
		main.addButton();
		main.knownUsbDeviceConnected('none');// try autoconnection 
		if (main.ismobile()==false){
			navigator.usb.addEventListener("connect", main.knownUsbDeviceConnected)// set up an Eventlistener which will attempt to autoconnect once a paired device is detected
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
            name: 'Robby',
            blockIconURI: blockIconURI,
	    	showStatusButton: false, // we are using our own
	    	docsURI: 'https://technika-karlsruhe.github.io/',


			blocks: [ //the blocks are already defined in the block.js file and accessed like that:
				b.getBlock_onOpenClose(),
				b.getBlock_isClosed(),
				b.getBlock_doSetMotorSpeed(),
				b.getBlock_doSetMotorSpeedDir(),
				b.getBlock_doSetMotorDir(),
				b.getBlock_doStopMotor(),
			],

			menus:{ // defining the different Menus, identified by the blocks through their name
				motorID: {
					items: main._formatMenuM(outInt)
				},
				inputID: {
					items: main._formatMenuin(inInt, outInt)
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
			}
        };
    }
	//Block functions, they are also defined in the block.js file and can be accessed like this:
	onOpenClose(args){
		return b.onOpenClose(args,controller)
	}

	isClosed(args) { // SENSOR, INPUT
		return b.isClosed(args, controller)
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

module.exports = Scratch3RobbyBlocks;
