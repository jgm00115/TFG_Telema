import React, { useState } from "react";
import DraggableLayout from "./DraggableLayout";

export default function Venue({ imageUrl, editable = false, width = 300, fov = null }) {
  const [cameras, setCameras] = useState([
    {
        "name": "conductor",
        "point": {
            "x": 0.505,
            "y": 0.5318888945936232
        }
    },
    {
        "name": "timpani",
        "point": {
            "x": 0.345,
            "y": 0.7619037839503003
        }
    },
    {
        "name": "balcony",
        "point": {
            "x": 0.50125,
            "y": 0.038999845972172306
        }
    },
    {
        "name": "sidestalls",
        "point": {
            "x": 0.795,
            "y": 0.45959850079581044
        }
    }
]);

  const saveCameraLayout = (layout) => {
    console.log("Saving Camera Layout:", layout);
  };

  return (
    <DraggableLayout
      imageUrl={imageUrl}
      items={cameras}
      setItems={setCameras}
      label="Venue"
      saveLayout={saveCameraLayout}
      width={width}
      editable={editable}
      fov={fov}
    />
  );
}
