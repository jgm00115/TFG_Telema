export class AudioIO {
    constructor(audioRef, maxNumChannels, sampleRate = 48000) {
        console.log(`Creating new audioIO`); 
        
        const DEFAULT_GAIN = 1;
        // Create a new AudioContext with the specified sample rate
        this._audioCtx = new AudioContext({ sampleRate });
        console.log(`Audio context sample rate: ${this._audioCtx.sampleRate}`);
        console.log(`AudioRef: ${audioRef}`);
        // Create a MediaElementSource node from the audio reference
        this._sourceNode = this._audioCtx.createMediaElementSource(audioRef);
        this._sourceNode.channelCount = maxNumChannels;
        this._sourceNode.channelInterpretation = 'discrete';
        
        // Create a Gain node to control the master volume
        this._masterGain = this._audioCtx.createGain();
        this._masterGain.gain.value = DEFAULT_GAIN;
        this._masterGain.channelCount = 2;
        // Connect the master gain node to the audio context destination (speakers)
        this._masterGain.connect(this._audioCtx.destination);
        
        // Initialize audio chains array and selected audio chain index
        this._audioChains = [];
        this._selectedAudioChainIndex = 0;
    }

    // Get the source node
    getSourceNode() {
        return this._sourceNode;
    }

    // Get the master gain node
    getMasterGain() {
        return this._masterGain;
    }

    // Get the current value of the master gain
    getMasterGainValue() {
        return this._masterGain.gain.value;
    }

    // Set the value of the master gain
    setMasterGain(gain) {
        console.log(`Setting master gain to ${gain}`);
        this._masterGain.gain.value = gain;
    }

    // Add a new audio chain to the list of audio chains
    addAudioChain(audioChain) {
        this._audioChains.push(audioChain);
    }

    // Switch to a different audio chain by index
    switchAudioChain(index) {
        // Disconnect the current source node and the output node of the current audio chain
        this._sourceNode.disconnect();
        this._audioChains[this._selectedAudioChainIndex].getOutputNode().disconnect();
        
        // Connect the source node to the input node of the new audio chain
        this._sourceNode.connect(this._audioChains[index].getInputNode());
        // Connect the output node of the new audio chain to the master gain
        this._audioChains[index].getOutputNode().connect(this._masterGain);
        
        // Update the selected audio chain index
        this._selectedAudioChainIndex = index;
    }

    // Get the audio context
    getAudioCtx() {
        return this._audioCtx;
    }

    // Get the currently selected audio chain
    getSelectedAudioChain() {
        return this._audioChains[this._selectedAudioChainIndex];
    }

    // Get an audio chain by index
    getAudioChain(index) {
        return this._audioChains[index];
    }
}
