import { useSelector, useDispatch } from "react-redux";
import { updateEventStream } from "../store/eventReducer";

export default function useEvent() {
  const dispatch = useDispatch();
  const event = useSelector((state) => state.event);

  const handleUpdateEventStream = (data) => {
    dispatch(updateEventStream(data));
  };

  return { event, handleUpdateEventStream };
}
