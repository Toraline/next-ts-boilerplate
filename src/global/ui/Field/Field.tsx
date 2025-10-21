import { ComponentProps } from "react";
import "./Field.style.css";
import clsx from "clsx";

type FieldProps = ComponentProps<"input"> & {
  type?: string;
  variant?: "primary" | "borderless";
  label?: string;
  error?: string;
};

export const Field = ({
  id,
  type = "text",
  variant = "primary",
  label,
  error,
  ...inputProps
}: FieldProps) => {
  const classes = clsx("input", {
    "input--borderless": variant === "borderless",
    "input--error": error,
  });
  return (
    <div className="field__container">
      {label && (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      )}
      <input className={classes} id={id} type={type} {...inputProps} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};
