import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  "video-location": "stage",
  "video-mode": "standard",
  "audio-mode": "sss",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
