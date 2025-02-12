const Stream = require('../models/stream');
const HRTF = require('../models/hrtf');
const AMBIHRTF = require('../models/ambihrtf');

// Returns all streams
exports.getStreams = (req, res) => {
    Stream.find({})
    .then((streams) => {
        res.json(streams);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

// Creates a new stream and returns the id if successful
exports.postStream = (req,res) => {
    console.log(req.body);
    const stream = new Stream({
        'title': req.body.title,
        'description': req.body.description,
        'instruments': req.body.instruments,
        'sh_order': req.body.sh_order,
    });
    stream.save()
    .then((savedStream) => {
        console.log(`New stream with id ${savedStream._id}`);
        res.status(200).json({id: savedStream._id});
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
}

// Returns all HRTFs of the instruments of a stream
exports.getStreamHRTFS = (req, res) => {
    const streamID = req.params.id;
    Stream.findById(streamID)
    .then(async (stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}, hrtf`);
            res.sendStatus(404);
        }
        const hrtfs = await stream.getHRTFS();
        console.log(`Retrieved ${hrtfs.length} hrtfs for stream ${streamID}`);
        res.status(200).json(hrtfs);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}



// Returns all AmbiHRTFs of the correct order of a stream

exports.getStreamAmbiHRTFS = (req, res) => {
    const streamID = req.params.id;
    Stream.findById(streamID) 
    .then(async (stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        console.log(`stream= ${stream}`);
        const ambihrtfs = await stream.getAmbiHRTFS();
        console.log(`Retrieved ${ambihrtfs.length} ambi hrtfs for stream ${streamID}`);
        res.status(200).json(ambihrtfs);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}


// Returns a set of HRTFs adding rotation to the spatialization
exports.rotate = async (req, res) => {
    const streamID = req.params.id;
    const rotation = parseInt(req.params.rotation);
    try {
        const stream = await Stream.findById(streamID);
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        const rotatedHrtfs = await stream.rotate(rotation);
        res.status(200).json(rotatedHrtfs);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}
