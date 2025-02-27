import React from "react";
import styled from "styled-components";
import Title from "../typography/Title";
import Paragraph from "../typography/Paragraph";
import Form from "../forms/Form";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SteppedFormItem = ({ title, text, fields, renderAfterFields, formData, onChange }) => {
  return (
    <Container>
      {title && <Title text={title} />}
      {text && <Paragraph text={text} />}
      {fields && <Form fields={fields} formData={formData} onChange={onChange} />}
      {renderAfterFields && renderAfterFields()}
    </Container>
  );
};

export default SteppedFormItem;
