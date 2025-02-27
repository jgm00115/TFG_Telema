import React from "react";
import SwitchField from "./SwitchField";
import ImageRadio from "./ImageRadio";

const Field = ({ name, type, options, formData, onChange, styleType }) => {
  switch (type) {
    case "switch":
      return (
        <SwitchField
          name={name}
          options={options}
          formData={formData}
          onChange={onChange}
          styleType={styleType}
        />
      );

    case "image-radio":
      return (
        <ImageRadio
          name={name}
          options={options}
          formData={formData}
          onChange={onChange}
          styleType={styleType}
        />
      );

    default:
      return null;
  }
};

export default Field;
