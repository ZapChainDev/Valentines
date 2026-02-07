import { renderHook } from "@testing-library/react";

// Mock Firebase before importing the hook
jest.mock("@/lib/firebase/config", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getCountFromServer: jest.fn().mockResolvedValue({
    data: () => ({ count: 42 }),
  }),
}));

describe("usePinsCount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading true and count 0", async () => {
    const { usePinsCount } = require("../use-pins-count");

    const { result } = renderHook(() => usePinsCount());

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.count).toBe(0);
  });

  it("should return the count from Firebase", async () => {
    const { getCountFromServer } = require("firebase/firestore");
    getCountFromServer.mockResolvedValueOnce({
      data: () => ({ count: 100 }),
    });

    const { usePinsCount } = require("../use-pins-count");
    const { result, rerender } = renderHook(() => usePinsCount());

    // Wait for async operation
    await new Promise((resolve) => setTimeout(resolve, 100));
    rerender();

    expect(result.current.count).toBe(100);
    expect(result.current.loading).toBe(false);
  });

  it("should handle errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const { getCountFromServer } = require("firebase/firestore");
    getCountFromServer.mockRejectedValueOnce(new Error("Firebase error"));

    const { usePinsCount } = require("../use-pins-count");
    const { result, rerender } = renderHook(() => usePinsCount());

    // Wait for async operation
    await new Promise((resolve) => setTimeout(resolve, 100));
    rerender();

    expect(result.current.count).toBe(0);
    expect(result.current.loading).toBe(false);

    consoleSpy.mockRestore();
  });
});
