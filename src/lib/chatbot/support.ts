import Anthropic from "@anthropic-ai/sdk";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `Tu es l'assistant support de LODGE, plateforme immobilière entre particuliers en Tunisie.

Tu réponds aux questions des utilisateurs sur :
- Comment publier une annonce (gratuite, max 3 actives)
- Comment contacter un vendeur (via la messagerie interne)
- Plans payants (Essentiel, Confort, Premium) — demander à l'utilisateur de regarder /pricing
- Sécurité des transactions : LODGE ne participe pas aux paiements, JAMAIS payer avant visite, attention aux arnaques (Western Union, mandat cash)
- Modération : annonces vérifiées par IA + équipe humaine sous 24h
- Outils gratuits : calcul frais d'acquisition, simulateur crédit, estimation prix
- Charte : pas de coordonnées dans les descriptions, contact via la messagerie
- Anti-agence : LODGE est uniquement pour les particuliers, max 3 annonces gratuites

Règles strictes :
- Réponds toujours en français concis (3-5 phrases max)
- Ne donne JAMAIS de conseil juridique précis (renvoie vers un notaire)
- Si tu ne sais pas, dis-le et propose contact@lodge.tn
- Ne mens pas sur des fonctionnalités qui n'existent pas
- Reste poli et chaleureux`;

export type ChatbotResponse =
  | { ok: true; reply: string }
  | { ok: false; error: string };

export async function askChatbot(
  history: ChatMessage[],
  userMessage: string,
): Promise<ChatbotResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      ok: false,
      error:
        "Le chatbot est temporairement indisponible. Contactez-nous à contact@lodge.tn.",
    };
  }
  if (!userMessage.trim()) {
    return { ok: false, error: "Message vide" };
  }
  if (userMessage.length > 1000) {
    return { ok: false, error: "Message trop long (1000 caractères max)" };
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const trimmedHistory = history.slice(-10);
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        ...trimmedHistory.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMessage },
      ],
    });

    const block = response.content.find((c) => c.type === "text");
    const reply = block?.type === "text" ? block.text.trim() : "";
    if (!reply) {
      return { ok: false, error: "Réponse vide. Réessayez." };
    }
    return { ok: true, reply };
  } catch (error) {
    console.error("[chatbot] error:", error);
    return {
      ok: false,
      error: "Erreur temporaire du chatbot. Réessayez dans un instant.",
    };
  }
}
