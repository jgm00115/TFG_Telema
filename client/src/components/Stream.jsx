import dashjs from 'dashjs'
import Mixer from './Mixer'
import TrackSelector from './TrackSelector';

import { useRef, useEffect, useState } from 'react'

export default function Stream({ mediaURL }) {

    // Variables sin estado (su valor persiste entre re-renderizados)
    const numChannels = useRef(0);
    const audioRef = useRef(null);
    const player = useRef(dashjs.MediaPlayer().create());

    const audioChainInitialized = useRef(false);
    const audioCtx = useRef(null);
    const srcNode = useRef(null);
    const splitterNode = useRef(null);
    const gainNodes = useRef(Array(0));


    // Variables con estado (cada vez que cambien, los componentes se re-renderizan)
    const [numTracks, setNumTracks] = useState(0);
    const [track, setTrack] = useState(0);
    const [gains, setGains] = useState(Array(0).fill(0));

    // Inicializa el reproductor dash y lo vincula al elemento de audio
    // Se ejecuta una única vez tras el primer renderizado
    useEffect(() => {

        // Inicializa el reproductor dash y lo vincula al elemento de audio
        player.current.updateSettings({
            streaming: {
                buffer: {
                    bufferTimeAtTopQuality: 30,
                    bufferTimeAtTopQualityLongForm: 30,
                    stableBufferTime: 30,
                    longFormContentDurationThreshold: 30,
                }
            }
        })

        player.current.initialize(audioRef.current, mediaURL, true);

    }, []);

    // Se ejecuta cuando ganancias se actualicen
    useEffect(() => {

        console.log(`Ganancias = ${gains}`);

        // SI LA CADENA DE AUDIO ESTÁ INICIALIZADA
        if (audioChainInitialized.current) {

            // Actualiza nodos de ganancia
            for (let i = 0; i < gains.length; i++) {
                gainNodes.current[i].gain.value = gains[i];
            }
            
        }

    },[gains]);

    // Se ejecuta cuando el track seleccionado se actualice
    useEffect(() => {

        console.log(`Track activo = ${track}`);
        
        if (audioChainInitialized.current) {

            // Actualiza track activo

            const tracks = player.current.getTracksFor('audio');

            player.current.setCurrentTrack(tracks[track]);
            
        }

    },[track]);

    // Maneja el evento onCanPlay
    const canPlay = () => {

        // Actualiza el valor del número de tracks disponibles
        const tracks = player.current.getTracksFor('audio');
        setNumTracks(tracks.length);

        console.log(`Número de tracks de audio = ${numTracks}`);

        // Actualiza el número de canales de audio disponibles
        numChannels.current = tracks.map(
            (track) => track.audioChannelConfiguration);

        console.log(`Número de canales por track = ${numChannels.current}`);

        // Actualiza el número de ganancias necesarias
        setGains(Array(Math.max(...numChannels.current)).fill(0))
    }

    const onPlay = () => {
        // SI CADENA DE AUDIO ESTÁ INICIALIZADA, VUELVE
        if (audioChainInitialized.current)
            return;

        // INICIALIZA CADENA DE AUDIO 
        // Crea un audio context
        audioCtx.current = new AudioContext();

        // Crea un nodo fuente
        srcNode.current = audioCtx.current.createMediaElementSource(audioRef.current);

        srcNode.current.channelCount = Math.max(...numChannels.current);
        srcNode.current.channelInterpretation = 'discrete';
        // Crea un splitter con tantas salidas como máximo número de canales hay
        splitterNode.current = audioCtx.current.createChannelSplitter(Math.max(...numChannels.current));

        // Conecta el nodo fuente al splitter
        srcNode.current.connect(splitterNode.current);

        // Crea nodos de ganancia
        for (let i = 0; i < gains.length; i++) {

            gainNodes.current.push(audioCtx.current.createGain());

            // Conecta la salida del splitter al nodo de ganancia correspondiente
            splitterNode.current.connect(gainNodes.current[i], i);

            // Conecta el nodo de ganancia a la salida
            gainNodes.current[i].connect(audioCtx.current.destination);
        }

        // Asigna ganancias por defecto
        for (let i = 0; i < gains.length; i++) {
            gainNodes.current[i].gain.value = gains[i];
        }

        // Selecciona el track 0 por defecto
        const tracks = player.current.getTracksFor('audio');

        player.current.setCurrentTrack(tracks[0]);

        // Cadena de audio inicializada
        audioChainInitialized.current = true;
    }

    return (
        <div>
            <audio
                ref={audioRef}
                onCanPlay={canPlay}
                onPlay={onPlay}
                controls>
            </audio>

            <TrackSelector
                numTracks={numTracks}
                track={track}
                setTrack={setTrack}
            />

            <Mixer
                gains={gains}
                setGains={setGains}
                numFaders={numChannels.current[track]}
            />
        </div>

    );
}