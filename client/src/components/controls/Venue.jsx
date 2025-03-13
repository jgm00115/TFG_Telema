import React, { useState, useEffect, useCallback } from "react";
import DraggableLayout from "./DraggableLayout";
import { useParams } from "react-router-dom";
import { setCurrentCamera } from "../../store/reducers/streamReducer"
import { updateCameras } from "../../api/stream"


export default function Venue({  editable = false, width = 300 }) {

  // Get id from URL
  const { id } = useParams();
  const [streamData, setStreamData] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [venueImage, setVenueImage] = useState(null);

  const saveCameras = useCallback(async (newCameras) => {
      const updatedData = await updateCameras(id, newCameras);
      if (updatedData) setCameras(updatedData.cameras);
  }, [id, cameras]);

  const onSelectItem = (cameraName) => {
    const c = cameras.find((camera) => camera.name === cameraName)
    setCurrentCamera(c)
  }

  useEffect(() => {
      async function fetchStream() {
        try {
          const response = await fetch(`/stream/${id}/stream`);
          const data = await response.json();
          setStreamData(data);
          setVenueImage(data.venueImage)
          setCameras(data.cameras)
        } catch (error) {
          console.error("Error fetching stream:", error);
        }
      }
      fetchStream();
    }, [id]);


  return (
    streamData &&
    <DraggableLayout
      imageUrl={venueImage}
      items={cameras}
      setItems={setCameras}
      onSelectItem={onSelectItem}
      label="Venue"
      saveLayout={saveCameras}
      width={width}
      editable={editable}
      type="venue"
    />
  );
}
