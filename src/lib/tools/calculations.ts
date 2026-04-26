export function estimateMonthlyPayment(input: {
  principal: number;
  annualRatePercent: number;
  years: number;
}) {
  const monthlyRate = input.annualRatePercent / 100 / 12;
  const months = input.years * 12;
  if (monthlyRate === 0) return input.principal / months;
  return (
    (input.principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
  );
}

export function getNotaryRate(countryCode: string) {
  if (countryCode === "TN") return 0.06;
  if (countryCode === "MA") return 0.065;
  if (countryCode === "FR") return 0.075;
  if (countryCode === "DZ") return 0.05;
  return 0.06;
}

export function computeAcquisitionFees(input: {
  price: number;
  countryCode: string;
  bankFileFeeRate?: number;
}) {
  const notaryRate = getNotaryRate(input.countryCode);
  const registration = input.price * 0.01;
  const notary = input.price * notaryRate;
  const propertyTaxProrata = input.price * 0.0025;
  const agency = 0;
  const bankFileFee = input.price * (input.bankFileFeeRate ?? 0.01);
  const total =
    registration + notary + propertyTaxProrata + agency + bankFileFee;

  return {
    registration,
    notary,
    propertyTaxProrata,
    agency,
    bankFileFee,
    total,
  };
}

export function buildYearlySchedule(input: {
  principal: number;
  annualRatePercent: number;
  years: number;
}) {
  const monthlyPayment = estimateMonthlyPayment(input);
  const monthlyRate = input.annualRatePercent / 100 / 12;
  let remaining = input.principal;
  const rows: Array<{
    year: number;
    principalPaid: number;
    interestPaid: number;
    remaining: number;
  }> = [];

  for (let year = 1; year <= input.years; year += 1) {
    let principalPaid = 0;
    let interestPaid = 0;
    for (let m = 0; m < 12; m += 1) {
      const interest = remaining * monthlyRate;
      const principal = Math.min(remaining, monthlyPayment - interest);
      remaining = Math.max(0, remaining - principal);
      principalPaid += principal;
      interestPaid += interest;
    }
    rows.push({ year, principalPaid, interestPaid, remaining });
    if (remaining <= 0) break;
  }

  return { monthlyPayment, rows };
}
