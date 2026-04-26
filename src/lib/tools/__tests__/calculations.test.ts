import { describe, expect, it } from "vitest";

import {
  buildYearlySchedule,
  computeAcquisitionFees,
  estimateMonthlyPayment,
} from "@/lib/tools/calculations";

describe("tools calculations", () => {
  it("computes monthly payment", () => {
    const monthly = estimateMonthlyPayment({
      principal: 200000,
      annualRatePercent: 8,
      years: 20,
    });
    expect(monthly).toBeGreaterThan(1000);
  });

  it("computes acquisition fees", () => {
    const fees = computeAcquisitionFees({ price: 300000, countryCode: "TN" });
    expect(fees.notary).toBeGreaterThan(0);
    expect(fees.total).toBeGreaterThan(fees.notary);
  });

  it("builds yearly schedule rows", () => {
    const { rows } = buildYearlySchedule({
      principal: 120000,
      annualRatePercent: 7,
      years: 10,
    });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]?.year).toBe(1);
  });
});
