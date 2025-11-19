import { ComponentProps } from "react";
import { cva } from "class-variance-authority";

type FieldProps = ComponentProps<"input"> & {
  type?: string;
  variant?: "primary" | "borderless";
  label?: string;
  error?: string;
};

export const Field = ({ id, type = "text", variant, label, error, ...inputProps }: FieldProps) => {
  const input = cva(
    "p-4 rounded-md bg-transparent border border-neutral-200 outline-none font-normal text-base placeholder:text-neutral-400",
    {
      variants: {
        variant: {
          primary: ["border border-neutral-200"],
          borderless: ["border-none outline-none"],
          error: ["border-red-600"],
        },
      },
      compoundVariants: [
        {
          variant: "borderless",
        },
        {
          variant: "error",
        },
        {
          variant: "primary",
        },
      ],
      defaultVariants: {
        variant: "primary",
      },
    },
  );
  return (
    <div className="flex flex-col grow">
      {label && (
        <label className="font-medium py-2 px-4 text-base" htmlFor={id}>
          {label}
        </label>
      )}
      <input className={input({ variant })} id={id} type={type} {...inputProps} />
      {error && <p className="text-sm mt-1 ml-1 border-red-600">{error}</p>}
    </div>
  );
};
