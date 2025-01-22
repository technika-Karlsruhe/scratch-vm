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
//const blockIconURI = require('./btsmart_small.png').default;
const blockIconURI = 'data:image/png+xml;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAArCAYAAAAKasrDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMjHxIGmVAAAO20lEQVRYR+2XeVDcZZrHo1Z5rLNj1FFnvHan1DhuRctxxi2jcbKT1VGT6Jo7JiREJIncNzR0Q3M1NNBAQ9PNfd/3DU1zNzeBACGEhCMkgYCBEGPiuWPls29T7c7Mbg1Lbe3O7h/zrXrq/VHV9O/Tz/2u+6v+Erp9+/Y9cxNjv7yUn3S0b//mDWft9m+YU0k2LOYnbbgy0PG0+WN/OV3KDX1wMsDht0NH3w/ofvulmo5Nz349Pz5Or9V2eqy20X/iQ4bs93Pa4QDDYZLvz6eob01Xl9yaLM+/NZmfcWumturWbKfx1vzQ4K3LAwOZC8s3M+eWbmRembmcuXBpNvn6yIjltbNnLefnr1nOz82L86rl1atXLW/evPkTM8LqGnM8FFf/szupfWwdNY+uo+6xOxkoyafR8TBKbydUMldiA73QBHsTEiojIkpBYVYixsZ6utpbONndQW+Xkd7+XgaHh5hf/pwvvv6WuaXrjF68zOmpKc5fmOHCwiIz81eZXri6cl66NJtiRlhd3a8/e6hWgJngah4RgML6E9SccT+Oj68PUn8ZMQla5CH+BIT5oU3TUtvRxuwX3zB36zsuXPscowBrGuinaegkU4tL3PjmWy4K0OHZKwxdnuOsgJq8uiQ+u8yU+PxFAX/h/OTaAIcPvrWr3uQ5M1zdI3cwrvRjTmaHLkhGqswBDy9PCsuK8ZQ4EqUKpqyqiuvffs8X333P7M1vKG9vpripjtreDk7PzXHr2+8YmZune2KSrrNj6JubGZi5QN/4GH3DI0wJ4Ivnxk6bEVbXdLj8JcPWl6NSXn7q1rFnHiX/8bvp87Snz8eGABsLQo8dwvqYNen5uTg6O+Ar8yNWp1sBvCkA57/8jtIWPdnVxZS26umfmhCA/0rbmdPoB/up6DTi7uVF2+gwBfo64uJ1jF+6zIWBvgtmhLWp5oX1gzG/epqqXzxAj6M1LVJ7PN3ccHT3QalJIkAVjTJaRUBEKBWtTSwIsGvffM9lEeqChipSijPI05dxRnhw+evvaB8doaq7k8qudpqHBqnr66Cuq42h8bOMTEww0VS7NsBhN4v7+9/7x/G2l5+8rX9EFMvDd3DSxpLTvm4EBkTgG5GKvzoL/6gUYhOTCYqORJedRUVbO1Ud7RQZ6tBkxKPNiiezMp/lr77m69//nsZTw5QZjZQb22g5NUDryDAlIg3a+rroGz3NeEnWbFFR0V1mjD+vmWj5+tYND1PzkCgSs/VZ7qVHEUJIZC5BugoUCRUok0pIL6wiLCGDyJRMQjQ6gmKiCFarUGqjiEqNJ7GoCOPoOQanZ0VoT1LU0kFJS4swA3pR5VkVRRTXl9M+0Mv5nHhmZmbWmzH+vK4PDDzQ/uIT3/874IPr6Pnwbfo1CUSqiwRcHcrkOtS5jZQauonLrSI2qwxFTCJBsQmEaBOJTM1Gm19NSkUrmXXdZOt7yK7vJLuuhdx6PVlVpRQ1VJOan06dyNNGEfZxbRBDra3/NaBJzU/dN/EDnMmMW37FqewCdKpsFIl6QpP1ArCF8qZ+EooNaHJrCNVmEp5SQnRmNdrCJhLLjKRUdpmtg+TyZhKKqtDl5pJTWUpORRn+ymAkMindp04yGupGa3r02gA7fv3MxA9wJmv95TMMV9STHhRPcIKekKQGIjKayKvuIq6ghejsRqKyTNDNaAra0BV3EF/SSUJph3huRZOvF+ClhMenoIyNQpOiIyEzlaAgOSlpiRiMzQz7nmCkueJ5M8LqOvn+5j8Arl9H04bHGG1op9Q7lOD4euHFBsLTGkWlGonMbCI6t01YOzH5RmILOgSkccVi81oEeC3hyYWExImCilITqApDGRWKWhuBJk5JeV4SNTXFDEusmO5u+sSMsLq6X/l5Vp2AqzeZADQ88SOWRN70OTmgVOejic+n3tiPLr8BX0UyKXmFlDUPCUgj6jxhJuCcFgEvfkhqJcqEAlE4GYTGJgnACPwVvihE86+sLae3uYaa8myGZccYzo9fG2Dfoe07+4/uLo/6ux8jee5RGn9yJ9N5GRh3/5ZIi70kOFix9Z+3Ehmr48THNuzeu5us0nois9uFtQlrFXDNRKTrRV6KSk8sEeHNJUKtQyU8mJ2bQYivEwGexxg0NtLaVs+Ivx0dSre1AZq00FC5tfjJewl/5WlaH72LLl00ObvfwsXWHm9XH1KKKpFH5yEJziQyrVbkWi/hmW2oMltRZbWIs4mw1HpCkyoJ1hbgHx4r+qgv2eoQempK0Hoco9DPkSyZLZMzU3T62vze4PnxPvPrV9fFCLms+7Vf3Gx99iGafnoPhofuYCA6lGrLfbj6qvFS5uCnqSEosRGdCGloahvKtHbCM0zeaxMhNnnQIMJbS2BsAb5hOoJVUUSLAkkT/VEtwvvRpn/im1efpNT6X5i8dIG0EK+1j7qejU9sM+VerckeEHkorF3M3RJZACpdGYFxVfipKwiIb1oBVCS3CMhWAdgqCqWdrPo+Ud2NxGRV4xeRiIefgiitlpi4GLQxYaSESvHf9x6Fh98jzvEg4xem0Aa6rh3wtO3hbQ0Crk6A/WDDv36OkiojhfU9xKRXIwtORK5tIkp4LTChieCkJpSpjahzWkVT7ie+UABmViFXJeLqI8fF0wtPT1cCpV4UFxegCXAhxMWCNG0ItU21xCokC7OnB18yI6yu2dy0/wy48UmKK43Utg+jyaoX+2AS/rpm1Jnt4mwkMN5AsKn9pDeSVCZaTW4DqrQKMV2y8QnRCdMiVcTiExgu9ko/UjJSKCrNJTdLR352AtUhHgx+tDXXjLC6lvLyHm98+M4/AP54HaeeeZgMAWboGiMqTU9gZA6+GoPwZivyOAP+Wr2wOjGr60QzrxdnNXJNmUiFwhXzVxcgj8xAEhSFp0xGXlkZUrEEa9VBNBaLkRenYNrF4owZYXXNWG65t+XpB/7Eg71vvkyhfxw5og96R9UiVdcji9WjSWsWBdMgIE2AAkxMmhWLFwWiE5UuIGXRhQQITwapE3GT+WPv4k5mXja+vu54uDmQEK/B2FTDhLf1vBlhdc2kp9/bsfFp9AJsxdbfQd87m7kmsUcXnIZEVSXmsYEwMU00aQYB0kBu3aBoLS3EiKLRFXeSXCFmcEU7ukI9PsoEXKVynDzdOGZzggMHrdi5ZydBIXI+PWFFdJQSfWkO5+z2rg0QuGtMFWyl3/RCmfzZR4j9+Xq6N73IdYkNhZ4+hMrFPI2MJre4FAcXGW5ucnbu3snA1GUGZxbEmr/E2MKyOD8Tm/MZsenE4ewlxcXLGztnAfmpDYGhgTg5HMXDxYpguRM5iZGc2f+btQGadDVO/qPOt14Oyt7wIOkbH8P4wuOckzmSvPcd/HZtw2nfB3hIpRy39cLezgufAH/GP7vGzI2vVmz6+k3x9xLd5ydRJZsKJRZ3PxVhmmQk8kAkvt7I5B74iO+M1ChJjAtn7MCWr65PTz9gRlhd/e9uGmwRnmsV467tqb8R53qaI4MIOXwYG3u5eEk8CrG8hmiKkYZqSSos5NTFOWY+/5KppRtMXrvBeQHcP3WRrOpmEvNqSciuIrWgiuj4NCLj4wgRFy6przPq+Ehi1aGcPbiVwU7D42aE1TW46+3BPy6S5sfvpzEzh4gjttj6pOEcWIB3ZDnxOfXockybsYEifSNjIqxTi8ucv7rMOXH3HZ1doLi5lzAx8gJEgfmExOMsCcDOyR4n52NIvG1RRQcTGxMqQrwFQ4pmbYCtT94XXPdHvdDwyN20ZxWSbWmPgzwP56BCpNEVJIqGrBUbdFVjC0UC8vSlK0wKD04sfs65z5Y5NTNLTdcppJH5uCsycfGLwcHTDwcxmVydj+PpeJTUuDDRsJWM7HmDCg+rtQF2v7HxTwBNldyamkuVpS12fnk4BuTjEVYsxpmeiJgkEcICcQkS993piyvhNdkZ4b2Ry1cobjmJj6oQiTIT94BYHL38iE4Qy6+oYneHIzSL9T8/OYqBT3YwVp79phlhdQ0f2bkCaJrFJjO1m8ZoHU1HjmHrmyMgc3D0z8EnQiwD/mqCo9UYBgYYF6E9b/Le4nXOihwcujRHXkMnktBUpMoY0QcDOO7gQnCkmlhtjLhjf8wu0XK6ezvp8bPnXEWenRlhdZ05YWG/AmiGNC0MzYEKuo9aYS/NxMEvC0+lWLfCcggJS0ARraG+p0e0l8WVaj67cI3RK58xcOEiubUG0QcDcHR1EhVvjfXB3Xx6eB/eUg8cLHYQGSQhM0XNwIld9Mb4rw2wd8/bWxufuJ+6h8TIE5AmwFFbSy4e3YenbzyOUi1pRXV4ycORSBXIFSr0rS0CakHAiT44vyj64Dx9k5PkVJXjJvHB2dkZZ7GVO5z4BH8PO+Su1sjsDqJw+xi1WB66rXbQZXdgbYC3b1++b6wk97mqra/c9hA9sPin9zJy4F0uW2xHabGfhEN72fH+NqLVamw+ssBqzwfi3qwSOTfH2JWronrnRYHM0Dk6QlZRHjJPd/xdHQlzdyBIFIfC5iDVtvs5Z7uHRevtzNntuX3F1eKLud2bd5gRVteNS5cenI7xCxqy2XO7ZvdrVD/3IN3v/4auox/ie3AP4eIyf8L6Y3EBSuW4tSsKHwnFVWX0nztH/9mzdA4O0NLRjr6umlq1gvpPD9Jn+T4z+96kZ8vzdG9/7eRnidHSm+lxki9yk44snzz5ovnVa5fhZ/euhLdBnKbnjndfp9rmEO4nXHGwkSH1DMfbRYG3o4QAF0dy4qIwVpZwKiOecZUfl12PcH3fZm7s2sQNy/cWv3T4qH3Z59OA86HSt5bGx//W/Jr/vppFaKtF7lWZrX3LKxjsj+Fv+QnK4zakOrlQ6WRHwScWJB34gKa9b7EgOc7NvZv56uDWiZte1pXXgr2O3ho5+aKY73eYv/Z/Th1vvEi18OAPgJ2vPse4x3H6P3idid+9xOKWZ1n83UZGNz9/48LhnbqljMQPPh8f+vsb3d0P/a8A/Ud1Ht23rWvf9qimV5/PbHntHwa63nl9dikxavGL3ZtnbxzdUbboY+e83Kx//fbExD3mf/m/F2fO3G1+/Kv+n2vdun8DynF6lJYCbtYAAAAASUVORK5CYII=';
var b = new Block();  // access block.js 
var main = new Main(); // access index.js
var m = new Menus(); // access menus.js

var outInt = 6; // number of outputs *3 --> 4 for each individual output 2 for each motor set 

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
    
		extensionnumber++; // increase the number of extensions
		openedextensions.push("BTSmart")
		if(extensionnumber > 1) {
			main.addselections();
		}else{
			type="BTSmart"
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
				motorID: {
					items: main._formatMenuM(outInt)
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
