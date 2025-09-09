import React, { Fragment } from "react";
import { Button } from "ui/Button/Button";
import { SaveIcon } from "../Icons/Icons";
import { Field } from "ui/Field/Field";

type EditingProp = {
  value: string;
  onClick: (event: React.MouseEvent) => void;
  onChange: (event: React.ChangeEvent) => void;
};

export const Editing = ({ onChange, value, onClick }: EditingProp) => {
  return (
    <Fragment>
      <Field
        name={""}
        id={""}
        placeholder={""}
        type={"text"}
        label={"text-input"}
        value={value}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
      />
      <Button
        //    className="item__button--edit"
        aria-label="save changes"
        onClick={onClick}
      >
        {<SaveIcon></SaveIcon>}
      </Button>
    </Fragment>
  );
};
