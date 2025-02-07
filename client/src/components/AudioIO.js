export class AudioIO {
    constructor(audioRef, maxNumChannels,sampleRate = 48000) {
        console.log(`Creating new audioIO`); 
        
        const DEFAULT_GAIN = 1;
        this._audioCtx = new AudioContext({ sampleRate });
        // create source node
        this._sourceNode = this._audioCtx.createMediaElementSource(audioRef);
        this._sourceNode.channelCount = maxNumChannels;
        this._sourceNode.channelInterpretation = 'discrete';
        
        this._masterGain = this._audioCtx.createGain();
        this._masterGain.gain.value = DEFAULT_GAIN;
        //this._sourceNode.connect(this._masterGain);
        this._masterGain.connect(this._audioCtx.destination);
        this._audioChains = [];
        this._selectedAudioChainIndex = 0;
    }

    getSourceNode() {
        return this._sourceNode;
    }

    getMasterGain() {
        return this._masterGain;
    }
    getMasterGainValue() {
        return this._masterGain.gain.value;
    }

    setMasterGain(gain) {
        console.log(`Setting master gain to ${gain}`);
        this._masterGain.gain.value = gain;
    }

    addAudioChain(audioChain) {
        this._audioChains.push(audioChain);
        
    }
   

    
    switchAudioChain(index) {
        this._sourceNode.disconnect();
        this._audioChains[this._selectedAudioChainIndex].getOutputNode().disconnect();
        this._sourceNode.connect(this._audioChains[index].getInputNode());
        this._audioChains[index].getOutputNode().connect(this._masterGain);
        this._selectedAudioChainIndex = index;
    }
    getAudioCtx() {
        return this._audioCtx;
    }
    getSelectedAudioChain() {
        return this._audioChains[this._selectedAudioChainIndex];
    }
    getAudioChain(index) {
        return this._audioChains[index];
    }
}

