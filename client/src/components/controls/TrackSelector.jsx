import React from "react";
import styled from "styled-components";

// Styled Select Wrapper
const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

// Styled Label
const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

// Styled Select
const StyledSelect = styled.select`
  padding: 10px 16px;
  font-size: 16px;
  border: 2px solid #007bff;
  border-radius: 8px;
  background-color: white;
  color: #333;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0056b3;
  }

  &:focus {
    border-color: #003f7f;
    box-shadow: 0 0 6px rgba(0, 91, 187, 0.5);
  }
`;

// Styled Option
const StyledOption = styled.option`
  font-size: 16px;
  background: white;
  color: #333;
`;

export default function TrackSelector({ numTracks, track, setTrack, trackNames }) {
  function handleChange(event) {
    setTrack(event.target.value);
  }

  return (
    <SelectWrapper>
      <Label>Select a track</Label>
      <StyledSelect value={track} onChange={handleChange}>
        {Array.from({ length: numTracks }, (_, i) => (
          <StyledOption key={i} value={i}>
            {trackNames[i]}
          </StyledOption>
        ))}
      </StyledSelect>
    </SelectWrapper>
  );
}
