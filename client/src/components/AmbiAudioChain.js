export class AmbiAudioChain {

    // Attributes
    _audioCtx = null;
    _sourceNode = null;
    _splitterNode = null;
   
    _convolverNodes = [];
    _masterGain = null;

    // Constructor
    
    constructor(audioCtx, order, defaultGain, hrtfs) {
        this._maxNumChannels = (order + 1) * (order + 1);
        console.log(`Creating new audio chain:  
        3DOF single position rendering of order ${order} with ${this._maxNumChannels} channels`);
        // creating new audio context
        this._audioCtx = audioCtx
        // create a splitter
        this._splitterNode = this._audioCtx.createChannelSplitter(this._maxNumChannels);
        this._splitterNode.channelCountMode = 'explicit';
        this._splitterNode.channelInterpretation = 'discrete'; // Use discrete channel interpretation
        console.log(this._splitterNode);
        // create a master gain node
        this._masterGain = this._audioCtx.createGain();
        this._masterGain.gain.value = 1;
        this._masterGain.channelCount = 2;
        console.log(this._masterGain);

        // create convolvers nodes for ambi hrtf
        for (let i = 0; i < this._maxNumChannels; i++){
            this._convolverNodes.push(this._audioCtx.createConvolver());
            
            // disable normalization in convolvers
            this._convolverNodes[i].normalize = false
            this._convolverNodes[i].channelCount = 2;
            //this._convolverNodes[i].channelInterpretation = 'discrete';
            this._convolverNodes[i].channelCountMode = 'explicit';
            // Connect the splitter to the gain nodes
            this._splitterNode.connect(this._convolverNodes[i], i);
        }
        // Load the HRTFs
        this.loadHRTFS(hrtfs)
        for (let i = 0; i < this._maxNumChannels; i++){
            // Connect gain nodes to convolvers
            this._splitterNode.connect(this._convolverNodes[i],i);
            // Connect convolvers to the master fader
            this._convolverNodes[i].connect(this._masterGain);
        }
        console.log(this._convolverNodes[0]);
    }

    /**
     * Loads the HRTF data.
     * 
     * @param {Array} hrtfs - The HRTF data.
     */
    loadHRTFS(hrtfs) {
        console.log(`Loading ${hrtfs.length} HRTFs`);
        console.log(hrtfs);
        for (let i = 0; i < this._convolverNodes.length; i++){
            const hrtf = hrtfs[i];
            // HRTF length
            const length = hrtf.left.length;
            // Stereo impulse response
            const buffer = this._audioCtx.createBuffer(2, length, hrtf.samplerate);
            const buffer_l = buffer.getChannelData(0);
            const buffer_r = buffer.getChannelData(1);
            for (let n = 0; n < length; n++){
                buffer_l[n] = hrtf.left[n];
                buffer_r[n] = hrtf.right[n];
            }
            this._convolverNodes[i].buffer = buffer;
        }
    }

    /**
     * Sets the master gain value.
     * 
     * @param {number} gain - The gain value to set. Should be a number between 0 and 1.
     */
    setMasterGain(gain) {
        this._masterGain.gain.value = gain;
    }

    /**
     * Gets the current master gain value.
     * 
     * @returns {number} The current gain value.
     */
    getMasterGain() {
        return this._masterGain.gain.value;
    }


    getInputNode() {
        return this._splitterNode;
    }
    getOutputNode() {
        return this._masterGain;
    }
    getFadersGain() {
        return this._convolverNodes.map(ConvolverNode => this._masterGain.gain.value);
    }
    setFadersGain(gains) {
        
            this._masterGain.gain.value = gains[0];
    }
}

