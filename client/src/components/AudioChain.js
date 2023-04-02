export class AudioChain{

    // Atributos
    numTracks = 0;
    numChannels = [];
    maxNumChannels = 0;
    numFaders = 0;
    _audioCtx = null;
    _sourceNode = null;
    _splitterNode = null;
    _gainNodes = [];
    initialized = false;
    
    // Constructor
    constructor(audioRef,numTracks,numChannels){
        
        this.numTracks = numTracks;
        this.numChannels = numChannels;

        // Calcula el máximo número de canales de audio y el número de faders
        this.maxNumChannels = Math.max(...numChannels);
        this.numFaders = this.maxNumChannels;

        // Inicializa cadena de audio
        this.initialize(audioRef);
    }

    /** 
    * Actualiza el valor de las ganancias de los faders
    * @param {int[]} gains - Array con nuevas ganancias
    */
    setFadersGain(gains){

        for (let i = 0; i < this._gainNodes.length; i++) {
            this._gainNodes[i].gain.value = gains[i];
        }
    }

    /** 
    * Inicializa la cadena de audio
    * @param {} audioRef - Audio media element (dash player está vinculado a este elemento)
    */
    initialize(audioRef) {
        
        // Inicializa el audioContext
        this._audioCtx = new AudioContext();

        // Crea el nodo fuente
        this._sourceNode = this._audioCtx.createMediaElementSource(audioRef);
        this._sourceNode.channelCount = this.maxNumChannels;
        this._sourceNode.channelInterpretation = 'discrete';

        // Crea el splitter
        this._splitterNode = this._audioCtx.createChannelSplitter(this.maxNumChannels);
        
        // Conecta el nodo fuente al splitter
        this._sourceNode.connect(this._splitterNode);

        // Crea nodos de ganancia
        for(let i = 0; i < this.numFaders; i++){

            this._gainNodes.push(this._audioCtx.createGain());

            // Conecta la salida del splitter al nodo de ganancia correspondiente
            this._splitterNode.connect(this._gainNodes[i],i);

            // Conecta el nodo de ganancia a la salida
            this._gainNodes[i].connect(this._audioCtx.destination);

        }

        // Cadena de audio inicializada
        this.initialized = true;

    }

}