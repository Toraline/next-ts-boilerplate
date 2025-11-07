import { ComponentProps, Fragment, MouseEvent, useState } from "react";
import { Button } from "global/ui";
import { Save } from "global/ui/icons/Save";
import { Field } from "global/ui/Field/Field";
import "./Editing.style.css";

type EditingProp = ComponentProps<"input"> & {
  isLoading: boolean;
  initialValue?: string;
  onSaveEdit: (event: MouseEvent, description: string) => void;
};

export const Editing = ({ isLoading, onSaveEdit, initialValue = "" }: EditingProp) => {
  const [content, setContent] = useState(initialValue);

  return (
    <Fragment>
      <Field
        aria-label="input"
        variant="borderless"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="button-save">
        <Button
          variant="transparent"
          aria-label="save"
          onClick={(e) => onSaveEdit(e, content)}
          disabled={isLoading}
        >
          <Save />
        </Button>
      </div>
    </Fragment>
  );
};
