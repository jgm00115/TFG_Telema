import dashjs from 'dashjs'
import Fader from '../components/Fader';
import Mixer from '../components/Mixer'
import TrackSelector from '../components/TrackSelector';
import RotationSelector from '../components/RotationSelector';

//import { AudioChain } from '../components/AudioChain';

import { useRef, useEffect, useState } from 'react'
import { SSSAudioChain } from '../components/SSSAudioChain';
import { AudioIO } from '../components/AudioIO';
import { MOAudioChain } from '../components/MOAudioChain';
import { AmbiAudioChain } from '../components/AmbiAudioChain';


// Stream component
export default function Stream({ streaming, mediaURL }) {
    console.log('Stream');
    // Stateless variables (their value persists between re-renders)
    const numTracks = useRef(0);                            // total number of audio tracks
    const trackNames = useRef(Array(0));                    // names of the audio tracks
    const numChannels = useRef(Array(0));                   // audio channels per track (array)
    const mainTrackIndex = useRef(null);
    const audioRef = useRef(null);                          // HTML audio media element 
    const player = useRef(dashjs.MediaPlayer().create());   // dash player

    const audioIO = useRef(null);

    // State variables (components re-render every time they change)
    const [track, setTrack] = useState(0);                  // active track
    const [gains, setGains] = useState(Array(0).fill(0));   // array with gains of each fader
    const [masterGain, setMasterGain] = useState(1);
    const [rotation, setRotation] = useState(0);            // degrees of rotation from the original position
    const [showlabels, setShowLabels] = useState(true);
    console.log('UI components');
    // Executes once after the first render
    useEffect(() => {
        console.log('updateSettings');
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



        // IF THE AUDIO CHAIN IS INITIALIZED
        if (audioIO.current != null) {
            console.log(`Gains = ${gains}`);
            // Update gain nodes
            //audioChain.current.setFadersGain(gains);
            audioIO.current.getSelectedAudioChain().setFadersGain(gains);

        }

    }, [gains]);
    // Executes when the master gain is updated
    useEffect(() => {

        if (audioIO.current != null) {
            console.log(`Master gain = ${masterGain}`);
            audioIO.current.setMasterGain(masterGain);
        }
    }, [masterGain]);
    // Executes when the selected track is updated
    useEffect(() => {

        if (audioIO.current != null) {
            console.log(`Active track = ${track}`);
            // Update active track
            console.log(`Uploading new track `);
            const tracks = player.current.getTracksFor('audio');

            player.current.setCurrentTrack(tracks[track]);

            // If the main track is selected, use convolvers
            // And also add names to the faders
            console.log(`track = ${track}`);
            console.log(`track names = ${trackNames.current}`);
            if (trackNames.current[track] == 'main') {
                audioIO.current.switchAudioChain(0);
                console.log('main');
                setShowLabels(true);
            } else if (trackNames.current[track] == 'ambi') {
                audioIO.current.switchAudioChain(2);
                console.log('ambi');
                setShowLabels(false);
            }
            else if (trackNames.current[track] == 'cellos' || trackNames.current[track] == 'flutes' || trackNames.current[track] == 'violins') {
                audioIO.current.switchAudioChain(1);
                console.log('mo');
                setShowLabels(false);
            }

        }

    }, [track]);

    //TODO: adding a different component for the Ambisonics HRTF for 3dof + 6dof
    // Executes when the rotation is updated 
    useEffect(() => {
        async function loadHRTFS() {

            if (audioIO.current != null) {
                console.log(`rotation = ${rotation}`);
                let rotatedHRTFs;
                if (trackNames.current[mainTrackIndex.current] == "main") {
                    if (rotation != 0) {
                        // Request new HRTFS
                        const response = await fetch(`/stream/${streaming._id}/hrtfs/${rotation}`);
                        rotatedHRTFs = await response.json();
                    } else {
                        // If the rotation is 0, request the base HRTF
                        const response = await fetch(`/stream/${streaming._id}/hrtfs/`);
                        rotatedHRTFs = await response.json();
                    }
                    // Load hrtfs into convolvers
                    audioIO.current.getAudioChain(0).loadHRTFS(rotatedHRTFs);
                    console.log('rotatedHRTFs:');
                    console.log(rotatedHRTFs);
                } else if (trackNames.current[mainTrackIndex.current] == "ambi") {
                    audioIO.current.getAudioChain(2).rotateScene(rotation, 0);
                }



            }
        }
        loadHRTFS();
    }, [rotation]);

    const onPlay = async () => {
        console.log('onPlay');
        const defaultGain = 0.5;

        // IF AUDIO CHAIN IS INITIALIZED, RETURN
        if (audioIO.current != null)
            return;

        // Update the value of the number of available tracks
        const tracks = player.current.getTracksFor('audio');
        console.log(JSON.stringify(tracks));
        numTracks.current = tracks.length;

        // Update the name of the tracks
        let trackLangs = [];
        for (let trackL of tracks) {
            trackLangs.push(trackL.lang);
        }

        trackNames.current = trackLangs;

        console.log(`Number of audio tracks = ${numTracks.current}`);
        console.log(`track names = ${trackNames.current}`);
        // Update the number of available audio channels
        numChannels.current = tracks.map(
            (track) => parseInt(track.audioChannelConfiguration));

        const maxNumChannels = Math.max(...numChannels.current);
        //mainTrackIndex.current = numChannels.current.indexOf(maxNumChannels);
        mainTrackIndex.current = trackNames.current.indexOf('ambi');
        console.log(`Number of channels per track = ${numChannels.current}`);
        console.log(`Maximum number of channels = ${maxNumChannels}`);
        console.log(`Main track index = ${mainTrackIndex.current}`);

        // Request HRTFS from the backend
        console.log("requesting hrtfs");
        const response = await fetch(`/stream/${streaming._id}/hrtfs`);
        const hrtfs = await response.json();
        console.log(`Number of HRTFS retrieved = ${hrtfs.length}`);
        console.log(hrtfs);
        const ambiResponse = await fetch(`/stream/${streaming._id}/ambiHrtfs`);
        const ambiHrtfs = await ambiResponse.json();
        console.log(`Number of ambi HRTFS retrieved = ${ambiHrtfs.length}`);
        console.log(ambiHrtfs);

        // Create a new audioIO and multiple audio chains
        audioIO.current = new AudioIO(audioRef.current, maxNumChannels);
        audioIO.current.addAudioChain(new SSSAudioChain(audioIO.current.getAudioCtx(), maxNumChannels, defaultGain, hrtfs));
        audioIO.current.addAudioChain(new MOAudioChain(audioIO.current.getAudioCtx(), 2, defaultGain));
        audioIO.current.addAudioChain(new AmbiAudioChain(audioIO.current.getAudioCtx(), 2, defaultGain, ambiHrtfs));


        // INITIALIZE AUDIO CHAIN
        console.log(`Selected track name = ${trackNames.current[mainTrackIndex.current]}`);
        if (trackNames.current[mainTrackIndex.current] == 'main') {
            audioIO.current.switchAudioChain(0);
            //audioChain.current = new AudioChain(audioRef.current,
            //     maxNumChannels, defaultGain, hrtfs);

            console.log(`New audio chain selected`);

            // Update the value of the gains
            setGains(audioIO.current.getSelectedAudioChain().getFadersGain());
            setMasterGain(audioIO.current.getMasterGainValue());
            // Select the main track by default
            setTrack(mainTrackIndex.current);
            player.current.setCurrentTrack(tracks[mainTrackIndex.current]);
        } else if (trackNames.current[mainTrackIndex.current] == 'ambi') {
            audioIO.current.switchAudioChain(2);
            //audioChain.current = new AudioChain(audioRef.current,
            //     maxNumChannels, defaultGain, hrtfs);

            console.log(`New audio chain selected`);

            // Update the value of the gains
            setGains(audioIO.current.getSelectedAudioChain().getFadersGain());
            setMasterGain(audioIO.current.getMasterGainValue());
            // Select the main track by default
            setTrack(mainTrackIndex.current);
            player.current.setCurrentTrack(tracks[mainTrackIndex.current]);
        } else if (trackNames.current[mainTrackIndex.current] == 'cellos' || trackNames.current[mainTrackIndex.current] == 'flutes' || trackNames.current[mainTrackIndex.current] == 'violins') {
            audioIO.current.switchAudioChain(1);
            //audioChain.current = new AudioChain(audioRef.current,
            //     maxNumChannels, defaultGain, hrtfs);

            console.log(`New audio chain selected`);

            // Update the value of the gains
            setGains(audioIO.current.getSelectedAudioChain().getFadersGain());
            setMasterGain(audioIO.current.getMasterGainValue());
            // Select the main track by default
            setTrack(mainTrackIndex.current);
            player.current.setCurrentTrack(tracks[mainTrackIndex.current]);
        }
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
            ) : null}
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
                setGain={(event) => setMasterGain(event.target.value)}
                min={0}
                max={2}
                step={0.1}
                faderlabel={'Master'}
                showlabel={true}
            />
        </div>

    );
}