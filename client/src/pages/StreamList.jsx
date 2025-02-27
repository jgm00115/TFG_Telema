import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StreamingList() {
  const [streamingData, setStreamingData] = useState([]);
  const navigate = useNavigate(); // React Router navigation function

  function handleClick(event) {
    const streamID = event.target.id;
    navigate(`/streaming/${streamID}`); // Navigate to stream details page
  }

  // Retrieve the info of all streamings
  useEffect(() => {
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
