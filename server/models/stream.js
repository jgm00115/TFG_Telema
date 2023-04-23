const mongoose = require('mongoose');
const HRTFmodel = require('./hrtf');

const Schema = mongoose.Schema;

const instrumentSchema = new Schema({
    name: {type: String, required: true},
    channel: {type: Number, required: true},
    azimuth: {type: Number},
    elevation: {type: Number}
});

const streamSchema = new Schema({
    name: {type: String, required:true},
    description: {type: String, requierd:false},
    instruments: [instrumentSchema]
});

// Devuelve las HRTF de la posicion de cada instrumento
streamSchema.methods.getHRTFS = async function (){
    const positions = [];
    for (instrument of this.instruments){
        positions.push({
            'azimuth': instrument.azimuth,
            'elevation': instrument.elevation
            });
    }
    const hrtfs = await HRTFmodel.find({$or:positions}).exec();
    return hrtfs;
};

module.exports = mongoose.model('Stream',streamSchema);