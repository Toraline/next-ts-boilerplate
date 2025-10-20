import { ComponentProps, Fragment, MouseEvent } from "react";
import { Button } from "global/ui";
import { Save } from "ui/Icons/Save";
import { Field } from "ui/Field/Field";
import "./Editing.style.css";

type EditingProp = ComponentProps<"input"> & {
  value?: string;
  onClick: (event: MouseEvent) => void;
};

export const Editing = ({ value, onClick, ...fieldProps }: EditingProp) => {
  return (
    <Fragment>
      <Field
        aria-label="input"
        variant="noborder"
        value={value}
        onClick={(e) => e.stopPropagation()}
        {...fieldProps}
      />

      <div className="button-save">
        <Button variant="transparent" aria-label="save" onClick={onClick}>
          <Save />
        </Button>
      </div>
    </Fragment>
  );
};
