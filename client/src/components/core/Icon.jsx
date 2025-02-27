import React from "react";
import styled from "styled-components";

const StyledIcon = styled.img`
  width: ${({ size }) => (size === "small" ? "24px" : "32px")};
  height: ${({ size }) => (size === "small" ? "24px" : "32px")};
`;

const Icon = ({ icon, size = "default" }) => (
  <StyledIcon src={`/assets/${icon}.png`} alt={icon} size={size} />
);

export default Icon;
