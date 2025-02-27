import React, { useRef, useState } from "react";
import styled from "styled-components";
import SteppedFormItem from "./SteppedFormItem";
import Card from "../core/Card";
import CardFooter from "../core/CardFooter";
import SteppedNavigation from "../navigations/SteppedNavigation";

const SteppedFormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SteppedForm = ({ items, formData, onChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSteps = items.length;
  const isNextDisabled = currentIndex + 1 >= totalSteps;
  const isPrevDisabled = currentIndex <= 0;

  const handleNext = () => {
    if (!isNextDisabled) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isPrevDisabled) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <SteppedFormContainer>
      <Card>
        <SteppedFormItem {...items[currentIndex]} formData={formData} onChange={onChange} />
        <CardFooter>
          <SteppedNavigation
            onNextPress={handleNext}
            onPrevPress={handlePrev}
            isPrevDisabled={isPrevDisabled}
            isNextDisabled={isNextDisabled}
            currentIndex={currentIndex}
            totalSteps={totalSteps}
          />
        </CardFooter>
      </Card>
    </SteppedFormContainer>
  );
};

export default SteppedForm;
