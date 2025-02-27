import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./reducers/settingsReducer.js";
import eventReducer from "./reducers/eventReducer.js";
import streamReducer from "./reducers/streamReducer.js";

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    event: eventReducer,
    stream: streamReducer
  },
});

export default store;
