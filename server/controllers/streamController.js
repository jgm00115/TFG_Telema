const Stream = require('../models/stream');

// Devuelve todos los streams
exports.getStreams = (req,res) => {
    Stream.find({})
    .then((streams) => {
        res.json(streams);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

// Crea un nuevo stream y devuelve el id si hay éxito
exports.postStream = (req,res) => {
    const stream = new Stream({
        'title': req.body.title,
        'description': req.body.description,
        'instruments': req.body.instruments,
    });
    stream.save()
    .then((savedStream)=> {
        console.log(`Nuevo stream con id ${savedStream._id}`);
        res.status(200).json({id: savedStream._id});
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
}

// Devuelve todas las HRTFs de los instrumentos de un stream
exports.getStreamHRTFS = (req,res) => {
    const streamID = req.params.id;
    Stream.findById(streamID)
    .then(async (stream)=> {
        if(!stream){
            console.log(`No existe ningún stream con id ${streamID}`);
            res.sendStatus(404);
        }
        const hrtfs = await stream.getHRTFS();
        res.status(200).json(hrtfs);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}