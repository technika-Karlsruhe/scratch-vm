const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Translation = require('../scratch3_ft/translation');
const formatMessage = require('format-message');
var translate= new Translation();
class Block {
	constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup();
    }
    setup(){ // all necessary block setups 
        translate.setup();
    }

    getBlock_onOpenClose(){
        return{
            opcode: 'onOpenClose',
            text: translate._getText( 'onOpenClose',this.locale),
            blockType: BlockType.HAT,
            arguments: {
                SENSOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputDigitalSensorTypes',
                    defaultValue: 'sens_button'
                },
                INPUT: {
                    type: ArgumentType.STRING,
                    menu: 'inputID',
                    defaultValue: '2'
                },
                OPENCLOSE: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputDigitalSensorChangeTypes',
                    defaultValue: 'open'
                },
            }
        }
    }

    getBlock_onInput(){
        return{
            opcode: 'onInput',
            text: translate._getText( 'onInput',this.locale),
            blockType: BlockType.HAT,
            arguments: {
                SENSOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputAnalogSensorTypes',
                    defaultValue: 'sens_color'
                },
                INPUT: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputID',
                    defaultValue: '2'
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
        }
    }

    getBlock_getSensor(){
        return{
            opcode: 'getSensor',
            text: translate._getText( 'getSensor',this.locale),
            blockType: BlockType.REPORTER,
            arguments: {
                SENSOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputAnalogSensorTypes',
                    defaultValue: 'sens_ntc'
                },
                INPUT: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputID',
                    defaultValue: '2'
                },
            }
        }
    }

    getBlock_isClosed(){
        return{
            opcode: 'isClosed',
            text: translate._getText( 'isClosed',this.locale),
            blockType: BlockType.BOOLEAN,
            arguments: {
                SENSOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputDigitalSensorTypes',
                    defaultValue: 'sens_button'
                },
                INPUT: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputID',
                    defaultValue: '2'
                },
            }
        }
    }

    getBlock_dosetLamp () {
        return{
            opcode: 'doSetLamp',
            text: translate._getText( 'doSetLamp',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                OUTPUT: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: '0',
                },
                NUM: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0,
                    maxValue: 8
                }  
            },
        };
    };

    getBlock_doSetOutput(){
        return{
            opcode: 'doSetOutput',
            text: translate._getText( 'doSetOutput',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                OUTPUT: {
                    type: ArgumentType.NUMBER,
                    menu: 'outputID',
                    defaultValue: '0'
                },
                NUM: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0,
                    maxValue: 8
                }
            }
        }
    }

    getBlock_doConfigureInput(){
        return{
            opcode: 'doConfigureInput',
            text: translate._getText( 'doConfigureInput',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                INPUT: {
                    type: ArgumentType.STRING,
                    menu: 'inputID',
                    defaultValue: '2'
                },
                MODE: {
                    type: ArgumentType.STRING,
                    menu: 'inputModes',
                    defaultValue: 'd10v'
                },
            }
        }
    }

    getBlock_doSetMotorSpeed(){
        return{
            opcode: 'doSetMotorSpeed',
            text: translate._getText( 'doSetMotorSpeed',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                MOTOR_ID: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: '0'
                },
                SPEED: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 8,
                    minValue: 0,
                    maxValue: 8
                }
            }
        }
    };

    getBlock_doSetMotorSpeedDir(){
        return{
            opcode: 'doSetMotorSpeedDir',
            text: translate._getText( 'doSetMotorSpeedDir',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                MOTOR_ID: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
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
        }
    };

    getBlock_doSetMotorDir(){
        return{
            opcode: 'doSetMotorDir',
            text: translate._getText( 'doSetMotorDir',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                MOTOR_ID: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: '0'
                },
                DIRECTION: {
                    type: ArgumentType.NUMBER,
                    menu: 'motorDirection',
                    defaultValue: 1
                }
            }
        }
    }

    getBlock_doStopMotor(){
        return{
            opcode: 'doStopMotor',
            text: translate._getText( 'doStopMotor',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                MOTOR_ID: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: '0'
                },
            }
        }
    }
}


module.exports = Block;
