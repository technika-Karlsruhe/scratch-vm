const formatMessage = require('format-message');
const { LOOP } = require('../../extension-support/block-type');
const message = { // translations en/de/fr/es/ko
    
    //menu labels
    Digitalvoltage: {
        'en': 'digital voltage',
        'de': 'digitale Spannung',
        'fr': 'tension numérique',
        'es': 'voltaje digital',
        'ko': '디지털 전압'
    },
    Digitalresistance: {
        'en': 'digital resistance',
        'de': 'digitaler Widerstand',
        'fr': 'résistance numérique',
        'es': 'resistencia digital',
        'ko': '디지털 저항'
    },
    Analoguevoltage: {
        'en':'analogue voltage',
        'de':'analoge Spannung',
        'fr': 'tension analogique',
        'es': 'voltaje analógico',
        'ko': '아날로그 전압'
    },
    Analogueresistance: {
        'en':'analogue resistance',
        'de':'analoger Widerstand',
        'fr': 'résistance analogique',
        'es': 'resistencia analógica',
        'ko': '아날로그 저항'
    },
    Ultrasonic:{
        'en':'Ultrasonic',
        'de':'Ultraschall',
        'fr': 'ultrasons',
        'es': 'ultrasónico',
        'ko': '초음파'
    },
    ColorSensor: {
        'en':'color sensor',
        'de':'Farbsensor',
        'fr': 'capteur de couleur',
        'es': 'sensor de color',
        'ko': '컬러 센서'
    },
    DistanceSensor:{
        'en': 'distance sensor',
        'de': 'Abstandssensor',
        'fr': 'capteur de distance',
        'es': 'sensor de distancia',
        'ko': '거리 센서'
    },
    NTCResistor:{
        'en': 'NTC resistor',
        'de': 'NTC Widerstand',
        'fr': 'résistance NTC',
        'es': 'resistor NTC',
        'ko': 'NTC 저항'
    },
    PhotoResistor: {
        'en':'photo resistor',
        'de':'Fotowiderstand',
        'fr': 'photorésistance',
        'es': 'fotorresistor',
        'ko': '광저항'
    }, 
    DistanceSensor: {
        'en':'distance sensor',
        'de':'Abstandssensor',
        'fr': 'capteur de distance',
        'es': 'sensor de distancia'
    },
    Button: {
        'en':'button',
        'de':'Taster',
        'fr': 'bouton',
        'es': 'botón',
        'ko': '버튼'
    },
    Lightbarrier: {
        'en':'lightbarrier',
        'de':'Lichtschranke',
        'fr': 'barrière lumineuse',
        'es': 'barrera de luz',
        'ko': '광차단기'
    },
    Reedcontact: {
        'en':'reedcontact',
        'de':'Reedkontakt',
        'fr': 'contact à lames souples (reed)',
        'es': 'contacto reed',
        'ko': '리드 접점'
    },
    TrailSensor:{
        'en':'trail sensor',
        'de':'Spursensor',
        'fr': 'capteur de piste',
        'es': 'sensor de rastro',
        'ko': '트레일 센서'
    }, 
    Open:{
        'en':'opens',
        'de':'öffnet',
        'fr': 'ouvre',
        'es': 'abre',
        'ko': '열림'
    }, 
    Closed: {
        'en':'closes',
        'de':'schließt',
        'fr': 'ferme',
        'es': 'cierra',
        'ko': '닫힘'
    },
    Forward: {
        'en':'forward',
        'de':'Vorwärts',
        'fr': 'avant',
        'es': 'adelante',
        'ko': '앞으로'
    }, 
    Backwards: {
        'en':'backwards',
        'de':'Rückwärts',
        'fr': 'arrière',
        'es': 'atrás',
        'ko': '뒤로'
    },
    yes: {
        'en':'yes',
        'de':'ja',
        'fr': 'oui',
        'es': 'sí',
        'ko': '예'
    },
    no: {
        'en':'no',
        'de':'nein',
        'fr': 'non',
        'es': 'no',
        'ko': '아니오'
    },
    on: {
        'en':'on',
        'de':'an',
        'fr': 'activé',
        'es': 'encendido',
        'ko': '켜짐'
    },
    off: {
        'en':'off',
        'de':'aus',
        'fr': 'éteint',
        'es': 'apagado',
        'ko': '꺼짐'
    },
    blue: {
        'en':'blue',
        'de':'blau',
        'fr': 'bleu',
        'es': 'azul',
        'ko': '파랑'
    },
    orange: {
        'en':'orange',
        'de':'orange',
        'fr': 'orange',
        'es': 'naranja',
        'ko': '주황'
    },
    kp_nose: {
        'en':'nose',
        'de':'Nase',
        'fr': 'nez',
        'es': 'nariz',
        'ko': '코'
    },
    kp_left_eye: {
        'en':'left eye',
        'de':'linkes Auge',
        'fr': 'œil gauche',
        'es': 'ojo izquierdo',
        'ko': '왼쪽 눈'
    },
    kp_right_eye: {
        'en':'right eye',
        'de':'rechtes Auge',
        'fr': 'œil droit',
        'es': 'ojo derecho',
        'ko': '오른쪽 눈'
    },
    kp_left_ear: {
        'en':'left ear',
        'de':'linkes Ohr',
        'fr': 'oreille gauche',
        'es': 'oreja izquierda',
        'ko': '왼쪽 귀'
    },
    kp_right_ear: {
        'en':'right ear',
        'de':'rechtes Ohr',
        'fr': 'oreille droite',
        'es': 'oreja derecha',
        'ko': '오른쪽 귀'
    },
    kp_left_shoulder: {
        'en':'left shoulder',
        'de':'linke Schulter',
        'fr': 'épaule gauche',
        'es': 'hombro izquierdo',
        'ko': '왼쪽 어깨'
    },
    kp_right_shoulder: {
        'en':'right shoulder',
        'de':'rechte Schulter',
        'fr': 'épaule droite',
        'es': 'hombro derecho',
        'ko': '오른쪽 어깨'
    },
    kp_left_elbow: {
        'en':'left elbow',
        'de':'linker Ellbogen',
        'fr': 'coude gauche',
        'es': 'codo izquierdo',
        'ko': '왼쪽 팔꿈치'
    },
    kp_right_elbow: {
        'en':'right elbow',
        'de':'rechter Ellbogen',
        'fr': 'coude droit',
        'es': 'codo derecho',
        'ko': '오른쪽 팔꿈치'
    },
    kp_left_wrist: {
        'en':'left wrist',
        'de':'linkes Handgelenk',
        'fr': 'poignet gauche',
        'es': 'muñeca izquierda',
        'ko': '왼쪽 손목'
    },
    kp_right_wrist: {
        'en':'right wrist',
        'de':'rechtes Handgelenk',
        'fr': 'poignet droit',
        'es': 'muñeca derecha',
        'ko': '오른쪽 손목'
    },
    kp_left_hip: {
        'en':'left hip',
        'de':'linke Hüfte',
        'fr': 'hanche gauche',
        'es': 'cadera izquierda',
        'ko': '왼쪽 엉덩이'
    },
    kp_right_hip: {
        'en':'right hip',
        'de':'rechte Hüfte',
        'fr': 'hanche droite',
        'es': 'cadera derecha',
        'ko': '오른쪽 엉덩이'
    },
    kp_left_knee: {
        'en':'left knee',
        'de':'linkes Knie',
        'fr': 'genou gauche',
        'es': 'rodilla izquierda',
        'ko': '왼쪽 무릎'
    },
    kp_right_knee: {
        'en':'right knee',
        'de':'rechtes Knie',
        'fr': 'genou droit',
        'es': 'rodilla derecha',
        'ko': '오른쪽 무릎'
    },
    kp_left_ankle: {
        'en':'left ankle',
        'de':'linker Knöchel',
        'fr': 'cheville gauche',
        'es': 'tobillo izquierdo',
        'ko': '왼쪽 발목'
    },
    kp_right_ankle: {
        'en':'right ankle',
        'de':'rechter Knöchel',
        'fr': 'cheville droite',
        'es': 'tobillo derecho',
        'ko': '오른쪽 발목'
    },

    //blocks
    onOpenClose: {
        'en':'If [SENSOR] [INPUT] [OPENCLOSE]',
        'de':'Wenn [SENSOR] [INPUT] [OPENCLOSE]',
        'fr': 'Si [SENSOR] [INPUT] [OPENCLOSE]',
        'es': 'Si [SENSOR] [INPUT] [OPENCLOSE]',
        'ko': '[SENSOR] [INPUT] [OPENCLOSE]이면'
    },
    onInput: {
        'en':'If value of [SENSOR] [INPUT] [OPERATOR] [VALUE]',
        'de':'Wenn der Wert [SENSOR] [INPUT] [OPERATOR] [VALUE]',
        'fr': 'Si la valeur de [SENSOR] [INPUT] [OPERATOR] [VALUE]',
        'es': 'Si el valor de [SENSOR] [INPUT] [OPERATOR] [VALUE]',
        'ko': '[SENSOR] [INPUT] 값이 [OPERATOR] [VALUE]이면'
    },
    getSensor: {
        'en':'Read value of [SENSOR] [INPUT]',
        'de':'Lese Wert von [SENSOR] [INPUT]',
        'fr': 'Lire la valeur de [SENSOR] [INPUT]',
        'es': 'Leer el valor de [SENSOR] [INPUT]',
        'ko': '[SENSOR] [INPUT] 값 읽기'
    }, 
    isClosed: {
        'en': 'Is [SENSOR] [INPUT] closed?',
        'de': 'Ist [SENSOR] [INPUT] geschlossen?',
        'fr': 'Est-ce que [SENSOR] [INPUT] est fermé ?',
        'es': '¿Está [SENSOR] [INPUT] cerrado?',
        'ko': '[SENSOR] [INPUT]이(가) 닫혔습니까?'
    },
    doSetLamp: {
        'en':'Set lamp [OUTPUT] to [NUM]',
        'de':'Setze Lampe [OUTPUT] auf [NUM]',
        'fr': 'Mettre la lampe [OUTPUT] à [NUM]',
        'es': 'Poner la lámpara [OUTPUT] a [NUM]',
        'ko': '램프 [OUTPUT]을(를) [NUM]로 설정'
    }, 
    doSetOutput: {
        'en':'Set output [OUTPUT] to [NUM]',
        'de':'Setze Ausgang [OUTPUT] auf [NUM]',
        'fr': 'Mettre la sortie [OUTPUT] à [NUM]',
        'es': 'Poner la salida [OUTPUT] a [NUM]',
        'ko': '출력 [OUTPUT]을(를) [NUM]로 설정'
    }, 
    doConfigureInput: {
        'en':'Set input [INPUT] to [MODE]',
        'de':'Setze Eingang [INPUT] auf [MODE]',
        'fr': 'Configurer l’entrée [INPUT] en [MODE]',
        'es': 'Configurar la entrada [INPUT] en [MODE]',
        'ko': '입력 [INPUT]을(를) [MODE]로 설정'
    }, 
    doSetMotorSpeed: {
        'en':'Set motor [MOTOR_ID] to [SPEED]',
        'de':'Setze Motor [MOTOR_ID] auf [SPEED]',
        'fr': 'Mettre le moteur [MOTOR_ID] à [SPEED]',
        'es': 'Poner el motor [MOTOR_ID] a [SPEED]',
        'ko': '모터 [MOTOR_ID]을(를) [SPEED]로 설정'
    },
    doSetMotorSpeedDir: {
        'en':'Set motor [MOTOR_ID] to [SPEED] [DIRECTION]',
        'de':'Setze Motor [MOTOR_ID] auf [SPEED] [DIRECTION]',
        'fr': 'Mettre le moteur [MOTOR_ID] à [SPEED] [DIRECTION]',
        'es': 'Poner el motor [MOTOR_ID] a [SPEED] [DIRECTION]',
        'ko': '모터 [MOTOR_ID]을(를) [SPEED] [DIRECTION]로 설정'
    },
    doSetMotorDir: {
        'en':'Set motor [MOTOR_ID] to [DIRECTION]',
        'de':'Setze Motor [MOTOR_ID] auf [DIRECTION]',
        'fr': 'Mettre le moteur [MOTOR_ID] à [DIRECTION]',
        'es': 'Poner el motor [MOTOR_ID] a [DIRECTION]',
        'ko': '모터 [MOTOR_ID]을(를) [DIRECTION]로 설정'
    },
    doStopMotor: {
        'en':'Stop motor [MOTOR_ID]',
        'de':'Stoppe Motor [MOTOR_ID]',
        'fr': 'Arrêter le moteur [MOTOR_ID]',
        'es': 'Detener el motor [MOTOR_ID]',
        'ko': '모터 [MOTOR_ID] 정지'
    },
    doSetServoPosition: {
        'en':'Set servo [SERVO_ID] to [POSITION]',
        'de':'Setze Servo [SERVO_ID] auf [POSITION]',
        'fr': 'Mettre le servo [SERVO_ID] à [POSITION]',
        'es': 'Poner el servo [SERVO_ID] a [POSITION]',
        'ko': '서보 [SERVO_ID]을(를) [POSITION]로 설정'
    },
    onCounter: {
        'en':'If counter [COUNTER_ID] [OPERATOR] [VALUE]',
        'de':'Wenn Zähler [COUNTER_ID] [OPERATOR] [VALUE]',
        'fr': 'Si le compteur [COUNTER_ID] [OPERATOR] [VALUE]',
        'es': 'Si el contador [COUNTER_ID] [OPERATOR] [VALUE]',
        'ko': '카운터 [COUNTER_ID]이(가) [OPERATOR] [VALUE]이면'
    },
    getCounter: {
        'en':'Get value of counter [COUNTER_ID]',
        'de':'Lese Wert von Zähler [COUNTER_ID]',
        'fr': 'Lire la valeur du compteur [COUNTER_ID]',
        'es': 'Leer el valor del contador [COUNTER_ID]',
        'ko': '카운터 [COUNTER_ID] 값 읽기'
    },
    isCounter: {
        'en':'Is counter [COUNTER_ID] [OPERATOR] [VALUE]',
        'de':'Ist Zähler [COUNTER_ID] [OPERATOR] [VALUE]',
        'fr': 'Le compteur [COUNTER_ID] est-il [OPERATOR] [VALUE] ?',
        'es': '¿El contador [COUNTER_ID] es [OPERATOR] [VALUE]?',
        'ko': '카운터 [COUNTER_ID]이(가) [OPERATOR] [VALUE]입니까?'
    },
    doPlaySound: {
        'en':'Play sound [NUM]',
        'de':'Spiele Sound [NUM]',
        'fr': 'Jouer le son [NUM]',
        'es': 'Reproducir sonido [NUM]',
        'ko': '사운드 [NUM] 재생'
    },
    doPlaySoundWait: {
        'en':'Play sound [NUM] and wait',
        'de':'Spiele Sound [NUM] und warte',
        'fr': 'Jouer le son [NUM] et attendre',
        'es': 'Reproducir sonido [NUM] y esperar',
        'ko': '사운드 [NUM] 재생 후 대기'
    },
    doPlaySound2: {
        'en':'Play sound [SOUND_ID] Loop [LOOP]',
        'de':'Spiele Sound [SOUND_ID] Wiederholen [LOOP]',
        'fr': 'Jouer le son [SOUND_ID] en boucle [LOOP]',
        'es': 'Reproducir sonido [SOUND_ID] en bucle [LOOP]',
        'ko': '사운드 [SOUND_ID] 반복 [LOOP] 재생'
    },
    doStopSound: {
        'en':'Stop sound',
        'de':'Stoppe Sound',
        'fr': 'Arrêter le son',
        'es': 'Detener sonido',
        'ko': '사운드 정지'
    },
    doResetCounter: {
        'en':'Reset counter [COUNTER_ID]',
        'de':'Setze Zähler [COUNTER_ID] zurück',
        'fr': 'Réinitialiser le compteur [COUNTER_ID]',
        'es': 'Reiniciar contador [COUNTER_ID]',
        'ko': '카운터 [COUNTER_ID] 초기화'
    },
    doSetMotorSpeedDirDist: {
        'en':'Move motor [MOTOR_ID] by [STEPS] steps with [SPEED] [DIRECTION]',
        'de':'Bewege Motor [MOTOR_ID] um [STEPS] Schritte mit [SPEED] [DIRECTION]',
        'fr': 'Déplacer le moteur [MOTOR_ID] de [STEPS] pas avec [SPEED] [DIRECTION]',
        'es': 'Mover motor [MOTOR_ID] [STEPS] pasos con [SPEED] [DIRECTION]',
        'ko': '모터 [MOTOR_ID]을(를) [SPEED] [DIRECTION]로 [STEPS] 스텝 이동'
    },
    doSetMotorSpeedDirSync: {
        'en':'Move motor [MOTOR_ID] [DIRECTION] and [MOTOR_ID2] [DIRECTION2] with [SPEED]',
        'de':'Bewege Motor [MOTOR_ID] [DIRECTION] und [MOTOR_ID2] [DIRECTION2] mit [SPEED]',
        'fr': 'Déplacer le moteur [MOTOR_ID] [DIRECTION] et [MOTOR_ID2] [DIRECTION2] avec [SPEED]',
        'es': 'Mover motor [MOTOR_ID] [DIRECTION] y [MOTOR_ID2] [DIRECTION2] con [SPEED]',
        'ko': '모터 [MOTOR_ID] [DIRECTION] 및 [MOTOR_ID2] [DIRECTION2]을(를) [SPEED]로 이동'
    },
    doSetMotorSpeedDirDistSync: {
        'en':'Move motor [MOTOR_ID] [DIRECTION] and [MOTOR_ID2] [DIRECTION2] by [STEPS] steps with [SPEED]',
        'de':'Bewege Motor [MOTOR_ID] [DIRECTION] und [MOTOR_ID2] [DIRECTION2] um [STEPS] Schritte mit [SPEED]',
        'fr': 'Déplacer le moteur [MOTOR_ID] [DIRECTION] et [MOTOR_ID2] [DIRECTION2] de [STEPS] pas avec [SPEED]',
        'es': 'Mover motor [MOTOR_ID] [DIRECTION] y [MOTOR_ID2] [DIRECTION2] [STEPS] pasos con [SPEED]',
        'ko': '모터 [MOTOR_ID] [DIRECTION] 및 [MOTOR_ID2] [DIRECTION2]을(를) [SPEED]로 [STEPS] 스텝 이동'
    },
    doStopMotorAndReset: {
        'en':'Reset [MOTOR_ID]',
        'de':'Setze [MOTOR_ID] zurück',
        'fr': 'Réinitialiser [MOTOR_ID]',
        'es': 'Reiniciar [MOTOR_ID]',
        'ko': '[MOTOR_ID] 초기화'
    },
    setLed: {
        'en':'Set LED [STATE]',
        'de':'Setze LED [STATE]',
        'fr': 'Mettre la LED [STATE]',
        'es': 'Poner LED [STATE]',
        'ko': 'LED [STATE]로 설정'
    },
    loadImageTF: {
        'en': 'load image model (TensorFlow)',
        'de': 'lade Bild Modell (TensorFlow)',
        'fr': 'charger le modèle d’image (TensorFlow)',
        'es': 'cargar modelo de imagen (TensorFlow)',
        'ko': '이미지 모델 로드 (TensorFlow)'
    },
    classifyImageTF: {
        'en': 'classify object in image via TF [URL]',
        'de': 'erkenne Objekt in Bild via TF [URL]',
        'fr': 'classer l’objet dans l’image via TF [URL]',
        'es': 'clasificar objeto en imagen vía TF [URL]',
        'ko': 'TF를 통해 이미지에서 객체 분류 [URL]'
    },
    startImageTF: {
        'en': 'start image recognition (camera) via TF',
        'de': 'starte Bild Erkennung (Kamera) via TF',
        'fr': 'démarrer la reconnaissance d’image (caméra) via TF',
        'es': 'iniciar reconocimiento de imagen (cámara) vía TF',
        'ko': 'TF를 통해 이미지 인식 시작 (카메라)'
    },
    stopImageTF: {
        'en': 'stop image recognition via TF',
        'de': 'stoppe Bild Erkennung via TF',
        'fr': 'arrêter la reconnaissance d’image via TF',
        'es': 'detener el reconocimiento de imagen vía TF',
        'ko': 'TF를 통해 이미지 인식 중지'
    },
    getImageTF: {
        'en': 'last image recognition via TF',
        'de': 'letzte Bild Erkennung via TF',
        'fr': 'dernière reconnaissance d’image via TF',
        'es': 'último reconocimiento de imagen vía TF',
        'ko': 'TF를 통해 마지막 이미지 인식'
    },
    getImageTFClass: {
        'en': 'image TF class',
        'de': 'Bild TF Klasse',
        'fr': 'classe TF d’image',
        'es': 'clase de imagen TF',
        'ko': '이미지 TF 클래스'
    },
    getImageTFProbability: {
        'en': 'image TF probability',
        'de': 'Bild TF Wahrscheinlichkeit',
        'fr': 'probabilité TF d’image',
        'es': 'probabilidad de imagen TF',
        'ko': '이미지 TF 확률'
    },
    loadImageTM: {
        'en': 'load image model (Teachable Machine) from [URL]',
        'de': 'lade Bild Modell (Teachable Machine) von [URL]',
        'fr': 'charger le modèle d’image (Teachable Machine) depuis [URL]',
        'es': 'cargar modelo de imagen (Teachable Machine) desde [URL]',
        'ko': '이미지 모델 로드 (Teachable Machine) [URL]에서'
    },
    classifyImageTM: {
        'en': 'classify object in image via TM [URL]',
        'de': 'erkenne Objekt in Bild via TM [URL]',
        'fr': 'classer l’objet dans l’image via TM [URL]',
        'es': 'clasificar objeto en imagen vía TM [URL]',
        'ko': 'TM를 통해 이미지에서 객체 분류 [URL]'
    },
    startImageTM: {
        'en': 'start image recognition (camera) via TM',
        'de': 'starte Bild Erkennung (Kamera) via TM',
        'fr': 'démarrer la reconnaissance d’image (caméra) via TM',
        'es': 'iniciar reconocimiento de imagen (cámara) vía TM',
        'ko': 'TM를 통해 이미지 인식 시작 (카메라)'
    },
    stopImageTM: {
        'en': 'stop image recognition via TM',
        'de': 'stoppe Bild Erkennung via TM',
        'fr': 'arrêter la reconnaissance d’image via TM',
        'es': 'detener el reconocimiento de imagen vía TM',
        'ko': 'TM를 통해 이미지 인식 중지'
    },
    getImageTM: {
        'en': 'last image recognition via TM',
        'de': 'letzte Bild Erkennung via TM',
        'fr': 'dernière reconnaissance d’image via TM',
        'es': 'último reconocimiento de imagen vía TM',
        'ko': 'TM를 통해 마지막 이미지 인식'
    },
    getImageTMClass: {
        'en': 'image TM class',
        'de': 'Bild TM Klasse',
        'fr': 'classe TM d’image',
        'es': 'clase de imagen TM',
        'ko': '이미지 TM 클래스'
    },
    getImageTMProbability: {
        'en': 'image TM probability',
        'de': 'Bild TM Wahrscheinlichkeit',
        'fr': 'probabilité TM d’image',
        'es': 'probabilidad de imagen TM',
        'ko': '이미지 TM 확률'
    },
    loadAudioTF: {
        'en': 'load audio model (TensorFlow)',
        'de': 'lade Audio Modell (TensorFlow)',
        'fr': 'charger le modèle audio (TensorFlow)',
        'es': 'cargar modelo de audio (TensorFlow)',
        'ko': '오디오 모델 로드 (TensorFlow)'
    },
    classifyAudioTF: {
        'en': 'classify sound via TF (microphone)',
        'de': 'erkenne Ton via TF (Mikrofon)',
        'fr': 'classer le son via TF (microphone)',
        'es': 'clasificar sonido vía TF (micrófono)',
        'ko': 'TF를 통해 사운드 분류 (마이크)'
    },
    startAudioTF: {
        'en': 'start audio recognition via TF',
        'de': 'starte Audio Erkennung via TF',
        'fr': 'démarrer la reconnaissance audio via TF',
        'es': 'iniciar reconocimiento de audio vía TF',
        'ko': 'TF를 통해 오디오 인식 시작'
    },
    stopAudioTF: {
        'en': 'stop audio recognition via TF',
        'de': 'stoppe Audio Erkennung via TF',
        'fr': 'arrêter la reconnaissance audio via TF',
        'es': 'detener el reconocimiento de audio vía TF',
        'ko': 'TF를 통해 오디오 인식 중지'
    },
    getAudioTF: {
        'en': 'last audio recognition via TF',
        'de': 'letzte Audio Erkennung via TF',
        'fr': 'dernière reconnaissance audio via TF',
        'es': 'último reconocimiento de audio vía TF',
        'ko': 'TF를 통해 마지막 오디오 인식'
    },
    getAudioTFClass: {
        'en': 'audio TF class',
        'de': 'Audio TF Klasse',
        'fr': 'classe TF audio',
        'es': 'clase de audio TF',
        'ko': '오디오 TF 클래스'
    },
    getAudioTFProbability: {
        'en': 'audio TF probability',
        'de': 'Audio TF Wahrscheinlichkeit',
        'fr': 'probabilité TF audio',
        'es': 'probabilidad de audio TF',
        'ko': '오디오 TF 확률'
    },
    loadAudioTM: {
        'en': 'load audio model (Teachable Machine) from [URL]',
        'de': 'lade Audio Modell (Teachable Machine) von [URL]',
        'fr': 'charger le modèle audio (Teachable Machine) depuis [URL]',
        'es': 'cargar modelo de audio (Teachable Machine) desde [URL]',
        'ko': '오디오 모델 로드 (Teachable Machine) [URL]에서'
    },
    classifyAudioTM: {
        'en': 'classify sound via TM (microphone)',
        'de': 'erkenne Ton via TM (Mikrofon)',
        'fr': 'classer le son via TM (microphone)',
        'es': 'clasificar sonido vía TM (micrófono)',
        'ko': 'TM를 통해 사운드 분류 (마이크)'
    },
    startAudioTM: {
        'en': 'start audio recognition via TM',
        'de': 'starte Audio Erkennung via TM',
        'fr': 'démarrer la reconnaissance audio via TM',
        'es': 'iniciar reconocimiento de audio vía TM',
        'ko': 'TM를 통해 오디오 인식 시작'
    },
    stopAudioTM: {
        'en': 'stop audio recognition via TM',
        'de': 'stoppe Audio Erkennung via TM',
        'fr': 'arrêter la reconnaissance audio via TM',
        'es': 'detener el reconocimiento de audio vía TM',
        'ko': 'TM를 통해 오디오 인식 중지'
    },
    getAudioTM: {
        'en': 'last audio recognition via TM',
        'de': 'letzte Audio Erkennung via TM',
        'fr': 'dernière reconnaissance audio via TM',
        'es': 'último reconocimiento de audio vía TM',
        'ko': 'TM를 통해 마지막 오디오 인식'
    },
    getAudioTMClass: {
        'en': 'audio TM class',
        'de': 'Audio TM Klasse',
        'fr': 'classe TM audio',
        'es': 'clase de audio TM',
        'ko': '오디오 TM 클래스'
    },
    getAudioTMProbability: {
        'en': 'audio TM probability',
        'de': 'Audio TM Wahrscheinlichkeit',
        'fr': 'probabilité TM audio',
        'es': 'probabilidad de audio TM',
        'ko': '오디오 TM 확률'
    },
    isAudioAbove: {
        'en':'Is audio level above [THRESHOLD] %?',
        'de': 'Audiopegel über [THRESHOLD] %?',
        'fr': 'Le niveau audio est-il supérieur à [THRESHOLD] % ?',
        'es': '¿El nivel de audio está por encima de [THRESHOLD] %?',
        'ko': '오디오 레벨이 [THRESHOLD] % 이상입니까?'
    },
    loadPoseTF: {
        'en': 'load pose model (TensorFlow)',
        'de': 'lade Pose Modell (TensorFlow)',
        'fr': 'charger le modèle de pose (TensorFlow)',
        'es': 'cargar modelo de pose (TensorFlow)',
        'ko': '포즈 모델 로드 (TensorFlow)'
    },
    startPoseTF: {
        'en': 'start pose recognition (camera) via TF',
        'de': 'starte Pose Erkennung (Kamera) via TF',
        'fr': 'démarrer la reconnaissance de pose (caméra) via TF',
        'es': 'iniciar reconocimiento de pose (cámara) vía TF',
        'ko': 'TF를 통해 포즈 인식 시작 (카메라)'
    },
    stopPoseTF: {
        'en': 'stop pose recognition via TF',
        'de': 'stoppe Pose Erkennung via TF',
        'fr': 'arrêter la reconnaissance de pose via TF',
        'es': 'detener el reconocimiento de pose vía TF',
        'ko': 'TF를 통해 포즈 인식 중지'
    },
    getPoseTF: {
        'en': 'pose TF amount of keypoints',
        'de': 'Pose TF Anzahl Keypoints',
        'fr': 'pose TF nombre de points clés',
        'es': 'pose TF cantidad de puntos clave',
        'ko': '포즈 TF 키포인트 수'
    },
    setPoseTFMinScore: {
        'en': 'set pose TF minimum score to [SCORE]',
        'de': 'setze Pose TF Mindest-Score auf [SCORE]',
        'fr': 'définir le score minimum de pose TF à [SCORE]',
        'es': 'establecer puntuación mínima de pose TF a [SCORE]',
        'ko': '포즈 TF 최소 점수를 [SCORE](으)로 설정'
    },
    poseTFKeypointsCount: {
        'en': 'pose TF amount of keypoints (filtered)',
        'de': 'Pose TF Anzahl Keypoints (gefiltert)',
        'fr': 'pose TF nombre de points clés (filtré)',
        'es': 'pose TF cantidad de puntos clave (filtrado)',
        'ko': '포즈 TF 키포인트 수 (필터링됨)'
    },
    poseTFKeypointX: {
        'en': 'pose TF X of [NAME]',
        'de': 'Pose TF X von [NAME]',
        'fr': 'pose TF X de [NAME]',
        'es': 'pose TF X de [NAME]',
        'ko': '포즈 TF [NAME]의 X'
    },
    poseTFKeypointY: {
        'en': 'pose TF Y of [NAME]',
        'de': 'Pose TF Y von [NAME]',
        'fr': 'pose TF Y de [NAME]',
        'es': 'pose TF Y de [NAME]',
        'ko': '포즈 TF [NAME]의 Y'
    },
    poseTFKeypointScore: {
        'en': 'pose TF Score of [NAME]',
        'de': 'Pose TF Score von [NAME]',
        'fr': 'pose TF Score de [NAME]',
        'es': 'pose TF Score de [NAME]',
        'ko': '포즈 TF [NAME]의 점수'
    },
    poseTFHasKeypoint: {
        'en': 'pose TF has keypoint [NAME]?',
        'de': 'Pose TF hat Keypoint [NAME]?',
        'fr': 'la pose TF a-t-elle le point clé [NAME] ?',
        'es': '¿la pose TF tiene el punto clave [NAME]?',
        'ko': '포즈 TF에 키포인트 [NAME]이(가) 있습니까?'
    },
    getPoseTFRaw: {
        'en': 'pose TF raw data (JSON)',
        'de': 'Pose TF Rohdaten (JSON)',
        'fr': 'pose TF données brutes (JSON)',
        'es': 'pose TF datos sin procesar (JSON)',
        'ko': '포즈 TF 원시 데이터 (JSON)'
    },
    loadPoseTM: {
        'en': 'load pose model (Teachable Machine) from [URL]',
        'de': 'lade Pose Modell (Teachable Machine) von [URL]',
        'fr': 'charger le modèle de pose (Teachable Machine) depuis [URL]',
        'es': 'cargar modelo de pose (Teachable Machine) desde [URL]',
        'ko': '포즈 모델 로드 (Teachable Machine) [URL]에서'
    },
    startPoseTM: {
        'en': 'start pose recognition (camera) via TM',
        'de': 'starte Pose Erkennung via TM (Kamera)',
        'fr': 'démarrer la reconnaissance de pose (caméra) via TM',
        'es': 'iniciar reconocimiento de pose (cámara) vía TM',
        'ko': 'TM를 통해 포즈 인식 시작 (카메라)'
    },
    stopPoseTM: {
        'en': 'stop pose recognition via TM',
        'de': 'stoppe Pose Erkennung via TM',
        'fr': 'arrêter la reconnaissance de pose via TM',
        'es': 'detener el reconocimiento de pose vía TM',
        'ko': 'TM를 통해 포즈 인식 중지'
    },
    getPoseTM: {
        'en': 'last pose data via TM',
        'de': 'letzte Pose Daten via TM',
        'fr': 'dernières données de pose via TM',
        'es': 'últimos datos de pose vía TM',
        'ko': 'TM를 통해 마지막 포즈 데이터'
    },
    getPoseTMClass: {
        'en': 'pose TM class',
        'de': 'Pose TM Klasse',
        'fr': 'classe TM de pose',
        'es': 'clase de pose TM',
        'ko': '포즈 TM 클래스'
    },
    getPoseTMProbability: {
        'en': 'pose TM probability',
        'de': 'Pose TM Wahrscheinlichkeit',
        'fr': 'probabilité TM de pose',
        'es': 'probabilidad de pose TM',
        'ko': '포즈 TM 확률'
    },

    //alerts and notifications
    connect: {
        'en':'Do you want to connect via USB or BT?',
        'de':'Willst du dich über USB oder BT verbinden?',
        'fr': 'Voulez-vous vous connecter via USB ou BT ?',
        'es': '¿Quieres conectarte por USB o BT?',
        'ko': 'USB 또는 BT로 연결하시겠습니까?'
    },
    connectwlan: {
        'en':'Do you want to connect via USB or WLAN?',
        'de':'Willst du dich über USB oder WLAN verbinden?',
        'fr': 'Voulez-vous vous connecter via USB ou WLAN ?',
        'es': '¿Quieres conectarte por USB o WLAN?',
        'ko': 'USB 또는 WLAN으로 연결하시겠습니까?'
    },
    cancel: {
        'en':'Cancel',
        'de':'Abbrechen',
        'fr': 'Annuler',
        'es': 'Cancelar',
        'ko': '취소'
    },
    connected: {
        'en':'The controller is connected',
        'de':'Der Controller ist verbunden',
        'fr': 'Le contrôleur est connecté',
        'es': 'El controlador está conectado',
        'ko': '컨트롤러가 연결되었습니다.'
    },
    start: {
        'en':'You can start now',
        'de':'Du kannst nun starten',
        'fr': 'Vous pouvez commencer maintenant',
        'es': 'Ahora puedes empezar',
        'ko': '이제 시작할 수 있습니다.'
    },
    disconnected: {
        'en':'The controller is disconnected',
        'de':'Der Controller ist getrennt',
        'fr': 'Le contrôleur est déconnecté',
        'es': 'El controlador está desconectado',
        'ko': '컨트롤러가 연결 해제되었습니다.'
    },
    reconnect: {
        'en':'try reconnecting by clicking the connect button in the right upper corner',
        'de':'Versuche, die Verbindung erneut herzustellen, indem du auf die Schaltfläche „Verbinden“ in der rechten oberen Ecke klickst',
        'fr': 'Essayez de vous reconnecter en cliquant sur le bouton de connexion dans le coin supérieur droit',
        'es': 'Intenta reconectar haciendo clic en el botón de conectar en la esquina superior derecha',
        'ko': '오른쪽 상단의 연결 버튼을 클릭하여 다시 연결해 보세요.'
    },
    range: {
        'en':'Output values range from 0 to 8',
        'de':'Ausgangswerte reichen von 0 bis 8',
        'fr': 'Les valeurs de sortie vont de 0 à 8',
        'es': 'Los valores de salida van de 0 a 8',
        'ko': '출력 값은 0에서 8까지입니다.'
    },
    maximum: {
        'en':'keep in mind that the maximum output value is 8',
        'de':'denke daran, dass der maximale Ausgangswert 8 ist',
        'fr': 'gardez à l’esprit que la valeur de sortie maximale est de 8',
        'es': 'ten en cuenta que el valor máximo de salida es 8',
        'ko': '최대 출력 값은 8임을 기억하세요.'
    },
    driver: {
        'en':'The driver is not installed',
        'de':'Der Treiber ist nicht installiert',
        'fr': 'Le pilote n’est pas installé',
        'es': 'El controlador no está instalado',
        'ko': '드라이버가 설치되어 있지 않습니다.'
    },
    install: {
        'en':'Please install the driver first',
        'de':'Bitte installiere zuerst den Treiber',
        'fr': 'Veuillez d’abord installer le pilote',
        'es': 'Por favor, instala primero el controlador',
        'ko': '먼저 드라이버를 설치하세요.'
    },
    connectbutton: {
        'en':'Connect',
        'de':'Verbinden',
        'fr': 'Connecter',
        'es': 'Conectar',
        'ko': '연결'
    },
    downloadbutton: {
        'en':'Download',
        'de':'Herunterladen',
        'fr': 'Télécharger',
        'es': 'Descargar',
        'ko': '다운로드'
    },
    usbnotsupport: {
        'en':'The Device is not supported via USB, because it does not have a USB port.',
        'de':'Das Gerät wird nicht per USB unterstützt, da dieses keinen USB Anschluss hat.',
        'fr': 'L’appareil n’est pas pris en charge via USB car il n’a pas de port USB.',
        'es': 'El dispositivo no es compatible por USB porque no tiene un puerto USB.',
        'ko': '이 장치는 USB 포트가 없어 USB로 지원되지 않습니다.'
    },
    btnotsupport: {
        'en':'The Device is not supported via Bluetooth, because it does not have a Bluetooth module.',
        'de':'Das Gerät wird nicht per Bluetooth unterstützt, da dieses kein Bluetooth Modul hat.',
        'fr': 'L’appareil n’est pas pris en charge via Bluetooth car il n’a pas de module Bluetooth.',
        'es': 'El dispositivo no es compatible por Bluetooth porque no tiene un módulo Bluetooth.',
        'ko': '이 장치는 블루투스 모듈이 없어 블루투스로 지원되지 않습니다.'
    },
    apikeytxt: {
        'en':'Enter the API key here:',
        'de':'Gebe hier den API-Schlüssel ein:',
        'fr': 'Entrez la clé API ici :',
        'es': 'Introduce aquí la clave API:',
        'ko': '여기에 API 키를 입력하세요:'
    },
    apikey:{
        'en':'API key',
        'de':'API-Schlüssel',
        'fr': 'Clé API',
        'es': 'Clave API',
        'ko': 'API 키'
    },
    ftduinoflash: {
        'en':'Uploading webusb scatch or File',
        'de':'Lade WebUSB Scratch oder Datei hoch',
        'fr': 'Téléchargement de WebUSB Scratch ou du fichier',
        'es': 'Subiendo WebUSB Scratch o archivo',
        'ko': 'WebUSB Scratch 또는 파일 업로드 중'
    },
    ftduinoupload: {
        'en':'Upload file',
        'de':'Datei hochladen',
        'fr': 'Télécharger le fichier',
        'es': 'Subir archivo',
        'ko': '파일 업로드'
    },
    notsupported: {
        'en':'The device is currently not supported!\n Please use download button.\n Download the Scratch file before.',
        'de':'Das Gerät wird zurzeit nicht unterstützt!\n Bitte benutze den Download-Button.\n Lade davor die Scratch Datei herunter.',
        'fr': 'L’appareil n’est actuellement pas pris en charge !\n Veuillez utiliser le bouton de téléchargement.\n Téléchargez d’abord le fichier Scratch.',
        'es': '¡El dispositivo no es compatible actualmente!\n Por favor, usa el botón de descarga.\n Descarga antes el archivo de Scratch.',
        'ko': '이 장치는 현재 지원되지 않습니다!\n 다운로드 버튼을 사용하세요.\n 먼저 Scratch 파일을 다운로드하세요.'
    },
    downloadtxt: {
        'en':'Now upload the converted file to the TXT via http://192.168.7.2/#txt/Scratch (TXT connected via USB).\n If the page doesnt load, activate the WEB server and the VNC server on the TXT.\n',
        'de':'Lade jetzt die convert Datei auf den TXT via http://192.168.7.2/#txt/Scratch (TXT über USB verbunden).\n Falls die Seite nicht läd -> aktiverie auf dem TXT den WEB Server und den VNC Server.\n',
        'fr': 'Maintenant, téléchargez le fichier converti sur le TXT via http://192.168.7.2/#txt/Scratch (TXT connecté via USB).\n Si la page ne se charge pas, activez le serveur WEB et le serveur VNC sur le TXT.\n',
        'es': 'Ahora sube el archivo convertido al TXT vía http://192.168.7.2/#txt/Scratch (TXT conectado por USB).\n Si la página no carga, activa el servidor WEB y el servidor VNC en el TXT.\n',
        'ko': '이제 변환된 파일을 http://192.168.7.2/#txt/Scratch (USB로 연결된 TXT)로 업로드하세요.\n 페이지가 로드되지 않으면 TXT에서 WEB 서버와 VNC 서버를 활성화하세요.\n'
    },
    downloadftduino: {
        'en':'Currently not supported.',
        'de':'Derzeit nicht unterstützt.',
        'fr': 'Actuellement non pris en charge.',
        'es': 'Actualmente no compatible.',
        'ko': '현재 지원되지 않습니다.'
    },
    downloadtx: {
        'en':'Currently not supported.',
        'de':'Derzeit nicht unterstützt.',
        'fr': 'Actuellement non pris en charge.',
        'es': 'Actualmente no compatible.',
        'ko': '현재 지원되지 않습니다.'
    },
    downloadrx: {
        'en':'Currently not supported.',
        'de':'Derzeit nicht unterstützt.',
        'fr': 'Actuellement non pris en charge.',
        'es': 'Actualmente no compatible.',
        'ko': '현재 지원되지 않습니다.'
    },
    downloadtxt40: {
        'en':'Currently not supported.',
        'de':'Derzeit nicht unterstützt.',
        'fr': 'Actuellement non pris en charge.',
        'es': 'Actualmente no compatible.',
        'ko': '현재 지원되지 않습니다.'
    },
    browsernotwebbt: {
        'en':'Your browser does not support Web Bluetooth.\nPlease use a different browser like Chrome or Edge.',
        'de':'Dein Browser unterstützt kein Web Bluetooth.\nBitte benutze einen anderen Browser wie Chrome oder Edge.',
        'fr': 'Votre navigateur ne prend pas en charge Web Bluetooth.\nVeuillez utiliser un autre navigateur comme Chrome ou Edge.',
        'es': 'Tu navegador no soporta Web Bluetooth.\nPor favor, usa otro navegador como Chrome o Edge.',
        'ko': '브라우저가 Web Bluetooth를 지원하지 않습니다.\nChrome 또는 Edge와 같은 다른 브라우저를 사용하세요.'
    },
    browsernotwebusb: {
        'en':'Your browser does not support Web USB.\nPlease use a different browser like Chrome or Edge.',
        'de':'Dein Browser unterstützt kein Web USB.\nBitte benutze einen anderen Browser wie Chrome oder Edge.',
        'fr': 'Votre navigateur ne prend pas en charge Web USB.\nVeuillez utiliser un autre navigateur comme Chrome ou Edge.',
        'es': 'Tu navegador no soporta Web USB.\nPor favor, usa otro navegador como Chrome o Edge.',
        'ko': '브라우저가 Web USB를 지원하지 않습니다.\nChrome 또는 Edge와 같은 다른 브라우저를 사용하세요.'
    },
    browsernotwebserial: {
        'en':'Your browser does not support Web Serial.\nPlease use a different browser like Chrome or Edge.',
        'de':'Dein Browser unterstützt kein Web Serial.\nBitte benutze einen anderen Browser wie Chrome oder Edge.',
        'fr': 'Votre navigateur ne prend pas en charge Web Serial.\nVeuillez utiliser un autre navigateur comme Chrome ou Edge.',
        'es': 'Tu navegador no soporta Web Serial.\nPor favor, usa otro navegador como Chrome o Edge.',
        'ko': '브라우저가 Web Serial을 지원하지 않습니다.\nChrome 또는 Edge와 같은 다른 브라우저를 사용하세요.'
    },
    mobilewebserial: {
        'en': 'Web Serial is not supported on mobile devices.\nPlease use a desktop browser.',
        'de': 'Web Serial wird auf mobilen Geräten nicht unterstützt.\nBitte benutze einen Desktop-Browser.',
        'fr': 'Web Serial n’est pas pris en charge sur les appareils mobiles.\nVeuillez utiliser un navigateur de bureau.',
        'es': 'Web Serial no es compatible en dispositivos móviles.\nPor favor, usa un navegador de escritorio.',
        'ko': '모바일 기기에서는 Web Serial이 지원되지 않습니다.\n데스크톱 브라우저를 사용하세요.'
    },
    tryagain: {
        'en': 'The Controller is not yet properly connected.\nPlease try again.',
        'de': 'Der Controller ist noch nicht richtig verbunden.\nBitte versuche es erneut.',
        'fr': 'Le contrôleur n’est pas encore correctement connecté.\nVeuillez réessayer.',
        'es': 'El controlador aún no está correctamente conectado.\nPor favor, inténtalo de nuevo.',
        'ko': '컨트롤러가 아직 제대로 연결되지 않았습니다.\n다시 시도해 주세요.'
    },
    noble:{
        'en': 'No access to Bluetooth devices. Please make sure Bluetooth is enabled and allow access to Bluetooth devices.',
        'de': 'Kein Zugriff auf Bluetooth-Geräte. Bitte stelle sicher, dass Bluetooth aktiviert ist und erlaube den Zugriff auf Bluetooth-Geräte.',
        'fr': 'Pas d’accès aux appareils Bluetooth. Veuillez vous assurer que le Bluetooth est activé et autoriser l’accès aux appareils Bluetooth.',
        'es': 'No hay acceso a dispositivos Bluetooth. Asegúrate de que el Bluetooth esté habilitado y permite el acceso a los dispositivos Bluetooth.',
        'ko': 'Bluetooth 장치에 대한 액세스가 없습니다. Bluetooth가 활성화되어 있고 Bluetooth 장치에 대한 액세스가 허용되었는지 확인하세요.'
    },
    linuxwebbt: {
        'en': 'On Linux, Web Bluetooth is only supported with experimental features enabled.\nPlease enable: chrome://flags/#enable-experimental-web-platform-features',
        'de': 'Unter Linux wird Web Bluetooth nur mit aktivierten experimentellen Funktionen unterstützt.\nBitte aktiviere: chrome://flags/#enable-experimental-web-platform-features',
        'fr': 'Sous Linux, Web Bluetooth n’est pris en charge qu’avec les fonctionnalités expérimentales activées.\nVeuillez activer : chrome://flags/#enable-experimental-web-platform-features',
        'es': 'En Linux, Web Bluetooth solo es compatible con funciones experimentales habilitadas.\nPor favor, habilita: chrome://flags/#enable-experimental-web-platform-features',
        'ko': 'Linux에서는 실험적 기능이 활성화된 경우에만 Web Bluetooth가 지원됩니다.\n다음 항목을 활성화하세요: chrome://flags/#enable-experimental-web-platform-features'
    },
    linuxserial: {
        'en': 'On Linux, Web Serial is only enabled with specific groups.\nPlease follow the instructions on the website.',
        'de': 'Unter Linux wird Web Serial nur mit bestimmten Gruppen ermöglicht. \nFolge den Anweisungen auf der Website.',
        'fr': 'Sous Linux, Web Serial n’est activé qu’avec des groupes spécifiques.\nVeuillez suivre les instructions sur le site Web.',
        'es': 'En Linux, Web Serial solo está habilitado con grupos específicos.\nPor favor, sigue las instrucciones en el sitio web.',
        'ko': 'Linux에서는 특정 그룹에서만 Web Serial이 활성화됩니다.\n웹사이트의 지침을 따르세요.'
    },

    camera_permission_check: {
        'en': 'Camera could not be started. Please check permissions.',
        'de': 'Kamera konnte nicht gestartet werden. Bitte Berechtigungen prüfen.',
        'fr': 'La caméra n’a pas pu démarrer. Veuillez vérifier les autorisations.',
        'es': 'No se pudo iniciar la cámara. Por favor, verifica los permisos.',
        'ko': '카메라를 시작할 수 없습니다. 권한을 확인하세요.'
    },
    picture_tf_model_loaded: {
        'en': 'Image TF model loaded!',
        'de': 'Bild-TF Modell geladen!',
        'fr': 'Modèle TF d’image chargé !',
        'es': '¡Modelo de imagen TF cargado!',
        'ko': '이미지 TF 모델이 로드되었습니다!'
    },
    picture_tf_model_not_loaded: {
        'en': 'Image TF model not loaded!',
        'de': 'Bild TF Modell nicht geladen!',
        'fr': 'Modèle TF d’image non chargé !',
        'es': '¡Modelo de imagen TF no cargado!',
        'ko': '이미지 TF 모델이 로드되지 않았습니다!'
    },
    picture_tf_recognition_started: {
        'en': 'Image TF recognition started!',
        'de': 'Bild TF Erkennung gestartet!',
        'fr': 'Reconnaissance d’image TF démarrée !',
        'es': '¡Reconocimiento de imagen TF iniciado!',
        'ko': '이미지 TF 인식이 시작되었습니다!'
    },
    picture_tf_recognition_stopped: {
        'en': 'Image TF recognition stopped!',
        'de': 'Bild TF Erkennung gestoppt!',
        'fr': 'Reconnaissance d’image TF arrêtée !',
        'es': '¡Reconocimiento de imagen TF detenido!',
        'ko': '이미지 TF 인식이 중지되었습니다!'
    },
    picture_tm_model_loaded: {
        'en': 'Image TM model loaded!',
        'de': 'Bild-TM Modell geladen!',
        'fr': 'Modèle TM d’image chargé !',
        'es': '¡Modelo de imagen TM cargado!',
        'ko': '이미지 TM 모델이 로드되었습니다!'
    },
    picture_tm_model_not_loaded: {
        'en': 'Image TM model not loaded!',
        'de': 'Bild TM Modell nicht geladen!',
        'fr': 'Modèle TM d’image non chargé !',
        'es': '¡Modelo de imagen TM no cargado!',
        'ko': '이미지 TM 모델이 로드되지 않았습니다!'
    },
    picture_tm_recognition_started: {
        'en': 'Image TM recognition started!',
        'de': 'Bild TM Erkennung gestartet!',
        'fr': 'Reconnaissance d’image TM démarrée !',
        'es': '¡Reconocimiento de imagen TM iniciado!',
        'ko': '이미지 TM 인식이 시작되었습니다!'
    },
    picture_tm_recognition_stopped: {
        'en': 'Image TM recognition stopped!',
        'de': 'Bild TM Erkennung gestoppt!',
        'fr': 'Reconnaissance d’image TM arrêtée !',
        'es': '¡Reconocimiento de imagen TM detenido!',
        'ko': '이미지 TM 인식이 중지되었습니다!'
    },
    audio_tf_model_loaded: {
        'en': 'Audio TF model loaded!',
        'de': 'Audio-TF Modell geladen!',
        'fr': 'Modèle TF audio chargé !',
        'es': '¡Modelo de audio TF cargado!',
        'ko': '오디오 TF 모델이 로드되었습니다!'
    },
    audio_tf_model_not_loaded: {
        'en': 'Audio TF model not loaded!',
        'de': 'Audio TF Modell nicht geladen!',
        'fr': 'Modèle TF audio non chargé !',
        'es': '¡Modelo de audio TF no cargado!',
        'ko': '오디오 TF 모델이 로드되지 않았습니다!'
    },
    audio_tf_already_running: {
        'en': 'Audio TF recognition is already running!',
        'de': 'Audio TF Erkennung läuft bereits!',
        'fr': 'La reconnaissance audio TF est déjà en cours !',
        'es': '¡El reconocimiento de audio TF ya está en funcionamiento!',
        'ko': '오디오 TF 인식이 이미 실행 중입니다!'
    },
    audio_tf_recognition_started: {
        'en': 'Audio TF recognition started!',
        'de': 'Audio TF Erkennung gestartet!',
        'fr': 'Reconnaissance audio TF démarrée !',
        'es': '¡Reconocimiento de audio TF iniciado!',
        'ko': '오디오 TF 인식이 시작되었습니다!'
    },
    audio_tf_could_not_start: {
        'en': 'Audio TF recognition could not start!',
        'de': 'Audio TF Erkennung konnte nicht gestartet werden!',
        'fr': 'La reconnaissance audio TF n’a pas pu démarrer !',
        'es': '¡El reconocimiento de audio TF no pudo iniciarse!',
        'ko': '오디오 TF 인식을 시작할 수 없습니다!'
    },
    audio_tf_recognition_stopped: {
        'en': 'Audio TF recognition stopped!',
        'de': 'Audio TF Erkennung gestoppt!',
        'fr': 'Reconnaissance audio TF arrêtée !',
        'es': '¡Reconocimiento de audio TF detenido!',
        'ko': '오디오 TF 인식이 중지되었습니다!'
    },
    audio_tm_model_loaded: {
        'en': 'Audio TM model loaded!',
        'de': 'Audio-TM Modell geladen!',
        'fr': 'Modèle TM audio chargé !',
        'es': '¡Modelo de audio TM cargado!',
        'ko': '오디오 TM 모델이 로드되었습니다!'
    },
    audio_tm_model_not_loaded: {
        'en': 'Audio TM model not loaded!',
        'de': 'Audio TM Modell nicht geladen!',
        'fr': 'Modèle TM audio non chargé !',
        'es': '¡Modelo de audio TM no cargado!',
        'ko': '오디오 TM 모델이 로드되지 않았습니다!'
    },
    audio_tm_already_running: {
        'en': 'Audio TM recognition is already running!',
        'de': 'Audio TM Erkennung läuft bereits!',
        'fr': 'La reconnaissance audio TM est déjà en cours !',
        'es': '¡El reconocimiento de audio TM ya está en funcionamiento!',
        'ko': '오디오 TM 인식이 이미 실행 중입니다!'
    },
    audio_tm_recognition_started: {
        'en': 'Audio TM recognition started!',
        'de': 'Audio TM Erkennung gestartet!',
        'fr': 'Reconnaissance audio TM démarrée !',
        'es': '¡Reconocimiento de audio TM iniciado!',
        'ko': '오디오 TM 인식이 시작되었습니다!'
    },
    audio_tm_recognition_failed: {
        'en': 'Audio TM recognition could not start!',
        'de': 'Audio TM Erkennung konnte nicht gestartet werden!',
        'fr': 'La reconnaissance audio TM n’a pas pu démarrer !',
        'es': '¡El reconocimiento de audio TM no pudo iniciarse!',
        'ko': '오디오 TM 인식을 시작할 수 없습니다!'
    },
    audio_tm_recognition_stopped: {
        'en': 'Audio TM recognition stopped!',
        'de': 'Audio TM Erkennung gestoppt!',
        'fr': 'Reconnaissance audio TM arrêtée !',
        'es': '¡Reconocimiento de audio TM detenido!',
        'ko': '오디오 TM 인식이 중지되었습니다!'
    },
    microphone_permission_check: {
        'en': 'Microphone could not be started. Please check permissions.',
        'de': 'Mikrofon konnte nicht gestartet werden. Bitte Berechtigungen prüfen.',
        'fr': 'Le microphone n’a pas pu démarrer. Veuillez vérifier les autorisations.',
        'es': 'No se pudo iniciar el micrófono. Por favor, verifica los permisos.',
        'ko': '마이크를 시작할 수 없습니다. 권한을 확인하세요.'
    },
    pose_tf_model_loaded: {
        'en': 'Pose TF model loaded!',
        'de': 'Pose-TF Modell geladen!',
        'fr': 'Modèle TF de pose chargé !',
        'es': '¡Modelo de pose TF cargado!',
        'ko': '포즈 TF 모델이 로드되었습니다!'
    },
    pose_tf_model_not_loaded: {
        'en': 'Pose TF model not loaded!',
        'de': 'Pose TF Modell nicht geladen!',
        'fr': 'Modèle TF de pose non chargé !',
        'es': '¡Modelo de pose TF no cargado!',
        'ko': '포즈 TF 모델이 로드되지 않았습니다!'
    },
    pose_tf_recognition_started: {
        'en': 'Pose TF recognition started!',
        'de': 'Pose TF Erkennung gestartet!',
        'fr': 'Reconnaissance de pose TF démarrée !',
        'es': '¡Reconocimiento de pose TF iniciado!',
        'ko': '포즈 TF 인식이 시작되었습니다!'
    },
    pose_tf_recognition_stopped: {
        'en': 'Pose TF recognition stopped!',
        'de': 'Pose TF Erkennung gestoppt!',
        'fr': 'Reconnaissance de pose TF arrêtée !',
        'es': '¡Reconocimiento de pose TF detenido!',
        'ko': '포즈 TF 인식이 중지되었습니다!'
    },
    pose_tm_model_loaded: {
        'en': 'Pose TM model loaded!',
        'de': 'Pose-TM Modell geladen!',
        'fr': 'Modèle TM de pose chargé !',
        'es': '¡Modelo de pose TM cargado!',
        'ko': '포즈 TM 모델이 로드되었습니다!'
    },
    pose_tm_model_not_loaded: {
        'en': 'Pose TM model not loaded!',
        'de': 'Pose TM Modell nicht geladen!',
        'fr': 'Modèle TM de pose non chargé !',
        'es': '¡Modelo de pose TM no cargado!',
        'ko': '포즈 TM 모델이 로드되지 않았습니다!'
    },
    pose_tm_recognition_started: {
        'en': 'Pose TM recognition started!',
        'de': 'Pose TM Erkennung gestartet!',
        'fr': 'Reconnaissance de pose TM démarrée !',
        'es': '¡Reconocimiento de pose TM iniciado!',
        'ko': '포즈 TM 인식이 시작되었습니다!'
    },
    pose_tm_recognition_stopped: {
        'en': 'Pose TM recognition stopped!',
        'de': 'Pose TM Erkennung gestoppt!',
        'fr': 'Reconnaissance de pose TM arrêtée !',
        'es': '¡Reconocimiento de pose TM detenido!',
        'ko': '포즈 TM 인식이 중지되었습니다!'
    },
    model_not_loaded: {
        'en': 'Model not loaded!',
        'de': 'Modell nicht geladen!',
        'fr': 'Modèle non chargé !',
        'es': '¡Modelo no cargado!',
        'ko': '모델이 로드되지 않았습니다!'
    },
    no_recognition: {
        'en': 'No recognition!',
        'de': 'Keine Erkennung!',
        'fr': 'Aucune reconnaissance !',
        'es': '¡Sin reconocimiento!',
        'ko': '인식 없음!'
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