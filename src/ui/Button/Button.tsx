import React, { ComponentProps } from "react";
import "./Button.styles.css";

type ButtonProps = ComponentProps<"button"> & {
  children: React.ReactNode;
};

export const Button = ({ children, type = "button", ...buttonProps }: ButtonProps) => {
  return (
    <button className="button" type={type} {...buttonProps}>
      {children}
    </button>
  );
};
