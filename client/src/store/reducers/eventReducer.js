import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  eventStreams: {},
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    updateEventStream: (state, action) => {
      const { id, ...updates } = action.payload;
      if (!state.eventStreams[id]) {
        state.eventStreams[id] = {};
      }
      Object.assign(state.eventStreams[id], updates);
    },
  },
});

export const { updateEventStream } = eventSlice.actions;
export default eventSlice.reducer;
