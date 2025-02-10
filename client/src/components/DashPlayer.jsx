import React, { useEffect, useRef } from 'react';
import dashjs from 'dashjs';

const DashPlayer = ({ videoSrc, onVideoReady }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;

    const player = dashjs.MediaPlayer().create();
    player.initialize(videoRef.current, videoSrc, true);
    onVideoReady(videoRef.current);

    return () => {
      player.reset();
    };
  }, [videoSrc, onVideoReady]);

  return (
    <video
      ref={videoRef}
      crossOrigin="anonymous"
      playsInline
      muted
      autoPlay
      style={{
        height: "100px",
        width: "200px"
      }}
    />
  );
};

export default DashPlayer;
