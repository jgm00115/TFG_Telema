import React from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

const HeaderTitle = styled.h2`
  color: ${({theme}) => theme.header.colour};
  font-size: 17px;
  font-weight: 500;
  flex: 1;
`;

const IconButton = styled.button`
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
`;

const LiveIndicator = styled.div`
  font-size: 12px;
  color: ${({theme}) => theme.header.colour};
`;

const Header = ({ title, onBackPress, isLive }) => (
  <HeaderWrapper>
    {onBackPress && <IconButton onClick={onBackPress}>←</IconButton>}
    <HeaderTitle>{title}</HeaderTitle>
    {isLive && <LiveIndicator>● Live</LiveIndicator>}
  </HeaderWrapper>
);

export default Header;
