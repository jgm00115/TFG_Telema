/** 
* streamController.js
* 
* Callbacks para procesar peticiones relacionadas con streams
*/

const fs = require('fs');
const path = require('path');

const media_dir = path.resolve(path.join(__dirname,'..','..','media'));

exports.get_ingest = (req,res) => {
    
    res.send(`No implementado: media_dir = ${media_dir}`);

}

// Espera recibir cabecera Content-Type: application/octet-stream
exports.stream_ingest = (req,res) => {

    // Directorio de salida
    const filename = req.params.filename;
    const filepath = path.join(media_dir,'uploads',filename);

    // Escribe en fichero
    fs.writeFile(filepath, req.body, (err) => {
        
        if (err) throw err;
        
    });
    res.send(`Fichero ${filename} recibido`);

}