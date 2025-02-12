export class MOAudioChain {
    constructor(audioCtx, myMaxNumChannels = 2, defaultGain) {
        console.log(`Creating new audio chain for minus one: 
        Maximum number of channels = ${myMaxNumChannels},
        Default gain = ${defaultGain}`);
        
        this._audioCtx = audioCtx;
        
        this._splitterNode = this._audioCtx.createChannelSplitter(myMaxNumChannels);
        this._mergerNode = this._audioCtx.createChannelMerger(1);
        this._gainNodes = [];

        for (let i = 0; i < myMaxNumChannels; i++) {
            this._gainNodes.push(this._audioCtx.createGain());
            this._gainNodes[i].gain.value = defaultGain;
            this._splitterNode.connect(this._gainNodes[i], i);
        }

        for (let i = 0; i < myMaxNumChannels; i++) {
            this._gainNodes[i].connect(this._mergerNode);
        }
    }

    getInputNode() {
        return this._splitterNode;
    }
    getOutputNode() {
        return this._mergerNode;
    }

    setFadersGain(gains) {
        for (let i = 0; i < this._gainNodes.length; i++) {
            this._gainNodes[i].gain.value = gains[i];
        }
    }

    getFadersGain() {
        return this._gainNodes.map(gainNode => gainNode.gain.value);
    }

}