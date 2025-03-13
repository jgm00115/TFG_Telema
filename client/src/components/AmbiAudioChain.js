import SceneRotator from "./SceneRotator.js";
import HOAHRTFConvolver from "./HOAHRTFConvolver.js";
export class AmbiAudioChain {

    // Attributes
    _audioCtx = null;
    _sourceNode = null;
    _splitterNode = null;
    _hoaHrtfConvolver = null;
    _sceneRotator = null;
    _masterGain = null;

    // Constructor

    constructor(audioCtx, order, defaultGain, hrtfs) {
        this._maxNumChannels = (order + 1) * (order + 1);
        console.log(`Creating new audio chain:  
        3DOF single position rendering of order ${order} with ${this._maxNumChannels} channels`);
        // creating new audio context
        this._audioCtx = audioCtx
        this._hoaHrtfConvolver = new HOAHRTFConvolver(this._audioCtx, order,hrtfs);
        this._sceneRotator = new SceneRotator(this._audioCtx, 2);
        console.log(this._sceneRotator);

        this._sceneRotator.out.connect(this._hoaHrtfConvolver.in);
    }

    getInputNode() {
        return this._sceneRotator.in;
    }
    getOutputNode() {
        return this._hoaHrtfConvolver.out;
    }

    getFadersGain() {
        return Array(this._maxNumChannels).fill(1);
    }

    setFadersGain(gains) {
    }

    rotateScene(azimuth, elevation) {
        this._sceneRotator.yaw = azimuth;
        this._sceneRotator.pitch = elevation;
        this._sceneRotator.updateRotMtx();
    }
}

