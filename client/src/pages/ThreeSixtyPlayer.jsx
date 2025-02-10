import React, { useState, useEffect, useRef } from 'react';
import DashPlayer from '../components/DashPlayer';
import VideoSphereManual from '../components/VideoSphere';
import dashjs from 'dashjs';

const ThreeSixtyPlayer = () => {
  const [videoElement, setVideoElement] = useState(null);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
      if (!videoRef.current) return;
  
      const player = dashjs.MediaPlayer().create();
      player.initialize(videoRef.current, "http://127.0.0.1:8081/output_adaptive_360.mpd", true);
      // list all of the available tracks
      videoRef.current.addEventListener('canplay', () => {
        if (!audioContextRef.current) {
          console.log("Initializing Web Audio...");
          setVideoElement(videoRef.current);
          setupAudioProcessing(videoRef.current);
        }
      });
      player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
        const audioTracks = player.getTracksFor('audio');
        console.log("audio tracks", audioTracks);
      
        const videoTracks = player.getTracksFor('video');
        console.log("video tracks", videoTracks);
      });
      
      videoRef.current.muted = false;
      return () => {
        player.reset();
        if (audioContextRef.current) {
          audioContextRef.current.close();  // Clean up audio context on unmount
        }
      };
    }, []);

  useEffect(() => {
    if (videoRef.current) {
      console.log("video ref current", videoRef.current);
    }
  }, [videoRef.current]);

  const setupAudioProcessing = (videoElement) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log("audio context", audioContext)
    audioContextRef.current = audioContext;
  
    const source = audioContext.createMediaElementSource(videoElement);
    console.log("ref src", source);
    audioSourceRef.current = source;
  
    // Create nodes
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    const analyserNode = audioContext.createAnalyser();
  
    // Configure nodes
    gainNode.gain.value = 0.8;
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 2000;
    analyserNode.fftSize = 2048;
  
    // Chain: video → filter → analyser → gain → speakers
    source.connect(filterNode);
    filterNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
  
    // Visualization (optional)
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const visualizeAudio = () => {
      requestAnimationFrame(visualizeAudio);
      analyserNode.getByteFrequencyData(dataArray);
    };
    visualizeAudio();

  };

  const handlePlay = () => {
    videoElement.play();
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };
  
  
  return (
    <div onClick={() => videoElement && handlePlay()}>
      {/* Dash.js Video Player */}
        <video
        ref={videoRef}
        crossOrigin="anonymous"
        playsInline
        muted
        autoPlay
        style={{
          height: "100px",
          width: "200px",
          position: "absolute",
          top: "-10000px"
        }}
      />
      {videoElement && <VideoSphereManual videoElement={videoElement} />}
    </div>
  );
};

export default ThreeSixtyPlayer;
