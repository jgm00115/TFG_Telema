const AMBIHRTF = require('../models/ambihrtf');

// Returns all HRTFs
exports.getAMBIHRTF = (req,res) => {
    AMBIHRTF.find({})
    .then(documents => {
        res.json(documents);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
}

// Returns available orders and degrees coordinates
exports.getAvailableOrderDegrees = (req,res) => {
    Promise.all([
        AMBIHRTF.distinct('order'),
        AMBIHRTF.distinct('degree')
    ])
    .then(([ordValues, degValues]) => {
        const coords = {
            order: ordValues,
            degree: degValues
        };
        res.json(coords);
    })
    .catch(err =>{
        console.log(err);
        res.sendStatus(500);
    });
}


exports.postAMBIHRTF = (req, res) => {
    const ambihrtf = new AMBIHRTF({
        'order': req.body.order,
        'degree': req.body.degree,
        'left': req.body.left,
        'right': req.body.right,
        'samplerate': req.body.samplerate});
    ambihrtf.save()
    .then(()=> {
       console.log(`AMBI HRTF ord = ${ambihrtf.order}, deg = ${ambihrtf.degree} stored in database`);
       res.sendStatus(200); 
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
}