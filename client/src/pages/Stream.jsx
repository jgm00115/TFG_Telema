import dashjs from "dashjs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  setStreaming, setTrack, setNumTracks, setTrackNames, 
  setNumChannels, setMediaURL, setGains, setMasterGain, setRotation, toggleMenu, setPlaying,
  setShowControls 
} from "../store/reducers/streamReducer";

import Fader from "../components/controls/Fader";
import Mixer from "../components/controls/Mixer";
import TrackSelector from "../components/controls/TrackSelector";
import RotationSelector from "../components/RotationSelector";
import ThreeSixtyPlayer from "./ThreeSixtyPlayer";
import Venue from "../components/controls/Venue";
import Orchestra from "../components/controls/Orchestra"
import FadeWrapper from "../components/core/FadeWrapper";
import LargeHeader from "../components/core/LargeHeader";

import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Get stream ID from URL
import { SSSAudioChain } from "../components/SSSAudioChain";
import { AudioIO } from "../components/AudioIO";
import { MOAudioChain } from "../components/MOAudioChain";
import { AmbiAudioChain } from "../components/AmbiAudioChain";
import ThreeControls from "../components/controls/ThreeControls";

export default function Stream() {

  // Get the stream ID from the URL
  const { id: streamid } = useParams();
  const navigate = useNavigate();
  // Create redux dispatcher and get redux selectors
  const dispatch = useDispatch();
  const streaming = useSelector((state) => state.stream.streaming);
  const mediaURL = useSelector((state) => state.stream.mediaURL);
  const track = useSelector((state) => state.stream.track);
  const numTracks = useSelector((state) => state.stream.numTracks);
  const trackNames = useSelector((state) => state.stream.trackNames);
  const numChannels = useSelector((state) => state.stream.numChannels);
  const gains = useSelector((state) => state.stream.gains);
  const masterGain = useSelector((state) => state.stream.masterGain);
  const rotation = useSelector((state) => state.stream.rotation);
  const isMenuOpen = useSelector((state) => state.stream.isMenuOpen);
  const playing = useSelector((state) => state.stream.playing);
  const cameraRotation = useSelector((state) => state.stream.cameraRotation);
  const currentCamera = useSelector((state) => state.stream.currentCamera);
  const fovRotation = useSelector((state) => state.stream.fovRotation);
  const showControls = useSelector((state) => state.stream.showControls);
  const mode = useSelector((state) => state.stream.mode);
  const cameras = useSelector((state) => state.stream.cameras);
  const instruments = useSelector((state) => state.stream.instruments);

  // Refs for audio processing
  const mainTrackIndex = useRef(null);
  const audioRef = useRef(null);
  const player = useRef(dashjs.MediaPlayer().create());
  const audioIO = useRef(null);

  // State for UI updates
  const [showlabels, setShowLabels] = useState(true);

  // Fetch stream details when component mounts
  useEffect(() => {
    async function fetchStream() {
      try {
        const response = await fetch(`/stream/${streamid}/stream`);
        const data = await response.json();
        dispatch(setStreaming(data));
        dispatch(setMediaURL(`/media/${data._id}/manifest.mpd`)); // Construct media URL
      } catch (error) {
        console.error("Error fetching stream:", error);
      }
    }
    fetchStream();
  }, [streamid]);

  // Fetch MPD file when mediaURL updates
  useEffect(() => {
    if (!mediaURL) return;
    const fetchMediaUrl = async () => {
      try {
        const response = await fetch(mediaURL);
        const mpdText = await response.text();
        console.log("MPD", mpdText);
      } catch (error) {
        console.error("Error fetching MPD:", error);
      }
    };
    fetchMediaUrl();
  }, [mediaURL]);

  // Initialize dash.js player when mediaURL is available
  useEffect(() => {
    if (!mediaURL || !audioRef.current) return;

    player.current.updateSettings({
      streaming: {
        cacheInitSegments: true,
        delay: {
          liveDelayFragmentCount: 4,
        },
      },
    });

    player.current.initialize(audioRef.current, mediaURL, true);
  }, [mediaURL]);

  // Handle track changes
  useEffect(() => {
    if (!audioIO.current || !player.current) return;

    console.log(`Active track = ${track}`);
    const tracks = player.current.getTracksFor("audio");
    player.current.setCurrentTrack(tracks[track]);

    // Switch audio chain based on track name
    const trackName = trackNames[track];
    if (trackName === "main") {
      audioIO.current.switchAudioChain(0);
      setShowLabels(true);
    } else if (trackName === "ambi") {
      audioIO.current.switchAudioChain(2);
      setShowLabels(false);
    } else {
      audioIO.current.switchAudioChain(1);
      setShowLabels(false);
    }
  }, [track]);

  useEffect(() => {
    let timeout;
  
    const handleMouseMove = () => {
      dispatch(setShowControls(true));
  
      // Clear previous timeout and set a new one
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        dispatch(setShowControls(false));
      }, 3000);
    };
  
    window.addEventListener("mousemove", handleMouseMove);
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);
  

  // Handle rotation updates and HRTF fetching
  useEffect(() => {
    async function loadHRTFS() {
      if (!audioIO.current || !streaming) return;

      let rotatedHRTFs;
      const endpoint = rotation !== 0 ? `/stream/${streaming._id}/hrtfs/${rotation}` : `/stream/${streaming._id}/hrtfs/`;
      try {
        const response = await fetch(endpoint);
        rotatedHRTFs = await response.json();
        console.log("Rotated HRTFs:", rotatedHRTFs);
        audioIO.current.getAudioChain(0).loadHRTFS(rotatedHRTFs);
      } catch (error) {
        console.error("Error fetching HRTFs:", error);
      }
    }
    loadHRTFS();
  }, [rotation, streaming]);

  // Handle play event and initialize audio processing
  // Rather than onPlay we should instantiate on page load.
  // Is this because it needs to be playing in order to get the relevant information about the audio?
  // Update to onMetaDataLoaded
  // From that we can determine which modes for this stream are available and set the audio chains accordingly.
  const onPlay = async () => {
    if (!streaming || audioIO.current) return;

    // Can we get this information before playing/ready?
    const tracks = player.current.getTracksFor("audio");
    console.log("TRACKS", tracks)
    dispatch(setNumTracks(tracks.length));
    dispatch(setTrackNames(tracks.map(track => track.lang)));
    dispatch(setNumChannels(tracks.map(track => parseInt(track.audioChannelConfiguration))));
    mainTrackIndex.current = trackNames.indexOf("flutes");

    console.log(`Tracks:`, trackNames);
    console.log(`Channels:`, numChannels);

    try {
      const hrtfsResponse = await fetch(`/stream/${streaming._id}/hrtfs`);
      const hrtfs = await hrtfsResponse.json();
      const ambiHrtfsResponse = await fetch(`/stream/${streaming._id}/ambiHrtfs`);
      const ambiHrtfs = await ambiHrtfsResponse.json();

      audioIO.current = new AudioIO(audioRef.current, Math.max(...numChannels));
      audioIO.current.addAudioChain(new SSSAudioChain(audioIO.current.getAudioCtx(), numChannels, 0.5, hrtfs));
      audioIO.current.addAudioChain(new MOAudioChain(audioIO.current.getAudioCtx(), 2, 0.5));
      audioIO.current.addAudioChain(new AmbiAudioChain(audioIO.current.getAudioCtx(), 2, 0.5, ambiHrtfs));

      // Select the audio chain.
      if (trackNames[mainTrackIndex.current] === "main") {
        audioIO.current.switchAudioChain(0);
        dispatch(setTrack(mainTrackIndex.current));
        player.current.setCurrentTrack(tracks[mainTrackIndex.current]);
      }
    } catch (error) {
      console.error("Error initializing audio chains:", error);
    }
  };

  const dispatchSetTrack = (track) => {
    dispatch(setTrack(track));
  };

  const handlePlay = () => {
    audioRef.current.play();
    dispatch(setPlaying(true));
  };

  useEffect(() => {
    // every updates is update the AmbiAudioChain.rotateScene
    // AmbiAudioChain.rotateScene(cameraRotation);
  }, [cameraRotation])

  if (!streaming) return <p>Loading stream...</p>;

  /**
   *  TODO:
   *  If SSS, display orchestra layout and HRTF rotation controls
   *  If 3DOF, display venue layout controls, and ThreeSixty player.
   *  If 6DOF, display 3d venue layout controls, and have a camera positioned in that particular view?
   * 
   */

  return (
    <div>
      <div onClick={handlePlay}>
        <ThreeSixtyPlayer playerRef={audioRef} />
      </div>
      <div style={{ background: "rgba(255,255,255,0.5)", boxSizing: "border-box", position: "fixed", width: "100%", top: "0", right: "0", padding: "1em", transform: `translate(0, ${isMenuOpen ? "0" : "-100%"})`, transition: "transform 0.5s" }}
      >
        <video
          ref={audioRef}
          onPlay={onPlay}
          onLoadedMetadata={(e) => {
            const tracks = player.current.getTracksFor("audio");
            console.log("metadata tracks", tracks)
          }}
          crossOrigin="anonymous"
          muted={!playing}
          style={{
            position: "fixed",
            zIndex: "-4",
            top: "-300px",
            right: "-300px",
            width: "200px",
            height: "200px",
          }}
        />
        <TrackSelector numTracks={numTracks} track={track} setTrack={dispatchSetTrack} trackNames={trackNames} />
        {track === mainTrackIndex.current && (
          <RotationSelector rotation={rotation} setRotation={setRotation} min={-90} max={90} step={5} />
        )}
        <div style={{display: "flex", justifyContent: "center"}}>
          <Mixer
            gains={gains}
            setGains={setGains}
            numFaders={numChannels[track] || 1}
            faderlabels={streaming.instruments?.map(instrument => instrument.name) || []}
            showlabels={showlabels}
          />
          <Fader className="Master" gain={masterGain} setGain={event => setMasterGain(event.target.value)} min={0} max={2} step={0.1} faderlabel="Master" showlabel={true} />
          { instruments.length > 0 && (
                <Orchestra editable={false} width={300} />
          )}
        </div>
        <div style={{
          position: "relative",
          top: "66px",
          height: "50px",
          width: "100px",
          borderBottomRightRadius: "25px",
          borderBottomLeftRadius: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.5)",
          cursor: "pointer"
        }}
          onClick={() => dispatch(toggleMenu())}
        >
        </div>
      </div>
      <div style={{ position: "fixed", top: "10px", left: "10px", color: 'white' }}>
        <FadeWrapper visible={showControls}>
           <LargeHeader onBack={() => navigate("/")} title={streaming.title} />
        </FadeWrapper>
      </div>
      <div style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
        }}>Pitch {cameraRotation[0]} Roll {cameraRotation[1]} Yaw {cameraRotation[2]}</div>
        {
          cameras.length > 0 && (
              <div style={{ position: "fixed", bottom: "10px", right: "10px", width: "200px"}}>
                <Venue editable={false} width={200} />
            </div>
          )
         }
          </div>
  );
}
