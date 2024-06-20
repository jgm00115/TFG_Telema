# TFG Telema
Servicio de streaming de audio de carácter inmersivo para retransmitir actuaciones de música clásica

## Ejemplo de funcionamiento para las separaciones del TFG de teleco
[En el siguiente enlace](https://thankful-similarly-trout.ngrok-free.app/) se puede acceder a distintos **ejemplos de separación obtenidos con el sistema propuesto en el TFG de teleco**. La aplicación ha sido ligeramente modificada, inhibiendo la espacialización de las mezclas y sirviendo en distintos adaptation sets las señales de cada método de separación propuesto.

Se recomienda hacer uso de navegadores web basados en chromium, como podrían ser google chrome o microsoft edge.

## Distribución de contenido
Todo el audio se distribuye empleando el protocolo `MPEG-DASH`. En el frontend se hace uso de [dash.js](https://github.com/Dash-Industry-Forum/dash.js/) para la reproducción del contenido.

## Ingesta de media
Se emplea `ffmpeg` para la transcodificación y empaquetado de audio. Para subir contenido al servidor se usa el endpoint`http://localhost:8080/ingest/:stream_key/:filename`.

Por ejemplo, el siguiente comando envia un pseudostream con 4 fuentes de audio:

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
En la transcodificación y empaquetado se emplea el codec `Opus` y contenedores `WebM`. Las etiquetas de `language` en los metadatos de cada stream sirven para identificar al instrumento correspondiente.

Cada señal de audio se corresponde con un track del stream especificándolo en los `adaptation_sets`. Durante la reproducción se puede seleccionar interactivamente uno de estos tracks, el servidor envía al cliente únicamente el audio perteneciente al track seleccionado.**Todos los tracks pertenecientes al stream están sincronizados**.
