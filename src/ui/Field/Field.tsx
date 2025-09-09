import React from "react";

type FieldProps = {
  onChange: (event: React.ChangeEvent) => void;
  onClick: (event: React.MouseEvent) => void;
  name: string;
  id: string;
  label: string;
  placeholder: string;
  type: string;
  value: string;
};

export const Field = ({
  name,
  id,
  placeholder,
  type = "text",
  label,
  value,
  onChange,
  onClick,
}: FieldProps) => {
  return (
    <>
      <label htmlFor={id}></label>
      <input
        className="item__input"
        name={name}
        id={id}
        placeholder={placeholder}
        type={type}
        aria-label={label}
        value={value}
        onChange={onChange}
        onClick={onClick}
      ></input>
    </>
  );
};
