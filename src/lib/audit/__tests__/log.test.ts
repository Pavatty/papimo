import { beforeEach, describe, expect, it, vi } from "vitest";

import { logAuditEvent } from "@/lib/audit/log";

const { createClientMock, rpcMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  rpcMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}));

describe("logAuditEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createClientMock.mockResolvedValue({ rpc: rpcMock });
  });

  it("calls RPC with expected payload format", async () => {
    rpcMock.mockResolvedValue({ data: "event-id", error: null });

    await logAuditEvent({
      action: "listing.update",
      targetType: "listing",
      targetId: "11111111-1111-1111-1111-111111111111",
      beforeData: { status: "draft" },
      afterData: { status: "active" },
    });

    expect(rpcMock).toHaveBeenCalledWith("log_audit_event", {
      p_action: "listing.update",
      p_target_type: "listing",
      p_target_id: "11111111-1111-1111-1111-111111111111",
      p_before_data: { status: "draft" },
      p_after_data: { status: "active" },
    });
  });

  it("throws on RPC error", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { message: "permission denied" },
    });

    await expect(
      logAuditEvent({
        action: "listing.update",
        targetType: "listing",
      }),
    ).rejects.toThrow("logAuditEvent failed: permission denied");
  });
});
