import dashjs from 'dashjs'
import Mixer from '../components/Mixer'
import TrackSelector from '../components/TrackSelector';
import RotationSelector from '../components/RotationSelector';

import { AudioChain } from '../components/AudioChain';

import { useRef, useEffect, useState } from 'react'
import Fader from '../components/Fader';

export default function Stream({ streamID, mediaURL }) {

    // Variables sin estado (su valor persiste entre re-renderizados)
    const numTracks = useRef(0);                            // número de tracks de audio total
    const trackNames = useRef(Array(0));                    // nombre de los tracks de audio
    const numChannels = useRef(Array(0));                   // canales de audio por track (array)
    const mainTrackIndex = useRef(null);
    const audioRef = useRef(null);                          // html audio media element 
    const player = useRef(dashjs.MediaPlayer().create());   // dash player

    const audioChain = useRef(null);

    // Variables con estado (cada vez que cambien, los componentes se re-renderizan)
    const [track, setTrack] = useState(0);                  // track activo
    const [gains, setGains] = useState(Array(0).fill(0));   // array con ganancias de cada fader
    const [masterGain, setMasterGain] = useState(1);
    const [rotation, setRotation] = useState(0);            // grados de rotación respecto a la posición original

    // Se ejecuta una única vez tras el primer renderizado
    useEffect(() => {

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

        // Inicializa el reproductor dash y lo vincula al elemento de audio (autoplay true)
        player.current.initialize(audioRef.current, mediaURL, true);

    }, []);

    // Se ejecuta cuando ganancias se actualicen
    useEffect(() => {

        console.log(`Ganancias = ${gains}`);

        // SI LA CADENA DE AUDIO ESTÁ INICIALIZADA
        if (audioChain.current != null) {

            // Actualiza nodos de ganancia
            audioChain.current.setFadersGain(gains);

        }

    }, [gains]);
    // Se ejecuta cuando la ganancia del master se actualiza
    useEffect(()=>{
        console.log(`Ganancia del master = ${masterGain}`);
        if (audioChain.current != null) {
            audioChain.current.setMasterGain(masterGain);
        }
    },[masterGain]);
    // Se ejecuta cuando el track seleccionado se actualice
    useEffect(() => {

        console.log(`Track activo = ${track}`);

        if (audioChain.current != null) {

            // Actualiza track activo

            const tracks = player.current.getTracksFor('audio');

            player.current.setCurrentTrack(tracks[track]);

            // Si selecciona el main track usa convolvers
            if (track == mainTrackIndex.current){
                    audioChain.current.bypassConvolvers(false);
            } else {
                audioChain.current.bypassConvolvers(true);
            }

        }

    }, [track]);

    const onPlay = async () => {

        const defaultGain = 0.5;

        // SI CADENA DE AUDIO ESTÁ INICIALIZADA, VUELVE
        if (audioChain.current != null)
            return;

        // Actualiza el valor del número de tracks disponibles
        const tracks = player.current.getTracksFor('audio');
        numTracks.current = tracks.length;

        // Actualiza el nombre de los tracks
        let trackLangs = [];
        for (let trackL of tracks){
            trackLangs.push(trackL.lang);
        }

        trackNames.current = trackLangs;

        console.log(`Número de tracks de audio = ${numTracks.current}`);

        // Actualiza el número de canales de audio disponibles
        numChannels.current = tracks.map(
            (track) => parseInt(track.audioChannelConfiguration));

        const maxNumChannels = Math.max(...numChannels.current);
        mainTrackIndex.current = numChannels.current.indexOf(maxNumChannels);

        console.log(`Número de canales por track = ${numChannels.current}`);
        console.log(`Número de canales máximo = ${maxNumChannels}`);
        console.log(`Índice del main = ${mainTrackIndex.current}`);

        // Pide al backend las HRTFS
        const response = await fetch(`/stream/${streamID}/hrtfs`);
        const hrtfs = await response.json();

        console.log(`Número de HRTFS recuperadas = ${hrtfs.length}`);

        // INICIALIZA CADENA DE AUDIO
        audioChain.current = new AudioChain(audioRef.current,
             maxNumChannels, defaultGain, hrtfs);

        console.log(`Nueva cadena de audio creada`);

        // Actualiza el valor de las ganancias
        setGains(audioChain.current.getFadersGain());
        setMasterGain(audioChain.current.getMasterGain());
        // Selecciona el main por defecto
        setTrack(mainTrackIndex.current);
        player.current.setCurrentTrack(tracks[mainTrackIndex.current]);

    }

    return (
        <div>
            <audio
                ref={audioRef}
                onPlay={onPlay}
                controls>
            </audio>

            <TrackSelector
                numTracks={numTracks.current}
                track={track}
                setTrack={setTrack}
                trackNames={trackNames.current}
            />
            {track == mainTrackIndex.current ? (
                <RotationSelector
                rotation={rotation}
                setRotation={setRotation}
                min={-90}
                max={90}
                step={5}
            />
            ): null}
            <Mixer
                gains={gains}
                setGains={setGains}
                numFaders={numChannels.current[track]}
            />
            <Fader
                className='Master'
                gain={masterGain}
                setGain={(event)=>setMasterGain(event.target.value)}
                min={0}
                max={2}
                step={0.1}
            />
        </div>

    );
}