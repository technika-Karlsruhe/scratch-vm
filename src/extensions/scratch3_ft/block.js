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

    
	getBlock () {
        
		 return{ opcode: 'output',
		    text: 'set [OUTPUT] [VALUE] [NAME]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        OUTPUT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'o1'
                        },
			VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'ONOFFSTATE',
                            defaultValue: '2'
                        },
            NAME: {
						type: ArgumentType.STRING,
						defaultValue: '2'
                        }
                        
                    }
                };
	};
    getBlock_setLamp () {
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
	getMenu_OutputID () {
        return{
            outputID: [
            {text: 'O1', value: 'o1'} ,
            {text: 'O2', value: 'o2'}
            ]
        };
    }
	getMenu () {
		return {
			 text: "OFF", value: "o1"
            
		};
		
	};
    
}


module.exports = Block;
