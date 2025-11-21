const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const blockIconURI = require('./TensorFlow_small.svg');
const Block = require('../ft_source/block');
const Main = require('../ft_source/index.js');
const Menus = require('../ft_source/menus.js');
var b = new Block();  // access block.js 
var main = new Main(); // access index.js
var m = new Menus(); // access menus.js

const swal = require('sweetalert');

// TensorFlow.js
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-backend-webgl');
//require('@tensorflow/tfjs-backend-webgpu');

// tensorflow models
const mobilenet = require('@tensorflow-models/mobilenet'); // image classification via tfjs
const speechCommands = require('@tensorflow-models/speech-commands') //audio classification via tfjs
const posedetection = require('@tensorflow-models/pose-detection'); // pose detection via tfjs (including MoveNet, BlazePose and PoseNet)

// Teachable Machine libraries (ja nach Modell-Typ)
const tmImage = require('@teachablemachine/image'); // image classification
const tmAudio = require('@tensorflow-models/speech-commands'); // audio classification (via tfjs) //evtl in gui -> npm i util
const tmPose = require('@teachablemachine/pose'); // pose classification

const EXTENSION_ID = 'tensorflow';

class Scratch3TensorFlowBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.models = {
            image: { tfModel: null, tmModel: null },
            audio: { tfModel: null, tmModel: null },
            pose:  { tfModel: null, tmModel: null }
        };
        this.lastPrediction = {
            imageTF: '',
            imageTM: '',
            audioTF: '',
            audioTM: '',
            poseTF: '',
            poseTM: ''
        };
        this.lastPredictionDetails = {
            imageTF:   { className: '', probability: 0 },
            imageTM:   { className: '', probability: 0 },
            audioTF:   { className: '', probability: 0 },
            audioTM:   { className: '', probability: 0 },
            poseTF:    { className: '', probability: 0 },
            poseTM:    { className: '', probability: 0 }
        };
        this.poseTF = {
            keypoints: [],
            minScore: 0.3,
            raw: null
        };
        this.runtime.on('PROJECT_STOP_ALL', this.reset.bind(this));

        // Lazy-Init Promise
        this._tfReadyPromise = null;

        // audio monitoring
        this._audioMonitorActive = false;
        this._audioLevelNormalized = 0; // 0.0 - 1.0
        this._audioCtx = null;
        this._audioAnalyser = null;
        this._audioDataArray = null;
        this._audioStreamMon = null;
        this._audioRAF = null;
        this._audioDbMin = -60;

        translate.setup();
        main.addVersionNumber();
    }

    // Backend safe initialization
    async _ensureTFReady(preferred = 'webgl') {
        if (!this._tfReadyPromise) {
            this._tfReadyPromise = (async () => {
                try {
                    await tf.setBackend(preferred);
                } catch (e) {
                    console.warn(`tf.setBackend(${preferred}) failed, falling back to 'cpu'`, e);
                    await tf.setBackend('cpu');
                }
                await tf.ready();
                //console.info('TF Backend active:', tf.getBackend());
            })();
        }
        return this._tfReadyPromise;
    }

    // Stage preview on/off
    _enableStageCameraPreview(mirror = true) {
        const video = this.runtime?.ioDevices?.video;
        if (!video) return;
        try {
            video.mirror = mirror;
            video.enableVideo(true);
        } catch (e) {
            console.warn('Camera preview could not be enabled:', e);
        }
    }
    _disableStageCameraPreview() {
        const video = this.runtime?.ioDevices?.video;
        if (!video) return;
        try {
            video.disableVideo();
        } catch (e) {
            console.warn('Camera preview could not be disabled:', e);
        }
    }
    _updateStagePreview() {
        const anyVideoActive = this._tmImageStream || this._tfImageStream || this._tmPoseStream || this._tfPoseStream;
        if (!anyVideoActive) this._disableStageCameraPreview();
    }

    // One camera session for all loops (TF/TM, image/pose)
    async _ensureCamera(constraints = { video: { facingMode: 'user', width: 320, height: 240 } }) {
        if (this._cameraVideo && this._cameraStream) return this._cameraVideo;

        const video = document.createElement('video');
        video.width = 320;
        video.height = 240;
        video.autoplay = true;
        video.playsInline = true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            await new Promise(res => (video.onloadedmetadata = () => res()));
            await video.play();

            this._cameraVideo = video;
            this._cameraStream = stream;
            return video;
        } catch (err) {
            console.error('Camera could not be started:', err);
            swal(translate._getText('camera_permission_check', this.locale));
            throw err;
        }
    }
    _stopSharedCamera() {
        if (this._cameraStream) {
            try { this._cameraStream.getTracks().forEach(t => t.stop()); } catch (_) {}
        }
        this._cameraStream = null;
        this._cameraVideo = null;
    }

    getInfo() {
        translate.setup();
        return {
            id: EXTENSION_ID,
            name: 'TensorFlow',
            blockIconURI: blockIconURI,
            showStatusButton: false,
            docsURI: 'https://technika-karlsruhe.github.io/',
            color1: '#FF6F00',
            color2: '#E65100',

            blocks: [
                // === Image ===
                {
                    opcode: 'loadImageTF',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('loadImageTF', this.locale),
                    func: 'loadImageTF'
                },
                {
                    opcode: 'classifyImageTF',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('classifyImageTF', this.locale),
                    arguments: {
                        URL: { type: ArgumentType.STRING, defaultValue: 'https://example.com/image.jpg' }
                    },
                    func: 'classifyImageTF'
                },
                {
                    opcode: 'startImageTF',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('startImageTF', this.locale),
                    func: 'startImageTF'
                },
                {
                    opcode: 'stopImageTF',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('stopImageTF', this.locale),
                    func: 'stopImageTF'
                },
                {
                    opcode: 'getImageTF',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getImageTF', this.locale),
                    func: 'getImageTF'
                },
                {
                    opcode: 'getImageTFClass',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getImageTFClass', this.locale),
                    func: 'getImageTFClass'
                },
                {
                    opcode: 'getImageTFProbability',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getImageTFProbability', this.locale),
                    func: 'getImageTFProbability'
                },

                '---',

                {
                    opcode: 'loadImageTM',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('loadImageTM', this.locale),
                    arguments: {
                        URL: { type: ArgumentType.STRING, defaultValue: 'https://teachablemachine.withgoogle.com/models/XYZ/' }
                    },
                    func: 'loadImageTM'
                },
                {
                    opcode: 'classifyImageTM',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('classifyImageTM', this.locale),
                    arguments: {
                        URL: { type: ArgumentType.STRING, defaultValue: 'https://example.com/image.jpg' }
                    },
                    func: 'classifyImageTM'
                },
                {
                    opcode: 'startImageTM',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('startImageTM', this.locale),
                    func: 'startImageTM'
                },
                {
                    opcode: 'stopImageTM',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('stopImageTM', this.locale),
                    func: 'stopImageTM'
                },
                {
                    opcode: 'getImageTM',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getImageTM', this.locale),
                    func: 'getImageTM'
                },
                {
                    opcode: 'getImageTMClass',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getImageTMClass', this.locale),
                    func: 'getImageTMClass'
                },
                {
                    opcode: 'getImageTMProbability',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getImageTMProbability', this.locale),
                    func: 'getImageTMProbability'
                },

                '---',

                // === Audio ===
                {
                    opcode: 'loadAudioTF',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('loadAudioTF', this.locale),
                    func: 'loadAudioTF'
                },
                {
                    opcode: 'classifyAudioTF',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('classifyAudioTF', this.locale),
                    func: 'classifyAudioTF'
                },
                {
                    opcode: 'startAudioTF',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('startAudioTF', this.locale),
                    func: 'startAudioTF'
                },
                {
                    opcode: 'stopAudioTF',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('stopAudioTF', this.locale),
                    func: 'stopAudioTF'
                },
                {
                    opcode: 'getAudioTF',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getAudioTF', this.locale),
                    func: 'getAudioTF'
                },
                {
                    opcode: 'getAudioTFClass',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getAudioTFClass', this.locale),
                    func: 'getAudioTFClass'
                },
                {
                    opcode: 'getAudioTFProbability',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getAudioTFProbability', this.locale),
                    func: 'getAudioTFProbability'
                },

                '---',

                {
                    opcode: 'loadAudioTM',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('loadAudioTM', this.locale),
                    arguments: {
                        URL: { type: ArgumentType.STRING, defaultValue: 'https://teachablemachine.withgoogle.com/models/ABC/' }
                    },
                    func: 'loadAudioTM'
                },
                {
                    opcode: 'classifyAudioTM',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('classifyAudioTM', this.locale),
                    func: 'classifyAudioTM'
                },
                {
                    opcode: 'startAudioTM',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('startAudioTM', this.locale),
                    func: 'startAudioTM'
                },
                {
                    opcode: 'stopAudioTM',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('stopAudioTM', this.locale),
                    func: 'stopAudioTM'
                },
                {
                    opcode: 'getAudioTM',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getAudioTM', this.locale),
                    func: 'getAudioTM'
                },
                {
                    opcode: 'getAudioTMClass',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getAudioTMClass', this.locale),
                    func: 'getAudioTMClass'
                },
                {
                    opcode: 'getAudioTMProbability',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getAudioTMProbability', this.locale),
                    func: 'getAudioTMProbability'
                },

                '---',

                // boolean block for audio level
                {
                    opcode: 'isAudioAbove',
                    blockType: BlockType.BOOLEAN,
                    text: translate._getText('isAudioAbove', this.locale),
                    arguments: {
                        THRESHOLD: { type: ArgumentType.NUMBER, defaultValue: 30 }
                    },
                    func: 'isAudioAbove'
                },

                '---',

                // === Pose ===
                {
                    opcode: 'loadPoseTF',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('loadPoseTF', this.locale),
                    func: 'loadPoseTF'
                },
                {
                    opcode: 'startPoseTF',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('startPoseTF', this.locale),
                    func: 'startPoseTF'
                },
                {
                    opcode: 'stopPoseTF',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('stopPoseTF', this.locale),
                    func: 'stopPoseTF'
                },
                {
                    opcode: 'getPoseTF',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getPoseTF', this.locale),
                    func: 'getPoseTF'
                },
                {
                    opcode: 'setPoseTFMinScore',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('setPoseTFMinScore', this.locale),
                    arguments: {
                        SCORE: { type: ArgumentType.NUMBER, defaultValue: 0.3 }
                    },
                    func: 'setPoseTFMinScore'
                },
                {
                    opcode: 'poseTFKeypointsCount',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('poseTFKeypointsCount', this.locale),
                    func: 'poseTFKeypointsCount'
                },
                {
                    opcode: 'poseTFKeypointX',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('poseTFKeypointX', this.locale),
                    arguments: {
                        NAME: { type: ArgumentType.STRING, menu: 'keypointNames', defaultValue: 'nose' }
                    },
                    func: 'poseTFKeypointX'
                },
                {
                    opcode: 'poseTFKeypointY',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('poseTFKeypointY', this.locale),
                    arguments: {
                        NAME: { type: ArgumentType.STRING, menu: 'keypointNames', defaultValue: 'nose' }
                    },
                    func: 'poseTFKeypointY'
                },
                {
                    opcode: 'poseTFKeypointScore',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('poseTFKeypointScore', this.locale),
                    arguments: {
                        NAME: { type: ArgumentType.STRING, menu: 'keypointNames', defaultValue: 'nose' }
                    },
                    func: 'poseTFKeypointScore'
                },
                {
                    opcode: 'poseTFHasKeypoint',
                    blockType: BlockType.BOOLEAN,
                    text: translate._getText('poseTFHasKeypoint', this.locale),
                    arguments: {
                        NAME: { type: ArgumentType.STRING, menu: 'keypointNames', defaultValue: 'nose' }
                    },
                    func: 'poseTFHasKeypoint'
                },
                {
                    opcode: 'getPoseTFRaw',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getPoseTFRaw', this.locale),
                    func: 'getPoseTFRaw'
                },

                '---',

                {
                    opcode: 'loadPoseTM',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('loadPoseTM', this.locale),
                    arguments: {
                        URL: { type: ArgumentType.STRING, defaultValue: 'https://teachablemachine.withgoogle.com/models/DEF/' }
                    },
                    func: 'loadPoseTM'
                },
                {
                    opcode: 'startPoseTM',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('startPoseTM', this.locale),
                    func: 'startPoseTM'
                },
                {
                    opcode: 'stopPoseTM',
                    blockType: BlockType.COMMAND,
                    text: translate._getText('stopPoseTM', this.locale),
                    func: 'stopPoseTM'
                },
                {
                    opcode: 'getPoseTM',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getPoseTM', this.locale),
                    func: 'getPoseTM'
                },
                {
                    opcode: 'getPoseTMClass',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getPoseTMClass', this.locale),
                    func: 'getPoseTMClass'
                },
                {
                    opcode: 'getPoseTMProbability',
                    blockType: BlockType.REPORTER,
                    text: translate._getText('getPoseTMProbability', this.locale),
                    func: 'getPoseTMProbability'
                }
            ],

            menus: {
                keypointNames: {
                    items: [
                        { text: translate._getText('kp_nose', this.locale), value: 'nose' },
                        { text: translate._getText('kp_left_eye', this.locale), value: 'left_eye' },
                        { text: translate._getText('kp_right_eye', this.locale), value: 'right_eye' },
                        { text: translate._getText('kp_left_ear', this.locale), value: 'left_ear' },
                        { text: translate._getText('kp_right_ear', this.locale), value: 'right_ear' },
                        { text: translate._getText('kp_left_shoulder', this.locale), value: 'left_shoulder' },
                        { text: translate._getText('kp_right_shoulder', this.locale), value: 'right_shoulder' },
                        { text: translate._getText('kp_left_elbow', this.locale), value: 'left_elbow' },
                        { text: translate._getText('kp_right_elbow', this.locale), value: 'right_elbow' },
                        { text: translate._getText('kp_left_wrist', this.locale), value: 'left_wrist' },
                        { text: translate._getText('kp_right_wrist', this.locale), value: 'right_wrist' },
                        { text: translate._getText('kp_left_hip', this.locale), value: 'left_hip' },
                        { text: translate._getText('kp_right_hip', this.locale), value: 'right_hip' },
                        { text: translate._getText('kp_left_knee', this.locale), value: 'left_knee' },
                        { text: translate._getText('kp_right_knee', this.locale), value: 'right_knee' },
                        { text: translate._getText('kp_left_ankle', this.locale), value: 'left_ankle' },
                        { text: translate._getText('kp_right_ankle', this.locale), value: 'right_ankle' }
                    ]
                }
            }
        };
    }

    // === Image – TensorFlow ===
    async loadImageTF() {
        await this._ensureTFReady();
        this.models.image.tfModel = await mobilenet.load();
        swal(translate._getText('picture_tf_model_loaded', this.locale));
    }

    async classifyImageTF(args) {
        await this._ensureTFReady();
        if (!this.models.image.tfModel) return translate._getText('model_not_loaded', this.locale);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = args.URL;
        await new Promise(res => (img.onload = res));
        const preds = await this.models.image.tfModel.classify(img);
        const p = preds[0];
        if (p) {
            this.lastPredictionDetails.imageTF.className = p.className;
            this.lastPredictionDetails.imageTF.probability = p.probability;
            this.lastPrediction.imageTF = `${p.className} (${(p.probability * 100).toFixed(1)}%)`;
        }
        return p ? this.lastPrediction.imageTF : translate._getText('no_recognition', this.locale);
    }

    async startImageTF() {
        await this._ensureTFReady();
        if (!this.models.image.tfModel) {
            swal(translate._getText('picture_tf_model_not_loaded', this.locale));
            return;
        }

        this._enableStageCameraPreview(true);

        const video = document.createElement('video');
        video.width = 320;
        video.height = 240;
        video.autoplay = true;
        video.playsInline = true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            video.srcObject = stream;
            await new Promise(res => (video.onloadedmetadata = () => res()));
            await video.play();

            this._tfImageVideo = video;
            this._tfImageStream = stream;

            const loop = async () => {
                try {
                    const preds = await this.models.image.tfModel.classify(video);
                    const p = preds?.[0];
                    if (p) {
                        this.lastPredictionDetails.imageTF.className = p.className;
                        this.lastPredictionDetails.imageTF.probability = p.probability;
                        this.lastPrediction.imageTF = `${p.className} (${(p.probability * 100).toFixed(1)}%)`;
                    }
                } catch (e) {
                    console.error('Bild TF loop error:', e);
                }
                this._tfImageRAF = requestAnimationFrame(loop);
            };

            this._tfImageRAF = requestAnimationFrame(loop);
            swal(translate._getText('picture_tf_recognition_started', this.locale));
        } catch (err) {
            console.error('Camera could not be started:', err);
            swal(translate._getText('camera_permission_check', this.locale));
        }
    }

    stopImageTF() {
        if (this._tfImageRAF) {
            cancelAnimationFrame(this._tfImageRAF);
            this._tfImageRAF = null;
        }
        if (this._tfImageStream) {
            try { this._tfImageStream.getTracks().forEach(t => t.stop()); } catch (_) {}
            this._tfImageStream = null;
        }
        this._tfImageVideo = null;
        this._updateStagePreview();
        swal(translate._getText('picture_tf_recognition_stopped', this.locale));
    }

    async getImageTF() {
        return this.lastPrediction.imageTF || translate._getText('no_recognition', this.locale);
    }

    getImageTFClass() {
        return this.lastPredictionDetails.imageTF.className || '';
    }

    getImageTFProbability() {
        const p = this.lastPredictionDetails.imageTF.probability;
        return p ? Number((p * 100).toFixed(1)) : 0;
    }

    // === Image – Teachable Machine ===
    async loadImageTM(args) {
        await this._ensureTFReady();
        const modelURL = args.URL + "model.json";
        const metadataURL = args.URL + "metadata.json";
        this.models.image.tmModel = await tmImage.load(modelURL, metadataURL);
        swal(translate._getText('picture_tm_model_loaded', this.locale));
    }

    async classifyImageTM(args) {
        await this._ensureTFReady();
        if (!this.models.image.tmModel) return translate._getText('model_not_loaded', this.locale);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = args.URL;
        await new Promise(res => (img.onload = res));
        const prediction = await this.models.image.tmModel.predict(img);
        // prediction is an array with {className, probability}
        const highest = prediction.reduce((prev,curr) => curr.probability > prev.probability ? curr : prev, {probability:0});
        this.lastPredictionDetails.imageTM.className = highest.className;
        this.lastPredictionDetails.imageTM.probability = highest.probability;
        this.lastPrediction.imageTM = `${highest.className} (${(highest.probability * 100).toFixed(1)}%)`;
        return this.lastPrediction.imageTM;
    }

    async startImageTM() {
        await this._ensureTFReady();
        if (!this.models.image.tmModel) {
            swal(translate._getText('picture_tm_model_not_loaded', this.locale));
            return;
        }

        this._enableStageCameraPreview(true);

        const video = document.createElement('video');
        video.width = 320;
        video.height = 240;
        video.autoplay = true;
        video.playsInline = true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            video.srcObject = stream;
            await new Promise(res => (video.onloadedmetadata = () => res()));
            await video.play();

            this._tmImageVideo = video;
            this._tmImageStream = stream;

            const loop = async () => {
                try {
                    const prediction = await this.models.image.tmModel.predict(video);
                    const best = prediction.reduce((a, b) => (b.probability > a.probability ? b : a), { probability: 0 });
                    this.lastPredictionDetails.imageTM.className = best.className;
                    this.lastPredictionDetails.imageTM.probability = best.probability;
                    this.lastPrediction.imageTM = `${best.className} (${(best.probability * 100).toFixed(1)}%)`;
                } catch (e) {
                    console.error('Bild TM loop error:', e);
                }
                this._tmImageRAF = requestAnimationFrame(loop);
            };

            this._tmImageRAF = requestAnimationFrame(loop);
            swal(translate._getText('picture_tm_recognition_started', this.locale));
        } catch (err) {
            console.error('Camera could not be started:', err);
            swal(translate._getText('camera_permission_check', this.locale));
        }
    }

    stopImageTM() {
        if (this._tmImageRAF) {
            cancelAnimationFrame(this._tmImageRAF);
            this._tmImageRAF = null;
        }
        if (this._tmImageStream) {
            try { this._tmImageStream.getTracks().forEach(t => t.stop()); } catch (_) {}
            this._tmImageStream = null;
        }
        this._tmImageVideo = null;
        this._updateStagePreview();
        swal(translate._getText('picture_tm_recognition_stopped', this.locale));
    }

    async getImageTM() {
        return this.lastPrediction.imageTM || translate._getText('no_recognition', this.locale);
    }

    getImageTMClass() {
        return this.lastPredictionDetails.imageTM.className || '';
    }

    getImageTMProbability() {
        const p = this.lastPredictionDetails.imageTM.probability;
        return p ? Number((p * 100).toFixed(1)) : 0;
    }

    // === Audio – TensorFlow ===
    async loadAudioTF() {
        await this._ensureTFReady();
        const recognizer = speechCommands.create('BROWSER_FFT'); // pre-trained model
        await recognizer.ensureModelLoaded();
        this.models.audio.tfModel = recognizer;
        swal(translate._getText('audio_tf_model_loaded', this.locale));
    }

    async classifyAudioTF(args) {
        await this._ensureTFReady();
        const recognizer = this.models.audio.tfModel;
        if (!recognizer) return translate._getText('model_not_loaded', this.locale);

        if ((recognizer.isListening && recognizer.isListening()) || this._tfAudioListening) {
            return this.lastPrediction.audioTF || translate._getText('no_recognition', this.locale);
        }

        const labels = recognizer.wordLabels();
        let best = {label: 'unknown', score: 0};

        await new Promise((resolve, reject) => {
            try {
                recognizer.listen(result => {
                    const {scores} = result;
                    const maxIdx = scores.indexOf(Math.max(...scores));
                    const score = scores[maxIdx] || 0;
                    if (score > best.score) {
                        best = {label: labels[maxIdx] || 'unknown', score};
                    }
                }, {
                    includeSpectrogram: false,
                    probabilityThreshold: 0,   // we choose the best ourselves
                    overlapFactor: 0.999
                });

                setTimeout(() => {
                    recognizer.stopListening();
                    resolve();
                }, 1500);
            } catch (e) {
                try { recognizer.stopListening(); } catch (_) {}
                reject(e);
            }
        });

        this.lastPredictionDetails.audioTF.className = best.label;
        this.lastPredictionDetails.audioTF.probability = best.score;
        this.lastPrediction.audioTF = `${best.label} (${(best.score * 100).toFixed(1)}%)`;

        return this.lastPrediction.audioTF;
    }

    async startAudioTF() {
        await this._ensureTFReady();
        const recognizer = this.models.audio.tfModel;
        if (!recognizer) {
            swal(translate._getText('audio_tf_model_not_loaded', this.locale));
            return;
        }
        if (this._tfAudioListening) {
            swal(translate._getText('audio_tf_already_running', this.locale));
            return;
        }

        const labels = recognizer.wordLabels();
        try {
            this._tfAudioListening = true;
            recognizer.listen(result => {
                const {scores} = result;
                const maxIdx = scores.indexOf(Math.max(...scores));
                const label = labels[maxIdx] || 'unknown';
                const score = scores[maxIdx] || 0;

                this.lastPredictionDetails.audioTF.className = label;
                this.lastPredictionDetails.audioTF.probability = score;
                this.lastPrediction.audioTF = `${label} (${(score * 100).toFixed(1)}%)`;
            }, {
                includeSpectrogram: false,
                probabilityThreshold: 0,
                overlapFactor: 0.999
            });
            swal(translate._getText('audio_tf_recognition_started', this.locale));
        } catch (e) {
            console.error('Audio TF listen error:', e);
            this._tfAudioListening = false;
            swal(translate._getText('audio_tf_could_not_start', this.locale));
        }
    }

    stopAudioTF() {
        if (this._tfAudioListening && this.models.audio?.tfModel) {
            try { this.models.audio.tfModel.stopListening(); } catch (_) {}
        }
        this._tfAudioListening = false;
        swal(translate._getText('audio_tf_recognition_stopped', this.locale));
    }

    getAudioTF() {
        return this.lastPrediction.audioTF || translate._getText('no_recognition', this.locale);
    }
    getAudioTFClass() {
        return this.lastPredictionDetails.audioTF.className || '';
    }
    getAudioTFProbability() {
        const p = this.lastPredictionDetails.audioTF.probability;
        return p ? Number((p * 100).toFixed(1)) : 0;
    }

    // === Audio – Teachable Machine ===
    async loadAudioTM(args) {
        await this._ensureTFReady();
        const URL = args.URL;
        // speech-commands: Recognizer with TM-Model/Metadata
        // https://github.com/tensorflow/tfjs-models/tree/master/speech-commands
        this.models.audio.tmModel = await tmAudio.create(
            'BROWSER_FFT',
            undefined,
            URL + 'model.json',
            URL + 'metadata.json'
        );
        await this.models.audio.tmModel.ensureModelLoaded();
        swal(translate._getText('audio_tm_model_loaded', this.locale));
    }

    async classifyAudioTM(args) {
        await this._ensureTFReady();
        if (!this.models.audio.tmModel) return translate._getText('model_not_loaded', this.locale);
        const recognizer = this.models.audio.tmModel;

        if ((recognizer.isListening && recognizer.isListening()) || this._tmAudioListening) {
            return this.lastPrediction.audioTM || translate._getText('no_recognition', this.locale);
        }

        // Short microphone listening (e.g. ~1.5s) and return best label.
        const labels = recognizer.wordLabels();
        let best = {label: 'unknown', score: 0};

        await new Promise((resolve, reject) => {
            try {
                recognizer.listen(result => {
                    const {scores} = result;
                    const maxIdx = scores.indexOf(Math.max(...scores));
                    const score = scores[maxIdx] || 0;
                    if (score > best.score) {
                        best = {label: labels[maxIdx] || 'unknown', score};
                    }
                }, {
                    includeSpectrogram: false,
                    probabilityThreshold: 0,   // allow all, we pick the best ourselves
                    overlapFactor: 0.999       // almost continuous
                });

                setTimeout(() => {
                    recognizer.stopListening();
                    resolve();
                }, 1500);
            } catch (e) {
                try { recognizer.stopListening(); } catch (_) {}
                reject(e);
            }
        });

        this.lastPredictionDetails.audioTM.className = best.label;
        this.lastPredictionDetails.audioTM.probability = best.score;
        this.lastPrediction.audioTM = `${best.label} (${(best.score * 100).toFixed(1)}%)`;

        return this.lastPrediction.audioTM;
    }

    async startAudioTM() {
        await this._ensureTFReady();
        const recognizer = this.models.audio.tmModel;
        if (!recognizer) {
            swal(translate._getText('audio_tm_model_not_loaded', this.locale));
            return;
        }
        if (this._tmAudioListening) {
            swal(translate._getText('audio_tm_already_running', this.locale));
            return;
        }

        const labels = recognizer.wordLabels();
        try {
            this._tmAudioListening = true;
            recognizer.listen(result => {
                const {scores} = result;
                const maxIdx = scores.indexOf(Math.max(...scores));
                const label = labels[maxIdx] || 'unknown';
                const score = scores[maxIdx] || 0;

                this.lastPredictionDetails.audioTM.className = label;
                this.lastPredictionDetails.audioTM.probability = score;
                this.lastPrediction.audioTM = `${label} (${(score * 100).toFixed(1)}%)`;
            }, {
                includeSpectrogram: false,
                probabilityThreshold: 0,
                overlapFactor: 0.999
            });
            swal(translate._getText('audio_tm_recognition_started', this.locale));
        } catch (e) {
            console.error('Audio TM listen error:', e);
            this._tmAudioListening = false;
            swal(translate._getText('audio_tm_recognition_failed', this.locale));
        }
    }

    stopAudioTM() {
        if (this._tmAudioListening && this.models.audio?.tmModel) {
            try { this.models.audio.tmModel.stopListening(); } catch (_) {}
        }
        this._tmAudioListening = false;
        swal(translate._getText('audio_tm_recognition_stopped', this.locale));
    }

    getAudioTM() {
        return this.lastPrediction.audioTM || translate._getText('no_recognition', this.locale);
    }
    getAudioTMClass() {
        return this.lastPredictionDetails.audioTM.className || '';
    }
    getAudioTMProbability() {
        const p = this.lastPredictionDetails.audioTM.probability;
        return p ? Number((p * 100).toFixed(1)) : 0;
    }

    // ===== Audio-Level Monitor =====
    async _startAudioLevelMonitor() {
        if (this._audioMonitorActive) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.8;

            const dataBytes = new Uint8Array(analyser.fftSize);
            const dataFloats = new Float32Array(analyser.fftSize);
            source.connect(analyser);

            this._audioCtx = audioCtx;
            this._audioAnalyser = analyser;
            this._audioDataArray = dataBytes;
            this._audioDataFloat = dataFloats;
            this._audioStreamMon = stream;
            this._audioMonitorActive = true;

            const loop = () => {
                if (!this._audioMonitorActive) return;
                try {
                    let rms = 0;

                    if (typeof analyser.getFloatTimeDomainData === 'function') {
                        analyser.getFloatTimeDomainData(dataFloats); // -1..1
                        let sum = 0;
                        for (let i = 0; i < dataFloats.length; i++) {
                            const v = dataFloats[i];
                            sum += v * v;
                        }
                        rms = Math.sqrt(sum / dataFloats.length);
                    } else {
                        analyser.getByteTimeDomainData(dataBytes); // 0..255, middle 128
                        let sum = 0;
                        for (let i = 0; i < dataBytes.length; i++) {
                            const v = (dataBytes[i] - 128) / 128; // -1..1
                            sum += v * v;
                        }
                        rms = Math.sqrt(sum / dataBytes.length);
                    }

                    // Calculate dBFS and normalize to 0..1
                    const db = 20 * Math.log10(rms + 1e-8); // avoids log(0)
                    const norm = (db - this._audioDbMin) / (0 - this._audioDbMin);
                    this._audioLevelNormalized = Math.max(0, Math.min(1, norm));
                } catch (_) {}
                this._audioRAF = requestAnimationFrame(loop);
            };
            this._audioRAF = requestAnimationFrame(loop);
        } catch (e) {
            console.error('Audio level monitor could not be started:', e);
            swal(translate._getText('microphone_permission_check', this.locale));
            this._audioMonitorActive = false;
        }
    }

    async _ensureAudioMonitor() {
        if (!this._audioMonitorActive) {
            await this._startAudioLevelMonitor();
        }
    }

    _stopAudioLevelMonitor() {
        if (this._audioRAF) {
            cancelAnimationFrame(this._audioRAF);
            this._audioRAF = null;
        }
        if (this._audioStreamMon) {
            try { this._audioStreamMon.getTracks().forEach(t => t.stop()); } catch (_) {}
            this._audioStreamMon = null;
        }
        if (this._audioCtx) {
            try { this._audioCtx.close(); } catch (_) {}
            this._audioCtx = null;
        }
        this._audioAnalyser = null;
        this._audioDataArray = null;
        this._audioDataFloat = null;
        this._audioMonitorActive = false;
        this._audioLevelNormalized = 0;
    }

    // Boolean Block: Audio level above threshold?
    async isAudioAbove(args) {
        const threshold = Math.max(0, Math.min(100, Number(args.THRESHOLD) || 0)); // 0..100
        await this._ensureAudioMonitor();
        // Compare percent
        const levelPercent = this._audioLevelNormalized * 100;
        //console.log('Audio level:', levelPercent.toFixed(1), '% (Threshold:', threshold, '%)');
        return levelPercent >= threshold;
    }

    // === Pose – TensorFlow ===
    async loadPoseTF() {
        await this._ensureTFReady();
        const config = {
            modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING
            // alternatives:
            // modelType: posedetection.movenet.modelType.SINGLEPOSE_THUNDER
            // modelType: posedetection.movenet.modelType.MULTIPOSE_LIGHTNING
        };
        this.models.pose.tfModel = await posedetection.createDetector(
            posedetection.SupportedModels.MoveNet,
            config
        );
        swal(translate._getText('pose_tf_model_loaded', this.locale));
    }

    async startPoseTF() {
        await this._ensureTFReady();
        if (!this.models.pose.tfModel) {
            swal(translate._getText('pose_tf_model_not_loaded', this.locale));
            return;
        }

        // Preview on the stage (may open a second camera session)
        this._enableStageCameraPreview(true);

        const detector = this.models.pose.tfModel;

        // Start camera
        const video = document.createElement('video');
        video.width = 320;
        video.height = 240;
        video.autoplay = true;
        video.playsInline = true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            video.srcObject = stream;
            await new Promise(res => (video.onloadedmetadata = () => res()));
            await video.play();

            // Remember references to stop cleanly later
            this._tfPoseVideo = video;
            this._tfPoseStream = stream;

            const loop = async () => {
                try {
                    const poses = await detector.estimatePoses(video);
                    const pose = poses[0];
                    if (pose) {
                        this.poseTF.raw = pose;
                        // Filter by minimum score
                        this.poseTF.keypoints = (pose.keypoints || []).filter(k =>
                            k.score === undefined || k.score >= this.poseTF.minScore
                        );
                    } else {
                        this.poseTF.raw = null;
                        this.poseTF.keypoints = [];
                    }
                    // For backward compatibility:
                    this.lastPrediction.poseTF = String(this.poseTF.keypoints.length);
                } catch (e) {
                    console.error('Pose TF loop error:', e);
                }
                this._tfPoseRAF = requestAnimationFrame(loop);
            };

            this._tfPoseRAF = requestAnimationFrame(loop);
            swal(translate._getText('pose_tf_recognition_started', this.locale));
        } catch (err) {
            console.error('Camera could not be started:', err);
            swal(translate._getText('camera_permission_check', this.locale));
        }
    }

    stopPoseTF() {
        if (this._tfPoseRAF) {
            cancelAnimationFrame(this._tfPoseRAF);
            this._tfPoseRAF = null;
        }
        if (this._tfPoseStream) {
            try { this._tfPoseStream.getTracks().forEach(t => t.stop()); } catch (_) {}
            this._tfPoseStream = null;
        }
        this._tfPoseVideo = null;
        this._updateStagePreview();
        swal(translate._getText('pose_tf_recognition_stopped', this.locale));
    }

    getPoseTF() {
        return String(this.poseTF.keypoints.length);
    }

    setPoseTFMinScore(args) {
        const v = Number(args.SCORE);
        if (!isNaN(v)) this.poseTF.minScore = Math.max(0, Math.min(1, v));
    }

    poseTFKeypointsCount() {
        return String(this.poseTF.keypoints.length);
    }

    _findPoseTFKeypoint(name) {
        if (!name) return null;
        return this.poseTF.keypoints.find(k => k.name === name) ||
               (this.poseTF.raw?.keypoints || []).find(k => k.name === name) ||
               null;
    }

    poseTFKeypointX(args) {
        const kp = this._findPoseTFKeypoint(args.NAME);
        return kp ? Math.round(kp.x) : 0;
    }

    poseTFKeypointY(args) {
        const kp = this._findPoseTFKeypoint(args.NAME);
        return kp ? Math.round(kp.y) : 0;
    }

    poseTFKeypointScore(args) {
        const kp = this._findPoseTFKeypoint(args.NAME);
        return kp && typeof kp.score === 'number' ? Number((kp.score * 100).toFixed(1)) : 0;
    }

    poseTFHasKeypoint(args) {
        return !!this._findPoseTFKeypoint(args.NAME);
    }

    getPoseTFRaw() {
        return this.poseTF.raw ? JSON.stringify(this.poseTF.raw) : '';
    }

    // === Pose – Teachable Machine ===
    async loadPoseTM(args) {
        await this._ensureTFReady();
        const modelURL = args.URL + "model.json";
        const metadataURL = args.URL + "metadata.json";
        this.models.pose.tmModel = await tmPose.load(modelURL, metadataURL);
        swal(translate._getText('pose_tm_model_loaded', this.locale));
    }

    async startPoseTM() {
        await this._ensureTFReady();
        if (!this.models.pose.tmModel) {
            swal(translate._getText('pose_tm_model_not_loaded', this.locale));
            return;
        }

        this._enableStageCameraPreview(true);

        const model = this.models.pose.tmModel;

        // Start camera
        const video = document.createElement('video');
        video.width = 320;
        video.height = 240;
        video.autoplay = true;
        video.playsInline = true;

        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
        await new Promise(res => (video.onloadedmetadata = () => res()));
        await video.play();

        // Remember references to stop cleanly later
        this._tmPoseVideo = video;
        this._tmPoseStream = stream;

        const loop = async () => {
            try {
                // Important: first estimatePose, then predict with posenetOutput
                const { pose, posenetOutput } = await model.estimatePose(video);
                const prediction = await model.predict(posenetOutput);

                const best = prediction.reduce((a, b) => (b.probability > a.probability ? b : a), { probability: 0 });
                //this.lastPrediction.pose = JSON.stringify({
                //    className: best.className,
                //    probability: best.probability,
                //    // optional: raw values, if needed
                //    // prediction
                //});
                this.lastPredictionDetails.poseTM.className = best.className;
                this.lastPredictionDetails.poseTM.probability = best.probability;
                this.lastPrediction.poseTM = `${best.className} (${(best.probability * 100).toFixed(1)}%)`;
            } catch (e) {
                console.error('Pose TM loop error:', e);
            }
            this._tmPoseRAF = requestAnimationFrame(loop);
        };

        this._tmPoseRAF = requestAnimationFrame(loop);
        swal(translate._getText('pose_tm_recognition_started', this.locale));
    }

    stopPoseTM() {
        if (this._tmPoseRAF) {
            cancelAnimationFrame(this._tmPoseRAF);
            this._tmPoseRAF = null;
        }
        if (this._tmPoseStream) {
            try { this._tmPoseStream.getTracks().forEach(t => t.stop()); } catch (_) {}
            this._tmPoseStream = null;
        }
        this._tmPoseVideo = null;
        this._updateStagePreview();
        swal(translate._getText('pose_tm_recognition_stopped', this.locale));
    }

    async getPoseTM() {
        return this.lastPrediction.poseTM || translate._getText('no_recognition', this.locale);
    }

    getPoseTMClass() {
        return this.lastPredictionDetails.poseTM.className || '';
    }

    getPoseTMProbability() {
        const p = this.lastPredictionDetails.poseTM.probability;
        return p ? Number((p * 100).toFixed(1)) : 0;
    }

    reset() {
        //console.log('TensorFlow extension reset');
        // Image TM Loop stop and release camera
        if (this._tmImageRAF) {
            cancelAnimationFrame(this._tmImageRAF);
            this._tmImageRAF = null;
        }
        if (this._tmImageStream) {
            this._tmImageStream.getTracks().forEach(t => t.stop());
            this._tmImageStream = null;
        }
        this._tmImageVideo = null;

        // Image TF Loop stop and release camera
        if (this._tfImageRAF) {
            cancelAnimationFrame(this._tfImageRAF);
            this._tfImageRAF = null;
        }
        if (this._tfImageStream) {
            this._tfImageStream.getTracks().forEach(t => t.stop());
            this._tfImageStream = null;
        }
        this._tfImageVideo = null;

        // Pose TM Loop stop and release camera
        if (this._tmPoseRAF) {
            cancelAnimationFrame(this._tmPoseRAF);
            this._tmPoseRAF = null;
        }
        if (this._tmPoseStream) {
            this._tmPoseStream.getTracks().forEach(t => t.stop());
            this._tmPoseStream = null;
        }
        this._tmPoseVideo = null;

        // Pose TF Loop stop and release camera
        if (this._tfPoseRAF) {
            cancelAnimationFrame(this._tfPoseRAF);
            this._tfPoseRAF = null;
        }
        if (this._tfPoseStream) {
            this._tfPoseStream.getTracks().forEach(t => t.stop());
            this._tfPoseStream = null;
        }
        this._tfPoseVideo = null;
        this.poseTF.raw = null;
        this.poseTF.keypoints = [];

        // Audio TF stop
        if (this._tfAudioListening && this.models.audio?.tfModel) {
            try { this.models.audio.tfModel.stopListening(); } catch (_) {}
        }
        this._tfAudioListening = false;

        // Audio TM stop
        if (this._tmAudioListening && this.models.audio?.tmModel) {
            try { this.models.audio.tmModel.stopListening(); } catch (_) {}
        }
        this._tmAudioListening = false;

        // Audio level monitor stop
        this._stopAudioLevelMonitor();

        // Dispose pose detector if necessary
        try {
            this.models.pose?.tfModel?.dispose?.();
        } catch (_) {}

        // Stop shared camera
        this._stopSharedCamera();

        this._disableStageCameraPreview();
    }
}

module.exports = Scratch3TensorFlowBlocks;
