import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useDashPlayer } from '../hooks/useDashPlayer';
import { useAudioProcessing } from '../hooks/useAudioProcessing';
import { useVideoPlayback } from '../hooks/useVideoPlayback';
import VideoSphereManual from '../components/VideoSphere';

const ThreeSixtyPlayer = forwardRef((props, ref) => {
  const videoRef = useRef(null);

  // Set up DASH player and audio/video track management
  const { player, audioTracks, videoTracks } = useDashPlayer(videoRef);

  // Set up Web Audio processing
  const { setupAudioProcessing, resumeAudioContext } = useAudioProcessing(videoRef.current);

  // Manage video playback and audio setup
  const { videoElement, handlePlay } = useVideoPlayback(videoRef, setupAudioProcessing);

  // Expose via ref
  useImperativeHandle(ref, () => ({
    getAudioTracks: () => audioTracks,
    selectAudioTrack: (index) => {
      if (player) {
        const track = audioTracks[index];
        if (track) {
          player.setCurrentTrack(track.id);
          console.log(`Switched to audio track: ${track.lang || 'Unknown Language'}`);
        }
      }
    },
  }));

  return (
    <div
      onClick={() => {
        handlePlay();
        resumeAudioContext(); // Ensure audio context is resumed on play
      }}
    >
      {/* Hidden video element */}
      <video
        ref={videoRef}
        crossOrigin="anonymous"
        playsInline
        muted
        autoPlay
        style={{
          height: '100px',
          width: '200px',
          position: 'absolute',
          top: '-10000px',
        }}
      />

      {/* Display video inside the 360 video sphere */}
      {videoElement && <VideoSphereManual videoElement={videoElement} />}
    </div>
  );
});

export default ThreeSixtyPlayer;
