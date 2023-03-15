const formatMessage = require('format-message');
const message = { // translations en/ger
	Digitalvoltage: {
		'en': 'digital voltage',
		'de': 'digitale Spannung'
	},
	Digitalresistance: {
		'en': 'digital resistance',
		'de': 'digitaler Widerstand',
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
        'en':'opens',
        'de':'öffnet'
    }, 
    Closed: {
        'en':'closes',
        'de':'schließt'
    },
    Forward: {
        'en':'forward',
        'de':'Vorwärts'
    }, 
    Backwards: {
        'en':'backwards',
        'de':'Rückwärts'
    },
    onOpenClose: {
        'en':'If [SENSOR] [INPUT] [OPENCLOSE]',
        'de':'Wenn [SENSOR] [INPUT] [OPENCLOSE]'
    },
    onInput: {
        'en':'If value of [SENSOR] [INPUT] [OPERATOR] [VALUE]',
        'de':'Wenn der Wert [SENSOR] [INPUT] [OPERATOR] [VALUE]',
    },
    getSensor: {
        'en':'Read value of [SENSOR] [INPUT]',
        'de':'Lese Wert von [SENSOR] [INPUT]'
    }, 
    isClosed: {
        'en': 'Is [SENSOR] [INPUT] closed?',
        'de': 'Ist [SENSOR] [INPUT] geschlossen?'
    },
    doSetLamp: {
        'en':'Set lamp [OUTPUT] to [NUM]',
        'de':'Setze Lampe [OUTPUT] auf [NUM]',
    }, 
    doSetOutput: {
        'en':'Set output [OUTPUT] to [NUM]',
        'de':'Setze Ausgang [OUTPUT] auf [NUM]',
    }, 
    doConfigureInput: {
        'en':'Set input [INPUT] to [MODE]',
        'de':'Setze Eingang [INPUT] auf [MODE]'
    }, 
    doSetMotorSpeed: {
        'en':'Set motor [MOTOR_ID] to [SPEED]',
        'de':'Setze Motor [MOTOR_ID] auf [SPEED]'
    },
    doSetMotorSpeedDir: {
        'en':'Set motor [MOTOR_ID] to [SPEED] [DIRECTION]',
        'de':'Setze Motor [MOTOR_ID] auf [SPEED] [DIRECTION]'
    },
    doSetMotorDir: {
        'en':'Set motor [MOTOR_ID] to [DIRECTION]',
        'de':'Setze Motor [MOTOR_ID] auf [DIRECTION]'
    },
    doStopMotor: {
        'en':'Stop motor [MOTOR_ID]',
        'de':'Stoppe Motor [MOTOR_ID]',
    },

    //alerts and notifications
    connect: {
        'en':'Do you want to connect via USB or BT?',
        'de':'Willst du dich über USB oder BT verbinden?'
    },
    cancel: {
        'en':'Cancel',
        'de':'Abbrechen'
    },
    connected: {
        'en':'The controller is connected',
        'de':'Der Controller ist verbunden'
    },
    start: {
        'en':'You can start now',
        'de':'Du kannst nun starten'
    },
    disconnected: {
        'en':'The controller is disconnected',
        'de':'Der Controller ist getrennt'
    },
    reconnect: {
        'en':'try reconnecting by clicking the connect button in the right upper corner',
        'de':'Versuche, die Verbindung erneut herzustellen, indem du auf die Schaltfläche „Verbinden“ in der rechten oberen Ecke klickst'
    },
    range: {
        'en':'Output values range from 0 to 8',
        'de':'Ausgangswerte reichen von 0 bis 8'
    },
    maximum: {
        'en':'keep in mind that the maximum output value is 8',
        'de':'denke daran, dass der maximale Ausgangswert 8 ist'
    },

};

class Translation {
	constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
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