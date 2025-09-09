import React, { Fragment } from "react";
import { Input } from "ui/Input/Input";
import { Button } from "ui/Button/Button";
import { SaveIcon } from "../Icons/Icons";

type EditingProp = {
  value: string;
  onChange: (event: React.ChangeEvent) => void;
  onClick: (event: React.MouseEvent) => void;
};

export const Editing = ({ value, onChange, onClick }: EditingProp) => {
  return (
    <Fragment>
      <Input
        value={value}
        onChange={onChange}
        // className="item__input"
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
