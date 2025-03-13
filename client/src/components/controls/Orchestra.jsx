import React, { useState, useEffect, useCallback} from "react";
import { useParams } from "react-router-dom";
import DraggableLayout from "./DraggableLayout";
import { fetchStream, updateInstruments } from "../../api/stream";

export default function Orchestra({ editable = false, width = 300}) {

   const { id } = useParams();
   const [streamData, setStreamData] = useState(null);
   const [instruments, setInstruments] = useState([]);
   const [imageUrl, setImageUrl] = useState(null);

   const saveInstruments = useCallback(async () => {
    const updatedData = await updateInstruments(id, instruments);
    if (updatedData) setInstruments(updatedData.instruments);
  }, [id, instruments]);


  useEffect(() => {
    async function loadStreamData() {
      const data = await fetchStream(id);
      if (!data) return;

      const instruments = data.instruments.map((instrument, i) => ({
        ...instrument,
        point: instrument.point ?? { x: (i / data.instruments.length) + 0.03, y: 0.1 },
      }));

      setStreamData(data);
      setInstruments(instruments);
      setImageUrl(data.orchestraImage);
    }

    loadStreamData();
  }, [id]);

  return (
    <DraggableLayout
      imageUrl={imageUrl}
      items={instruments}
      setItems={setInstruments}
      label="Orchestra"
      saveLayout={saveInstruments}
      editable={editable}
      type="orchestra"
      width={width}
    />
  );
}
