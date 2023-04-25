export class AudioChain {

    // Atributos
    _audioCtx = null;
    _sourceNode = null;
    _splitterNode = null;
    _gainNodes = [];
    _convolverNodes = [];
    _monoMergerNode = null;
    _stereoMergerNode = null;
    _masterGain = null;

    // Constructor
    constructor(audioRef, maxNumChannels, defaultGain, hrtfs) {
            console.log(`Creando nueva cadena de audio: 
            Maximo número de canales = ${maxNumChannels},
            Ganancia por defecto = ${defaultGain}`);
            // crea nuevo contexto de audio
            this._audioCtx = new AudioContext();
            // crea nodo fuente
            this._sourceNode = this._audioCtx.createMediaElementSource(audioRef);
            this._sourceNode.channelCount = maxNumChannels;
            this._sourceNode.channelInterpretation = 'discrete';
            // crea un splitter
            this._splitterNode = this._audioCtx.createChannelSplitter(maxNumChannels);
            // crea un merger mono
            this._monoMergerNode = this._audioCtx.createChannelMerger(1);
            // crea un nodo de ganancia maestro
            this._masterGain = this._audioCtx.createGain();
            // crea un merger stereo
            this._stereoMergerNode = this._audioCtx.createChannelMerger(2);
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
            // Conecta el maestro a la salida
            this._masterGain.gain.value = 2;
            this._masterGain.connect(this._audioCtx.destination);
            // Conecta stereo merger a la salida
            // this._stereoMergerNode.connect(this._audioCtx.destination);
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

    loadHRTFS(hrtfs) {
        // Introduce la respuesta al impulso para cada convolver
        for (let i = 0; i < this._convolverNodes.length; i++){
            const hrtf = hrtfs[i];
            // longitud hrtf
            const length = hrtf.left.length;
            // respuesta al impulso stereo
            const buffer = this._audioCtx.createBuffer(2,length,this._audioCtx.sampleRate);
            const buffer_l = buffer.getChannelData(0);
            const buffer_r = buffer.getChannelData(1);
            for (let n = 0; n < length; n++){
                buffer_l[n] = hrtf.left[n];
                buffer_r[n] = hrtf.right[n];
            }
            this._convolverNodes[i].buffer = buffer;
        }
    }
}