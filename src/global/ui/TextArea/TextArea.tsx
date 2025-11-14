import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

type TextAreaProps = ComponentProps<"textarea"> & {
  children?: ReactNode;
  id: string;
  label?: string;
  error?: string;
};

export const TextArea = ({ label, id, error, ...textareaProps }: TextAreaProps) => {
  const textareaClasses = clsx("p-4 rounded-md border border-neutral-200 text-base outline-none", {
    "border-red-600": error,
  });

  return (
    <div className="flex flex-col text-base gap-2">
      {label && (
        <label htmlFor={id} className="text-black font-medium text-base">
          {label}
        </label>
      )}
      <textarea id={id} className={textareaClasses} {...textareaProps} />
      {error && <p className="text-red-600 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};
