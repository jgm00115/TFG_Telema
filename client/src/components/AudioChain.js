export class AudioChain {

    // Atributos
    _audioCtx = null;
    _sourceNode = null;
    _splitterNode = null;
    _gainNodes = [];
    _mergerNode = null;

    // Constructor
    constructor(audioRef, maxNumChannels, defaultGain) {
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
        // crea un merger
        this._mergerNode = this._audioCtx.createChannelMerger(1);
        // conecta la fuente al splitter
        this._sourceNode.connect(this._splitterNode);
        // crea nodos de ganancia
        for (let i = 0; i < maxNumChannels; i++){
            this._gainNodes.push(this._audioCtx.createGain());
            // asigna valor por defecto al nodo de ganancia
            this._gainNodes[i].gain.value = defaultGain;
            // Conecta el splitter al nodo de ganancia
            this._splitterNode.connect(this._gainNodes[i],i);
            // Conecta cada nodo de ganancia al merger
            this._gainNodes[i].connect(this._mergerNode,0,0);
        }
        // conecta el merger a la salida
        this._mergerNode.connect(this._audioCtx.destination);
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
}