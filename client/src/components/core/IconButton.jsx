import React from "react";
import styled from "styled-components";
import Icon from "./Icon";

const StyledIconButton = styled.button`
  padding: 9px;
  border: none;
  background: none;
  cursor: pointer;
  background-color: ${({ type, theme }) =>
    type === "circle"

      ? theme.iconButton.circle.backgroundColour
      : theme.iconButton.basic.backgroundColour};
  border-radius: ${({ type }) => (type === "circle" ? "50%" : "0")};
`;

const IconButton = ({ icon, onClick, type = "basic", size }) => {
  return (
    <StyledIconButton type={type} onClick={onClick}>
      <Icon icon={icon} size={size} />
    </StyledIconButton>
  );
};

export default IconButton;
