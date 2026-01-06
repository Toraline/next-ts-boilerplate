import React, { ComponentProps } from "react";

type CheckboxProps = ComponentProps<"input"> & {
  label?: string;
};

export const Checkbox = ({ label, ...checkboxProps }: CheckboxProps) => {
  return (
    <div className="flex gap-1">
      {label && <label htmlFor="checkbox">{label}</label>}
      <input type="checkbox" {...checkboxProps}></input>
    </div>
  );
};
