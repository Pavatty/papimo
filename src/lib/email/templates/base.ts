export type EmailLocale = "fr" | "en" | "ar";

export function wrapEmailHtml(
  content: string,
  locale: EmailLocale = "fr",
): string {
  const dir = locale === "ar" ? "rtl" : "ltr";
  const footer = {
    fr: "papimo — L'immobilier entre particuliers",
    en: "papimo — Real estate between individuals",
    ar: "papimo - عقارات بين الأفراد",
  };
  const unsubscribe = {
    fr: "Se désabonner",
    en: "Unsubscribe",
    ar: "إلغاء الاشتراك",
  };

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; padding:0; background:#FBF6EC; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
<table role="presentation" width="100%" style="background:#FBF6EC; padding:40px 20px;"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:560px; background:#FFF; border-radius:16px; padding:48px 40px;">
<tr><td align="center" style="padding-bottom:32px;">
<h1 style="margin:0; font-size:32px; font-weight:700;">
<span style="color:#1E5A96;">pap</span><span style="color:#EF6F50;">imo</span>
</h1></td></tr>
<tr><td>${content}</td></tr>
</table>
<table role="presentation" width="100%" style="max-width:560px; padding:24px 0;"><tr><td align="center">
<p style="margin:0 0 8px 0; font-size:12px; color:#8A8A8A;"><strong style="color:#1E5A96;">${footer[locale]}</strong></p>
<p style="margin:0; font-size:11px; color:#A0A0A0;">© 2026 papimo. <a href="https://papimo.vercel.app/${locale}/profile/edit" style="color:#A0A0A0;">${unsubscribe[locale]}</a></p>
</td></tr></table>
</td></tr></table>
</body></html>`;
}
