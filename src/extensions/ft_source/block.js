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

    defaultValue(outInt, inInt, servoInt){ // set default values for the number of inputs, outputs and servos
        indefaultValue = outInt; // default value for input menu
        servodefaultValue = outInt+inInt; // default value for servo menu
        outputdefaultValue = outInt/3; // default value for output menu
        counterdefaultvalue=servodefaultValue+servoInt
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
                    defaultValue: indefaultValue
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
                    defaultValue: indefaultValue
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
                    defaultValue: indefaultValue
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
                    defaultValue: indefaultValue
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
                    defaultValue: indefaultValue
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
                    defaultValue: indefaultValue
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

    getBlock_dosetLamp2 () {
        return{
            opcode: 'doSetLamp2',
            text: translate._getText( 'doSetLamp',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                OUTPUT: {
                    type: ArgumentType.STRING,
                    menu: 'outputID',
                    defaultValue: outputdefaultValue,
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
                    defaultValue: outputdefaultValue
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
                    defaultValue: indefaultValue
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
                    defaultValue: servodefaultValue
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
                    defaultValue: counterdefaultvalue
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
                    defaultValue: counterdefaultvalue
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
                    defaultValue: counterdefaultvalue
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

    getBlock_doResetCounter(){
        return{
            opcode: 'doResetCounter',
            text: translate._getText( 'doResetCounter',this.locale),
            blockType: BlockType.COMMAND,
            arguments: {
                COUNTER_ID: {
                    type: ArgumentType.NUMBER,
                    menu: 'counterID',
                    defaultValue: counterdefaultvalue
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

    //Block functions
    onOpenClose(args,controller){
        if(controller!=undefined &&controller.connected==true){

            if(controller.getvalWrite(parseInt(args.INPUT))!=0x0b && (args.SENSOR=='sens_button'||args.SENSOR=='sens_lightBarrier'||args.SENSOR=='sens_reed')){ // check if the mode has to be changed 
                controller.setchanging(parseInt(args.INPUT), true); //has to be changed 
            }
            if (controller.getvalWrite(parseInt(args.INPUT))!=0x0a && args.SENSOR=='sens_trail'){
                controller.setchanging(parseInt(args.INPUT), true); // has to be changed 
            } 
            
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

    onInput(args, controller) { // SENSOR, INPUT, OPERATOR, VALUE
        if(controller!=undefined &&controller.connected==true){
            if(controller.getvalWrite(parseInt(args.INPUT))!=0x0b && (args.SENSOR=='sens_ntc'||args.SENSOR=='sens_photo')){ // check if the mode has to be changed 
                controller.setchanging(parseInt(args.INPUT), true);
            }
            if (controller.getvalWrite(parseInt(args.INPUT))!=0x0a &&args.SENSOR=='sens_color'){
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
		//needs change I mode 
        if(controller!=undefined &&controller.connected==true){ // make sure a controller is actually connected
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
        else{
            return 0
        }
    }

    isClosed(args,controller) { // --> benötigt noch eine changeIMode funktion 
            // SENSOR, INPUT
        if(controller!=undefined &&controller.connected==true){ // make sure a controller is actually connected
            var x=controller.getvalIn(parseInt(args.INPUT))	
            return x!=255
        }else{
            return false
        }
    }

    doSetLamp(args,controller){
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.OUTPUT), args.NUM*15.875*(-1));
        }   
    }

    doSetOutput(args,controller) {
        if(controller!=undefined &&controller.connected==true){          
            controller.write_Value(parseInt(args.OUTPUT), args.NUM*15.875*(-1));
        }
    }
    doConfigureInput(args,controller) { 
        if(controller!=undefined &&controller.connected==true){    
            if(args.MODE=='d10v'||args.MODE=='a10v'){
                controller.write_Value(parseInt(args.INPUT), 0x0a);
            }else{
                controller.write_Value(parseInt(args.INPUT), 0x0b);
            }
        }
    }
    doSetMotorSpeed(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875*(-1));
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
 
    }

    doPlaySoundWait(args,controller) {

    }

    doResetCounter(args,controller) {
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.COUNTER_ID),0)
        }
    }

    doSetMotorSpeedDirDist(args,controller) {

    }

    doSetMotorSpeedDirSync(args,controller) {// not working properly yet, most likely an issue with not writing fast enough
        // possible correction: check last storage entry as well 
        if(controller!=undefined &&controller.connected==true){
            controll_motor_syncronosation(args,controller, undefined, undefined)
        }
    }

    doSetMotorSpeedDirDistSync(args,controller) {

    }
    
    doStopMotorAndReset(args,controller) {//useless
        if(controller!=undefined &&controller.connected==true){
            controller.write_Value(parseInt(args.MOTOR_ID), 0)
            setTimeout(x=>{
                controller.write_Value(parseInt(args.MOTOR_ID)+type.indIn+ type.indOut +type.indServo,0)
            },200)
        }
    }
}


module.exports = Block;

// shared functions by all blocks which are not connectiontype specific: 
function controll_motor_syncronosation(args,controller, lastcomm1, lastcomm2){
    var c1= parseInt(args.MOTOR_ID)+ type.indIn+ type.indOut +type.indServo
    var c2= parseInt(args.MOTOR_ID2)+ type.indIn+ type.indOut +type.indServo
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
            controll_motor_syncronosation(args,controller,  args.SPEED*15.875*parseInt(args.DIRECTION),  args.SPEED*15.875*parseInt(args.DIRECTION))
        },200)
    }
}
