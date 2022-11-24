const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

class Block {
	constructor (runtime) {
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
	
	getMenu () {
		return {
			 text: "OFF", value: "o1"
		};
		
	};

}


module.exports = Block;
