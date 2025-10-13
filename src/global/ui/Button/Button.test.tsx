import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should render button when no href is passed", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("should render link when href is passed", () => {
    render(<Button href="/">Click me</Button>);
    expect(screen.getByRole("link", { name: "Click me" })).toBeInTheDocument();
  });
});
