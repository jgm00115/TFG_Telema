const HRTF = require('../models/hrtf');

// Devuelve todas las HRTF
exports.getHRTF = (req,res) => {
    HRTF.find({})
    .then(documents => {
        res.json(documents);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
}

// Devuelve las coordenadas azimuth y elevation disponibles
exports.getAvailableCoords = (req,res) => {
    Promise.all([
        HRTF.distinct('azimuth'),
        HRTF.distinct('elevation')
    ])
    .then(([azValues, elValues]) => {
        const coords = {
            azimuths: azValues,
            elevations: elValues
        };
        res.json(coords);
    })
    .catch(err =>{
        console.log(err);
        res.sendStatus(500);
    });
}


exports.postHRTF = (req, res) => {
    const hrtf = new HRTF({
        'azimuth': req.body.azimuth,
        'elevation': req.body.elevation,
        'left': req.body.left,
        'right': req.body.right});
    hrtf.save()
    .then(()=> {
       console.log(`HRTF az = ${hrtf.azimuth}, el = ${hrtf.elevation} guardada en base de datos`);
       res.sendStatus(200); 
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
}