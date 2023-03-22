import dashjs from 'dashjs'
import Mixer from './Mixer'
import TrackSelector from './TrackSelector';

import { useRef, useEffect, useState } from 'react'

export default function Stream({mediaURL}) {

    // Variables sin estado (su valor persiste entre re-renderizados)
    const numChannels = useRef(0);
    const audioRef = useRef(null);
    const player = useRef(dashjs.MediaPlayer().create());

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

    // Acciones que se ejecutan cada vez que se renderiza el componente
    useEffect(() => {
        console.log(`Ganancias = ${gains}`);
        console.log(`Track activo = ${track}`);
        console.log(`numTracks = ${numTracks}`);
        console.log(`numChannels = ${numChannels.current}`);

        // Actualiza el número de
        
    });

    // Maneja el evento onCanPlay
    const canPlay = () => {

        // Actualiza el valor del número de tracks disponibles
        const tracks = player.current.getTracksFor('audio');
        setNumTracks(tracks.length);

        console.log(`Número de tracks de audio = ${numTracks}`);

        // Actualiza el número de tracks de audio disponibles
        numChannels.current = tracks.map(
            (track)=> track.audioChannelConfiguration);

        console.log(`Número de canales por track = ${numChannels.current}`);

        // Actualiza el número de ganancias necesarias
        setGains(Array(Math.max(...numChannels.current)).fill(0))
        
    }

    return (
        <div>
            <audio
                ref={audioRef}
                onCanPlay={canPlay}
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