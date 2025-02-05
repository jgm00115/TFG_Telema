# TFG Telema
Immersive audio streaming service for broadcasting classical music performances. You can access the project report through the
[following link](https://hdl.handle.net/10953.1/20073).

## Example of operation for the separations of the teleco TFG
[In the following link](https://thankful-similarly-trout.ngrok-free.app/) you can access different **separation examples obtained with the system proposed in the teleco TFG**. The application has been slightly modified, inhibiting the spatialization of the mixes and serving the signals of each proposed separation method in different adaptation sets.

It is recommended to use chromium-based web browsers, such as Google Chrome or Microsoft Edge.

## Content distribution
All audio is distributed using the `MPEG-DASH` protocol. The frontend uses [dash.js](https://github.com/Dash-Industry-Forum/dash.js/) for content playback.

## Media ingestion
`ffmpeg` is used for audio transcoding and packaging. To upload content to the server, the endpoint `http://localhost:8080/ingest/:stream_key/:filename` is used.

For example, the following command sends a pseudostream with 4 audio sources:

```bash
ffmpeg -re \
-i ../audio/Unaligned/cello.wav \
-i ../audio/Unaligned/flute.wav \
-i ../audio/Unaligned/vn_1.wav \
-i ../audio/Unaligned/main.wav \
-map 0:a -c:a libopus -mapping_family 255 -vn -metadata:s:a:0 language=cello \
-map 1:a -c:a libopus -mapping_family 255 -vn -metadata:s:a:1 language=flute \
-map 2:a -c:a libopus -mapping_family 255 -vn -metadata:s:a:2 language=violin \
-map 3:a -c:a libopus -mapping_family 255 -vn -metadata:s:a:3 language=main \
-f dash -dash_segment_type webm -seg_duration 10 -update_period 8 \
-adaptation_sets "id=0,streams=0 id=1,streams=1 id=2,streams=2 id=3,streams=3 " \
http://localhost:8080/ingest/test/manifest.mpd
```
The `Opus` codec and `WebM` containers are used for transcoding and packaging. The `language` tags in the metadata of each stream are used to identify the corresponding instrument.

Each audio signal corresponds to a track of the stream specifying it in the `adaptation_sets`. During playback, one of these tracks can be interactively selected, and the server sends the client only the audio belonging to the selected track. **All tracks belonging to the stream are synchronized**.
