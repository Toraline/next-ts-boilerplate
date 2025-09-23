import { ComponentProps } from "react";
import "./Field.style.css";

type FieldProps = ComponentProps<"input"> & {
  label?: string;
};

export const Field = ({ id, type = "text", label, ...inputProps }: FieldProps) => {
  return (
    <div className="field__container">
      {label && <label htmlFor={id}>{label}</label>}
      <input className="input" id={id} type={type} {...inputProps} />
    </div>
  );
};
