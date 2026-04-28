import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createMock = vi.fn();

vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: class {
      messages = { create: createMock };
    },
  };
});

import { moderateWithClaude } from "@/lib/moderation/claude-moderator";

const baseListing = {
  title: "Bel appartement",
  description: "Lumineux et calme",
  price: 100000,
  city: "Tunis",
};

beforeEach(() => {
  process.env.ANTHROPIC_API_KEY = "test-key";
});

afterEach(() => {
  delete process.env.ANTHROPIC_API_KEY;
  createMock.mockReset();
});

describe("moderateWithClaude", () => {
  it("returns null when ANTHROPIC_API_KEY is missing", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const result = await moderateWithClaude(baseListing);
    expect(result).toBeNull();
  });

  it("parses approved decision", async () => {
    createMock.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: '{"decision":"approved","score":0.95,"reasons":[]}',
        },
      ],
    });
    const result = await moderateWithClaude(baseListing);
    expect(result?.decision).toBe("approved");
    expect(result?.score).toBe(0.95);
  });

  it("parses rejected decision with markdown wrappers", async () => {
    createMock.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: '```json\n{"decision":"rejected","score":0.99,"reasons":["scam"]}\n```',
        },
      ],
    });
    const result = await moderateWithClaude(baseListing);
    expect(result?.decision).toBe("rejected");
    expect(result?.reasons).toContain("scam");
  });

  it("returns null when decision value is invalid", async () => {
    createMock.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: '{"decision":"unknown","score":0.5,"reasons":[]}',
        },
      ],
    });
    const result = await moderateWithClaude(baseListing);
    expect(result).toBeNull();
  });

  it("returns null on API error", async () => {
    createMock.mockRejectedValueOnce(new Error("network"));
    const result = await moderateWithClaude(baseListing);
    expect(result).toBeNull();
  });
});
