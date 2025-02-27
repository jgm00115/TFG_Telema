import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TextBlock = ({ children }) => {
  return <Container>{children}</Container>;
};

export default TextBlock;
