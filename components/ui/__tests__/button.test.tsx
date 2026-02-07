import { render, screen } from "@testing-library/react";
import { Button } from "../button";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  it("renders correctly with text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies variant classes correctly", () => {
    render(<Button variant="valentine">Valentine</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gradient-to-r");
  });

  it("applies size classes correctly", () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-11");
  });

  it("renders as a child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    expect(
      screen.getByRole("link", { name: /link button/i }),
    ).toBeInTheDocument();
  });
});
