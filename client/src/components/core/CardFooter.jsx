import React from "react";
import styled from "styled-components";

const CardFooterContainer = styled.div`
  margin-top: auto;
  padding-top: 24px;
  gap: 12px;
`;

const CardFooter = ({ children }) => {
  return <CardFooterContainer>{children}</CardFooterContainer>;
};

export default CardFooter;
