import { useEffect, useState } from 'react';

export function useVideoPlayer(videoRef, setupAudioProcessing) {
  const [videoElement, setVideoElement] = useState(null);

  useEffect(() => {
    if (videoRef.current) {
      setVideoElement(videoRef.current);
      setupAudioProcessing(videoRef.current);
    }
  }, [videoRef, videoElement, setupAudioProcessing]);

  const handlePlay = () => {
    if (videoElement) {
      videoElement.play();
    }
  };

  return { videoElement, handlePlay };
}
