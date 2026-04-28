import { type EmailLocale, wrapEmailHtml } from "./base";

interface WeeklyDigestParams {
  recipientName: string;
  newListingsCount: number;
  topListings: Array<{
    title: string;
    price: number;
    currency: string;
    city: string;
    url: string;
    cover?: string | null;
  }>;
  searchUrl: string;
  locale: EmailLocale;
}

export function weeklyDigestEmail(params: WeeklyDigestParams) {
  const { recipientName, newListingsCount, topListings, searchUrl, locale } =
    params;

  const labels = {
    fr: {
      subject: `LODGE — ${newListingsCount} nouvelles annonces cette semaine`,
      hello: `Bonjour ${recipientName},`,
      intro: `Voici un récap des nouveautés de la semaine sur LODGE. ${newListingsCount} annonces ont été publiées.`,
      cta: "Découvrir toutes les annonces",
      foot: "Vous recevez ce mail car vous êtes inscrit·e aux notifications hebdomadaires. Vous pouvez les désactiver à tout moment depuis votre profil.",
      from: "à",
    },
    en: {
      subject: `LODGE — ${newListingsCount} new listings this week`,
      hello: `Hello ${recipientName},`,
      intro: `Here's a recap of this week's new listings on LODGE. ${newListingsCount} listings were published.`,
      cta: "Browse all listings",
      foot: "You receive this email because you opted into weekly notifications. You can disable them anytime from your profile.",
      from: "in",
    },
    ar: {
      subject: `LODGE - ${newListingsCount} إعلانات جديدة هذا الأسبوع`,
      hello: `مرحباً ${recipientName}،`,
      intro: `إليك ملخص جديد هذا الأسبوع على LODGE. تم نشر ${newListingsCount} إعلاناً.`,
      cta: "تصفح جميع الإعلانات",
      foot: "تتلقى هذا البريد لأنك مشترك في الإشعارات الأسبوعية. يمكنك إيقافها في أي وقت من حسابك.",
      from: "في",
    },
  };

  const t = labels[locale];
  const cards = topListings
    .slice(0, 5)
    .map(
      (l) => `
<tr><td style="padding-bottom:16px;">
<a href="${l.url}" style="display:block; text-decoration:none; color:inherit; border:1px solid #E8E1D5; border-radius:12px; overflow:hidden;">
${l.cover ? `<img src="${l.cover}" alt="" width="520" style="display:block; width:100%; max-width:520px; height:auto;">` : ""}
<div style="padding:14px 18px;">
<p style="margin:0 0 4px 0; font-size:15px; font-weight:600; color:#1A1A1A;">${l.title}</p>
<p style="margin:0; font-size:14px; color:#1B5E3F; font-weight:500;">${l.price.toLocaleString("fr-FR")} ${l.currency} <span style="color:#8A8A8A; font-size:12px; font-weight:400;">${t.from} ${l.city}</span></p>
</div>
</a>
</td></tr>`,
    )
    .join("");

  const content = `
<h2 style="margin:0 0 16px 0; font-size:24px; color:#1A1A1A;">${t.hello}</h2>
<p style="margin:0 0 24px 0; font-size:16px; line-height:1.6; color:#4A4A4A;">${t.intro}</p>
<table role="presentation" width="100%" style="border-collapse:collapse;">${cards}</table>
<div style="text-align:center; padding:8px 0 0 0;">
<a href="${searchUrl}" style="display:inline-block; padding:14px 32px; background:#1B5E3F; color:#FFF; text-decoration:none; font-size:16px; font-weight:600; border-radius:12px;">${t.cta}</a>
</div>
<p style="margin:32px 0 0 0; font-size:12px; color:#8A8A8A; line-height:1.5;">${t.foot}</p>
`;

  return {
    subject: t.subject,
    html: wrapEmailHtml(content, locale),
  };
}
