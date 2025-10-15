import { render, screen, fireEvent } from "@testing-library/react";
import { Item } from "./Item";

describe("Item", () => {
  it("should be checked when rendered", () => {
    render(<Item isDone={true} />);
    expect(screen.getByLabelText("check")).toBeVisible();
  });

  it("should call onIsDoneChange", () => {
    const onIsDoneChange = jest.fn();
    render(<Item onIsDoneChange={onIsDoneChange} />);
    fireEvent.click(screen.getByTestId("checkbox"));
    expect(onIsDoneChange).toHaveBeenCalledTimes(1);
  });

  it("shows input and save button, calls onContentChange", () => {
    const onContentChange = jest.fn();
    const onEdit = jest.fn();

    render(<Item onEdit={onEdit} onContentChange={onContentChange} />);

    fireEvent.click(screen.getByLabelText("edit"));

    expect(screen.getByLabelText("input")).toBeInTheDocument();

    const input = screen.getByLabelText("input");

    fireEvent.change(input, { target: { value: "initial value" } });

    expect(onContentChange).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText("save"));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByLabelText("input")).not.toBeInTheDocument();
  });
});
