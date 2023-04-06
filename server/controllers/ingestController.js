/** 
* streamController.js
* 
* Callbacks para procesar peticiones relacionadas con streams
*/

const fs = require('fs');
const path = require('path');

const media_dir = path.resolve(path.join(__dirname, '..', '..', 'media'));

exports.get_ingest = (req, res) => {

    res.send(`No implementado: media_dir = ${media_dir}`);

}

exports.stream_ingest = (req, res) => {

    const stream_key = req.params.stream_key;

    // Crea directorio de salida si no existe
    // (debería relacionarse con el stream key)
    const ingest_path = path.join(media_dir,stream_key);

    try{
        if(!fs.existsSync(ingest_path)) {
            fs.mkdirSync(ingest_path, {recursive: true});
            console.log(`Directorio ${ingest_path} creado`);
        }
    } catch (error) {
        console.log(error);
    }

    const filename = req.params.filename;
    const filepath = path.join(ingest_path,filename);

    const writeStream = fs.createWriteStream(filepath);

    // Escribe en directorio de salida cuando recibe data
    req.on('data', (chunk) => {

        writeStream.write(chunk);

    });

    // Envia OK si todo ha ido correctamente
    req.on('end', () => {

        writeStream.end();

        console.log(`Fichero ${filename} recibido con éxito`);

        res.sendStatus(200);

    });

    writeStream.on('error', (err) => {

        console.log(`Error durante ingesta de datos: ${err}`);
        res.status(500).send(`Error al procesar archivos recibidos`);

    });

}