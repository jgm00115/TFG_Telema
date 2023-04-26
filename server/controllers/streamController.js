const Stream = require('../models/stream');
const HRTF = require('../models/hrtf');

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
        console.log(`Se han recuperado ${hrtfs.length} hrtfs para el streaming ${streamID}`);
        res.status(200).json(hrtfs);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
}

// Devuelve un set de HRTFS añadiendo rotación a la espacializacion
exports.rotate = async (req, res) => {
    const streamID = req.params.id;
    const rotation = parseInt(req.params.rotation);
    try {
        const positions = await findPositions(streamID);
        console.log(`Posiciones base: ${JSON.stringify(positions)}`);
        if (positions){
            // Añade la rotación a cada posición
            for (const position of positions){
                position.azimuth +=rotation;
            }
            console.log(`Posiciones tras rotación: ${JSON.stringify(positions)}`);
            // Encuentra las posiciones más cercanas disponibles
            closestAvailablePositions = await closestAvailableAzimuths(positions);
            console.log(`Posiciones disponibles más cercanas:
            ${JSON.stringify(closestPositions)}`);
            // Query de hrtfs de esas posiciones
            const hrtf = await Promise.all(
                closestAvailablePositions.map((position)=> {
                    return HRTF.find({azimuth:position.azimuth,elevation:position.elevation});
                }));
            res.status(200).json(hrtf);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    

}

// Encuentra las posiciones de cada instrumento
findPositions = async (streamID) => {
    const stream = await Stream.findById(streamID);
    if (!stream)
        return null;
    const instruments = stream.instruments;
    const positions = [];
    for (const instrument of instruments){
        positions.push({
            azimuth: instrument.azimuth,
            elevation: instrument.elevation
        });
    }
    return positions;
}

/* Para cada posicion selecciona la posicion más cercana
*/
closestAvailableAzimuths = async (positions) => {
    closestPositions= [];
    for (const position of positions){
        azimuth = position.azimuth;
        elevation = position.elevation;
        // Azimuths disponibles para esa elevación
        const availableAzimuths = await HRTF.distinct(
            'azimuth',{elevation: elevation});
        // Distancia angular con los azimuths disponibles
        const dist = availableAzimuths.map(
            (availableAzimuth) => Math.abs(availableAzimuth - azimuth));
        // Posición con mínima distancia
        closestPositions.push({
            azimuth: availableAzimuths[dist.indexOf(Math.min(...dist))],
            elevation: elevation});
    }
    return closestPositions;
}