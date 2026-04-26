import { isMessageSuspicious } from "./moderation";

export async function moderateMessageAsync(content: string) {
  // Placeholder wrapper until Edge Function `moderate-message` is deployed.
  return isMessageSuspicious(content);
}
