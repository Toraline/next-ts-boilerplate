import { ComponentProps, ReactNode } from "react";
import "./TextArea.style.css";
import clsx from "clsx";

type TextAreaProps = ComponentProps<"textarea"> & {
  children?: ReactNode;
  id: string;
  label?: string;
  error?: string;
};

export const TextArea = ({ label, id, error, ...textareaProps }: TextAreaProps) => {
  const textareaClasses = clsx("textarea", {
    "textarea--error": error,
  });

  return (
    <div className="text-area">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <textarea id={id} className={textareaClasses} {...textareaProps} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};
