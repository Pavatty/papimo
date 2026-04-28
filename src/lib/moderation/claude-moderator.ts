import Anthropic from "@anthropic-ai/sdk";

import type { Database } from "@/types/database";

type ListingRow = Database["public"]["Tables"]["listings"]["Row"];

export type ClaudeDecision = {
  decision: "approved" | "rejected" | "manual_review";
  score: number;
  reasons: string[];
  raw: string;
};

const SYSTEM_PROMPT = `Tu es un modérateur d'une plateforme immobilière (LODGE) entre particuliers en Tunisie.
Tu lis le titre + la description d'une annonce et tu décides si elle est conforme.

Critères de REJET (decision="rejected"):
- Arnaque évidente (Western Union, paiement avant visite, mandat cash, demande de virement étranger)
- Contenu illégal, haineux, discriminatoire, sexuel
- Spam manifeste / texte généré aléatoirement / hors sujet immobilier
- Coordonnées (numéro de téléphone, email, lien externe) dans la description (interdit, contact via la plateforme)

Critères de REVUE MANUELLE (decision="manual_review"):
- Description très vague, suspicion de fake annonce
- Prix qui semble incohérent (trop bas ou trop élevé)
- Style très commercial ressemblant à une agence (mention "agence", "professionnel", "portefeuille")

Sinon: decision="approved".

Réponds UNIQUEMENT avec un JSON valide au format:
{"decision":"approved"|"rejected"|"manual_review","score":<0-1 confiance>,"reasons":["raison1","raison2"]}
Pas de markdown, pas de texte avant ou après.`;

export async function moderateWithClaude(
  listing: Pick<ListingRow, "title" | "description" | "price" | "city">,
): Promise<ClaudeDecision | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const userText = `Titre: ${listing.title ?? "(vide)"}
Description: ${listing.description ?? "(vide)"}
Prix: ${listing.price ?? "?"}
Ville: ${listing.city ?? "?"}`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userText }],
    });

    const block = response.content.find((c) => c.type === "text");
    const raw = block?.type === "text" ? block.text : "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as {
      decision: "approved" | "rejected" | "manual_review";
      score: number;
      reasons: string[];
    };

    if (
      parsed.decision !== "approved" &&
      parsed.decision !== "rejected" &&
      parsed.decision !== "manual_review"
    ) {
      return null;
    }

    return {
      decision: parsed.decision,
      score: typeof parsed.score === "number" ? parsed.score : 0,
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
      raw,
    };
  } catch (error) {
    console.error("[claude-moderator] error:", error);
    return null;
  }
}
