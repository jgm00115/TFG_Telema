const express = require('express')
const path = require('path')

const app = express()

// directorio con recursos estáticos
app.use(express.static('public'))

const port = 8080

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'public/home.html'))
})

// Envia audio al cliente
app.get('/:audio/:filename', (req,res) => {

    console.log(`Petición de audio ${req.params.audio}, fichero ${req.params.filename}`)

    // ruta al recurso
    res_path = path.join(__dirname, 'mediaStream',req.params.audio,req.params.filename)
    
    res.sendFile(res_path)
})

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`)
})
