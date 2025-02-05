const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AMBIHRTFSchema = new Schema({
    order: {type: Number, required: true},
    degree: {type: Number, required: true},
    left: {type: [Number], required: true},
    right: {type: [Number], required:true},
    samplerate: {type: Number, required:true},
});
// Adds an index composed of the azimuth and elevation fields
AMBIHRTFSchema.index({order: 1, degree: 1 }, {unique: true});

module.exports = mongoose.model('AMBIHRTF',AMBIHRTFSchema);