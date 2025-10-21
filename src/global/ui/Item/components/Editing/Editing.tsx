import { ComponentProps, Fragment, MouseEvent } from "react";
import { Button } from "global/ui";
import { Save } from "global/ui/icons/Save";
import { Field } from "global/ui/Field/Field";
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
        variant="borderless"
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
