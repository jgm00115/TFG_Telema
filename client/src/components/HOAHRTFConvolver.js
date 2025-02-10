/**
 * 
 * @file AMBIHRTFConvolver.js
 * 
 * Paolo Ostan 
 * 2025-02-10
 */

/* HOA HRTF CONVOLVER */

export default class HOAHRTFConvolver {

    constructor(audioCtx, order,hrtfs) {

        this.ctx = audioCtx;
        this.order = order;
        this.nCh = (order + 1) * (order + 1);
        this.convNodes = new Array(this.order+1);
        // Input and output nodes
        this.in = this.ctx.createChannelSplitter(this.nCh);
        this.out = this.ctx.createGain();
        this.out.gain.value = 1;
        this.out.channelCount = 2;
        
        // Initialize rotation gains to identity matrix
        for (var n = 0; n <= this.order; n++) {
            
            var conv_n = new Array(2 * n + 1);
            for (var i = 0; i < 2 * n + 1; i++) {
                for (var j = 0; j < 2 * n + 1; j++) {
                    conv_n[i] = this.ctx.createConvolver();
                    conv_n[i].normalize = false;
                    conv_n[i].channelCount = 2;
                    conv_n[i].channelCountMode = 'explicit';
                }
            }
            this.convNodes[n] = conv_n;
        }
        console.log(this.convNodes);
        // Load the HRTFs
        this._loadHRTFS(hrtfs)

        for (var n = 0; n <= this.order; n++) {
            for (var i = 0; i < 2 * n + 1; i++) {
                this.in.connect(this.convNodes[n][i], n**2+i, 0);
                this.convNodes[n][i].connect(this.out);
            }
        }
    }

    /**
     * Loads the HRTF data.
     * 
     * @param {Array} hrtfs - The HRTF data.
     */
    _loadHRTFS(hrtfs) {
        console.log(`Loading ${hrtfs.length} HRTFs`);
        console.log(hrtfs);
        
        for (var n = 0; n <= this.order; n++) {
            for (var i = 0; i < 2 * n + 1; i++) {
                console.log(`Loading HRTF ${n**2 + i}, ${n}, ${i}`); 
               
                const hrtf = hrtfs[n**2 + i];
                // HRTF length
                const length = hrtf.left.length;
                // Stereo impulse response
                const buffer = this.ctx.createBuffer(2, length, hrtf.samplerate);
                const buffer_l = buffer.getChannelData(0);
                const buffer_r = buffer.getChannelData(1);
                for (var j = 0; j < length; j++){
                    buffer_l[j] = hrtf.left[j];
                    buffer_r[j] = hrtf.right[j];
                }
                this.convNodes[n][i].buffer = buffer;
            }
        }
    }

    
}