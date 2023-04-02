import dashjs from 'dashjs'
import Mixer from './Mixer'
import TrackSelector from './TrackSelector';

import {AudioChain} from './AudioChain';

import { useRef, useEffect, useState } from 'react'

export default function Stream({ mediaURL }) {

    // Variables sin estado (su valor persiste entre re-renderizados)
    const numChannels = useRef(0);
    const audioRef = useRef(null);
    const player = useRef(dashjs.MediaPlayer().create());
    
    const audioChain = useRef(null);

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
                cacheInitSegments: true,
                buffer: {
                    // bufferTimeAtTopQuality: 30,
                    // bufferTimeAtTopQualityLongForm: 30,
                    // stableBufferTime: 30,
                    // longFormContentDurationThreshold: 30,
                }
            }
        })

        player.current.initialize(audioRef.current, mediaURL, true);

    }, []);

    // Dispara el evento cuando el reproductor se para porque le falta data
    player.current.on(dashjs.MediaPlayer.events.PLAYBACK_WAITING, (e)=> {
        console.log(`Evento ${JSON.stringify(e)}`)
    })

    // Se ejecuta cuando ganancias se actualicen
    useEffect(() => {

        console.log(`Ganancias = ${gains}`);

        // SI LA CADENA DE AUDIO ESTÁ INICIALIZADA
        if (audioChain.current != null) {

            // Actualiza nodos de ganancia
            audioChain.current.setFadersGain(gains);
            
        }

    },[gains]);

    // Se ejecuta cuando el track seleccionado se actualice
    useEffect(() => {

        console.log(`Track activo = ${track}`);
        
        if (audioChain.current != null) {

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
        setGains(Array(Math.max(...numChannels.current)).fill(0.5))
    }

    const onPlay = () => {
        // SI CADENA DE AUDIO ESTÁ INICIALIZADA, VUELVE
        if (audioChain.current != null)
            return;

        // INICIALIZA CADENA DE AUDIO 
        audioChain.current = new AudioChain(audioRef.current,numTracks,numChannels.current);
        
        // Asigna ganancias por defecto
        audioChain.current.setFadersGain(gains);

        // Selecciona el track 0 por defecto
        const tracks = player.current.getTracksFor('audio');

        player.current.setCurrentTrack(tracks[0]);

        console.log(`Cadena de audio inicializada`);

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