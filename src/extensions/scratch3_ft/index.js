/*
  scratch3_ft/index.js
*/

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,xyz'

/**
 * Class for the ftDuino blocks in Scratch 3.0
 * @constructor
 */

const EXTENSION_ID = 'ft';

class Scratch3FtBlocks {

    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

	// this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: EXTENSION_ID,
            name: 'fischertechnik',
            blockIconURI: blockIconURI,
	    docsURI: 'https://technika-karlsruhe.github.io/',
	    blocks: [
		{
		    opcode: 'output',
		    text: 'output [OUTPUT] [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        OUTPUT: {
                            type: ArgumentType.STRING,
                            menu: 'OUTPUT',
                            defaultValue: 'o1'
                        },
			VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'ONOFFSTATE',
                            defaultValue: '1'
                        }
                    }
		}
            ],
            menus: {
                ONOFFSTATE: [
		    { text: 'On',  value: '1' },
		    { text: 'Off', value: '0' }
		],
                OUTPUT: [
		    {text: 'O1', value: 'o1'}, {text: 'O2', value: 'o2'},
		    {text: 'O3', value: 'o3'}, {text: 'O4', value: 'o4'},
		    {text: 'O5', value: 'o5'}, {text: 'O6', value: 'o6'},
		    {text: 'O7', value: 'o7'}, {text: 'O8', value: 'o8'}
                ]
	    }		
        };
    }

    output (args, util) {
	console.log("OUTPUT", args, util);
	return 1;
    }
}

module.exports = Scratch3FtBlocks;
