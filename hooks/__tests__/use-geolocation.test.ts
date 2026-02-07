import { renderHook, act } from "@testing-library/react";
import { useGeolocation } from "../use-geolocation";

describe("useGeolocation", () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global.navigator, "geolocation", {
      value: mockGeolocation,
      writable: true,
    });
  });

  it("should initialize with loading true", () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {});

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.loading).toBe(true);
    expect(result.current.latitude).toBeNull();
    expect(result.current.longitude).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should get position successfully", async () => {
    const mockPosition = {
      coords: {
        latitude: 11.7756,
        longitude: 124.886,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.latitude).toBe(11.7756);
    expect(result.current.longitude).toBe(124.886);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle geolocation error", async () => {
    const mockError = {
      code: 1,
      message: "User denied Geolocation",
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError);
    });

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it("should handle missing geolocation API", () => {
    Object.defineProperty(global.navigator, "geolocation", {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.error).toContain("Geolocation is not supported");
    expect(result.current.loading).toBe(false);
  });
});
