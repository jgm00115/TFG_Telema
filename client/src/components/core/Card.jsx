import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.card.backgroundColour};
  border-radius: 12px;
  padding: 32px;
  flex-grow: 1;
`;

const Card = ({ children }) => <CardContainer>{children}</CardContainer>;

export default Card;
