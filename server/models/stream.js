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
    // Puede haber multiples hrtfs con iguales coordenadas
    // Asegura devolver una hrtf para cada instrumento
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

module.exports = mongoose.model('Stream',streamSchema);