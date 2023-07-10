/*
  scratch3_txt/index.js
 workaround for the txt-controller. Since the controller only has a raw tcp-Socket-Server capable of writing and reading in and outputs,we have to use an implemented websocket server,
 which has access to the file directory, and the fact that the txt-firmware is capable of reading and compiling sb3-files
 (downloaded scratch programs), therefore all scratch programs for the txt have to be downloaded to the pc and then uploaded to the txt.
 A faster way which skips the download + upload could try to connect directly to the txt webserver and access the directory, however currently there are
 a few problems with the authorisation required by the txt. 
*/
const Block = require('../ft_source/block');
const BlockType = require('../../extension-support/block-type');
const Main = require('../ft_source/index.js');
const Menus = require('../ft_source/menus.js');
const ArgumentType = require('../../extension-support/argument-type');
const blockIconURI = require('./txt_small.png').default;
var b = new Block();  // access block.js 
var main = new Main(); // access index.js
var m = new Menus(); // access menus.js

var outInt = 0; // number of outputs *3 --> 4 for each individual output 2 for each motor set 

var inInt = 0; // number of inputs

var servoInt = 0; // number of servos

var counterInt = 0; // number of counters

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

const EXTENSION_ID = 'ftxt';

class Scratch3TxtBlocks {
	constructor (runtime) {
   
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
            {
                opcode: 'onOpenClose',
                text: translate._getText( 'onOpenClose',this.locale),
                blockType: BlockType.HAT,
                arguments: {
                    SENSOR: {
                        type: ArgumentType.NUMBER,
                        menu: 'inputDigitalSensorTypes',
                        defaultValue: '0'
                    },
                    INPUT: {
                        type: ArgumentType.STRING,
                        menu: 'inputID',
                        defaultValue: 0
                    },
                    OPENCLOSE: {
                        type: ArgumentType.NUMBER,
                        menu: 'inputDigitalSensorChangeTypes',
                        defaultValue: '0'
                    },
                }
            },
            {
                opcode: 'onCounter',
                text: translate._getText( 'onCounter',this.locale),
                blockType: BlockType.HAT,
                arguments: {
                    COUNTER_ID: {
                        type: ArgumentType.NUMBER,
                        menu: 'counterID',
                        defaultValue: 0
                    },
                    OPERATOR: {
                        type: ArgumentType.STRING,
                        menu: 'compares',
                        defaultValue: '>'
                    },
                    VALUE: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 100,
                        minValue: 0
                    }
                }
            },
            {
                opcode: 'onInput',
                text: translate._getText( 'onInput',this.locale),
                blockType: BlockType.HAT,
                arguments: {
                    SENSOR: {
                        type: ArgumentType.NUMBER,
                        menu: 'inputAnalogSensorTypes',
                        defaultValue: '0'
                    },
                    INPUT: {
                        type: ArgumentType.NUMBER,
                        menu: 'inputID',
                        defaultValue: 0
                    },
                    OPERATOR: {
                        type: ArgumentType.STRING,
                        menu: 'compares',
                        defaultValue: '>'
                    },
                    VALUE: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 100,
                        minValue: 0
                    }
                }
            },
            {
                opcode: 'getCounter',
                text: translate._getText( 'getCounter',this.locale),
                blockType: BlockType.REPORTER,
                arguments: {
                    COUNTER_ID: {
                        type: ArgumentType.NUMBER,
                        menu: 'counterID',
                        defaultValue: 0
                    },
                }
            },
            {
                opcode: 'getSensor',
                text: translate._getText( 'getSensor',this.locale),
                blockType: BlockType.REPORTER,
                arguments: {
                    SENSOR: {
                        type: ArgumentType.NUMBER,
                        menu: 'inputAnalogSensorTypes',
                        defaultValue: '0'
                    },
                    INPUT: {
                        type: ArgumentType.NUMBER,
                        menu: 'inputID',
                        defaultValue: 0
                    },
                }
            },
            {
                opcode: 'isClosed',
                text: translate._getText( 'isClosed',this.locale),
                blockType: BlockType.BOOLEAN,
                arguments: {
                    SENSOR: {
                        type: ArgumentType.NUMBER,
                        menu: 'inputDigitalSensorTypes',
                        defaultValue: '0'
                    },
                    INPUT: {
                        type: ArgumentType.NUMBER,
                        menu: 'inputID',
                        defaultValue: 0
                    },
                }
            },
            {
                opcode: 'doPlaySound',
                text: translate._getText( 'doPlaySound',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    NUM: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 1,
                        maxValue: 29
                    }
                }
            },
            {
                opcode: 'doPlaySoundWait',
                text: translate._getText( 'doPlaySoundWait',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    NUM: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 1,
                        maxValue: 29
                    }
                }
            },
            {
                opcode: 'doSetLamp2',
                text: translate._getText( 'doSetLamp',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    OUTPUT: {
                        type: ArgumentType.STRING,
                        menu: 'outputID',
                        defaultValue: 0,
                    },
                    NUM: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0,
                        maxValue: 8
                    }  
                },
            },
            {
                opcode: 'doSetOutput2',
                text: translate._getText( 'doSetOutput',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    OUTPUT: {
                        type: ArgumentType.NUMBER,
                        menu: 'outputID',
                        defaultValue: 0
                    },
                    NUM: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0,
                        maxValue: 8
                    }
                }
            },
            {
                opcode: 'doResetCounter',
                text: translate._getText( 'doResetCounter',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    COUNTER_ID: {
                        type: ArgumentType.NUMBER,
                        menu: 'counterID',
                        defaultValue: 0
                    },
                }
            },
            {
                opcode: 'doConfigureInput',
                text: translate._getText( 'doConfigureInput',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    INPUT: {
                        type: ArgumentType.STRING,
                        menu: 'inputID',
                        defaultValue: 0
                    },
                    MODE: {
                        type: ArgumentType.STRING,
                        menu: 'inputModes',
                        defaultValue: '0'
                    },
                }
            },
            {
                opcode: 'doSetMotorSpeed',
                text: translate._getText( 'doSetMotorSpeed',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    MOTOR_ID: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorID',
                        defaultValue: 0
                    },
                    SPEED: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 8,
                        minValue: 0,
                        maxValue: 8
                    }
                }
            },
            {
                opcode: 'doSetMotorSpeedDir',
                text: translate._getText( 'doSetMotorSpeedDir',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    MOTOR_ID: {
                        type: ArgumentType.STRING,
                        menu: 'motorID',
                        defaultValue: '0'
                    },
                    SPEED: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 8,
                        minValue: 0,
                        maxValue: 8
                    },
                    DIRECTION: {
                        type: ArgumentType.STRING,
                        menu: 'motorDirection',
                        defaultValue: '1'
                    }
                }
            },
            {
                opcode: 'doSetMotorDir',
                text: translate._getText( 'doSetMotorDir',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    MOTOR_ID: {
                        type: ArgumentType.STRING,
                        menu: 'motorID',
                        defaultValue: '0'
                    },
                    DIRECTION: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorDirection',
                        defaultValue: 1
                    }
                }
            },
            {
                opcode: 'doStopMotor',
                text: translate._getText( 'doStopMotor',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    MOTOR_ID: {
                        type: ArgumentType.STRING,
                        menu: 'motorID',
                        defaultValue: '0'
                    },
                }
            },
            {
                opcode: 'doSetMotorSpeedDirDist',
                text: translate._getText( 'doSetMotorSpeedDirDist',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    MOTOR_ID: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorID',
                        defaultValue: 0
                    },
                    DIRECTION: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorDirection',
                        defaultValue: 1
                    },
                    STEPS: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 100,
                        minValue: 0
                    },
                    SPEED: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 8,
                        minValue: 0,
                        maxValue: 8
                    }
                }
            },
            {
                opcode: 'doSetMotorSpeedDirSync',
                text: translate._getText( 'doSetMotorSpeedDirSync',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    MOTOR_ID: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorID',
                        defaultValue: 0
                    },
                    MOTOR_ID2: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorID',
                        defaultValue: 1
                    },
                    DIRECTION: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorDirection',
                        defaultValue: 1
                    },
                    DIRECTION2: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorDirection',
                        defaultValue: 1
                    },
                    SPEED: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 8,
                        minValue: 0,
                        maxValue: 8
                    }
                }
            },
            {
                opcode: 'doSetMotorSpeedDirDistSync',
                text: translate._getText( 'doSetMotorSpeedDirDistSync',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    MOTOR_ID: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorID',
                        defaultValue: 0
                    },
                    MOTOR_ID2: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorID',
                        defaultValue: 1
                    },
                    DIRECTION: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorDirection',
                        defaultValue: 1
                    },
                    DIRECTION2: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorDirection',
                        defaultValue: 1
                    },
                    STEPS: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 100,
                        minValue: 0
                    },
                    SPEED: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 8,
                        minValue: 0,
                        maxValue: 8
                    }
                }
            },
            {
                opcode: 'doStopMotorAndReset',
                text: translate._getText( 'doStopMotorAndReset',this.locale),
                blockType: BlockType.COMMAND,
                arguments: {
                    MOTOR_ID: {
                        type: ArgumentType.NUMBER,
                        menu: 'motorID',
                        defaultValue: 0
                    }
                }
            }


			],

			menus:{ // defining the different Menus, identified by the blocks through their name
				counterID: {
                    items: Scratch3TxtBlocks._buildIDMenu(4),
				},
				motorID: {
					items: Scratch3TxtBlocks._buildIDMenu(4),
				},
				outputID: {
					items: Scratch3TxtBlocks._buildIDMenu(8),
				},
				inputID: {
					items:  Scratch3TxtBlocks._buildIDMenu(8),
				},
				inputModes: {
					items: Scratch3TxtBlocks._buildInputModeMenu(),
				},
				inputAnalogSensorTypes: {
					items: Scratch3TxtBlocks._buildAnalogSensorTypeMenu(),
				},
				inputDigitalSensorTypes: {
					items: Scratch3TxtBlocks._buildDigitalSensorTypeMenu(),
				},
				inputDigitalSensorChangeTypes: {
					items:  Scratch3TxtBlocks._buildOpenCloseMenu(),
				},
				motorDirection: {
					items:Scratch3TxtBlocks._buildDirectionMenu(),
				},
				compares: {
					items: ['<', '>']
				},
			}
        };
    }

 static _buildIDMenu(count) {
    const result = [];
    for (let n = 0; n < count; n++) {
        result.push({
            text: String(n + 1),
            value: n.toString()        
        })
    }
    return result;
}
static _buildDigitalSensorTypeMenu() {
    return [{
        text: translate._getText('Button'),
        value: '0'
    }, {
        text: translate._getText('Lightbarrier'),
        value: '1'
    }, {
        text: translate._getText('Reedcontact'),
        value: '2'
    }, {
        text: translate._getText('TrailSensor'),
        value: '3'
    }];
}

static _buildAnalogSensorTypeMenu() {
    return [{
        text: translate._getText('ColorSensor'),
        value: '0'
    }, {
        text:  translate._getText('DistanceSensor'),
        value: '1'
    }, {
        text: translate._getText('NTCResistor'),
        value: '2'
    }, {
        text: translate._getText('PhotoResistor'),
        value: '3'
    }];
}

static _buildInputModeMenu() {
    return [{
        text: translate._getText('Digitalvoltage'),
        value: '0'
    }, {
        text: translate._getText('Digitalresistance'),
        value: '1'
    }, {
        text: translate._getText('Analoguevoltage'),       
        value: '2'
    }, {
        text: translate._getText('Analogueresistance'),         
        value: '3'
    }, {
        text: translate._getText('Ultrasonic'),
        value: '4'
    }];
}

static _buildOpenCloseMenu() {
    return [{
        text: translate._getText('Open'),
        value: '0'
    }, {
        text: translate._getText('Closed'),
        value: '1'
    }];
}

static _buildDirectionMenu() {
    return [{
        text: translate._getText('Forward'),
        value: '1'
    }, {
        text: translate._getText('Backwards'),
        value: '-1'
    }];
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
module.exports = Scratch3TxtBlocks;
