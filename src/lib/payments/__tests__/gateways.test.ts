import { describe, expect, it, vi } from "vitest";

import { parseWebhook as parseKonnectWebhook } from "@/lib/payments/konnect";

vi.mock("stripe", () => {
  class MockStripe {
    checkout = {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: "cs_test",
          url: "https://checkout.stripe.test/session",
        }),
      },
    };
    webhooks = {
      constructEvent: vi.fn((_body: string, _signature: string) => ({
        type: "checkout.session.completed",
      })),
    };
    constructor() {}
  }
  return { default: MockStripe };
});

describe("payments gateway helpers", () => {
  it("parses Konnect webhook payload", () => {
    const parsed = parseKonnectWebhook(
      JSON.stringify({
        paymentRef: "ref_1",
        status: "completed",
        orderId: "tx_1",
      }),
      null,
    );
    expect(parsed.paymentRef).toBe("ref_1");
    expect(parsed.status).toBe("completed");
    expect(parsed.orderId).toBe("tx_1");
  });
});
