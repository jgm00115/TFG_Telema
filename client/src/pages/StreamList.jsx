import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsMenuOpen } from "../store/reducers/streamReducer";

export default function StreamingList() {
  const [streamingData, setStreamingData] = useState([]);
  const navigate = useNavigate(); // React Router navigation function
  const dispatch = useDispatch();
  function handleClick(event) {
    const streamID = event.target.id;
    navigate(`/streaming/${streamID}`); // Navigate to stream details page
  }

  // Retrieve the info of all streamings
  useEffect(() => {
    dispatch(setIsMenuOpen(false))
    fetch("/stream/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Streaming data", data)
        setStreamingData(data);
      });
  }, []);

  console.log(`Streamings data = ${JSON.stringify(streamingData)}`);

  return (
    <>
      <ul>
        {streamingData.map((stream) => (
          <li key={stream._id}>
            <p id={stream._id} onClick={handleClick} style={{ cursor: "pointer", color: "blue" }}>
              {stream.title}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
