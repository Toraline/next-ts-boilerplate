import { render, screen, fireEvent } from "@testing-library/react";
import { Item } from "./Item";

describe("Item", () => {
  //tests if the Item is initially checked when loaded.
  it("should be checked when is done", () => {
    render(<Item initialChecked={true} />);
    expect(screen.getByDisplayValue(1)).toBeInTheDocument();
  });

  it("should complete the item when clicked", () => {
    //creates a mock function responsible for the visual changes on check state.
    const onComplete = jest.fn();
    //renders the component with the prop to be tested.
    render(<Item onComplete={onComplete} initialChecked={false} />);
    //simulates the event trigger "checking" the checkbox.
    fireEvent.click(screen.getByDisplayValue(1));
    //tests if the mock function is being called.
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("should handle content edit properly", () => {
    //mock function responsible for handling the toggle and the content change.
    const handleSaveEdit = jest.fn();
    //renders Item component with the props to be tested.
    render(<Item onSaveEdit={handleSaveEdit} />);
    //simulates the event trigger of clicking in the edit icon/button.
    fireEvent.click(screen.getByLabelText("edit"));
    //tests if the editing state is open.
    expect(screen.getByLabelText("input")).toBeInTheDocument();
    //creates an input element with the "input" opened in the editing state.
    const input = screen.getByLabelText("input");
    //simulates the changing of the value on the input created.
    fireEvent.change(input, { target: { value: "initial value" } });
    //tests if the content changed on the screen.
    expect(screen.getByDisplayValue("initial value")).toBeInTheDocument();
    //simulates the clicking event on the save icon/button.
    fireEvent.click(screen.getByLabelText("save"));
    //tests if the editing state closing mock function is being called.
    expect(handleSaveEdit).toHaveBeenCalledTimes(1);
    //tests if the component changed back to the notEditing state.
    expect(screen.queryByLabelText("input")).not.toBeInTheDocument();
  });
});
