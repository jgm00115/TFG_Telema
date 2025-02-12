export class AudioChain {

    // Attributes
    _audioCtx = null;
    _sourceNode = null;
    _splitterNode = null;
    _gainNodes = [];
    _convolverNodes = [];
    _mergerNode = null;
    _masterGain = null;

    // Constructor
    constructor(audioRef, maxNumChannels, defaultGain, hrtfs) {
            console.log(`Creating new audio chain: 
            Maximum number of channels = ${maxNumChannels},
            Default gain = ${defaultGain}`);
            // create new audio context
            this._audioCtx = new AudioContext({sampleRate:48000});
            // create source node
            this._sourceNode = this._audioCtx.createMediaElementSource(audioRef);
            this._sourceNode.channelCount = maxNumChannels;
            this._sourceNode.channelInterpretation = 'discrete';
            // create a splitter
            this._splitterNode = this._audioCtx.createChannelSplitter(maxNumChannels);
            // create a mono merger
            this._mergerNode = this._audioCtx.createChannelMerger(1);
            // create a master gain node
            this._masterGain = this._audioCtx.createGain();
            this._masterGain.gain.value = 1;
            // connect the source to the splitter
            this._sourceNode.connect(this._splitterNode);
            // create gain nodes and convolvers
            for (let i = 0; i < maxNumChannels; i++){
                this._gainNodes.push(this._audioCtx.createGain());
                this._convolverNodes.push(this._audioCtx.createConvolver());
                // set default value to the gain node
                this._gainNodes[i].gain.value = defaultGain;
                // disable normalization in convolvers
                this._convolverNodes[i].normalize = false;
                // Connect the splitter to the gain nodes
                this._splitterNode.connect(this._gainNodes[i], i);
            }
            // Load the HRTFs
            this.loadHRTFS(hrtfs)
            for (let i = 0; i < maxNumChannels; i++){
                // Connect gain nodes to convolvers
                this._gainNodes[i].connect(this._convolverNodes[i]);
                // Connect convolvers to the master fader
                this._convolverNodes[i].connect(this._masterGain);

            }
            console.log(this._convolverNodes[0]);
            // Connect the mono merger to the master
            this._mergerNode.connect(this._masterGain);
            // Connect the master to the output
            this._masterGain.connect(this._audioCtx.destination);

    }

    /** 
    * Updates the gain values of the faders
    * @param {int[]} gains - Array with new gains
    */
    setFadersGain(gains) {
        for (let i = 0; i < this._gainNodes.length; i++) {
            this._gainNodes[i].gain.value = gains[i];
        }
    }

    /** 
    * Returns an array with the gains of the faders.
    * @return {float[]} Brief description of the returning value here.
    */
    getFadersGain() {
        const gains = [];
        for (let i = 0; i < this._gainNodes.length; i++) {
            gains.push(this._gainNodes[i].gain.value);
        }
        return gains;
    }

    setMasterGain(gain) {
        this._masterGain.gain.value = gain;
    }

    getMasterGain() {
        return this._masterGain.gain.value;
    }

    loadHRTFS(hrtfs) {
        // Introduce la respuesta al impulso para cada convolver
        for (let i = 0; i < this._convolverNodes.length; i++){
            const hrtf = hrtfs[i];
            // longitud hrtf
            const length = hrtf.left.length;
            // respuesta al impulso stereo
            const buffer = this._audioCtx.createBuffer(2,length,hrtf.samplerate);
            const buffer_l = buffer.getChannelData(0);
            const buffer_r = buffer.getChannelData(1);
            for (let n = 0; n < length; n++){
                buffer_l[n] = hrtf.left[n];
                buffer_r[n] = hrtf.right[n];
            }
            this._convolverNodes[i].buffer = buffer;
        }
    }

    bypassConvolvers(bypass){
        if(bypass){
            for(let i = 0; i < this._gainNodes.length; i++){
                // Disconnect the gain nodes from the convolvers
                this._gainNodes[i].disconnect();
                // Connect to the merger
                this._gainNodes[i].connect(this._mergerNode);
                console.log(this._masterGain);
            }
        } else {
            for(let i = 0; i < this._gainNodes.length; i++){
                // Disconnect the gain nodes from the merger
                this._gainNodes[i].disconnect();
                // Connect to convolvers
                this._gainNodes[i].connect(this._convolverNodes[i]);
                console.log(this._masterGain);
            }
        }

    }
}
