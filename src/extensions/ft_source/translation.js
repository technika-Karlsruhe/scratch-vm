const formatMessage = require('format-message');
const { LOOP } = require('../../extension-support/block-type');
const message = { // translations en/ger
	Digitalvoltage: {
		'en': 'digital voltage',
		'de': 'digitale Spannung',
        'fr': 'tension numérique'
	},
	Digitalresistance: {
		'en': 'digital resistance',
		'de': 'digitaler Widerstand',
        'fr': 'résistance numérique'
	},
	Analoguevoltage: {
		'en':'analogue voltage',
		'de':'analoge Spannung',
        'fr': 'tension analogique'
	},
	Analogueresistance: {
		'en':'analogue resistance',
		'de':'analoger Widerstand',
        'fr': 'résistance analogique'
	},
    Ultrasonic:{
        'en':'Ultrasonic',
		'de':'Ultraschall',
        'fr': 'ultrason'
    },
    ColorSensor: {
        'en':'color sensor',
        'de':'Farbsensor',
        'fr': 'capteur de couleur'
    },
    DistanceSensor:{
        'en': 'distance sensor',
        'de': 'Abstandssensor',
        'fr': 'capteur de distance'
    },
    NTCResistor:{
        'en': 'NTC resistor',
        'de': 'NTC Widerstand',
        'fr': 'résistance NTC'
    },
    PhotoResistor: {
        'en':'photo resistor',
        'de':'Fotowiderstand',
        'fr': 'résistance photo'
    }, 
    DistanceSensor: {
        'en':'distance sensor',
        'de':'Abstandssensor',
        'fr': 'capteur de distance'
    },
    Button: {
        'en':'button',
        'de':'Taster',
        'fr': 'bouton'
    },
    Lightbarrier: {
        'en':'lightbarrier',
        'de':'Lichtschranke',
        'fr': 'barrière lumineuse'
    },
    Reedcontact: {
        'en':'reedcontact',
        'de':'Reedkontakt',
        'fr': 'contact reed'
    },
    TrailSensor:{
        'en':'trail sensor',
        'de':'Spursensor',
        'fr': 'capteur de piste'
    }, 
    Open:{
        'en':'opens',
        'de':'öffnet',
        'fr': 'ouvre'
    }, 
    Closed: {
        'en':'closes',
        'de':'schließt',
        'fr': 'ferme'
    },
    Forward: {
        'en':'forward',
        'de':'Vorwärts',
        'fr': 'avant'
    }, 
    Backwards: {
        'en':'backwards',
        'de':'Rückwärts',
        'fr': 'arrière'
    },
    yes: {
        'en':'yes',
        'de':'ja',
        'fr': 'oui'
    },
    no: {
        'en':'no',
        'de':'nein',
        'fr': 'non'
    },
    on: {
        'en':'on',
        'de':'an',
        'fr': 'sur'
    },
    off: {
        'en':'off',
        'de':'aus',
        'fr': 'désactivé'
    },
    blue: {
        'en':'blue',
        'de':'blau',
        'fr': 'bleu'
    },
    orange: {
        'en':'orange',
        'de':'orange',
        'fr': 'orange'
    },
    onOpenClose: {
        'en':'If [SENSOR] [INPUT] [OPENCLOSE]',
        'de':'Wenn [SENSOR] [INPUT] [OPENCLOSE]',
        'fr': 'Si [SENSOR] [INPUT] [OPENCLOSE]'
    },
    onInput: {
        'en':'If value of [SENSOR] [INPUT] [OPERATOR] [VALUE]',
        'de':'Wenn der Wert [SENSOR] [INPUT] [OPERATOR] [VALUE]',
        'fr': 'Si la valeur de [SENSOR] [INPUT] [OPERATOR] [VALUE]'
    },
    getSensor: {
        'en':'Read value of [SENSOR] [INPUT]',
        'de':'Lese Wert von [SENSOR] [INPUT]',
        'fr': 'Lire la valeur de [SENSOR] [INPUT]'
    }, 
    isClosed: {
        'en': 'Is [SENSOR] [INPUT] closed?',
        'de': 'Ist [SENSOR] [INPUT] geschlossen?',
        'fr': 'Est-ce que [SENSOR] [INPUT] est fermé ?'
    },
    doSetLamp: {
        'en':'Set lamp [OUTPUT] to [NUM]',
        'de':'Setze Lampe [OUTPUT] auf [NUM]',
        'fr': 'Mettre la lampe [OUTPUT] à [NUM]'
    }, 
    doSetOutput: {
        'en':'Set output [OUTPUT] to [NUM]',
        'de':'Setze Ausgang [OUTPUT] auf [NUM]',
        'fr': 'Mettre la sortie [OUTPUT] à [NUM]'
    }, 
    doConfigureInput: {
        'en':'Set input [INPUT] to [MODE]',
        'de':'Setze Eingang [INPUT] auf [MODE]',
        'fr': 'Configurer l’entrée [INPUT] en [MODE]'
    }, 
    doSetMotorSpeed: {
        'en':'Set motor [MOTOR_ID] to [SPEED]',
        'de':'Setze Motor [MOTOR_ID] auf [SPEED]',
        'fr': 'Mettre le moteur [MOTOR_ID] à [SPEED]'
    },
    doSetMotorSpeedDir: {
        'en':'Set motor [MOTOR_ID] to [SPEED] [DIRECTION]',
        'de':'Setze Motor [MOTOR_ID] auf [SPEED] [DIRECTION]',
        'fr': 'Mettre le moteur [MOTOR_ID] à [SPEED] [DIRECTION]'
    },
    doSetMotorDir: {
        'en':'Set motor [MOTOR_ID] to [DIRECTION]',
        'de':'Setze Motor [MOTOR_ID] auf [DIRECTION]',
        'fr': 'Mettre le moteur [MOTOR_ID] à [DIRECTION]'
    },
    doStopMotor: {
        'en':'Stop motor [MOTOR_ID]',
        'de':'Stoppe Motor [MOTOR_ID]',
        'fr': 'Arrêter le moteur [MOTOR_ID]'
    },
    doSetServoPosition: {
        'en':'Set servo [SERVO_ID] to [POSITION]',
        'de':'Setze Servo [SERVO_ID] auf [POSITION]',
        'fr': 'Mettre le servo [SERVO_ID] à [POSITION]'
    },
    onCounter: {
        'en':'If counter [COUNTER_ID] [OPERATOR] [VALUE]',
        'de':'Wenn Zähler [COUNTER_ID] [OPERATOR] [VALUE]',
        'fr': 'Si le compteur [COUNTER_ID] [OPERATOR] [VALUE]'
    },
    getCounter: {
        'en':'Get value of counter [COUNTER_ID]',
        'de':'Lese Wert von Zähler [COUNTER_ID]',
        'fr': 'Lire la valeur du compteur [COUNTER_ID]'
    },
    isCounter: {
        'en':'Is counter [COUNTER_ID] [OPERATOR] [VALUE]',
        'de':'Ist Zähler [COUNTER_ID] [OPERATOR] [VALUE]',
        'fr': 'Le compteur [COUNTER_ID] est-il [OPERATOR] [VALUE] ?'
    },
    doPlaySound: {
        'en':'Play sound [NUM]',
        'de':'Spiele Sound [NUM]',
        'fr': 'Jouer le son [NUM]'
    },
    doPlaySoundWait: {
        'en':'Play sound [NUM] and wait',
        'de':'Spiele Sound [NUM] und warte',
        'fr': 'Jouer le son [NUM] et attendre'
    },
    doPlaySound2: {
        'en':'Play sound [SOUND_ID] Loop [LOOP]',
        'de':'Spiele Sound [SOUND_ID] Wiederholen [LOOP]',
        'fr': 'Jouer le son [SOUND_ID] en boucle [LOOP]'
    },
    doStopSound: {
        'en':'Stop sound',
        'de':'Stoppe Sound',
        'fr': 'Arrêter le son'
    },
    doResetCounter: {
        'en':'Reset counter [COUNTER_ID]',
        'de':'Setze Zähler [COUNTER_ID] zurück',
        'fr': 'Réinitialiser le compteur [COUNTER_ID]'
    },
    doSetMotorSpeedDirDist: {
        'en':'Move motor [MOTOR_ID] by [STEPS] steps with [SPEED] [DIRECTION]',
        'de':'Bewege Motor [MOTOR_ID] um [STEPS] Schritte mit [SPEED] [DIRECTION]',
        'fr': 'Déplacer le moteur [MOTOR_ID] de [STEPS] pas avec [SPEED] [DIRECTION]'
    },
    doSetMotorSpeedDirSync: {
        'en':'Move motor [MOTOR_ID] [DIRECTION] and [MOTOR_ID2] [DIRECTION2] with [SPEED]',
        'de':'Bewege Motor [MOTOR_ID] [DIRECTION] und [MOTOR_ID2] [DIRECTION2] mit [SPEED]',
        'fr': 'Déplacer le moteur [MOTOR_ID] [DIRECTION] et [MOTOR_ID2] [DIRECTION2] avec [SPEED]'
    },
    doSetMotorSpeedDirDistSync: {
        'en':'Move motor [MOTOR_ID] [DIRECTION] and [MOTOR_ID2] [DIRECTION2] by [STEPS] steps with [SPEED]',
        'de':'Bewege Motor [MOTOR_ID] [DIRECTION] und [MOTOR_ID2] [DIRECTION2] um [STEPS] Schritte mit [SPEED]',
        'fr': 'Déplacer le moteur [MOTOR_ID] [DIRECTION] et [MOTOR_ID2] [DIRECTION2] de [STEPS] pas avec [SPEED]'
    },
    doStopMotorAndReset: {
        'en':'Reset [MOTOR_ID]',
        'de':'Setze [MOTOR_ID] zurück',
        'fr': 'Réinitialiser [MOTOR_ID]'
    },
    setLed: {
        'en':'Set LED [STATE]',
        'de':'Setze LED [STATE]',
        'fr': 'Mettre la LED [STATE]'
    },

    //alerts and notifications
    connect: {
        'en':'Do you want to connect via USB or BT?',
        'de':'Willst du dich über USB oder BT verbinden?',
        'fr': 'Voulez-vous vous connecter via USB ou BT ?'
    },
    connectwlan: {
        'en':'Do you want to connect via USB or WLAN?',
        'de':'Willst du dich über USB oder WLAN verbinden?',
        'fr': 'Voulez-vous vous connecter via USB ou WLAN ?'
    },
    cancel: {
        'en':'Cancel',
        'de':'Abbrechen',
        'fr': 'Annuler'
    },
    connected: {
        'en':'The controller is connected',
        'de':'Der Controller ist verbunden',
        'fr': 'Le contrôleur est connecté'
    },
    start: {
        'en':'You can start now',
        'de':'Du kannst nun starten',
        'fr': 'Vous pouvez commencer maintenant'
    },
    disconnected: {
        'en':'The controller is disconnected',
        'de':'Der Controller ist getrennt',
        'fr': 'Le contrôleur est déconnecté'
    },
    reconnect: {
        'en':'try reconnecting by clicking the connect button in the right upper corner',
        'de':'Versuche, die Verbindung erneut herzustellen, indem du auf die Schaltfläche „Verbinden“ in der rechten oberen Ecke klickst',
        'fr': 'Essayez de vous reconnecter en cliquant sur le bouton de connexion dans le coin supérieur droit'
    },
    range: {
        'en':'Output values range from 0 to 8',
        'de':'Ausgangswerte reichen von 0 bis 8',
        'fr': 'Les valeurs de sortie vont de 0 à 8'
    },
    maximum: {
        'en':'keep in mind that the maximum output value is 8',
        'de':'denke daran, dass der maximale Ausgangswert 8 ist',
        'fr': 'gardez à l’esprit que la valeur de sortie maximale est de 8'
    },
    driver: {
        'en':'The driver is not installed',
        'de':'Der Treiber ist nicht installiert',
        'fr': 'Le pilote n’est pas installé'
    },
    install: {
        'en':'Please install the driver first',
        'de':'Bitte installiere zuerst den Treiber',
        'fr': 'Veuillez d’abord installer le pilote'
    },
    connectbutton: {
        'en':'Connect',
        'de':'Verbinden',
        'fr': 'Connecter'
    },
    downloadbutton: {
        'en':'Download',
        'de':'Herunterladen',
        'fr': 'Télécharger'
    },
    usbnotsupport: {
        'en':'The Device is not supported via USB, because it does not have a USB port.',
        'de':'Das Gerät wird nicht per USB unterstützt, da dieses keinen USB Anschluss hat.',
        'fr': 'L’appareil n’est pas pris en charge via USB car il n’a pas de port USB.'
    },
    btnotsupport: {
        'en':'The Device is not supported via Bluetooth, because it does not have a Bluetooth module.',
        'de':'Das Gerät wird nicht per Bluetooth unterstützt, da dieses kein Bluetooth Modul hat.',
        'fr': 'L’appareil n’est pas pris en charge via Bluetooth car il n’a pas de module Bluetooth.'
    },
    apikeytxt: {
        'en':'Enter the API key here:',
        'de':'Gebe hier den API-Schlüssel ein:',
        'fr': 'Entrez la clé API ici :'
    },
    apikey:{
        'en':'API key',
        'de':'API-Schlüssel',
        'fr': 'Clé API'
    },
    ftduinoflash: {
        'en':'Uploading webusb scatch or File',
        'de':'Lade WebUSB Scratch oder Datei hoch',
        'fr': 'Téléchargement de WebUSB Scratch ou du fichier'
    },
    ftduinoupload: {
        'en':'Upload file',
        'de':'Datei hochladen',
        'fr': 'Télécharger le fichier'
    },
    notsupported: {
        'en':'The device is currently not supported!\n Please use download button.\n Download the Scratch file before.',
        'de':'Das Gerät wird zurzeit nicht unterstützt!\n Bitte benutze den Download-Button.\n Lade davor die Scratch Datei herunter.',
        'fr': 'L’appareil n’est actuellement pas pris en charge !\n Veuillez utiliser le bouton de téléchargement.\n Téléchargez d’abord le fichier Scratch.'
    },
    downloadtxt: {
        'en':'Now upload the converted file to the TXT via http://192.168.7.2/#txt/Scratch (TXT connected via USB).\n If the page doesnt load, activate the WEB server and the VNC server on the TXT.\n',
        'de':'Lade jetzt die convert Datei auf den TXT via http://192.168.7.2/#txt/Scratch (TXT über USB verbunden).\n Falls die Seite nicht läd -> aktiverie auf dem TXT den WEB Server und den VNC Server.\n',
        'fr': 'Maintenant, téléchargez le fichier converti sur le TXT via http://192.168.7.2/#txt/Scratch (TXT connecté via USB).\n Si la page ne se charge pas, activez le serveur WEB et le serveur VNC sur le TXT.\n'
    },
    downloadftduino: {
        'en':'Currently not supported.',
        'de':'Derzeit nicht unterstützt.',
        'fr': 'Actuellement non pris en charge.'
    },
    downloadtx: {
        'en':'Currently not supported.',
        'de':'Derzeit nicht unterstützt.',
        'fr': 'Actuellement non pris en charge.'
    },
    downloadrx: {
        'en':'Currently not supported.',
        'de':'Derzeit nicht unterstützt.',
        'fr': 'Actuellement non pris en charge.'
    },
    downloadtxt40: {
        'en':'Currently not supported.',
        'de':'Derzeit nicht unterstützt.',
        'fr': 'Actuellement non pris en charge.'
    },
    browsernotwebbt: {
        'en':'Your browser does not support Web Bluetooth.\nPlease use a different browser like Chrome or Edge.',
        'de':'Dein Browser unterstützt kein Web Bluetooth.\nBitte benutze einen anderen Browser wie Chrome oder Edge.',
        'fr': 'Votre navigateur ne prend pas en charge Web Bluetooth.\nVeuillez utiliser un autre navigateur comme Chrome ou Edge.'
    },
    browsernotwebusb: {
        'en':'Your browser does not support Web USB.\nPlease use a different browser like Chrome or Edge.',
        'de':'Dein Browser unterstützt kein Web USB.\nBitte benutze einen anderen Browser wie Chrome oder Edge.',
        'fr': 'Votre navigateur ne prend pas en charge Web USB.\nVeuillez utiliser un autre navigateur comme Chrome ou Edge.'
    },
    browsernotwebserial: {
        'en':'Your browser does not support Web Serial.\nPlease use a different browser like Chrome or Edge.',
        'de':'Dein Browser unterstützt kein Web Serial.\nBitte benutze einen anderen Browser wie Chrome oder Edge.',
        'fr': 'Votre navigateur ne prend pas en charge Web Serial.\nVeuillez utiliser un autre navigateur comme Chrome ou Edge.'
    },
    mobilewebserial: {
        'en': 'Web Serial is not supported on mobile devices.\nPlease use a desktop browser.',
        'de': 'Web Serial wird auf mobilen Geräten nicht unterstützt.\nBitte benutze einen Desktop-Browser.',
        'fr': 'Web Serial n’est pas pris en charge sur les appareils mobiles.\nVeuillez utiliser un navigateur de bureau.'
    },
    tryagain: {
        'en': 'The Controller is not yet properly connected.\nPlease try again.',
        'de': 'Der Controller ist noch nicht richtig verbunden.\nBitte versuche es erneut.',
        'fr': 'Le contrôleur n’est pas encore correctement connecté.\nVeuillez réessayer.'
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