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
const Translation = require('../ft_source/translation');
const Main = require('../ft_source/index.js');
const blockIconURI = require('./btsmart_small.png');
var b = new Block();  // access block.js 
var translate = new Translation();
var main = new Main();

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
		//console.log(xyz)

		main.knownUsbDeviceConnected('none');// try autoconnection 
		navigator.usb.addEventListener("connect", main.knownUsbDeviceConnected)// set up an Eventlistener which will attempt to autoconnect once a paired device is detected
		//this.setButton(0, "");
    }
    
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
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
