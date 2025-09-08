import React from "react";

type ButtonProps = {
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
};

export const Button = ({ onClick, children }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};
