/** 
* streamController.js
* 
* Callbacks para procesar peticiones de archivos multimedia para reproducirlos
*/

const path = require('path');
const { resourceLimits } = require('worker_threads');

const media_dir = rootDir = path.resolve(__dirname,'..','..','media');

exports.get_media = (req,res) => {
    stream_id = req.params.id;
    filename = req.params.filename;
    // ruta al recurso
    resource_path = path.join(media_dir, stream_id,filename);
    // Ajusta el content-type en función de la extensión del archivo
    extension = path.extname(resource_path);
    if (extension === '.mpd'){
        res.set('Content-Type','application/dash+xml');
    } else if (extension === '.webm'){
        res.set('Content-Type','audio/webm');
    }
    // envia el archivo
    res.sendFile(resource_path);
}