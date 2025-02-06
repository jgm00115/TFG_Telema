import dashjs from 'dashjs'
import Fader from '../components/Fader';
import Mixer from '../components/Mixer'
import TrackSelector from '../components/TrackSelector';
import RotationSelector from '../components/RotationSelector';

import { AudioChain } from '../components/AudioChain';

import { useRef, useEffect, useState } from 'react'

export default function Stream({ streaming, mediaURL }) {

    // Stateless variables (their value persists between re-renders)
    const numTracks = useRef(0);                            // total number of audio tracks 
    const trackNames = useRef(Array(0));                    // names of the audio tracks
    const numChannels = useRef(Array(0));                   // audio channels per track (array)
    const mainTrackIndex = useRef(null);
    const audioRef = useRef(null);                          // HTML audio media element 
    const player = useRef(dashjs.MediaPlayer().create());   // dash player

    const audioChain = useRef(null);

    // State variables (components re-render every time they change)
    const [track, setTrack] = useState(0);                  // active track
    const [gains, setGains] = useState(Array(0).fill(0));   // array with gains of each fader
    const [masterGain, setMasterGain] = useState(1);
    const [rotation, setRotation] = useState(0);            // degrees of rotation from the original position
    const [showlabels, setShowLabels] = useState(true); 

    // Executes once after the first render
    useEffect(() => {

        player.current.updateSettings({
            'streaming': {
                'cacheInitSegments': true,
                'delay': {
                    liveDelayFragmentCount: 4
                }
            }
        });

        // Initialize the dash player and link it to the audio element (autoplay true)
        player.current.initialize(audioRef.current, mediaURL, true);

        }, []);

        // Executes when gains are updated
        useEffect(() => {

        console.log(`Gains = ${gains}`);

        // IF THE AUDIO CHAIN IS INITIALIZED
        if (audioChain.current != null) {

            // Update gain nodes
            audioChain.current.setFadersGain(gains);

        }

        }, [gains]);
        // Executes when the master gain is updated
        useEffect(()=>{
        console.log(`Master gain = ${masterGain}`);
        if (audioChain.current != null) {
            audioChain.current.setMasterGain(masterGain);
        }
        },[masterGain]);
        // Executes when the selected track is updated
        useEffect(() => {

        console.log(`Active track = ${track}`);

        if (audioChain.current != null) {

            // Update active track

            const tracks = player.current.getTracksFor('audio');

            player.current.setCurrentTrack(tracks[track]);

            // If the main track is selected, use convolvers
            // And also add names to the faders
            if (track == mainTrackIndex.current){
                audioChain.current.bypassConvolvers(false);
                setShowLabels(true);
            } else {
            audioChain.current.bypassConvolvers(true);
            setShowLabels(false);
            }

        }

        }, [track]);
    
    //TODO: adding a different component for the Ambisonics HRTF for 3dof + 6dof
    // Executes when the rotation is updated 
    useEffect(() => {
        async function loadHRTFS (){
            console.log(`rotation = ${rotation}`);
            if (audioChain.current != null){
                let rotatedHRTFs;
                if(rotation != 0){
                    // Request new HRTFS
                    const response = await fetch(`/stream/${streaming._id}/hrtfs/${rotation}`);
                    rotatedHRTFs = await response.json();
                } else {
                    // If the rotation is 0, request the base HRTF
                    const response = await fetch(`/stream/${streaming._id}/hrtfs/`);
                    rotatedHRTFs = await response.json();
                }
                console.log('rotatedHRTFs:');
                console.log(rotatedHRTFs);
            
            // Load hrtfs into convolvers
           AudioIO.current.getSelectedAudioChain().loadHRTFS(rotatedHRTFs);
            }
        }
        loadHRTFS();
    },[rotation]);

    const onPlay = async () => {

        const defaultGain = 0.5;

        // IF AUDIO CHAIN IS INITIALIZED, RETURN
        if (audioChain.current != null)
            return;

        // Update the value of the number of available tracks
        const tracks = player.current.getTracksFor('audio');
        console.log(JSON.stringify(tracks));
        numTracks.current = tracks.length;

        // Update the name of the tracks
        let trackLangs = [];
        for (let trackL of tracks){
            trackLangs.push(trackL.lang);
        }

        trackNames.current = trackLangs;

        console.log(`Number of audio tracks = ${numTracks.current}`);

        // Update the number of available audio channels
        numChannels.current = tracks.map(
            (track) => parseInt(track.audioChannelConfiguration));

        const maxNumChannels = Math.max(...numChannels.current);
        mainTrackIndex.current = numChannels.current.indexOf(maxNumChannels);

        console.log(`Number of channels per track = ${numChannels.current}`);
        console.log(`Maximum number of channels = ${maxNumChannels}`);
        console.log(`Main track index = ${mainTrackIndex.current}`);

        // Request HRTFS from the backend
        const response = await fetch(`/stream/${streaming._id}/hrtfs`);
        const hrtfs = await response.json();

        console.log(`Number of HRTFS retrieved = ${hrtfs.length}`);

        // INITIALIZE AUDIO CHAIN
        audioChain.current = new AudioChain(audioRef.current,
             maxNumChannels, defaultGain, hrtfs);

        console.log(`New audio chain created`);

        // Update the value of the gains
        setGains(audioChain.current.getFadersGain());
        setMasterGain(audioChain.current.getMasterGain());
        // Select the main track by default
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
                faderlabels={streaming.instruments.map(instrument => instrument.name)}
                showlabels={showlabels}
            />
            <Fader
                className='Master'
                gain={masterGain}
                setGain={(event)=>setMasterGain(event.target.value)}
                min={0}
                max={2}
                step={0.1}
                faderlabel={'Master'}
                showlabel={true}
            />
        </div>

    );
}