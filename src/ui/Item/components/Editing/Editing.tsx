import React, { ComponentProps, Fragment } from "react";
import { Button } from "ui/Button/Button";
import { Save } from "../../../Icons/Save";
import { Field } from "ui/Field/Field";

type EditingProp = ComponentProps<"input"> & {
  value: string;
  onClick: (event: React.MouseEvent) => void;
  onChange: (event: React.ChangeEvent) => void;
};

export const Editing = ({ onChange, value, onClick, ...fieldProps }: EditingProp) => {
  return (
    <Fragment>
      <Field
        value={value}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        {...fieldProps}
      />
      <Button className="button" aria-label="save changes" onClick={onClick}>
        {<Save />}
      </Button>
    </Fragment>
  );
};
