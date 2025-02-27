import React from "react";
import styled from "styled-components";

const BackgroundWrapper = styled.div`
  min-height: 100vh;
  background-size: cover;
  background-position: center;
`;

const Overlay = styled.div`
  flex-grow: 1;
  background-color: rgba(0, 0, 0, 0.6);
`;

const BackgroundImage = ({ children }) => (
  <BackgroundWrapper>
    <Overlay>{children}</Overlay>
  </BackgroundWrapper>
);

export default BackgroundImage;
