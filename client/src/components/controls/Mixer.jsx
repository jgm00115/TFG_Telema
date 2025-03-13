import React from "react";
import styled from "styled-components";
import Fader from "./Fader";
import { useDispatch } from "react-redux";
import { setGains } from "../../store/reducers/streamReducer"
 
const MixerContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: flex-end; /* Align faders at the bottom */
  background: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
`;

export default function Mixer({ gains, setGains, numFaders, faderLabels }) {

  const dispatch = useDispatch();

  return (
    <MixerContainer>
      {Array.from({ length: numFaders }, (_, index) => (
        <Fader
          key={index}
          value={gains[index] || 0}
          setValue={(newValue) => {
            const newGains = [...gains];
            newGains[index] = newValue;
            dispatch(setGains(newGains));
          }}
          label={faderLabels ? faderLabels[index] : `Fader ${index + 1}`}
        />
      ))}
    </MixerContainer>
  );
}
