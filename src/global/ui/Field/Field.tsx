import { ComponentProps } from "react";
import "./Field.style.css";
import clsx from "clsx";

type FieldProps = ComponentProps<"input"> & {
  variant?: "primary" | "nolabel" | "noborder";
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
    "input--noborder": variant === "noborder",
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
