import { type EmailLocale, wrapEmailHtml } from "./base";

interface SearchAlertEmailParams {
  recipientName: string;
  matchingCount: number;
  searchLabel: string;
  searchUrl: string;
  locale: EmailLocale;
}

export function searchAlertEmail(params: SearchAlertEmailParams) {
  const { recipientName, matchingCount, searchLabel, searchUrl, locale } =
    params;

  const labels = {
    fr: {
      subject: "Nouvelles annonces correspondant à vos critères",
      hello: `Bonjour ${recipientName},`,
      intro: `${matchingCount} nouvelles annonces correspondent à votre recherche "${searchLabel}".`,
      cta: "Voir les nouvelles annonces",
      foot: "Vous recevez cet email car vous avez activé une alerte de recherche.",
    },
    en: {
      subject: "New listings matching your criteria",
      hello: `Hello ${recipientName},`,
      intro: `${matchingCount} new listings match your search "${searchLabel}".`,
      cta: "View new listings",
      foot: "You are receiving this email because you enabled a search alert.",
    },
    ar: {
      subject: "إعلانات جديدة مطابقة لمعاييرك",
      hello: `مرحباً ${recipientName}،`,
      intro: `هناك ${matchingCount} إعلانات جديدة تطابق بحثك "${searchLabel}".`,
      cta: "عرض الإعلانات الجديدة",
      foot: "تصلك هذه الرسالة لأنك فعّلت تنبيه البحث.",
    },
  };

  const t = labels[locale];
  const content = `
<h2 style="margin:0 0 16px 0; font-size:24px; color:#1A1A1A;">${t.hello}</h2>
<p style="margin:0 0 20px 0; font-size:16px; line-height:1.6; color:#4A4A4A;">${t.intro}</p>
<div style="text-align:center; padding:20px 0;">
<a href="${searchUrl}" style="display:inline-block; padding:14px 32px; background:#EF6F50; color:#FFF; text-decoration:none; font-size:16px; font-weight:600; border-radius:12px;">${t.cta}</a>
</div>
<p style="margin:24px 0 0 0; font-size:13px; color:#6A6A6A;">${t.foot}</p>
`;

  return {
    subject: t.subject,
    html: wrapEmailHtml(content, locale),
  };
}
