import React from "react";
import styled from "styled-components";
import Field from "./Field";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 0;
`;

const Form = ({ fields, formData, onChange }) => {
  return (
    <FormContainer>
      {fields.map((field) => (
        <Field
          key={field.name}
          name={field.name}
          type={field.type}
          options={field.options}
          formData={formData}
          onChange={onChange}
          styleType={field.styleType}
        />
      ))}
    </FormContainer>
  );
};

export default Form;
