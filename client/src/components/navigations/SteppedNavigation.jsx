import React from "react";
import styled from "styled-components";
import IconButton from "../core/IconButton";

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  justify-content: space-between;
`;

const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 auto;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.dotActive.backgroundColor : theme.dot.backgroundColor};
`;

const SteppedNavigation = ({
  onPrevPress,
  onNextPress,
  isPrevDisabled,
  isNextDisabled,
  currentIndex,
  totalSteps,
}) => (
  <NavigationContainer>
    <IconButton
      type="circle"
      icon="chevron-left"
      onClick={onPrevPress}
      disabled={isPrevDisabled}
    />

    <DotsContainer>
      {new Array(totalSteps).fill(0).map((_, i) => (
        <Dot key={i} isActive={i <= currentIndex} />
      ))}
    </DotsContainer>

    <IconButton
      type="circle"
      icon="chevron-right"
      onClick={onNextPress}
      disabled={isNextDisabled}
    />
  </NavigationContainer>
);

export default SteppedNavigation;
