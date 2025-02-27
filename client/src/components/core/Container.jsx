import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  flex-grow: 1;
  padding: 12px 24px;
`;

const Container = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};

export default Container;
