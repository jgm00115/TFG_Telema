/** 
* streamController.js
* 
* Callbacks to process requests related to streams
*/

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const Stream = require('../models/stream');

const media_dir = path.resolve(path.join(__dirname, '..', '..', 'media'));

exports.get_ingest = (req, res) => {

    res.send(`Not implemented: media_dir = ${media_dir}`);

}

exports.stream_ingest = (req, res) => {

    const stream_key = req.params.stream_key;

    // Create output directory if it does not exist
    // (should be related to the stream key)
    const ingest_path = path.join(media_dir,stream_key);

    try{
        if(!fs.existsSync(ingest_path)) {
            fs.mkdirSync(ingest_path, {recursive: true});
            console.log(`Directory ${ingest_path} created`);
        }
    } catch (error) {
        console.log(error);
    }

    const filename = req.params.filename;
    const filepath = path.join(ingest_path,filename);

    const writeStream = fs.createWriteStream(filepath);

    // Write to output directory when data is received
    req.on('data', (chunk) => {

        writeStream.write(chunk);

    });

    // Send OK if everything went correctly
    req.on('end', () => {

        writeStream.end();

        console.log(`File ${filename} received successfully`);
        
        // Check for changes to the .mpd file
        if (path.extname(filename) === '.mpd'){
            const watcher = chokidar.watch(filepath);
            watcher.on('change', path => {
                console.log(`File ${path} has changed`);
                // Read the file and get the value of type
                fs.readFile(filepath, 'utf8', (err,data) => {
                    if (err){
                        console.log(`Error reading ${filepath}`);
                        return;
                    } else if (data == null){
                        return;
                    }
                    const typeMatch = data.match(/type="([^"]+)"/);
                    if(typeMatch && typeMatch[1]) {
                        const typeValue = typeMatch[1]
                        if (typeValue === 'dynamic')
                            return;
                        // update the end date of the stream
                        Stream.findByIdAndUpdate({_id: stream_key, endDate: null},{endDate: new Date()}, {new:true})
                        .then(updateStream => {
                            if (updateStream){
                                console.log(`Live stream ${updateStream} has ended`);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                        console.log(`TYPE = ${typeValue}`);
                    }
                });
            })
        }

        res.sendStatus(200);

    });

    writeStream.on('error', (err) => {

        console.log(`Error during data ingestion: ${err}`);
        res.status(500).send(`Error processing received files`);

    });

}