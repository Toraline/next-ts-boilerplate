import { render, screen } from "@testing-library/react";
import { Field } from "./Field";

describe("Field", () => {
  it("should render Field with label", () => {
    render(<Field id="field" label="label" placeholder="Insert text" />);
    expect(screen.getByLabelText("label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Insert text")).toBeInTheDocument();
  });

  it("should render Field without label", () => {
    render(<Field id="field" placeholder="Insert text" />);
    expect(screen.queryByLabelText("label")).not.toBeInTheDocument();
  });
});
