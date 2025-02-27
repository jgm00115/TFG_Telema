import React, { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Item = styled.div`
  padding: 6px;
  width: 40%;
`;

const Image = styled.img.attrs(({ isActive }) => ({
  "data-active": isActive, // Prevents unwanted prop warnings in DOM
}))`
  aspect-ratio: 16/9;
  border-radius: 6px;
  width: 100%;
  border: 2px solid ${({ isActive, theme }) => (isActive ? theme.imageRadio.borderColourActiveLight : "transparent")};
  background-color: ${({ theme }) => theme.imageRadio.backgroundColourLight};
`;

const Text = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const ImageRadio = ({ name, options, formData, onChange }) => {
  useEffect(() => {
    console.log("form data", formData[name])
  }, [formData])
  return (
    <Container>
      {options.map((option) => (
        <Item key={option.value}>
          <div onClick={() => onChange(name, option.value)}>
            {option.image && (
              <Image src={option.image} isActive={formData[name] === option.value} />
            )}
            <Text>{option.name}</Text>
          </div>
        </Item>
      ))}
    </Container>
  );
};

export default ImageRadio;
