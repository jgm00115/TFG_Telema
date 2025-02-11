import { useEffect, useRef, useState } from 'react';
import dashjs from 'dashjs';

export function useDashPlayer(videoRef) {
  const [player, setPlayer] = useState(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [videoTracks, setVideoTracks] = useState([]);

  useEffect(() => {
    if (!videoRef.current) return;

    const dashPlayer = dashjs.MediaPlayer().create();
    dashPlayer.initialize(videoRef.current, "http://127.0.0.1:8081/output_adaptive_360.mpd", true);
    setPlayer(dashPlayer);

    dashPlayer.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
      setAudioTracks(dashPlayer.getTracksFor('audio'));
      setVideoTracks(dashPlayer.getTracksFor('video'));
    });

    return () => {
      dashPlayer.reset();
    };
  }, [videoRef]);

  return { player, audioTracks, videoTracks };
}
