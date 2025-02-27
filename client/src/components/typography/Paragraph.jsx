import React from "react";
import styled from "styled-components";

const StyledParagraph = styled.p`
  font-size: 17px;
  line-height: 24px;
  color: ${({ colour, theme }) => colour || theme.general.colour};
`;

const Paragraph = ({ text, colour }) => {
  return <StyledParagraph colour={colour}>{text}</StyledParagraph>;
};

export default Paragraph;
