import Link from "next/link";
import clsx from "clsx";
import "./Button.style.css";
import React, { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  href?: string;
  children?: React.ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "transparent";
};

export const Button = ({
  href,
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
  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
};
