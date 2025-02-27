import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  streaming: null,
  mediaURL: null,
  track: 0,
  numTracks: 0,
  trackNames: [],
  numChannels: [],
  gains: [],
  masterGain: 1,
  rotation: 0,
  isMenuOpen: false,
  playing: false,
  mode: "sss",
  cameraRotation: [0, 0, 0],
  fovRotation: 0,
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setStreaming(state, action) {
      state.streaming = action.payload;
      console.log("Streaming:", action.payload);
      state.mediaURL = `/media/${action.payload._id}/manifest.mpd`;
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
  setFovRotation
} = streamSlice.actions;

export default streamSlice.reducer;
