import { useRef } from 'react';

export function useAudioProcessing(videoElement) {
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);

  const setupAudioProcessing = () => {
    if (!videoElement) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaElementSource(videoElement);
    audioSourceRef.current = source;

    // Create audio nodes
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    const analyserNode = audioContext.createAnalyser();

    // Configure audio nodes
    gainNode.gain.value = 0.8;
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 2000;
    analyserNode.fftSize = 2048;

    // Chain nodes: source → filter → analyser → gain → speakers
    source.connect(filterNode);
    filterNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Optional visualization
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const visualizeAudio = () => {
      requestAnimationFrame(visualizeAudio);
      analyserNode.getByteFrequencyData(dataArray);
    };
    visualizeAudio();
  };

  const resumeAudioContext = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  return { setupAudioProcessing, resumeAudioContext };
}
