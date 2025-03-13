const mongoose = require('mongoose');
const HRTFmodel = require('./hrtf');
const ambiHRTFmodel = require('./ambihrtf');

const Schema = mongoose.Schema;

const instrumentSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    name: {type: String, required: true},
    channel: {type: Number, required: true},
    azimuth: {type: Number},
    elevation: {type: Number},
    point: {type: Object}
});

const cameraSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    name: {type: String, required: true},
    point: {type: Object, required: true},
    initialRotation: {type: Number, required: true},
    
})

const streamSchema = new Schema({
    title: {type: String, required:true},
    description: {type: String, required:false},
    createdAt: {type:Date, default: Date.now},
    endDate: {type:Date, default:null},
    instruments: [instrumentSchema],
    sh_order: {type: Number, required: false},
    venueDinemsions: {type: Object, required: false},
    venueImage: {type: String, required: false},
    venueName: { type: String, required: false},
    orchestraImage: {type: String, required: false},
    cameras: [cameraSchema]
});

// Returns the positions of each instrument in the stream
streamSchema.methods.getPositions = function(){
    console.log(`Instruments: ${this.instruments}`);
    const positions = this.instruments.map((instrument) => {
        return ({
            'azimuth':instrument.azimuth,
            'elevation': instrument.elevation
        });
    });
    return positions;
}

// Returns the HRTF of the position of each instrument
streamSchema.methods.getHRTFS = async function (){
    const positions = this.getPositions();
    const hrtfs = await HRTFmodel.find({$or:positions}).exec();
    // There can be multiple HRTFs with the same coordinates
    // Ensures to return one HRTF for each instrument
    const instrumentHrtfs = this.instruments.map((instrument) => {
        const matchingHrtf = hrtfs.find(hrtf => 
            hrtf.azimuth === instrument.azimuth &&
            hrtf.elevation === instrument.elevation
            );
        if (matchingHrtf) {
            return {
                ...matchingHrtf.toObject(),
                channel: instrument.channel
            };
        } else {
            return null;
        }
        
    });

    return instrumentHrtfs;
};

// Returns the positions of each instrument in the stream

streamSchema.methods.getAmbiIndexes = function(){
    const sh_order = 2; //this.sh_order;
    const sh_indexes = [];
    for (let n = 0; n <= sh_order; n++) {
        for (let m = -n; m <= n; m++) {
            sh_indexes.push({ order: n, degree: m });
        }
    }
    return sh_indexes;
}

streamSchema.methods.getAmbiHRTFS = async function(){
    const sh_indexes = this.getAmbiIndexes();
    const ambihrtfs = await ambiHRTFmodel.find({$or:sh_indexes}).exec();
    // There can be multiple HRTFs with the same coordinates
    // Ensures to return one HRTF for each instrument
    i = 0;
    //console.log(`ambihrtfs: ${ambihrtfs}`);
    console.log(`sh_index test: ${sh_indexes}`);
    console.log(`sh_index test: ${sh_indexes[0].order}, ${sh_indexes[0].degree}`);
    const ambiHrtfs = sh_indexes.map((sh_index) => {
        console.log(`sh_index, order: ${sh_index.order}, degree: ${sh_index.degree}`);
        const matchingAmbiHrtf = ambihrtfs.find(ambihrtf => 
            ambihrtf.order  === sh_index.order  &&
            ambihrtf.degree === sh_index.degree
            );
        if (matchingAmbiHrtf) {
            return {
                ...matchingAmbiHrtf.toObject(),
                channel: i,
            };
            i++;
        } else {
            return null;
        }
        
    });

    return ambiHrtfs;
};



// For each position, selects the closest available position
closestAvailableAzimuths = async (positions) => {
    closestPositions= [];
    for (const position of positions){
        azimuth = position.azimuth;
        elevation = position.elevation;
        // Available azimuths for that elevation
        const availableAzimuths = await HRTFmodel.distinct(
            'azimuth',{elevation: elevation});
        // Angular distance with the available azimuths
        const dist = availableAzimuths.map(
            (availableAzimuth) => Math.abs(availableAzimuth - azimuth));
        // Position with minimum distance
        closestPositions.push({
            azimuth: availableAzimuths[dist.indexOf(Math.min(...dist))],
            elevation: elevation});
    }
    console.log(`Positions after adding rotation: ${JSON.stringify(positions)}`);
    console.log(`Closest available positions:
            ${JSON.stringify(closestPositions)}`);
    return closestPositions;
}

streamSchema.methods.rotate = async function(rotation){
    const positions = this.getPositions();
    // Adds the rotation to each position
    for (let position of positions){
        position.azimuth -= rotation;
    }
    // Finds the closest available positions
    const closestPositions = await closestAvailableAzimuths(positions);
    // Query HRTFs with those positions
    const rotatedHrtfs = await Promise.all(
        closestPositions.map((position)=> {
            return HRTFmodel.find({azimuth:position.azimuth,elevation:position.elevation});
        }));
    return rotatedHrtfs.flat();
}

module.exports = mongoose.model('Stream',streamSchema);