type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const store = new Map<string, RateLimitEntry>();

type RateLimitInput = {
  key: string;
  limit: number;
  windowMs: number;
};

export function checkRateLimit({ key, limit, windowMs }: RateLimitInput): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const current = store.get(key);

  if (!current || now - current.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: Math.max(limit - 1, 0) };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  store.set(key, current);
  return { allowed: true, remaining: Math.max(limit - current.count, 0) };
}

export const RATE_LIMITS = {
  magicLinkPerIpPerHour: { limit: 5, windowMs: 60 * 60 * 1000 },
  whatsappSendPerIpPerHour: { limit: 3, windowMs: 60 * 60 * 1000 },
  whatsappVerifyPerPhonePerHour: { limit: 5, windowMs: 60 * 60 * 1000 },
} as const;
