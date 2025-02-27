import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  padding: 13px 17px;
  border-radius: 4px;
  height: 50px;
  width: 100%;
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  border: none;
  background-color: ${({ type, theme }) => 
    type === "secondary" ?  theme.button.secondary.backgroundColor :
    type === "dark-primary" ? theme.button.darkPrimary.backgroundColor :
    type === "dark-secondary" ? theme.button.darkSecondary.backgroundColor :
    theme.button.primary.backgroundColor
  };
  color: ${({ type, theme }) => 
    type === "secondary" ? theme.button.secondary.colour :
    type === "dark-primary" ? theme.button.darkPrimary.colour :
    type === "dark-secondary" ? theme.button.darkSecondary.colour :
    theme.button.primary.colour
  };
`;

const Button = ({ text, onClick, type = "primary" }) => {
  return <StyledButton type={type} onClick={onClick}>{text}</StyledButton>;
};

export default Button;
