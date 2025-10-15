import { ComponentProps, Fragment, MouseEvent } from "react";
import { Button } from "global/ui";
import { Save } from "ui/Icons/Save";
import { Field } from "ui/Field/Field";

type EditingProp = ComponentProps<"input"> & {
  save?: boolean;
  value?: string;
  onClick: (event: MouseEvent) => void;
};

export const Editing = ({ save = true, value, onClick, ...fieldProps }: EditingProp) => {
  return (
    <Fragment>
      <Field
        aria-label="input"
        variant="noborder"
        value={value}
        onClick={(e) => e.stopPropagation()}
        {...fieldProps}
      />
      {save && (
        <Button variant="transparent" aria-label="save" onClick={onClick}>
          <Save />
        </Button>
      )}
    </Fragment>
  );
};
