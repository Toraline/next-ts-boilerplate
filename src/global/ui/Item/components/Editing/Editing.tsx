import { ComponentProps, Fragment, MouseEvent } from "react";
import { Button } from "global/ui";
import { Save } from "global/ui/Icons/Save";
import { Field } from "global/ui/Field/Field";

type EditingProp = ComponentProps<"input"> & {
  save?: boolean;
  value?: string;
  onClick: (event: MouseEvent) => void;
};

export const Editing = ({ save = true, value, onClick, ...fieldProps }: EditingProp) => {
  return (
    <Fragment>
      <Field
        variant="borderless"
        value={value}
        onClick={(e) => e.stopPropagation()}
        {...fieldProps}
      />
      {save && (
        <Button variant="transparent" aria-label="save changes" onClick={onClick}>
          <Save />
        </Button>
      )}
    </Fragment>
  );
};
