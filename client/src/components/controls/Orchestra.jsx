import React, { useState } from "react";
import DraggableLayout from "./DraggableLayout";

export default function Orchestra({ imageUrl, editable = false }) {
  const [instruments, setInstruments] = useState([
    { name: "violin", point: { x: 0.29, y: 0.76 } },
    { name: "cello", point: { x: 0.67, y: 0.77 } },
    { name: "flute", point: { x: 0.39, y: 0.52 } },
    { name: "clarinet", point: { x: 0.57, y: 0.50 } },
    { name: "trumpet", point: { x: 0.50, y: 0.30 } },
  ]);

  const saveOrchestraLayout = (layout) => {
    console.log("Saving Orchestra Layout:", layout);
  };

  return (
    <DraggableLayout
      imageUrl={imageUrl}
      items={instruments}
      setItems={setInstruments}
      label="Orchestra"
      saveLayout={saveOrchestraLayout}
      editable={editable}
    />
  );
}
