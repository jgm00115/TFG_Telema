import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  streaming: null,
  mediaURL: null,
  track: 0,
  numTracks: 1,
  trackNames: [],
  numChannels: [],
  instruments: [],
  cameras: [],
  currentCamera: null,
  gains: [],
  masterGain: 1,
  rotation: 0,
  isMenuOpen: false,
  playing: false,
  mode: "SSS",
  cameraRotation: [0, 0, 0],
  fovRotation: null,
  showControls: true,
  availableModes: ["SSS", "3DOF", "6DOF"],
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setStreaming(state, action) {
      state.streaming = action.payload;
      console.log("Streaming:", action.payload);
      state.mediaURL = `/media/${action.payload._id}/manifest.mpd`;
      state.instruments = action.payload.instruments;
      state.cameras = action.payload.cameras;
      state.currentCamera = action.payload.cameras[0] || null;
    },
    setTrack(state, action) {
      state.track = action.payload;
    },
    setNumTracks(state, action) {
      state.numTracks = action.payload;
    },
    setTrackNames(state, action) {
      state.trackNames = action.payload;
    },
    setNumChannels(state, action) {
      state.numChannels = action.payload;
    },
    setGains(state, action) {
      state.gains = action.payload;
    },
    setMasterGain(state, action) {
      state.masterGain = action.payload;
    },
    setRotation(state, action) {
      state.rotation = action.payload;
    },
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setPlaying(state, action) {
      state.playing = action.payload;
    },
    setMediaURL(state, action) {
      state.mediaURL = action.payload;
    },
    setIsMenuOpen(state, action) {
      state.isMenuOpen = action.payload
    },
    setCameraRotation(state, action) {
      state.cameraRotation = action.payload
    },
    setFovRotation(state, action) {
      state.fovRotation = action.payload
    },
    setShowControls(state, action) {
      state.showControls = action.payload
    },
    setInstruments(state, action) {
      state.instruments = action.payload
    },
    setCameras(state, action) {
      state.cameras = action.payload
    },
    setMode(state, action) {
      state.mode = action.payload
    },
    setCurrentCamera(state, action) {
      state.currentCamera = action.payload
    }
  },
});

export const {
  setStreaming,
  setTrack,
  setNumTracks,
  setTrackNames,
  setNumChannels,
  setGains,
  setMasterGain,
  setRotation,
  toggleMenu,
  setPlaying,
  setMediaURL,
  setMode,
  setIsMenuOpen,
  setCameraRotation,
  setFovRotation,
  setShowControls,
  setCameras,
  setInstruments,
  setCurrentCamera
} = streamSlice.actions;

export default streamSlice.reducer;
