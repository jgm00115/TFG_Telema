const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HRTFSchema = new Schema({
    azimuth: {type: Number, required: true, unique: true},
    elevation: {type: Number, required: true, unique: true},
    left: {type: [Number], required: true},
    right: {type: [Number], required:true},
});

module.exports = mongoose.model('HRTF',HRTFSchema);