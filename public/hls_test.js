const audioContext = new AudioContext();
const hls = new Hls();
const Nchannels = 4;

const audioTag = new Audio()
audioTag.setAttribute('controls','controls')
document.body.appendChild(audioTag)

hls.loadSource('/media/Pirates_4channels/master.m3u8')

hls.on(Hls.Events.MANIFEST_PARSED, (event,data) => {
    console.log(`${event}: ${JSON.stringify(data)}`)
})

hls.on(Hls.Events.FRAG_LOADED, (event,data) => {
    console.log(`${event}: ${JSON.stringify(data)}`)
})

hls.attachMedia(audioTag)

var sourceNode = audioContext.createMediaElementSource(audioTag);
//sourceNode.channelCount = Nchannels;
//sourceNode.channelInterpretation = 'discrete'
var splitterNode = audioContext.createChannelSplitter(Nchannels);
sourceNode.connect(splitterNode);

gainNodes = []

for(let i = 0; i < Nchannels; i++) {
    
    gainNodes.push(audioContext.createGain())

    splitterNode.connect(gainNodes[i],i)
    gainNodes[i].connect(audioContext.destination)
}

// Ajusta las ganancias
gainNodes[0].gain.value = 0
gainNodes[1].gain.value = 0
gainNodes[2].gain.value = 1
gainNodes[3].gain.value = 0

play = document.createElement('button')

play.addEventListener('click', ()=> {
    if (audioContext.state == 'suspended')
    audioContext.state = 'resume'

    audioFile.play()
})

document.body.appendChild(play)