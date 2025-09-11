import clsx from "clsx";
import React from "react";
import "./Button.style.css";

type ButtonProps = {
  children: React.ReactNode;
  size?: "sm" | "default";
  variant?: "default" | "transparent";
};

export const Button = ({ children, variant, size }: ButtonProps) => {
  const classes = clsx(
    "button",
    { "button--transparent": variant == "transparent" },
    { "button--default": variant == "default" },
    { "button--sm": size == "sm" },
  );

  return <button className={classes}>{children}</button>;
};
