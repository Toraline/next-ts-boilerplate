import { render, screen } from "@testing-library/react";
import { TextArea } from "./TextArea";

describe("TextArea", () => {
  it("should render the component with label and with placeholder", () => {
    render(<TextArea id="textarea" label="label" placeholder="Insert text" />);
    expect(screen.getByLabelText("label")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Insert text")).toBeVisible();
  });

  it("should render without the label", () => {
    render(<TextArea id="textarea" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
