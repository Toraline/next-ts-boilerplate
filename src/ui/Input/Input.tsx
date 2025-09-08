import React from "react";

type InputProps = {
  value: string;
  onChange: (event: React.ChangeEvent) => void;
  onClick: (event: React.MouseEvent) => void;
};

export const Input = ({ value, onChange, onClick }: InputProps) => {
  return <input value={value} onChange={onChange} className="item__input" onClick={onClick} />;
};
