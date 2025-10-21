import { render, screen, fireEvent } from "@testing-library/react";
import { Item } from "./Item";

describe("Item", () => {
  //tests if the Item is initially checked when loaded.
  it("should be checked when is done", () => {
    render(<Item isDone={true} />);
    expect(screen.getByLabelText("check")).toBeVisible();
  });

  it("should complete the item when clicked", () => {
    //creates a mock function responsible for the visual changes on check state.
    const onComplete = jest.fn();
    //renders the component with the prop to be tested.
    render(<Item onComplete={onComplete} />);
    //simulates the event trigger "checking" the checkbox.
    fireEvent.click(screen.getByTestId("checkbox"));
    //tests if the mock function is being called.
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("should handle content edit properly", () => {
    //creates a mock function responsible for the content change on the input.
    const onContentChange = jest.fn();
    //creates a mock function responsible for "opening" and "closing" the editing state
    const onEdit = jest.fn();
    //renders Item component with the props to be tested.
    render(<Item onEdit={onEdit} onContentChange={onContentChange} />);
    //simulates the event trigger of clicking in the edit icon/button.
    fireEvent.click(screen.getByLabelText("edit"));
    //tests if the editing state is open.
    expect(screen.getByLabelText("input")).toBeInTheDocument();
    //creates an input element with the "input" opened in the editing state.
    const input = screen.getByLabelText("input");
    //simulates the changing of the value on the input created.
    fireEvent.change(input, { target: { value: "initial value" } });
    //tests if the content change mock function is being called after the value changed.
    expect(onContentChange).toHaveBeenCalledTimes(1);
    //simulates the clicking event on the save icon/button.
    fireEvent.click(screen.getByLabelText("save"));
    //tests if the editing state closing mock function is being called.
    expect(onEdit).toHaveBeenCalledTimes(1);
    //tests if the component changed back to the notEditing state.
    expect(screen.queryByLabelText("input")).not.toBeInTheDocument();
  });
});
