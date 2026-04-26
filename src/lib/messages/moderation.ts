const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phoneRegex = /(\+?\d[\d\s().-]{7,}\d)/;
const bankKeywords = [
  "western union",
  "moneygram",
  "rib",
  "iban",
  "virement",
  "carte bancaire",
  "paypal",
];

export function isMessageSuspicious(content: string) {
  const normalized = content.toLowerCase();
  const hasBankKeyword = bankKeywords.some((keyword) =>
    normalized.includes(keyword),
  );

  return {
    hasEmail: emailRegex.test(content),
    hasPhone: phoneRegex.test(content),
    hasBankKeyword,
    flagged:
      emailRegex.test(content) || phoneRegex.test(content) || hasBankKeyword,
  };
}
