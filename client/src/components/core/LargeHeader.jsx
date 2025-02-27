import React from "react";
import styled from "styled-components";

const LargeHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

const LargeHeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: 500;
  flex: 1;
`;

const LargeHeader = ({ title, onClose, onBack }) => (
  <LargeHeaderWrapper>
    {onBack && <button onClick={onBack}>←</button>}
    <LargeHeaderTitle>{title}</LargeHeaderTitle>
    {onClose && <button onClick={onClose}>✕</button>}
  </LargeHeaderWrapper>
);

export default LargeHeader;
