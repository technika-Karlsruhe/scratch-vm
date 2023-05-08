/*
  scratch3_btreceiver/index.js
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
const blockIconURI = require('./btreceiver.png');
var b = new Block();  // access block.js 
var main = new Main(); // access index.js
var m = new Menus(); // access menus.js

var outInt = 3; // number of outputs

var inInt = 0; // number of inputs

var servoInt = 1; // number of servos

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

/**
 * Class for the btreceiver blocks in Scratch 3.0
 * @constructor
 */

const EXTENSION_ID = 'btreceiver';

class Scratch3BTReceiverBlocks {
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
		openedextensions.push("BTReceiver")
		if(extensionnumber > 1) {
			main.addselections();
		}else{
			type="BTReceiver"
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
            name: 'BT-Receiver',
            blockIconURI: blockIconURI,
	    	showStatusButton: false, // we are using our own
	    	docsURI: 'https://technika-karlsruhe.github.io/',


			blocks: [ //the blocks are already defined in the block.js file and accessed like that:
				b.getBlock_dosetLamp(),
				b.getBlock_doSetOutput(),
				b.getBlock_doSetMotorSpeed(),
				b.getBlock_doSetMotorSpeedDir(),
				b.getBlock_doSetMotorDir(),
				b.getBlock_doStopMotor(),
                b.getBlock_doSetServoPosition(),
			],

			menus:{ // defining the different Menus, identified by the blocks through their name
				outputID: {
					items: main._formatMenuout(outInt)
				},
                servoID: {
					items: main._formatMenuservo(servoInt)
				},
				motorDirection: {
					items: m.motorDirection()
				},
			}
        };
    }
	//Block functions, they are also defined in the block.js file and can be accessed like this:

	doSetLamp(args){
		b.doSetLamp(args,controller)
    }

	doSetOutput(args) {
		b.doSetOutput(args,controller)
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

    doSetServoPosition(args) {
        b.doSetServoPosition(args, controller)
    }

	reset() {// reset function triggered by pressing the red stop button
		if(controller!=undefined){
			controller.reset()
		}
	}
}

module.exports = Scratch3BTReceiverBlocks;
