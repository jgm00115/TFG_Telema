const express = require('express');
const cors = require('cors');
const path = require('path');
const connect = require('./utils/database');
const app = express();

app.use(cors());
const port = 8080;

// rutas
const ingestRoutes = require('./routes/ingestRoutes');
const hrtfRoutes = require('./routes/hrtfRoutes');
const ambiHrtfRoutes = require('./routes/ambiHrtfRoutes');
const streamRoutes = require('./routes/streamRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

app.use('/ingest',ingestRoutes);
app.use('/hrtf',hrtfRoutes);
app.use('/ambiHrtf',ambiHrtfRoutes);
app.use('/stream',streamRoutes);
app.use('/media',mediaRoutes);
// directorio raíz
rootDir = path.resolve(__dirname,'..');

// directorio con recursos estáticos
app.use(express.static(path.join(rootDir,'public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(rootDir,'public/home.html'));
})

async function startServer() {
    try {
        // Lee la url de la base de datos desde las variables de entorno
        const mongoUrl = process.env.MONGO_URL;
        await connect(mongoUrl);
        console.log(`Connecting to database ${mongoUrl}`);

        app.listen(port, () => {
            console.log(`server executing in port ${port}`);
        });
    } catch(err) {
        console.log(err);
    }
}

startServer();