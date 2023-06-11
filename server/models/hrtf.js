const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HRTFSchema = new Schema({
    azimuth: {type: Number, required: true},
    elevation: {type: Number, required: true},
    left: {type: [Number], required: true},
    right: {type: [Number], required:true},
    samplerate: {type: Number, required:true},
});
// Añade un índice compuesto por los campos azimuth y elevation
HRTFSchema.index({azimuth: 1, elevation: 1 }, {unique: true});

module.exports = mongoose.model('HRTF',HRTFSchema);