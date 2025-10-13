import React, { ComponentProps, Fragment } from "react";
import { Button } from "global/ui";
import { Save } from "ui/Icons/Save";
import { Field } from "ui/Field/Field";

type EditingProp = ComponentProps<"input"> & {
  save?: boolean;
  value?: string;
  onClick: (event: React.MouseEvent) => void;
};

export const Editing = ({ save = true, value, onClick, ...fieldProps }: EditingProp) => {
  return (
    <Fragment>
      <Field
        variant="noborder"
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
