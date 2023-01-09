const formatMessage = require('format-message');
const message = { // translations en/ger
	Digitalvoltage: {
		'en': 'digital voltage',
		'de': 'digitale Spannung'
	},
	Digitalresistance: {
		'en': 'digital resistance',
		'de': 'digitale Spannung',
	},
	Analoguevoltage: {
		'en':'analogue voltage',
		'de':'analoge Spannung'
	},
	Analogueresistance: {
		'en':'analogue resistance',
		'de':'analoger Widerstand' 
	}

};
class Translation {
	constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }
    setup(){// gain access to scratch language menu
        const currentLocale = formatMessage.setup().locale;
        if (Object.keys(message).filter((key) => {return currentLocale in message[key]}).length > 0) {
            this.locale = currentLocale;
        } else {
            this.locale = 'en';
        }
    }
    _getText (key) {// return translation
        return message[key][this.locale] || message[key]['en'];
    }
}


module.exports = Translation;