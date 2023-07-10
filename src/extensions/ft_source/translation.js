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
    Ultrasonic:{
        'en':'Ultrasonic',
		'de':'Ultraschall' 
    },
    ColorSensor: {
        'en':'color sensor',
        'de':'Farbsensor'
    },
    DistanceSensor:{
        'en': 'distance sensor',
        'de': 'Abstandssensor'
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
    doSetServoPosition: {
        'en':'Set servo [SERVO_ID] to [POSITION]',
        'de':'Setze Servo [SERVO_ID] auf [POSITION]'
    },
    onCounter: {
        'en':'If counter [COUNTER_ID] [OPERATOR] [VALUE]',
        'de':'Wenn Zähler [COUNTER_ID] [OPERATOR] [VALUE]'
    },
    getCounter: {
        'en':'Get value of counter [COUNTER_ID]',
        'de':'Lese Wert von Zähler [COUNTER_ID]'
    },
    isCounter: {
        'en':'Is counter [COUNTER_ID] [OPERATOR] [VALUE]',
        'de':'Ist Zähler [COUNTER_ID] [OPERATOR] [VALUE]'
    },
    doPlaySound: {
        'en':'Play sound [NUM]',
        'de':'Spiele Sound [NUM]'
    },
    doPlaySoundWait: {
        'en':'Play sound [NUM] and wait',
        'de':'Spiele Sound [NUM] und warte'
    },
    doResetCounter: {
        'en':'Reset counter [COUNTER_ID]',
        'de':'Setze Zähler [COUNTER_ID] zurück'
    },
    doSetMotorSpeedDirDist: {
        'en':'Move motor [MOTOR_ID] by [STEPS] steps with [SPEED] [DIRECTION]',
        'de':'Bewege Motor [MOTOR_ID] um [STEPS] Schritte mit [SPEED] [DIRECTION]'
    },
    doSetMotorSpeedDirSync: {
        'en':'Move motor [MOTOR_ID] [DIRECTION] and [MOTOR_ID2] [DIRECTION2] with [SPEED]',
        'de':'Bewege Motor [MOTOR_ID] [DIRECTION] und [MOTOR_ID2] [DIRECTION2] mit [SPEED]'
    },
    doSetMotorSpeedDirDistSync: {
        'en':'Move motor [MOTOR_ID] [DIRECTION] and [MOTOR_ID2] [DIRECTION2] by [STEPS] steps with [SPEED]',
        'de':'Bewege Motor [MOTOR_ID] [DIRECTION] und [MOTOR_ID2] [DIRECTION2] um [STEPS] Schritte mit [SPEED]'
    },
    doStopMotorAndReset: {
        'en':'Reset [MOTOR_ID]',
        'de':'Setze [MOTOR_ID] zurück'
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
    driver: {
        'en':'The driver is not installed',
        'de':'Der Treiber ist nicht installiert'
    },
    install: {
        'en':'Please install the driver first',
        'de':'Bitte installiere zuerst den Treiber'
    },
    connectbutton: {
        'en':'Connect',
        'de':'Verbinden'
    },
    usbnotsupport: {
        'en':'The Device is not supported via USB, because it does not have a USB port.',
        'de':'Das Gerät wird nicht per USB unterstützt, da dieses keinen USB Anschluss hat.'
    },
    btnotsupport: {
        'en':'The Device is not supported via Bluetooth, because it does not have a Bluetooth module.',
        'de':'Das Gerät wird nicht per Bluetooth unterstützt, da dieses kein Bluetooth Modul hat.'
    }

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