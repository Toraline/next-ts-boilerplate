import clsx from "clsx";
import "./Button.style.css";
import React, { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  children: React.ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "transparent";
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  ...buttonProps
}: ButtonProps) => {
  const classes = clsx("button", {
    "button--transparent": variant === "transparent",
    "button--sm": size === "sm",
  });

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
};
