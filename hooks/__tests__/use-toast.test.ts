import { render, screen, fireEvent } from "@testing-library/react";
import { useToast, toast } from "../use-toast";
import { renderHook, act } from "@testing-library/react";

describe("useToast", () => {
  it("should initialize with empty toasts", () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
  });

  it("should add a toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: "Test Toast",
        description: "This is a test",
      });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe("Test Toast");
  });

  it("should dismiss a toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const { id } = result.current.toast({
        title: "Test Toast",
      });
      result.current.dismiss(id);
    });

    // Toast should be marked for dismissal
    expect(result.current.toasts[0]?.open).toBe(false);
  });

  it("should handle destructive variant", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    });

    expect(result.current.toasts[0].variant).toBe("destructive");
  });
});
