import { Button } from "global/ui";
import { CATEGORIES_UI } from "../..";
import { GLOBAL_UI } from "global/constants";

export const Tasks = () => {
  return (
    <>
      <h2 className="subtitle">{CATEGORIES_UI.HEADERS.TASKS}</h2>
      <Button size="sm">{GLOBAL_UI.BUTTONS.NEW_TASK}</Button>
    </>
  );
};
