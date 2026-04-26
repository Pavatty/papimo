import { redirect } from "next/navigation";

export async function GET() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!plausibleDomain) {
    return new Response("Plausible not configured", { status: 404 });
  }
  redirect(`https://plausible.io/${plausibleDomain}`);
}
