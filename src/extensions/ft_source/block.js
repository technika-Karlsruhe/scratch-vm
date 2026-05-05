const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Main = require('../ft_source/index.js');
var main = new Main(); // access index.js
class Block {
	constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); //setup translations
    }

    setup(){ // all necessary block setups 
        translate.setup();
    }

    defaultValue(outInt, inInt, servoInt, maxSpeed){ // set default values for the number of inputs, outputs and servos
        let indefaultValue = outInt; // default value for input menu
        let servodefaultValue = outInt + inInt; // default value for servo menu
        let outputdefaultValue = outInt / 3; // default value for output menu
        let counterdefaultValue = servodefaultValue + servoInt;

        this.maxSpeed = maxSpeed || 8;

        this.indefaultValue = indefaultValue;
        this.servodefaultValue = servodefaultValue;
        this.outputdefaultValue = outputdefaultValue;
        this.counterdefaultValue = counterdefaultValue;

        this.indOut = outInt;
        this.indIn = inInt;
        this.indServo = servoInt;
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
                    defaultValue: this.indefaultValue
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
                    defaultValue: this.indefaultValue
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

    getBlock_onInput2(){
        return{
            opcode: 'onInput2',
            text: translate._getText( 'onInput',this.locale),
            blockType: BlockType.HAT,
            arguments: {
                SENSOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputAnalogSensorTypes2',
                    defaultValue: 'sens_color'
                },
                INPUT: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputID',
                    defaultValue: this.indefaultValue
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
                    defaultValue: this.indefaultValue
                },
            }
        }
    }

    getBlock_getSensor2(){
        return{
            opcode: 'getSensor2',
            text: translate._getText( 'getSensor',this.locale),
            blockType: BlockType.REPORTER,
            arguments: {
                SENSOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputAnalogSensorTypes2',
                    defaultValue: 'sens_ntc'
                },
                INPUT: {
                    type: ArgumentType.NUMBER,
                    menu: 'inputID',
                    defaultValue: this.indefaultValue
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
                    defaultValue: this.indefaultValue
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
                    menu: 'motorID',
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

    getBlock_doSetLamp2 () {
        return{
            opcode: 'doSetLamp2',
            text: translate._getText( 'doSetLamp',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                OUTPUT: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: this.outputdefaultValue,
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
                    menu: 'motorID',
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

    getBlock_doSetOutput2(){
        return{
            opcode: 'doSetOutput2',
            text: translate._getText( 'doSetOutput',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                OUTPUT: {
                    type: ArgumentType.NUMBER,
                    menu: 'outputID',
                    defaultValue: this.outputdefaultValue
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
                    defaultValue: this.indefaultValue
                },
                MODE: {
                    type: ArgumentType.STRING,
                    menu: 'inputModes',
                    defaultValue: 'd10v'
                },
            }
        }
    }

    getBlock_doConfigureInput2(){
        return{
            opcode: 'doConfigureInput2',
            text: translate._getText( 'doConfigureInput',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                INPUT: {
                    type: ArgumentType.STRING,
                    menu: 'inputID',
                    defaultValue: this.indefaultValue
                },
                MODE: {
                    type: ArgumentType.STRING,
                    menu: 'inputModes2',
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
                    type: ArgumentType.NUMBER,
                    menu: 'motorID',
                    defaultValue: 0
                },
                SPEED: {
                    type: ArgumentType.NUMBER,
                    defaultValue: this.maxSpeed || 8,
                    minValue: 0,
                    maxValue: this.maxSpeed || 8
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
                    menu: 'motorID',
                    defaultValue: '0'
                },
                SPEED: {
                    type: ArgumentType.NUMBER,
                    defaultValue: this.maxSpeed || 8,
                    minValue: 0,
                    maxValue: this.maxSpeed || 8
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
                    menu: 'motorID',
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
                    menu: 'motorID',
                    defaultValue: '0'
                },
            }
        }
    }

    getBlock_doSetServoPosition(){
        return{
            opcode: 'doSetServoPosition',
            text: translate._getText( 'doSetServoPosition',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                SERVO_ID: {
                    type: ArgumentType.STRING,
                    menu: 'servoID',
                    defaultValue: this.servodefaultValue
                },
                POSITION: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0,
                    minValue: -8,
                    maxValue: 8
                }
            }
        }
    };

    getBlock_onCounter(){
        return{
            opcode: 'onCounter',
            text: translate._getText( 'onCounter',this.locale),
            blockType: BlockType.HAT,
            arguments: {
                COUNTER_ID: {
                    type: ArgumentType.NUMBER,
                    menu: 'counterID',
                    defaultValue: this.counterdefaultValue
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
    };
    getBlock_isCounter(){
        return{
            opcode: 'isCounter',
            text: translate._getText( 'isCounter',this.locale),
            blockType: BlockType.BOOLEAN,
            arguments: {
                COUNTER_ID: {
                    type: ArgumentType.NUMBER,
                    menu: 'counterID',
                    defaultValue: this.counterdefaultValue
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
    };

    getBlock_getCounter(){
        return{
            opcode: 'getCounter',
            text: translate._getText( 'getCounter',this.locale),
            blockType: BlockType.REPORTER,
            arguments: {
                COUNTER_ID: {
                    type: ArgumentType.NUMBER,
                    menu: 'counterID',
                    defaultValue: this.counterdefaultValue
                },
            }
        }
    };

    getBlock_doPlaySound(){
        return{
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
        }
    };

    getBlock_doPlaySoundWait(){
        return{
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
        }
    };

    getBlock_doPlaySound2(){
        return{
            opcode: 'doPlaySound2',
            text: translate._getText( 'doPlaySound2',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                SOUND_ID: {
                    type: ArgumentType.NUMBER,
                    menu: 'soundfiles',
                    defaultValue: '01_Airplane.wav'
                },
                LOOP: {
                    type: ArgumentType.BOOLEAN,
                    menu: 'LOOP',
                    defaultValue: 'no'
                }
            }
        }
    };

    getBlock_doStopSound(){
        return{
            opcode: 'doStopSound',
            text: translate._getText( 'doStopSound',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                //NUM: {
                //    type: ArgumentType.NUMBER,
                //    defaultValue: 1,
                //    maxValue: 29
                //}
            }
        }
    };

    getBlock_doResetCounter(){
        return{
            opcode: 'doResetCounter',
            text: translate._getText( 'doResetCounter',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                COUNTER_ID: {
                    type: ArgumentType.NUMBER,
                    menu: 'counterID',
                    defaultValue: this.counterdefaultValue
                },
            }
        }
    };

    getBlock_doSetMotorSpeedDirDist(){
        return{
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
        }
    };

    getBlock_doSetMotorSpeedDirSync(){
        return{
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
        }
    };
    getBlock_doSetMotorSpeedDirDistSync(){
        return{
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
        }
    };
    getBlock_doStopMotorAndReset(){
        return{
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
    };
    getBlock_setLed(){
        return{
            opcode: 'setLed',
            text: translate._getText('setLed',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                STATE: {
                    type: ArgumentType.NUMBER,
                    menu: 'ledState',
                    defaultValue: 0
                }
            }
        }
    };

    //Block functions
    onOpenClose2(args,controller){
        if(controller!=undefined &&controller.connected==true){

            if(controller.getvalWrite(parseInt(args.INPUT))!=0x0b && (args.SENSOR=='sens_button'||args.SENSOR=='sens_lightBarrier'||args.SENSOR=='sens_reed'||args.SENSOR=='sens_trail')){ // check if the mode has to be changed 
                controller.setchanging(parseInt(args.INPUT), true); //has to be changed 
            }
            //if (controller.getvalWrite(parseInt(args.INPUT))!=0x0a && args.SENSOR=='sens_trail'){
            //    controller.setchanging(parseInt(args.INPUT), true); // has to be changed 
            //} 
            if (controller.getchanging(parseInt(args.INPUT))==true){ // if something must be changed 
                controller.changeInMode (args) // change function automatically ensures no exceptions occur
                    if(controller.getnumruns(parseInt(args.INPUT))<100){ // if we run into any uexpected problems with the changing process 
                        controller.setnumruns(parseInt(args.INPUT),controller.getnumruns(parseInt(args.INPUT))+1);
                    }else{
                        controller.setnumruns(parseInt(args.INPUT),0); // restart the changing 
                        controller.setfuncstate(parseInt(args.INPUT),0);
                        controller.setchanging(parseInt(args.INPUT), false);
                    }
                return false;
            }else {// normal Hat function 
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
        }else{
            return false
        }
    }

    onOpenClose(args, controller) {
        if (controller && controller.connected) {
            const input = parseInt(args.INPUT);
            const currentMode = controller.getvalWrite(input);
    
            const sensorModeMap = {
                'sens_button': 0x0b,
                'sens_lightBarrier': 0x0b,
                'sens_reed': 0x0b,
                'sens_trail': 0x0b,
            };
    
            const targetMode = sensorModeMap[args.SENSOR];
    
            if (targetMode !== undefined && currentMode !== targetMode) {
                controller.setchanging(input, true);
            }
    
            if (controller.getchanging(input)) {
                controller.changeInMode({ ...args, TARGET_MODE: targetMode });
    
                if (controller.getnumruns(input) < 100) {
                    controller.setnumruns(input, controller.getnumruns(input) + 1);
                } else {
                    controller.setnumruns(input, 0);
                    controller.setfuncstate(input, 0);
                    controller.setchanging(input, false);
                }
    
                return false;
            } else {
                if (args.OPENCLOSE == 'closed') {
                    return controller.getvalIn(input) != 255;
                } else {
                    return controller.getvalIn(input) == 255;
                }
            }
        } else {
            return false;
        }
    }

    onInput(args, controller) {
        if (controller && controller.connected) {
            const input = parseInt(args.INPUT);
            const currentMode = controller.getvalWrite(input);
    
            const sensorModeMap = {
                'sens_color': 0x0a,
                'sens_ntc': 0x0b,
                'sens_photo': 0x0b,
                'sens_distance': 0x0c,
            };
    
            const targetMode = sensorModeMap[args.SENSOR];
    
            if (targetMode !== undefined && currentMode !== targetMode) {
                controller.setchanging(input, true);
            }
    
            if (controller.getchanging(input)) {
                controller.changeInMode({ ...args, TARGET_MODE: targetMode });
    
                if (controller.getnumruns(input) < 100) {
                    controller.setnumruns(input, controller.getnumruns(input) + 1);
                } else {
                    controller.setnumruns(input, 0);
                    controller.setfuncstate(input, 0);
                    controller.setchanging(input, false);
                }
    
                return false;
            } else {
                if (args.OPERATOR == '<') {
                    return controller.getvalIn(input) < args.VALUE;
                } else {
                    return controller.getvalIn(input) > args.VALUE;
                }
            }
        } else {
            return false;
        }
    }

    onInput2(args, controller) { // SENSOR, INPUT, OPERATOR, VALUE
        if(controller!=undefined &&controller.connected==true){
            if(controller.getvalWrite(parseInt(args.INPUT))!=0x0b && (args.SENSOR=='sens_ntc'||args.SENSOR=='sens_photo')){ // check if the mode has to be changed 
                controller.setchanging(parseInt(args.INPUT), true);
            }
            if (controller.getvalWrite(parseInt(args.INPUT))!=0x0a &&args.SENSOR=='sens_color'){
                controller.setchanging(parseInt(args.INPUT),true);
            }
            if (controller.getvalWrite(parseInt(args.INPUT))!=0x0c &&args.SENSOR=='sens_distance'){
                controller.setchanging(parseInt(args.INPUT),true);
            }
            if (controller.getchanging(parseInt(args.INPUT))==true){ // if something must be changed 
                controller.changeInMode(args)
                    if(controller.getnumruns(parseInt(args.INPUT))<100){ // if we run into any uexpected problems with the changing process 
                        controller.setnumruns(parseInt(args.INPUT), controller.getnumruns(parseInt(args.INPUT))+1);
                    }else{
                        controller.setnumruns(parseInt(args.INPUT), 0); // restart the changing 
                        controller.setfuncstate(parseInt(args.INPUT), 0);
                        controller.setchanging(parseInt(args.INPUT),false);	
                    }
                    return false;
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
        }else{
            return false
        }
    }

    getSensor(args, controller) {
        // SENSOR, INPUT
		//-->set input to right mode and read afterwards
        if(controller!=undefined &&controller.connected==true){ // make sure a controller is actually connected
            switch(args.SENSOR) {
                case 'sens_color':
                    controller.write_Value(parseInt(args.INPUT),0x0a);
                    break;
                case 'sens_ntc':
                    controller.write_Value(parseInt(args.INPUT),0x0b);
                    break;
                case 'sens_photo':
                    controller.write_Value(parseInt(args.INPUT),0x0b);
                    break;
                case 'sens_distance':
                    controller.write_Value(parseInt(args.INPUT),0x0c);
                    break;
            }
            return controller.getvalIn(parseInt(args.INPUT));
        }
        else{
            return 0
        }
    }

    isClosed(args, controller) {
        // SENSOR, INPUT
        if (controller && controller.connected) {
            const input = parseInt(args.INPUT);
    
            const sensorModeMap = {
                'sens_button': 0x0b,
                'sens_lightBarrier': 0x0b,
                'sens_reed': 0x0b,
                'sens_trail': 0x0b,
            };
    
            const targetMode = sensorModeMap[args.SENSOR];
    
            if (targetMode !== undefined && controller.getvalWrite(input) !== targetMode) {
                controller.write_Value(input, targetMode);
            }
    
            const x = controller.getvalIn(input);
            return x !== 255;
        } else {
            return false;
        }
    }

    isClosedoldnew(args, controller) {
        // SENSOR, INPUT
        if (controller && controller.connected) {
            const input = parseInt(args.INPUT);
            const currentMode = controller.getvalWrite(input);
    
            const sensorModeMap = {
                'sens_button': 0x0b,
                'sens_lightBarrier': 0x0b,
                'sens_reed': 0x0b,
                'sens_trail': 0x0b,
            };
    
            const targetMode = sensorModeMap[args.SENSOR];
    
            if (targetMode !== undefined && currentMode !== targetMode) {
                controller.setchanging(input, true);
            }
    
            if (controller.getchanging(input)) {
                controller.changeInMode({ ...args, TARGET_MODE: targetMode });
    
                if (controller.getnumruns(input) < 100) {
                    controller.setnumruns(input, controller.getnumruns(input) + 1);
                } else {
                    controller.setnumruns(input, 0);
                    controller.setfuncstate(input, 0);
                    controller.setchanging(input, false);
                }
                return false;
            }
    
            const x = controller.getvalIn(input);
            return x != 255;
        } else {
            return false;
        }
    }

    isClosed2(args,controller) {
        // SENSOR, INPUT
        if (controller != undefined && controller.connected == true) { // make sure a controller is actually connected
            if(controller.getvalWrite(parseInt(args.INPUT))!=0x0b && (args.SENSOR=='sens_button'||args.SENSOR=='sens_lightBarrier'||args.SENSOR=='sens_reed'||args.SENSOR=='sens_trail')){ // check if the mode has to be changed 
                controller.setchanging(parseInt(args.INPUT), true); //has to be changed 
            }
            //if (controller.getvalWrite(parseInt(args.INPUT))!=0x0a && args.SENSOR=='sens_trail'){
            //    controller.setchanging(parseInt(args.INPUT), true); // has to be changed 
            //} 
            if (controller.getchanging(parseInt(args.INPUT)) == true) { // if something must be changed
                controller.changeInMode(args);
                if (controller.getnumruns(parseInt(args.INPUT)) < 100) {
                    controller.setnumruns(parseInt(args.INPUT), controller.getnumruns(parseInt(args.INPUT)) + 1);
                } else {
                    controller.setnumruns(parseInt(args.INPUT), 0); // Restart changing process
                    controller.setfuncstate(parseInt(args.INPUT), 0);
                    controller.setchanging(parseInt(args.INPUT), false);
                }
                return false;
            }

            var x = controller.getvalIn(parseInt(args.INPUT));
            return x != 255; // Return true if the input is not 255 (closed), false if it is
        } else {
            return false;
        }
    }

    doSetLamp(args,controller){
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.OUTPUT), args.NUM*15.875); //*(-1) deleted because nearly all controller have problems with it
        }   
    }

    doSetOutput(args,controller) {
        if(controller!=undefined &&controller.connected==true){          
            controller.write_Value(parseInt(args.OUTPUT), args.NUM*15.875); //*(-1) deleted because nearly all controller have problems with it
        }
    }

    doConfigureInput(args,controller) { 
        //if(controller!=undefined &&controller.connected==true){    
        //    if(args.MODE=='d10v'||args.MODE=='a10v'){
        //        controller.write_Value(parseInt(args.INPUT), 0x0a);
        //    }else{
        //        controller.write_Value(parseInt(args.INPUT), 0x0b);
        //    }
        //}
        if (controller != undefined && controller.connected == true) {    
            if (args.MODE === 'd10v' || args.MODE === 'a10v') {
                controller.write_Value(parseInt(args.INPUT), 0x0a);
            } else if (args.MODE === 'd5k' || args.MODE === 'a5k') {
                controller.write_Value(parseInt(args.INPUT), 0x0b);
            } else if (args.MODE === 'ultrasonic') {
                controller.write_Value(parseInt(args.INPUT), 0x0c);
            } else {
                console.log("unknown mode");
            }
        }
    }

    doSetMotorSpeed(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875); //*(-1) deleted because nearly all controller have problems with it
        }
    }

    doSetMotorSpeedDir(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875*parseInt(args.DIRECTION));
        } 
    }

    doSetMotorDir(args,controller) { 
        if(controller!=undefined &&controller.connected==true){
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
    }

    doStopMotor(args,controller) {
        if(controller!=undefined &&controller.connected==true){    
            controller.write_Value(parseInt(args.MOTOR_ID), 0)
        }
    }

    doSetServoPosition(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.SERVO_ID), args.POSITION*15.875);
        }
    }

    onCounter(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            if(args.OPERATOR=='<'){
                return controller.getvalIn(parseInt(args.COUNTER_ID))<args.VALUE
            }else{
                return controller.getvalIn(parseInt(args.COUNTER_ID))>args.VALUE
            }
        }
    }

    getCounter(args,controller) {     
        if(controller!=undefined &&controller.connected==true){
            return controller.getvalIn(parseInt(args.COUNTER_ID))
        }
    }

    isCounter(args,controller) {      
        if(controller!=undefined &&controller.connected==true){
            if(args.OPERATOR=='<'){
                return controller.getvalIn(parseInt(args.COUNTER_ID))<args.VALUE
            }else{
                return controller.getvalIn(parseInt(args.COUNTER_ID))>args.VALUE
            }
        }
    }

    doPlaySound(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(30, args.NUM);
        }
    }

    doPlaySoundWait(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(33, args.NUM);
        }
    }

    doPlaySound2(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            if(args.LOOP=='yes'){
                controller.write_Value(30, args.SOUND_ID);
            }else{
                controller.write_Value(31, args.SOUND_ID);
            }
        }
    }

    doStopSound(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(32, args.NUM);
        }
    }

    doResetCounter(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.COUNTER_ID),0)
        }
    }

    doSetMotorSpeedDirDist(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            const SPEED_FACTOR = 15.875;
            const motorId = parseInt(args.MOTOR_ID);
            const direction = parseInt(args.DIRECTION);
            const steps = parseInt(args.STEPS);
            const speed = parseFloat(args.SPEED);
            const scaledSpeed = speed * SPEED_FACTOR * direction;
            const c = motorId + this.indIn + this.indOut + this.indServo;
        
            // initialize tracking storage
            if (!controller._activeMoves) {
                controller._activeMoves = {};
            }
        
            //console.log(controller.getvalIn(motorId + this.indIn + this.indOut + this.indServo))
            // start new move
            const startPos = controller.getvalIn(c);
            controller._activeMoves[motorId] = {
                startPos: startPos,
                targetSteps: Math.abs(steps),
                running: true
            };
        
            //console.log(`[Motor ${motorId+1}] StartPos=${startPos}, TargetSteps=${steps}, Dir=${direction}`);
        
            const check = () => {
                const move = controller._activeMoves[motorId];
        
                // If the move was stopped or deleted
                if (!move || !move.running) return;
        
                const currentPos = controller.getvalIn(c);
                const distanceTravelled = Math.abs(currentPos - move.startPos);
        
                if (distanceTravelled >= move.targetSteps) {
                    controller.write_Value(motorId, 0);
                    controller._activeMoves[motorId].running = false;
                    //console.log(`[Motor ${motorId}] Ziel erreicht. Motor gestoppt.`);
                } else {
                    setTimeout(check, 50);
                }
            };
        
            controller.write_Value(motorId, scaledSpeed);
            setTimeout(check, 50);
        }
    }

    doSetMotorSpeedDirSync(args,controller) {// not working properly yet, most likely an issue with not writing fast enough
        console.log("doSetMotorSpeedDirSync")
        console.log(args.MOTOR_ID)
        console.log(args.MOTOR_ID2)
        console.log(args.DIRECTION)
        console.log(args.DIRECTION2)
        console.log(args.SPEED)
        args.indIn=this.indIn
        args.indOut=this.indOut
        args.indServo=this.indServo
        // possible correction: check last storage entry as well 
        if(controller!=undefined &&controller.connected==true){
            controll_motor_syncronosation(args, controller, undefined, undefined)
        }
    }

    doSetMotorSpeedDirDistSync(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            const SPEED_FACTOR = 15.875;
            const motorId1 = parseInt(args.MOTOR_ID);
            const motorId2 = parseInt(args.MOTOR_ID2);
            const dir1 = parseInt(args.DIRECTION);
            const dir2 = parseInt(args.DIRECTION2);
            const steps = Math.abs(parseInt(args.STEPS));
            const speed = parseFloat(args.SPEED);
            const scaledSpeed1 = speed * SPEED_FACTOR * dir1;
            const scaledSpeed2 = speed * SPEED_FACTOR * dir2;
            const c1 = motorId1 + this.indIn + this.indOut + this.indServo;
            const c2 = motorId2 + this.indIn + this.indOut + this.indServo;
        
            if (!controller._activeMoves) {
                controller._activeMoves = {};
            }
        
            const startPos1 = controller.getvalIn(c1);
            const startPos2 = controller.getvalIn(c2);
        
            controller._activeMoves[motorId1] = {
                startPos: startPos1,
                targetSteps: steps,
                running: true
            };
        
            controller._activeMoves[motorId2] = {
                startPos: startPos2,
                targetSteps: steps,
                running: true
            };
        
            //console.log(`[Motor ${motorId1}] StartPos=${startPos1}, TargetSteps=${steps}, Dir=${dir1}`);
            //console.log(`[Motor ${motorId2}] StartPos=${startPos2}, TargetSteps=${steps}, Dir=${dir2}`);
        
            const check = () => {
                const move1 = controller._activeMoves[motorId1];
                const move2 = controller._activeMoves[motorId2];
        
                const pos1 = controller.getvalIn(c1);
                const pos2 = controller.getvalIn(c2);
        
                if (move1?.running) {
                    const dist1 = Math.abs(pos1 - move1.startPos);
                    if (dist1 >= move1.targetSteps) {
                        controller.write_Value(motorId1, 0);
                        controller._activeMoves[motorId1].running = false;
                        //console.log(`[Motor ${motorId1}] Ziel erreicht. Motor gestoppt.`);
                    }
                }
        
                if (move2?.running) {
                    const dist2 = Math.abs(pos2 - move2.startPos);
                    if (dist2 >= move2.targetSteps) {
                        controller.write_Value(motorId2, 0);
                        controller._activeMoves[motorId2].running = false;
                        //console.log(`[Motor ${motorId2}] Ziel erreicht. Motor gestoppt.`);
                    }
                }
        
                if (controller._activeMoves[motorId1]?.running || controller._activeMoves[motorId2]?.running) {
                    setTimeout(check, 50);
                }
            };
        
            controller.write_Value(motorId1, scaledSpeed1);
            controller.write_Value(motorId2, scaledSpeed2);
            setTimeout(check, 50);
        }
    }
    
    doStopMotorAndReset(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.MOTOR_ID), 0)
            setTimeout(x=>{
                controller.write_Value(parseInt(args.MOTOR_ID)+this.indIn+this.indOut+this.indServo, 0)
            },200)
        }
    }

    setLed(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            if(args.STATE=='1'){ // orange or turn on LED
                controller.write_Value(34, 1);
            }else if(args.STATE=='0'){ // blue or turn off LED
                controller.write_Value(34, 0);
            }
        }
    }
}


module.exports = Block;

// shared functions by all blocks which are not connectiontype specific: 
function controll_motor_syncronosation(args, controller, lastcomm1, lastcomm2){
    var c1 = parseInt(args.MOTOR_ID) + args.indIn + args.indOut + args.indServo
    var c2 = parseInt(args.MOTOR_ID2) + args.indIn + args.indOut + args.indServo
    if(lastcomm1!=undefined&&lastcomm2!=undefined){
        if (controller.getvalWrite(parseInt(args.MOTOR_ID))==lastcomm1&&controller.getvalWrite(parseInt(args.MOTOR_ID2))==lastcomm2){
            var diff = Math.floor((controller.getvalIn(c1)-controller.getvalIn(c2))/100)
            var val1
            var val2
            if(diff>=0){
                controller.write_Value(parseInt(args.MOTOR_ID2), args.SPEED*15.875*parseInt(args.DIRECTION))
                val2=args.SPEED*15.875*parseInt(args.DIRECTION)
                if(args.SPEED-diff>=0){
                    controller.write_Value(parseInt(args.MOTOR_ID), (args.SPEED-diff)*15.875*parseInt(args.DIRECTION))
                    val1= (args.SPEED-diff)*15.875*parseInt(args.DIRECTION)
                }else{
                    controller.write_Value(parseInt(args.MOTOR_ID), 0)
                    val1= 0
                }
            }else{
                controller.write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875*parseInt(args.DIRECTION))
                val1= args.SPEED*15.875*parseInt(args.DIRECTION)
                if(args.SPEED+diff>=0){
                    controller.write_Value(parseInt(args.MOTOR_ID2), (args.SPEED+diff)*15.875*parseInt(args.DIRECTION))
                    val2=(args.SPEED+diff)*15.875*parseInt(args.DIRECTION)
                }else{
                    controller.write_Value(parseInt(args.MOTOR_ID2), 0)
                    val2=0
                }
            }
            setTimeout(x=>{
                controll_motor_syncronosation(args,controller, val1, val2)
            },200)
        }else{
            console.log(controller.getstor(0))
        }
    }else{
        controller.write_Value(c1,0)
        controller.write_Value(c2,0)
        controller.write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875*parseInt(args.DIRECTION))
        controller.write_Value(parseInt(args.MOTOR_ID2), args.SPEED*15.875*parseInt(args.DIRECTION))
        setTimeout(x=>{
            controll_motor_syncronosation(args,controller, args.SPEED*15.875*parseInt(args.DIRECTION), args.SPEED*15.875*parseInt(args.DIRECTION))
        },200)
    }
}
