import { type EmailLocale, wrapEmailHtml } from "./base";

interface NewMessageEmailParams {
  recipientName: string;
  senderName: string;
  listingTitle: string;
  messagePreview: string;
  conversationUrl: string;
  locale: EmailLocale;
}

export function newMessageEmail(params: NewMessageEmailParams) {
  const {
    recipientName,
    senderName,
    listingTitle,
    messagePreview,
    conversationUrl,
    locale,
  } = params;

  const labels = {
    fr: {
      subject: `Nouveau message de ${senderName} sur papimo`,
      hello: `Bonjour ${recipientName},`,
      intro: `${senderName} vous a envoyé un message au sujet de votre annonce "${listingTitle}".`,
      preview: "Aperçu :",
      cta: "Voir la conversation",
      ignore: "Vous pouvez répondre directement depuis papimo.",
    },
    en: {
      subject: `New message from ${senderName} on papimo`,
      hello: `Hello ${recipientName},`,
      intro: `${senderName} sent you a message about your listing "${listingTitle}".`,
      preview: "Preview:",
      cta: "View conversation",
      ignore: "You can reply directly from papimo.",
    },
    ar: {
      subject: `رسالة جديدة من ${senderName} على papimo`,
      hello: `مرحباً ${recipientName}،`,
      intro: `أرسل ${senderName} رسالة بخصوص إعلانك "${listingTitle}".`,
      preview: "معاينة:",
      cta: "عرض المحادثة",
      ignore: "يمكنك الرد مباشرة من papimo.",
    },
  };

  const t = labels[locale];

  const content = `
<h2 style="margin:0 0 16px 0; font-size:24px; color:#1A1A1A;">${t.hello}</h2>
<p style="margin:0 0 20px 0; font-size:16px; line-height:1.6; color:#4A4A4A;">${t.intro}</p>
<div style="background:#FBF6EC; border-left:4px solid #EF6F50; padding:16px; margin:0 0 24px 0; border-radius:8px;">
<p style="margin:0 0 8px 0; font-size:13px; color:#6A6A6A; font-weight:600;">${t.preview}</p>
<p style="margin:0; font-size:15px; color:#1A1A1A; font-style:italic;">${messagePreview}</p>
</div>
<div style="text-align:center; padding:20px 0;">
<a href="${conversationUrl}" style="display:inline-block; padding:14px 32px; background:#EF6F50; color:#FFF; text-decoration:none; font-size:16px; font-weight:600; border-radius:12px;">${t.cta}</a>
</div>
<p style="margin:24px 0 0 0; font-size:13px; color:#6A6A6A;">${t.ignore}</p>
`;

  return {
    subject: t.subject,
    html: wrapEmailHtml(content, locale),
  };
}
