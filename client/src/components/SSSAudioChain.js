export class SSSAudioChain {
    constructor(audioCtx, maxNumChannels, defaultGain, hrtfs) {
        console.log(`Creating new audio chain: 
        Maximum number of channels = ${maxNumChannels},
        Default gain = ${defaultGain}`);
        
        this._audioCtx = audioCtx;
        this._masterGain = this._audioCtx.createGain();
        this._masterGain.gain.value = 1;
        
        this._splitterNode = this._audioCtx.createChannelSplitter(maxNumChannels);
        this._gainNodes = [];
        this._convolverNodes = [];

        for (let i = 0; i < maxNumChannels; i++) {
            this._gainNodes.push(this._audioCtx.createGain());
            this._convolverNodes.push(this._audioCtx.createConvolver());
            this._gainNodes[i].gain.value = defaultGain;
            this._convolverNodes[i].normalize = false;
            this._splitterNode.connect(this._gainNodes[i], i);
        }

        this.loadHRTFS(hrtfs);

        for (let i = 0; i < maxNumChannels; i++) {
            this._gainNodes[i].connect(this._convolverNodes[i]);
            this._convolverNodes[i].connect(this._masterGain);
        }

    }

    getInputNode() {
        return this._splitterNode;
    }
    getOutputNode() {
        return this._masterGain;
    }

    setFadersGain(gains) {
        for (let i = 0; i < this._gainNodes.length; i++) {
            this._gainNodes[i].gain.value = gains[i];
        }
    }

    getFadersGain() {
        return this._gainNodes.map(gainNode => gainNode.gain.value);
    }

    loadHRTFS(hrtfs) {
        for (let i = 0; i < this._convolverNodes.length; i++) {
            const hrtf = hrtfs[i];
            const length = hrtf.left.length;
            const buffer = this._audioCtx.createBuffer(2, length, hrtf.samplerate);
            const buffer_l = buffer.getChannelData(0);
            const buffer_r = buffer.getChannelData(1);
            for (let n = 0; n < length; n++) {
                buffer_l[n] = hrtf.left[n];
                buffer_r[n] = hrtf.right[n];
            }
            this._convolverNodes[i].buffer = buffer;
        }
    }

    /* 
    bypassConvolvers(bypass) {
        if (bypass) {
            for (let i = 0; i < this._gainNodes.length; i++) {
                this._gainNodes[i].disconnect();
                this._gainNodes[i].connect(this._mergerNode);
            }
        } else {
            for (let i = 0; i < this._gainNodes.length; i++) {
                this._gainNodes[i].disconnect();
                this._gainNodes[i].connect(this._convolverNodes[i]);
            }
        }
    } 
    */
}