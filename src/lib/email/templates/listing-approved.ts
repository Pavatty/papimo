import { type EmailLocale, wrapEmailHtml } from "./base";

interface ListingApprovedEmailParams {
  recipientName: string;
  listingTitle: string;
  listingUrl: string;
  locale: EmailLocale;
}

export function listingApprovedEmail(params: ListingApprovedEmailParams) {
  const { recipientName, listingTitle, listingUrl, locale } = params;

  const labels = {
    fr: {
      subject: "Votre annonce a été approuvée",
      hello: `Bonjour ${recipientName},`,
      intro: `Votre annonce "${listingTitle}" a été approuvée par notre équipe et est maintenant visible.`,
      cta: "Voir l'annonce",
      foot: "Merci d'utiliser papimo.",
    },
    en: {
      subject: "Your listing has been approved",
      hello: `Hello ${recipientName},`,
      intro: `Your listing "${listingTitle}" has been approved by our team and is now visible.`,
      cta: "View listing",
      foot: "Thanks for using papimo.",
    },
    ar: {
      subject: "تمت الموافقة على إعلانك",
      hello: `مرحباً ${recipientName}،`,
      intro: `تمت الموافقة على إعلانك "${listingTitle}" من قبل فريقنا وهو الآن ظاهر.`,
      cta: "عرض الإعلان",
      foot: "شكراً لاستخدامك papimo.",
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
