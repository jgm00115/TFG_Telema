const src = '/media/Unaligned/manifest.mpd'

const player = dashjs.MediaPlayer().create()

let audioTracks = []

// Ajusta la longitud máxima del buffer y el tiempo de refresco del mismo
player.updateSettings({
    streaming: {
        buffer:{
            bufferTimeAtTopQuality: 30,
            bufferTimeAtTopQualityLongForm: 30,
            stableBufferTime: 30,
            longFormContentDurationThreshold: 30,
        }
    }
})

const audio = new Audio()
const Nchannels = 30

audio.setAttribute('controls','controls')
document.body.appendChild(audio)

audio.addEventListener('play', ()=>{
    
    //Genera sliders para controlar la ganancia de cada canal

    for(let i = 0; i < Nchannels; i++){

        let slider = document.createElement('input')
        slider.setAttribute('type','range')
        slider.setAttribute('min','0')
        slider.setAttribute('max','1')
        slider.setAttribute('step','0.1')
        slider.setAttribute('value','0')
        slider.setAttribute('id',i)
        slider.addEventListener('input', (event) => {

            // Asigna el valor del slider al nodo de ganancia correspondiente
            let id = event.target.id
            let gain = event.target.value

            gainNodes[id].gain.value = gain

        })
        
        // Añade los sliders al documento
        document.body.appendChild(slider)
    }

    //Inicializa el audioContext
    const audioCtx = new AudioContext()

    //Crea una fuente de audio y un splitter
    const srcNode = audioCtx.createMediaElementSource(audio)
    srcNode.channelCount = Nchannels
    srcNode.channelInterpretation = 'discrete'
    const splitterNode = audioCtx.createChannelSplitter(Nchannels)

    //Conecta la fuente al splitter
    srcNode.connect(splitterNode)
    
    //Inicializa el array de nodos de ganancia
    let gainNodes = []

    //Crea nodos de ganancia para cada canal
    for(let i = 0; i<Nchannels; i++){
        
        // Añade un nuevo nodo de ganancia
        gainNodes.push(audioCtx.createGain())

        // Conecta el splitter al nodo de ganancia
        splitterNode.connect(gainNodes[i],i)

        // Conecta el nodo de ganancia a la salida
        gainNodes[i].connect(audioCtx.destination)

        // Ganancia por defecto = 0
        gainNodes[i].gain.value = 0

    }
    audioTracks = player.getTracksFor('audio')
    console.log(`Tracks para audio ${JSON.stringify(audioTracks)}`)

})

player.initialize(audio,src,true)

// Permite cambiar el track de audio
let trackSelector = document.createElement('select')

let track0 = document.createElement('option')
let track1 = document.createElement('option')
let track2 = document.createElement('option')
let track3 = document.createElement('option')

track0.text = 'Track 0'
track1.text = 'Track 1'
track2.text = 'Track 2'
track3.text = 'Track 3'

trackSelector.add(track0)
trackSelector.add(track1)
trackSelector.add(track2)
trackSelector.add(track3)

trackSelector.addEventListener('input', (event) => {

    console.log(`Selected index = ${event.target.selectedIndex}`)
    player.setCurrentTrack(audioTracks[event.target.selectedIndex])

})

document.body.appendChild(trackSelector)