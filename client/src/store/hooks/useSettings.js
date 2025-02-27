import { useSelector, useDispatch } from "react-redux";
import { updateSettings } from "../reducers/settingsReducer.js";

export default function useSettings() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

  const handleUpdateSettings = (key, value) => {
    dispatch(updateSettings({ key, value }));
  };

  return { settings, handleUpdateSettings };
}
