const Stream = require('../models/stream');
const HRTF = require('../models/hrtf');
const AMBIHRTF = require('../models/ambihrtf');
const mongoose = require('mongoose');

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

// Get stream by id
exports.getStream = (req, res) => {
    console.log("inside get stream");
    const streamID = req.params.id;
    Stream.findById(streamID)
    .then((stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        res.json(stream);
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

// Updates a stream with the provided data
exports.updateStream = async (req, res) => {
    try {
        const streamID = req.params.id;
        const body = req.body;

        const stream = await Stream.findById(streamID);
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            return res.sendStatus(404);
        }
        if (typeof body.title !== 'undefined') {
            stream.title = body.title;
        }
        if (typeof body.description !== 'undefined') {
            stream.description = body.description;
        }
        if (typeof body.sh_order !== 'undefined') {
            stream.sh_order = body.sh_order;
        }
        if (typeof body.venueDimensions !== 'undefined') {
            stream.venueDimensions = body.venueDimensions;
        }
        if (typeof body.venueName !== 'undefined') {
            stream.venueName = body.venueName;
        }
        if (typeof body.venueImage !== 'undefined') {
            stream.venueImage = body.venueImage;
        }
        if (typeof body.orchestraImage !== 'undefined') {
            stream.orchestraImage = body.orchestraImage;
        }
        await stream.save();
        return res.status(200).json(stream);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

exports.deleteStream = async (req, res) => {
    try {
        const streamID = req.params.id;

        const deletedStream = await Stream.findByIdAndDelete(streamID);
        if (!deletedStream) {
            console.log(`No stream exists with id ${streamID}`);
            return res.sendStatus(404);
        }
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

exports.endStream = async (req, res) => {
    try {
        const streamID = req.params.id;
        const endDate = req.body.endDate || new Date();

        const stream = await Stream.findById(streamID);
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            return res.sendStatus(404);
        }

        stream.endDate = endDate;
        await stream.save();

        return res.status(200).json(stream);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

exports.updateInstrumentPosition = (req, res) => {
    const streamID = req.params.id;
    const instrumentID = req.params.instrumentID;
    const position = req.body.position;
    Stream.findById(streamID)
    .then(async (stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        if (!position) {
            console.log("No position provided");
            res.sendStatus(400);
        }
        const instrument = stream.instruments.id(instrumentID);
        if (!instrument) {
            console.log(`No instrument exists with id ${instrumentID}`);
            res.sendStatus(404);
        }
        instrument.position = position;
        await stream.save();
        res.status(200).json(instrument);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

exports.updateInstruments = (req, res) => {
    const streamID = req.params.id;
    const instruments = req.body.instruments;
    Stream.findById(streamID)
    .then(async (stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        if (!instruments) {
            console.log("No instruments provided");
            res.sendStatus(400);
        }
        stream.instruments = instruments;
        await stream.save();
        res.status(200).json(stream);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

exports.updateCameraPosition = (req, res) => {
    const streamID = req.params.id;
    const cameraID = req.params.cameraID;
    const position = req.body.position;
    Stream.findById(streamID)
    .then(async (stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        if (!position) {
            console.log("No position provided");
            res.sendStatus(400);
        }
        const camera = stream.cameras.id(cameraID);
        if (!camera) {
            console.log(`No camera exists with id ${cameraID}`);
            res.sendStatus(404);
        }
        camera.position = position;
        await stream.save();
        res.status(200).json(camera);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

exports.updateCameras = async (req, res) => {
    try {
        console.log("Inside update cameras");
        const streamID = req.params.id;
        let cameras = req.body.cameras; // Incoming cameras array

        if (typeof cameras === 'undefined') {
            console.log("No cameras provided");
            return res.status(400).json({ error: "No cameras provided" });
        }

        const stream = await Stream.findById(streamID);
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            return res.status(404).json({ error: "Stream not found" });
        }

        // Ensure all cameras have an ObjectId
        cameras = cameras.map(camera => ({
            _id: camera._id ? new mongoose.Types.ObjectId(camera._id) : new mongoose.Types.ObjectId(),
            name: camera.name,
            point: camera.point,
            initialRotation: camera.initialRotation
        }));

        stream.cameras = cameras; // Replace the existing cameras with the updated list
        await stream.save();

        res.status(200).json(stream);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.updateVenue = (req, res) => {
    const streamID = req.params.id;
    const venueName = req.body.venueName;
    const venueDimensions = req.body.venueDimensions;
    const venueImage = req.body.venueImage;
    const orchestraImage = req.body.orchestraImage;
    Stream
        .findById
        (streamID)
        .then(async (stream) => {
            if (!stream) {
                console.log(`No stream exists with id ${streamID}`);
                res.sendStatus(404);
            }
            if (venueName) stream.venueName = venueName;
            if (venueDimensions) stream.venueDimensions = venueDimensions;
            if (venueImage) stream.venueImage = venueImage;
            if (orchestraImage) stream.orchestraImage = orchestraImage;
            await stream.save();
            res.status(200).json(stream);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
}


exports.getCameras = (req, res) => {
    const streamID = req.params.id;
    Stream.findById(streamID)
    .then(async (stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        res.status(200).json(stream.cameras);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

exports.getInstruments = (req, res) => {
    const streamID = req.params.id;
    Stream.findById(streamID)
    .then(async (stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        res.status(200).json(stream.instruments);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

exports.updateVenueImage = (req, res) => {
    const streamID = req.params.id;
    const venueImage = req.body.venueImage
    Stream.findById(streamID)
    .then(async (stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        if (!venueImage) {
            console.log("No image provided");
            res.sendStatus(400);
        }
        stream.venueImage = venueImage;
        await stream.save();
        res.status(200).json(stream);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

exports.updateOrchestraImage = (req, res) => {
    const streamID = req.params.id;
    const orchestraImage = req.body.orchestraImage
    Stream.findById(streamID)
    .then(async (stream) => {
        if (!stream) {
            console.log(`No stream exists with id ${streamID}`);
            res.sendStatus(404);
        }
        if (!orchestraImage) {
            console.log("No image provided");
            res.sendStatus(400);
        }
        stream.orchestraImage = orchestraImage;
        await stream.save();
        res.status(200).json(stream);
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
        console.log("Testing update.....")
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
