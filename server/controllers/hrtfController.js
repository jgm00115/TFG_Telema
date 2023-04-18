const HRTF = require('../models/hrtf');

exports.getHRTF = (req,res) => {
    res.send('No implementado');
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