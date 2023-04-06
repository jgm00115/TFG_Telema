startButton = document.getElementById('start')
startButton.addEventListener('click', () => {

    // URL manifiesto dash
    const src = '/media/Unaligned/manifest.mpd'

    // Instancia reproductor dash
    const player = dashjs.MediaPlayer().create()

    // Reserva espacio para los tracks de audio
    let audioTracks = []

    // Ajusta la longitud máxima del buffer y el tiempo de refresco del mismo
    player.updateSettings({
        streaming: {
            cacheInitSegments: true, 
            buffer: {
                //initialBufferLevel: 10,
                //stableBufferTime: 30,
                //bufferPruningInterval: 10,
                //bufferToKeep: 20,
            },
        }
    })

    // Crea un nuevo elemento de audio
    const audio = new Audio()

    // Añade controles  al elemento de audio
    audio.setAttribute('controls', 'controls')

    document.body.appendChild(audio)

    // Crea el track selector y la cadena de audio cuando el contenido puede reproducirse
    let initialized = false

    const audioCtx = new AudioContext()
    
    audio.addEventListener('canplay', () => {

        // Si ya se ha inicializado, vuelve
        if (initialized) {
            console.log('Cadena de audio ya inicializada')
            return
        }

        // Toma el número de tracks que existen
        let tracks = player.getTracksFor('audio')
        console.log(`Tracks = ${JSON.stringify(tracks)}`)
        console.log(`Número de tracks disponibles = ${tracks.length}`)
        console.log(`Instrumentos de cada track:`)
        for (let i = 0; i < tracks.length; i++){
            console.log(`Track ${i}: ${JSON.stringify(tracks[i].lang)}`)

        }
        // Track selector
        let trackSelector = document.createElement('select')

        for (let i = 0; i < tracks.length; i++) {

            let track = document.createElement('option')
            track.text = `Track ${i}`
            trackSelector.add(track)

        }

        // Selecciona el track 0 por defecto
        player.setCurrentTrack(tracks[0])

        // Cambia el track seleccionado
        trackSelector.addEventListener('input', (event) => {

            player.setCurrentTrack(tracks[event.target.selectedIndex])

        })

        // Añade el track selector al documento
        document.body.appendChild(trackSelector)

        // Comprueba cuántos canales tiene cada track
        let nchannels = []
        for (track of tracks) {
            nchannels.push(track.audioChannelConfiguration)
        }

        // Obtiene el número máximo de canales
        maxChannelNumber = Math.max(...nchannels)
        console.log(`Canales por track = ${nchannels}`)
        console.log(`Máximo número de canales = ${maxChannelNumber}`)

        // Cadena de audio
        // Nodo fuente
        const srcNode = audioCtx.createMediaElementSource(audio)
        srcNode.channelCount = maxChannelNumber
        srcNode.channelInterpretation = 'discrete'

        // Splitter con el número máximo de canales
        const splitterNode = audioCtx.createChannelSplitter(maxChannelNumber)

        // Conecta fuente a splitter
        srcNode.connect(splitterNode)

        // Crea tantos nodos de ganancia como canales
        let gainNodes = []

        for (let i = 0; i < maxChannelNumber; i++) {

            gainNodes.push(audioCtx.createGain())

            // Conecta el splitter al nodo de ganancia
            splitterNode.connect(gainNodes[i], i)

            // Conecta el nodo de ganancia a la salida
            gainNodes[i].connect(audioCtx.destination)

            // Ganancia por defecto = 0
            gainNodes[i].gain.value = 0.5

        }

        // Crea faders de volumen para cada canal
        for (let i = 0; i < maxChannelNumber; i++) {

            let fader = document.createElement('input')
            fader.setAttribute('type', 'range')
            fader.setAttribute('min', '0')
            fader.setAttribute('max', '1')
            fader.setAttribute('step', '0.1')
            fader.setAttribute('value', '0.5')
            fader.setAttribute('id', i)

            // Modifica la ganancia del nodo correspondiente
            fader.addEventListener('input', (event) => {

                let id = event.target.id
                let gain = event.target.value

                gainNodes[id].gain.value = gain
            })

            // Añade los faders al documento
            document.body.appendChild(fader)
        }

        initialized = true

    })

    // Inicia el reproductor dash
    player.initialize(audio, src, true)
    console.log(`Dashjs version = ${dashjs.Version}`)
})