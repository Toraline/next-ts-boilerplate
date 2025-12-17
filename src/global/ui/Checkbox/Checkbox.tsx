import React, { ComponentProps } from "react";

type CheckboxProps = ComponentProps<"input"> & {
  checked?: boolean;
  label?: string;
  checkboxId?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const Checkbox = ({
  label,
  checkboxId,
  onChange,
  checked,
  ...checkboxProps
}: CheckboxProps) => {
  return (
    <div className="flex gap-1">
      {label && <label htmlFor="checkbox">{label}</label>}
      <input
        type="checkbox"
        name="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={onChange}
        {...checkboxProps}
      ></input>
    </div>
  );
};
