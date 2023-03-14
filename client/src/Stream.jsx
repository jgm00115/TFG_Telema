import dashjs from 'dashjs'
import {useRef, useEffect } from 'react'

export default function Player () {
    
    const audioRef = useRef(null);

    useEffect(() => {
        const player = dashjs.MediaPlayer().create();

        player.updateSettings({
            streaming: {
                buffer:{
                    bufferTimeAtTopQuality: 6,
                    bufferTimeAtTopQualityLongForm: 6,
                    stableBufferTime: 6,
                    longFormContentDurationThreshold: 10,
                }
            }
        })

        player.initialize(audioRef.current,'/media/webM_dash/manifest.mpd',true);
    }, []);

    return (
        <audio ref={audioRef} controls/>
    )
}