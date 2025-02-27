import React from "react";
import styled from "styled-components";

const FaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  width: 40px; /* Adjusted for better track visibility */
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
`;

const StyledInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  writing-mode: bt-lr; /* Ensures vertical direction */
  direction: ltr;
  width: 10px; /* Width of the fader */
  height: 150px; /* Length of the fader */
  background: transparent;
  outline: none;
  transition: 0.2s;
  cursor: pointer;

  /* Track */
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 100%;
    background: linear-gradient(to top,rgb(53, 149, 252) var(--progress, 0%), #ddd var(--progress, 0%));
    border-radius: 50px; /* Fully rounded edges */
    position: relative;
  }

  /* Thumb */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    margin-top: -5px;
    left: 3px;
  }

  // when slider thumb is active
    &::-webkit-slider-thumb:active {
        background:rgb(4, 103, 210);
    }

  &::-moz-range-track {
    background: linear-gradient(to top, #007bff var(--progress, 0%), #ddd var(--progress, 0%));
    border-radius: 50px;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
  }
`;

/* Wrapper for the range input to dynamically update background */
const FaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  /* Updates track background dynamically based on value */
  input {
    --progress: ${(props) => props.progress}%;
  }
`;

export default function Fader({ value, setValue, min = 0, max = 1, step = 0.01, label }) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <FaderWrapper progress={progress}>
      <Label>{label}</Label>
      <StyledInput
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
      />
    </FaderWrapper>
  );
}
