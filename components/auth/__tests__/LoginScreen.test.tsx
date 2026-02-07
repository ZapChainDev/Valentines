import { render, screen } from "@testing-library/react";
import { LoginScreen } from "../LoginScreen";

// Mock the hooks
jest.mock("@/hooks/use-pins-count", () => ({
  usePinsCount: () => ({ count: 25, loading: false }),
}));

// Mock AuthProvider
jest.mock("../AuthProvider", () => ({
  useAuth: () => ({
    user: null,
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    loading: false,
  }),
}));

describe("LoginScreen", () => {
  it("renders the hero section", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Share your love")).toBeInTheDocument();
    expect(screen.getByText("with the world")).toBeInTheDocument();
  });

  it("renders the HeartMap logo in navigation", () => {
    render(<LoginScreen />);

    // Use getAllByText since HeartMap appears twice (nav + footer)
    const logos = screen.getAllByText("HeartMap");
    expect(logos.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the sign in button", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Get Started with Google")).toBeInTheDocument();
  });

  it("displays the pins count from Firebase", () => {
    render(<LoginScreen />);

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Love pins dropped")).toBeInTheDocument();
  });

  it("renders the how it works section", () => {
    render(<LoginScreen />);

    expect(screen.getByText("How HeartMap Works")).toBeInTheDocument();
    expect(screen.getByText("1. Drop Your Pin")).toBeInTheDocument();
    expect(screen.getByText("2. Share Your Song")).toBeInTheDocument();
    expect(screen.getByText("3. Connect & Chat")).toBeInTheDocument();
  });

  it("renders the CTA section", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Ready to share your love?")).toBeInTheDocument();
    expect(screen.getByText("Start Your Journey")).toBeInTheDocument();
  });

  it("renders the footer", () => {
    render(<LoginScreen />);

    expect(screen.getByText(/© 2026 HeartMap/)).toBeInTheDocument();
  });

  it("renders the Valentine's Special badge", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Valentine's Special 2026")).toBeInTheDocument();
  });
});
