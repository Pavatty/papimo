import { type EmailLocale, wrapEmailHtml } from "./base";

interface ListingPublishedEmailParams {
  recipientName: string;
  listingTitle: string;
  listingUrl: string;
  locale: EmailLocale;
}

export function listingPublishedEmail(params: ListingPublishedEmailParams) {
  const { recipientName, listingTitle, listingUrl, locale } = params;

  const labels = {
    fr: {
      subject: "Votre annonce est en ligne sur LODGE",
      hello: `Bonjour ${recipientName},`,
      intro: `Bonne nouvelle ! Votre annonce "${listingTitle}" est maintenant publiée sur LODGE.`,
      cta: "Voir mon annonce",
      foot: "Vous pouvez modifier votre annonce à tout moment depuis votre espace.",
    },
    en: {
      subject: "Your listing is live on LODGE",
      hello: `Hello ${recipientName},`,
      intro: `Great news! Your listing "${listingTitle}" is now published on LODGE.`,
      cta: "View my listing",
      foot: "You can edit your listing at any time from your dashboard.",
    },
    ar: {
      subject: "إعلانك منشور الآن على LODGE",
      hello: `مرحباً ${recipientName}،`,
      intro: `خبر رائع! إعلانك "${listingTitle}" تم نشره الآن على LODGE.`,
      cta: "عرض إعلاني",
      foot: "يمكنك تعديل إعلانك في أي وقت من حسابك.",
    },
  };

  const t = labels[locale];
  const content = `
<h2 style="margin:0 0 16px 0; font-size:24px; color:#1A1A1A;">${t.hello}</h2>
<p style="margin:0 0 20px 0; font-size:16px; line-height:1.6; color:#4A4A4A;">${t.intro}</p>
<div style="text-align:center; padding:20px 0;">
<a href="${listingUrl}" style="display:inline-block; padding:14px 32px; background:#EF6F50; color:#FFF; text-decoration:none; font-size:16px; font-weight:600; border-radius:12px;">${t.cta}</a>
</div>
<p style="margin:24px 0 0 0; font-size:13px; color:#6A6A6A;">${t.foot}</p>
`;

  return {
    subject: t.subject,
    html: wrapEmailHtml(content, locale),
  };
}
