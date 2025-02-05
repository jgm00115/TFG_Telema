export class AudioProcessor {

    // attributes
    _audioCtx = null;
    _masterGain = null;

    /**
     * Creates an instance of AudioProcessor.
     * 
     * @param {HTMLMediaElement} audioRef - The reference to the audio element.
     * @param {number} maxNumChannels - The maximum number of audio channels.
     * @param {number} defaultGain - The default gain value.
     * @param {Array} hrtfs - The HRTF data.
     */
    constructor(audioRef, maxNumChannels, defaultGain, hrtfs) {
        console.log(`Creating new audio component`);
        // new audio context
        this._audioCtx = new AudioContext({sampleRate:48000});
        this._masterGain = this._audioCtx.createGain();
        this._masterGain.gain.value = 1;
    }

    /** 
     * Updates the gain values of the faders.
     * 
     * @param {number[]} gains - Array with new gain values.
     */
    setFadersGain(gains) {
        for (let i = 0; i < this._gainNodes.length; i++) {
            this._gainNodes[i].gain.value = gains[i];
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

}


export class AudioChain {

    // Attributes
    _sourceNode = null;
    _splitterNode = null;
    _gainNodes = [];
    _convolverNodes = [];
    _mergerNode = null;

    // Constructor
    constructor(audioRef, maxNumChannels, defaultGain, hrtfs) {
            console.log(`Creando nueva cadena de audio: 
            Maximo número de canales = ${maxNumChannels},
            Ganancia por defecto = ${defaultGain}`);
            // crea nuevo contexto de audio
            this._audioCtx = new AudioContext({sampleRate:48000});
            // crea nodo fuente
            this._sourceNode = this._audioCtx.createMediaElementSource(audioRef);
            this._sourceNode.channelCount = maxNumChannels;
            this._sourceNode.channelInterpretation = 'discrete';
            // crea un splitter
            this._splitterNode = this._audioCtx.createChannelSplitter(maxNumChannels);
            // crea un merger mono
            this._mergerNode = this._audioCtx.createChannelMerger(1);
            // crea un nodo de ganancia maestro
            this._masterGain = this._audioCtx.createGain();
            this._masterGain.gain.value = 1;
            // conecta la fuente al splitter
            this._sourceNode.connect(this._splitterNode);
            // crea nodos de ganancia y convolvers
            for (let i = 0; i < maxNumChannels; i++){
                this._gainNodes.push(this._audioCtx.createGain());
                this._convolverNodes.push(this._audioCtx.createConvolver());
                // asigna valor por defecto al nodo de ganancia
                this._gainNodes[i].gain.value = defaultGain;
                // deshabilita normalizacion en convolvers
                this._convolverNodes[i].normalize = false;
                // Conecta el splitter a los nodos de ganancia
                this._splitterNode.connect(this._gainNodes[i], i);
            }
            // Carga las hrtfs
            this.loadHRTFS(hrtfs)
            for (let i = 0; i < maxNumChannels; i++){
                // Conecta nodos de ganancia a convolvers
                this._gainNodes[i].connect(this._convolverNodes[i]);
                // Conecta convolvers al fader maestro
                this._convolverNodes[i].connect(this._masterGain);

            }
            console.log(this._convolverNodes[0]);
            // Conecta el mono merger al maestro
            this._mergerNode.connect(this._masterGain);
            // Conecta el maestro a la salida
            this._masterGain.connect(this._audioCtx.destination);

    }

    /** 
    * Actualiza el valor de las ganancias de los faders
    * @param {int[]} gains - Array con nuevas ganancias
    */
    setFadersGain(gains) {
        for (let i = 0; i < this._gainNodes.length; i++) {
            this._gainNodes[i].gain.value = gains[i];
        }
    }

    /** 
    * Devuelve un array con las ganancias de los faders.
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
                // Desconecta los nodos de ganancia de los convolvers
                this._gainNodes[i].disconnect();
                // Conecta al merger
                this._gainNodes[i].connect(this._mergerNode);
                console.log(this._masterGain);
            }
        } else {
            for(let i = 0; i < this._gainNodes.length; i++){
                // Desconecta los nodos de ganancia del merger
                this._gainNodes[i].disconnect();
                // Conecta con convolvers
                this._gainNodes[i].connect(this._convolverNodes[i]);
                console.log(this._masterGain);
            }
        }

    }
}


export class ambiConvolver {

    constructor(audioCtx, order) {

        this.initialized = false;

        this.ctx = audioCtx;
        this.order = order;
        this.nCh = (order + 1) * (order + 1);
        this.encFilters = new Array(this.nCh);
        this.encFilterNodes = new Array(this.nCh);
        // input and output nodes
        this.in = this.ctx.createGain();
        this.in.channelCountMode = 'explicit';
        this.in.channelCount = 1;
        this.out = this.ctx.createChannelMerger(this.nCh);
        // convolver nodes
        for (var i = 0; i < this.nCh; i++) {
            this.encFilterNodes[i] = this.ctx.createConvolver();
            this.encFilterNodes[i].normalize = false;
        }
        // create audio connections
        for (var i = 0; i < this.nCh; i++) {
            this.in.connect(this.encFilterNodes[i]);
            this.encFilterNodes[i].connect(this.out, 0, i);
        }

        this.initialized = true;
    }

    updateFilters(audioBuffer) {
        // assign filters to convolvers
        for (var i = 0; i < this.nCh; i++) {
            this.encFilters[i] = this.ctx.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate);
            this.encFilters[i].getChannelData(0).set(audioBuffer.getChannelData(i));

            this.encFilterNodes[i].buffer = this.encFilters[i];
        }
    }


}

export class ambiBinConvolver extends AudioNode{
    constructor(audioCtx, order) {

        this.initialized = false;

        this.ctx = audioCtx;
        this.order = order;
        this.nCh = (order + 1) * (order + 1);
        this.hrtfFilters = new Array(this.nCh);
        this.hrtfFilterNodes = new Array(this.nCh);
        // input 
        this.in = this.ctx.createChannelSplitter(this.nCh);
        this.in.channelCountMode = 'explicit';
        this.in.channelInterpretation = 'discrete'; // Use discrete channel interpretation
        this.out = this.ctx.createChannelMerger(2);
        this.out.channelCountMode = 'explicit';
        this.out.channelInterpretation = 'discrete'; // Use discrete channel interpretation
        // convolver nodes

        for (var i = 0; i < this.nCh; i++) {
            this.hrtfFilterNodes[i] = this.ctx.createConvolver();
            this.hrtfFilterNodes[i].normalize = false;
            this.hrtfFilterNodes[i].channelCount = 2;
            this.hrtfFilterNodes[i].channelInterpretation = 'discrete';
            this.hrtfFilterNodes[i].channelCountMode = 'explicit';
        }
        // create audio connections
        for (var i = 0; i < this.nCh; i++) {
            this.in.connect(this.hrtfFilterNodes[i],i);
            this.hrtfFilterNodes[i].connect(this.out, 0, 0);
        }

        this.initialized = true;
    }

    updateHrtfs(audioBuffer) {
        // assign filters to convolvers
        for (var i = 0; i < this.nCh; i++) {
            this.hrtfFilters[i] = this.ctx.createBuffer(2, audioBuffer.length, audioBuffer.sampleRate);
            this.hrtfFilters[i].getChannelData(0).set(audioBuffer.getChannelData(0));
            this.hrtfFilters[i].getChannelData(1).set(audioBuffer.getChannelData(1));

            this.hrtfFilterNodes[i].buffer = this.hrtfFilters[i];
        }
    }
}