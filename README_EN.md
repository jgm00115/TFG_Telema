# TFG Telema
An immersive audio streaming service for broadcasting classical music performances. The full project documentation can be accessed via the following [link](https://hdl.handle.net/10953.1/20073).

## Example of Operation for the TFG Separations
[At this link](https://thankful-similarly-trout.ngrok-free.app/), you can access various **examples of separations obtained using the system proposed in the TFG**. The application has been slightly modified, disabling the spatialization of the mixes and serving the signals from each proposed separation method in different adaptation sets.

It is recommended to use Chromium-based web browsers, such as Google Chrome or Microsoft Edge.

## Content Distribution
All audio is distributed using the `MPEG-DASH` protocol. The frontend uses [dash.js](https://github.com/Dash-Industry-Forum/dash.js/) for content playback.

## Media Ingestion
`ffmpeg` is used for audio transcoding and packaging. To upload content to the server, use the endpoint `http://localhost:8080/ingest/:stream_key/:filename`.

For example, the following command sends a pseudo-stream with 4 audio sources:

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
