import React, { ComponentProps } from "react";
import "./TextArea.style.css";

type TextAreaProps = ComponentProps<"textarea"> & {
  children?: React.ReactNode;
  id: string;
  label?: string;
};

export const TextArea = ({ label, id, ...textareaProps }: TextAreaProps) => {
  return (
    <div className="container">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <textarea id={id} className="textarea" {...textareaProps} />
    </div>
  );
};
