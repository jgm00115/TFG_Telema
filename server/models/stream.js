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
    title: {type: String, required:true},
    description: {type: String, required:false},
    createdAt: {type:Date, default: Date.now},
    endDate: {type:Date, default:null},
    instruments: [instrumentSchema]
});

// Devuelve las posiciones de cada instrumento del streaming
streamSchema.methods.getPositions = function(){
    const positions = this.instruments.map((instrument) => {
        return ({
            'azimuth':instrument.azimuth,
            'elevation': instrument.elevation
        });
    });
    return positions;
}

// Devuelve las HRTF de la posicion de cada instrumento
streamSchema.methods.getHRTFS = async function (){
    const positions = this.getPositions();
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

// Para cada posicion selecciona la posicion más cercana
closestAvailableAzimuths = async (positions) => {
    closestPositions= [];
    for (const position of positions){
        azimuth = position.azimuth;
        elevation = position.elevation;
        // Azimuths disponibles para esa elevación
        const availableAzimuths = await HRTFmodel.distinct(
            'azimuth',{elevation: elevation});
        // Distancia angular con los azimuths disponibles
        const dist = availableAzimuths.map(
            (availableAzimuth) => Math.abs(availableAzimuth - azimuth));
        // Posición con mínima distancia
        closestPositions.push({
            azimuth: availableAzimuths[dist.indexOf(Math.min(...dist))],
            elevation: elevation});
    }
    console.log(`Posiciones tras añadir rotación: ${JSON.stringify(positions)}`);
    console.log(`Posiciones disponibles más cercanas:
            ${JSON.stringify(closestPositions)}`);
    return closestPositions;
}

streamSchema.methods.rotate = async function(rotation){
    const positions = this.getPositions();
    // Añade la rotación a cada posición
    for (let position of positions){
        position.azimuth -= rotation;
    }
    // Encuentra las posiciones más cercanas disponibles
    const closestPositions = await closestAvailableAzimuths(positions);
    // Query de hrtfs con esas posiciones
    const rotatedHrtfs = await Promise.all(
        closestPositions.map((position)=> {
            return HRTFmodel.find({azimuth:position.azimuth,elevation:position.elevation});
        }));
    return rotatedHrtfs.flat();
}

module.exports = mongoose.model('Stream',streamSchema);