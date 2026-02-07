import { extractYoutubeId, formatTimestamp, cn } from "../utils";

describe("extractYoutubeId", () => {
  it("extracts video ID from standard YouTube URL", () => {
    expect(
      extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from short YouTube URL", () => {
    expect(extractYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
  });

  it("extracts video ID from embedded YouTube URL", () => {
    expect(extractYoutubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
  });

  it("extracts video ID with additional parameters", () => {
    expect(
      extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=123"),
    ).toBe("dQw4w9WgXcQ");
  });

  it("returns null for invalid URL", () => {
    expect(extractYoutubeId("https://example.com")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(extractYoutubeId("")).toBeNull();
  });

  it("handles YouTube URL without www", () => {
    expect(extractYoutubeId("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
  });
});

describe("formatTimestamp", () => {
  it('returns "Just now" for recent timestamp', () => {
    const now = new Date();
    expect(formatTimestamp(now)).toBe("Just now");
  });

  it("formats minutes ago correctly", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatTimestamp(fiveMinutesAgo)).toBe("5m ago");
  });

  it("formats hours ago correctly", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatTimestamp(twoHoursAgo)).toBe("2h ago");
  });

  it("formats days ago correctly", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(formatTimestamp(threeDaysAgo)).toBe("3d ago");
  });
});

describe("cn (className utility)", () => {
  it("merges class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "conditional")).toBe("base conditional");
    expect(cn("base", false && "conditional")).toBe("base");
  });

  it("handles undefined and null values", () => {
    expect(cn("base", undefined, null, "another")).toBe("base another");
  });

  it("merges Tailwind classes correctly", () => {
    expect(cn("p-4", "p-6")).toBe("p-6");
  });

  it("handles arrays of classes", () => {
    expect(cn(["class1", "class2"])).toBe("class1 class2");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});
