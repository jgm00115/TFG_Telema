/**
 * Módulo para conectar con base de datos
 */

const mongoose = require('mongoose');
mongoose.set('strictQuery',false);

async function connect(mongoUrl){
    await mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
    });
}

module.exports = connect;