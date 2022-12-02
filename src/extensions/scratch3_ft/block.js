const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
class Block {
	constructor (runtime, chara) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    

    getBlock_onOpenClose(){
        return{
            opcode: 'onOpenClose',
                    text: ({
                        id: 'ftxt.onOpenClose',
                        default: 'If [SENSOR] [INPUT] [OPENCLOSE]',
                        description: 'check when a certain sensor closes or opens'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        SENSOR: {
                            type: ArgumentType.NUMBER,
                            menu: 'inputDigitalSensorTypes',
                            defaultValue: 'sens_button'
                        },
                        INPUT: {
                            type: ArgumentType.NUMBER,
                            menu: 'inputID',
                            defaultValue: '1'
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
                    text: ({
                        id: 'ftxt.onInput',
                        default: 'If value of [SENSOR] [INPUT] [OPERATOR] [VALUE]',
                        description: 'check when a certain input changes its value'
                    }),
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
                            defaultValue: '1'
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
                    text: ({
                        id: 'ftxt.getSensor',
                        default: 'Read value of [SENSOR] [INPUT]',
                        description: 'get the value of a sensor'
                    }),
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
                            defaultValue: '1'
                        },
                    }
        }
    }

    getBlock_isClosed(){
        return{
            opcode: 'isClosed',
                    text: ({
                        id: 'ftxt.isClosed',
                        default: 'Is [SENSOR] [INPUT] closed?',
                        description: 'check whether a sensor is closed'
                    }),
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
                            defaultValue: 'I1'
                        },
                    }
        }
    }

    getBlock_dosetLamp () {
        return{
            opcode: 'doSetLamp',
            text: ({
                id: 'ftxt.doSetLamp',
                default: 'Set lamp [OUTPUT] to [NUM]',
                description: 'Set the value of the given lamp'
            }),
            blockType: BlockType.COMMAND,
            arguments: {
                OUTPUT: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: 'o1',
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
                    text: ({
                        id: 'ftxt.doSetOutput',
                        default: 'Set output [OUTPUT] to [NUM]',
                        description: 'Set the value of the given output'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        OUTPUT: {
                            type: ArgumentType.NUMBER,
                            menu: 'outputID',
                            defaultValue: 'o1'
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
                    text: ({
                        id: 'ftxt.doConfigureInput',
                        default: 'Set input [INPUT] to [MODE](geht noch nicht)',
                        description: 'Set the mode of the given input.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INPUT: {
                            type: ArgumentType.NUMBER,
                            menu: 'inputID',
                            defaultValue: 'o1'
                        },
                        MODE: {
                            type: ArgumentType.NUMBER,
                            menu: 'inputModes',
                            defaultValue: 'd10v'
                        },
                    }
        }
    }

    getBlock_doSetMotorSpeed(){
        return{
            opcode: 'doSetMotorSpeed',
            text: ({
                id: 'ftxt.doSetMotorSpeed',
                default: 'Set motor [MOTOR_ID] to [SPEED]',
                description: 'Set the speed of the given motor'
            }),
            blockType: BlockType.COMMAND,
            arguments: {
                MOTOR_ID: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: 'o1'
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
            text: ({
                id: 'ftxt.doSetMotorSpeedDir',
                default: 'Set motor [MOTOR_ID] to [SPEED] [DIRECTION]',
                description: 'Set speed and direction of the given motor'
            }),
            blockType: BlockType.COMMAND,
            arguments: {
                MOTOR_ID: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: 'o1'
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
            text: ({
                id: 'ftxt.doSetMotorDir',
                default: 'Set motor [MOTOR_ID] to [DIRECTION]',
                description: 'Set the direction of the given motor'
            }),
            blockType: BlockType.COMMAND,
            arguments: {
                MOTOR_ID: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: 'o1'
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
            text: ({
                id: 'ftxt.doStopMotor',
                default: 'Stop motor [MOTOR_ID]',
                description: 'Stop the given motor.'
            }),
            blockType: BlockType.COMMAND,
            arguments: {
                MOTOR_ID: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: 'o1'
                },
            }
        }
    }
}


module.exports = Block;
