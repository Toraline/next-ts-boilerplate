import Link from "next/link";
import clsx from "clsx";
import "./Button.style.css";
import { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
  "aria-label"?: string;
  href?: string;
  children?: ReactNode;
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
  const classes = clsx(
    "align-middle bg-black rounded-md border-none cursor-pointer inline-block text-base text-white font-medium  text-center hover:bg-neutral-200",
    {
      "bg-transparent border-none text-black p-0 hover:bg-transparent": variant === "transparent",
      "py-1 px-2 text-xs": size === "sm",
      "py-2 px-4": size === "md",
    },
  );
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
