import { Resend } from "resend";

let cached: Resend | null = null;

export const resend = new Proxy({} as Resend, {
  get(_target, prop: keyof Resend) {
    if (!cached) {
      cached = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
    }
    return cached[prop];
  },
});
