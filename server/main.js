const express = require('express');
const cors = require('cors');
const path = require('path');
const connect = require('./utils/database');
const app = express();

app.use(cors());

// rutas
const ingestRoutes = require('./routes/ingestRoutes');
const hrtfRoutes = require('./routes/hrtfRoutes');

app.use('/ingest',ingestRoutes);
app.use('/hrtf',hrtfRoutes);

// directorio raíz
rootDir = path.resolve(__dirname,'..');

// directorio con recursos estáticos
app.use(express.static(path.join(rootDir,'public')));

const port = 8080;

app.get('/', (req,res) => {
    res.sendFile(path.join(rootDir,'public/home.html'));
})

// Peticiones de playlist
app.get('/media/:media/:filename/', (req,res) => {

    res_path = path.join(rootDir,'media', req.params.media, req.params.filename);

    console.log(`>Petición de playlist ${res_path}`);

    res.sendFile(res_path);

})

// Peticiones de segmentos
app.get('/media/:media/:stream/:segment', (req,res) => {

    res_path = path.join(rootDir,'media', req.params.media, req.params.stream, req.params.segment);

    console.log(`>Petición de segmento ${res_path}`);
    
    res.sendFile(res_path);

})

async function startServer() {
    try {
        // Lee la url de la base de datos desde las variables de entorno
        const mongoUrl = process.env.MONGO_URL;
        await connect(mongoUrl);
        console.log(`Conectado a la base de datos ${mongoUrl}`);

        app.listen(port, () => {
            console.log(`Servidor escuchando en puerto ${port}`);
        });
    } catch(err) {
        console.log(err);
    }
}

startServer();