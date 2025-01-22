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
//const blockIconURI = require('./txt_small.png').default;
const blockIconURI = 'data:image/png+xml;base64,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'
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
