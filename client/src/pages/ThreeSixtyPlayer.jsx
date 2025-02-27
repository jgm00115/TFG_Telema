import React, { useEffect } from 'react';
import VideoSphereManual from '../components/controls/VideoSphere';

const ThreeSixtyPlayer = (props, ref) => {
  const { playerRef } = props;
  useEffect(() => {
    console.log("XXX Player ref", playerRef)
    console.log("XXX Player ref CURRENT", playerRef.current)
  }, [playerRef])
  return (
    <div
    >
      {/* Display video inside the 360 video sphere */}
      <VideoSphereManual videoElement={playerRef} />
    </div>
  );
};

export default ThreeSixtyPlayer;
