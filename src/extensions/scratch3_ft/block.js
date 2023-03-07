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
//Block definitions
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
//Block functions
    onOpenClose(args,controller){
		if(controller.getvalWrite(parseInt(args.INPUT))!=0x0b && (args.SENSOR=='sens_button'||args.SENSOR=='sens_lightBarrier'||args.SENSOR=='sens_reed')){ // check if the mode has to be changed 
			controller.setchanging(parseInt(args.INPUT), true);
		}
		if (controller.getvalWrite(parseInt(args.INPUT))!=0x0a && args.SENSOR=='sens_trail'){
			controller.setchanging(parseInt(args.INPUT), true);
		} 
		
		if (controller.getchanging(parseInt(args.INPUT))==true){ // if something must be changed 
			controller.changeInMode (args)
			/*if (controller.getfuncstate()==0){ // already changing?
				//controller.setfuncstate(1); 
				return false;
			}else { */
				if(controller.getnumruns(parseInt(args.INPUT))<100){ // if we run into any uexpected problems with the changing process 
					controller.setnumruns(parseInt(args.INPUT),controller.getnumruns(parseInt(args.INPUT))+1);
					console.log(controller.getnumruns(parseInt(args.INPUT))+'num')
				}else{
					controller.setnumruns(parseInt(args.INPUT),0); // restart the changing 
					controller.setfuncstate(parseInt(args.INPUT),0);
					controller.setchanging(parseInt(args.INPUT), false);
				}
			return false;
			//}
		}else {// normal Hat function 
			console.log(controller.getvalIn(parseInt(args.INPUT))+'in')
			if(args.OPENCLOSE=='closed'){
				if(controller.getvalIn(parseInt(args.INPUT))!=255){
					return true;
				}else return false;
			}else {
				if(controller.getvalIn(parseInt(args.INPUT))==255){
					return true;
				}else return false;
			}
		}
	}

    onInput(args, controller) { // SENSOR, INPUT, OPERATOR, VALUE
		if(controller.getvalWrite(parseInt(args.INPUT))!=0x0b && (args.SENSOR=='sens_ntc'||args.SENSOR=='sens_photo')){ // check if the mode has to be changed 
			controller.setchanging(parseInt(args.INPUT), true);
		}
		if (controller.getvalWrite(parseInt(args.INPUT))!=0x0a &&args.SENSOR=='sens_color'){
			controller.setchanging(parseInt(args.INPUT),true);
		}
		if (controller.getchanging(parseInt(args.INPUT))==true){ // if something must be changed 
			controller.changeInMode(args)
			//if (controller.getfuncstate(1)==0){ // already changing?
				//controller.setfuncstate2(1); 
				
				//return false;
			//}else {
				if(controller.getnumruns(parseInt(args.INPUT))<100){ // if we run into any uexpected problems with the changing process 
					controller.setnumruns(parseInt(args.INPUT), controller.getnumruns(parseInt(args.INPUT))+1);
                    console.log(controller.getnumruns(parseInt(args.INPUT))+'num')
				}else{
                    console.log("OKKKK")
					controller.setnumruns(parseInt(args.INPUT), 0); // restart the changing 
					controller.setfuncstate(parseInt(args.INPUT), 0);
					controller.setchanging(parseInt(args.INPUT),false);	
				}
				return false;
			//}
		}else{
	   		if(args.OPERATOR=='<'){
				if(controller.getvalIn(parseInt(args.INPUT))<args.VALUE){
					return true;
				}else return false;
			} else{
				if(controller.getvalIn(parseInt(args.INPUT))>args.VALUE){
					return true;
				}else return false;
			}
		}
	}
    getSensor(args, controller) {
        // SENSOR, INPUT
		//-->set input to right mode and read afterwards
		//needs change I mOde 
		switch(args.SENSOR) {
			case 'sens_color':
				controller.write_Value(parseInt(args.INPUT) ,0x0a);
				break;
			case 'sens_ntc':
				controller.write_Value(parseInt(args.INPUT),0x0b);
				break;
			case 'sens_photo':
				controller.write_Value(parseInt(args.INPUT),0x0b);
				break;
		}
        return controller.getvalIn(parseInt(args.INPUT));
    }
    isClosed(args,controller) { // --> benötigt noch eine changeIMode funktion 
        // SENSOR, INPUT
     var x=controller.getvalIn(parseInt(args.INPUT))	
     console.log(x)
     return x!=255
    }
    doSetLamp(args,controller){
        controller.write_Value(parseInt(args.OUTPUT), args.NUM*15.875);
    }

    doSetOutput(args,controller) {
        controller.write_Value(parseInt(args.OUTPUT), args.NUM*15.875);
    }

    doConfigureInput(args,controller) { 
       if(args.MODE=='d10v'||args.MODE=='a10v'){
        controller.write_Value(parseInt(args.INPUT), 0x0a);
       }else{
        controller.write_Value(parseInt(args.INPUT), 0x0b);
    }
    }

    doSetMotorSpeed(args,controller) {
        controller.write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875);
    }

    doSetMotorSpeedDir(args,controller) {
    controller.write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875*parseInt(args.DIRECTION));	
    }

    doSetMotorDir(args,controller) { 
    var flex=0;
    if (controller.getstor(parseInt(args.MOTOR_ID)).length>0){ // check if values for the output are in the queue
        flex=controller.getstor(parseInt(args.MOTOR_ID))[controller.getstor(parseInt(args.MOTOR_ID)).length-1];// if yes save the last output value 
    }else{
        flex=controller.getvalWrite(parseInt(args.MOTOR_ID)); // if not safe the current one
    }
    if((args.DIRECTION=='1'&&flex<0)||(args.DIRECTION=='-1'&&flex>0)){// check if direction change is necessary 
        controller.write_Value(parseInt(args.MOTOR_ID), flex*-1); // if yes, change direction
    }
    }

    doStopMotor(args,controller) {
        controller.write_Value(parseInt(args.MOTOR_ID), 0)
    }
}


module.exports = Block;
