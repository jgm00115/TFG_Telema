
/*
// Crea audio context y fuentes de audio
const audioCtx = new AudioContext()

// Audio
const audio1 = document.createElement('audio')
setSource(audio1,'/src1/src1.m3u8')

const audio2 = document.createElement('audio')
setSource(audio2,'/src2/src2.m3u8')

// Fuentes de audio
const src1 = audioCtx.createMediaElementSource(audio1)
const src2 = audioCtx.createMediaElementSource(audio2)

// Crea un nodo para ajustar la ganancia de cada fuente
const volume_src1 = audioCtx.createGain()
const volume_src2 = audioCtx.createGain()

// Configura rutas de la cadena de audio
src1.connect(volume_src1)          
src2.connect(volume_src2)                        
volume_src1.connect(audioCtx.destination)
volume_src2.connect(audioCtx.destination)

console.log(audioCtx)

// Botón de play reproduce ambas fuentes a la vez
play.addEventListener('click', () => {
    
    // Comprueba estado del audioContext
    if (audioCtx.state == 'suspended'){
        audioCtx.resume()
        console.log(audioCtx)
    }
        
    audio1.play()
    audio2.play()
})

// Botón de pause para la reproducción de ambas fuentes
pause.addEventListener('click', () => {
    audio1.pause()
    audio2.pause()
})

volume_slider_src1.addEventListener('input', () => {
    // Lee el valor del slider y lo convierte entre 0 y 1
    g = volume_slider_src1.value / 100

    // Ajusta el valor de la ganancia
    volume_src1.gain.value = g

    console.log(volume_src1.gain.value)
})

volume_slider_src2.addEventListener('input', () => {
    // Lee el valor del slider y lo convierte entre 0 y 1
    g = volume_slider_src2.value / 100

    // Ajusta el valor de la ganancia
    volume_src2.gain.value = g

    console.log(volume_src2.gain.value)
})

function setSource(audio, src){

    // Primero checkea si hay soporte nativo de HLS en el navegador
    if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        
        console.log('Soporte nativo de HLS en navegador')
        audio.src = src;
      
        // Si no hay soporte nativo, comprueba si HLS.js es soportado
    } else if (Hls.isSupported()) {
        console.log('No hay soporte nativo de HLS, pero HLS.js es soportado')
      var hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(audio);
    }
}

*/