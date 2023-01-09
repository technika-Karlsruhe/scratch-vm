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
	},
    ColorSensor: {
        'en':'color sensor',
        'de':'Farbsensor'
    },
    NTCResistor:{
        'en': 'NTC resistor',
        'de': 'NTC Widerstand'
    },
    PhotoResistor: {
        'en':'photo resistor',
        'de':'Fotowiderstand'
    }, 
    Button: {
        'en':'button',
        'de':'Taster'
    },
    Lightbarrier: {
        'en':'lightbarrier',
        'de':'Lichtschranke'
    },
    Reedcontact: {
        'en':'reedcontact',
        'de':'Reedkontakt'
    },
    TrailSensor:{
        'en':'trail sensor',
        'de':'Spursensor'
    }, 
    Open:{
        'en':'open',
        'de':'offen'
    }, 
    Closed: {
        'en':'closed',
        'de':'geschlossen'
    },
    Forward: {
        'en':'forward',
        'de':'Vorwärts'
    }, 
    Backwards: {
        'en':'backwards',
        'de':'Rückwärts'
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