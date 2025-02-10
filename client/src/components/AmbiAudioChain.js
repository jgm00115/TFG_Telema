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
        /*
        this._masterGain = this._audioCtx.createGain();
        this._masterGain.gain.value = 1;
        this._masterGain.channelCount = 2;
        console.log(this._masterGain);

        // create convolvers nodes for ambi hrtf
        for (let i = 0; i < this._maxNumChannels; i++) {
            this._convolverNodes.push(this._audioCtx.createConvolver());

            // disable normalization in convolvers
            this._convolverNodes[i].normalize = false
            this._convolverNodes[i].channelCount = 2;
            //this._convolverNodes[i].channelInterpretation = 'discrete';
            this._convolverNodes[i].channelCountMode = 'explicit';
            // Connect the splitter to the gain nodes
            this._splitterNode.connect(this._convolverNodes[i], i);
        }
            */

        //console.log(this._convolverNodes[0]);

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

