import React from "react";
import styled from "styled-components";

const StyledTitle = styled.h1`
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 12px;
  color: ${({ colour, theme }) => colour || theme.general.colour};
`;

const Title = ({ text, colour }) => {
  return <StyledTitle colour={colour}>{text}</StyledTitle>;
};

export default Title;
