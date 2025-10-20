import { ComponentProps, ReactNode } from "react";
import "./TextArea.style.css";

type TextAreaProps = ComponentProps<"textarea"> & {
  children?: ReactNode;
  id: string;
  label?: string;
};

export const TextArea = ({ label, id, ...textareaProps }: TextAreaProps) => {
  return (
    <div className="text-area">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}

      <textarea id={id} className="textarea" {...textareaProps} />
    </div>
  );
};
