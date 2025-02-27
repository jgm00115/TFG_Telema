import React from "react";
import styled from "styled-components";
import Button from "../core/Button";

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.switch.background};
  padding: 4px;
  border-radius: 8px;
`;

const SwitchField = ({ name, options, formData, onChange, styleType = "light" }) => {
  return (
    <SwitchContainer>
      {options.map((option) => (
        <div key={option.value} style={{ width: `${100 / options.length}%` }}>
          <Button text={option.name} type={formData[name] === option.value ? "primary" : "secondary"} onClick={() => onChange(name, option.value)} />
        </div>
      ))}
    </SwitchContainer>
  );
};

export default SwitchField;
