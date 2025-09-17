import { ComponentProps } from "react";
import "./Field.style.css";
import clsx from "clsx";

type FieldProps = ComponentProps<"input"> & {
  variant?: "primary" | "nolabel";
  label?: string;
};

export const Field = ({
  id,
  type = "text",
  variant = "primary",
  label,
  ...inputProps
}: FieldProps) => {
  const classes = clsx("input", {
    "input--nolabel": variant === "nolabel",
  });
  return (
    <div className="container">
      {label && (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      )}
      <input className={classes} id={id} type={type} {...inputProps} />
    </div>
  );
};
