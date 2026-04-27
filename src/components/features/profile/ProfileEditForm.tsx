"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { Camera, Mail, ShieldAlert, Trash2 } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useLocale, useTranslations } from "next-intl";

import {
  uploadAvatar,
  updateProfile,
} from "@/app/[locale]/(authed)/profile/edit/actions";

type ProfileShape = {
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  bio?: string | null;
  preferred_language?: string | null;
  notifications_email?: boolean | null;
  notifications_push?: boolean | null;
  account_type?: string | null;
  verified_email?: boolean | null;
  verified_phone?: boolean | null;
  member_since?: string | null;
};

type Props = {
  profile: ProfileShape;
};

export function ProfileEditForm({ profile }: Props) {
  const t = useTranslations("profile.edit");
  const locale = useLocale();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar_url ?? null,
  );

  const memberSince = useMemo(() => {
    if (!profile.member_since) return null;
    const date = new Date(profile.member_since);
    return Number.isNaN(date.getTime())
      ? null
      : date.toLocaleDateString(locale);
  }, [locale, profile.member_since]);

  const validatePhone = (value: string) => {
    if (!value.trim()) {
      setPhoneError(null);
      return true;
    }
    const parsed = parsePhoneNumberFromString(value);
    if (!parsed || !parsed.isValid()) {
      setPhoneError("Numéro invalide");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const onSave = (formData: FormData) => {
    const phoneValue = String(formData.get("phone") ?? "");
    if (!validatePhone(phoneValue)) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await updateProfile(formData);
      setFeedback(
        result.success ? t("saved") : `${t("error")}: ${result.error}`,
      );
    });
  };

  const onAvatarChange = () => {
    const file = avatarInputRef.current?.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setFeedback("Avatar trop lourd (max 2MB).");
      return;
    }
    const typeOk = file.type === "image/jpeg" || file.type === "image/png";
    if (!typeOk) {
      setFeedback("Format non supporté, utilisez JPG/PNG.");
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.set("avatar", file);
    startTransition(async () => {
      const result = await uploadAvatar(formData);
      if (!result.success) {
        setFeedback(`${t("error")}: ${result.error}`);
      } else {
        setFeedback(t("saved"));
      }
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <section className="border-line rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-ink mb-5 text-2xl font-bold">{t("title")}</h1>

        <div className="mb-6">
          <p className="text-ink mb-2 text-sm font-semibold">{t("avatar")}</p>
          <div className="flex items-center gap-3">
            <div className="border-line bg-creme-pale relative h-20 w-20 overflow-hidden rounded-full border">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div>
              <input
                ref={avatarInputRef}
                type="file"
                name="avatar"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={onAvatarChange}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="border-line inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <Camera className="h-4 w-4" />
                {t("changeAvatar")}
              </button>
              {memberSince ? (
                <p className="text-ink-soft mt-1 text-xs">
                  Membre depuis {memberSince}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <form action={onSave} className="space-y-5">
          <hr className="border-line" />
          <section className="space-y-3">
            <h2 className="text-ink text-sm font-semibold">
              {t("personalInfo")}
            </h2>
            <div>
              <label className="text-ink mb-1 block text-sm">
                {t("fullName")}
              </label>
              <input
                name="full_name"
                defaultValue={profile.full_name ?? ""}
                className="border-line focus-visible:ring-bleu/30 w-full rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
              />
            </div>
            <div>
              <label className="text-ink mb-1 block text-sm">
                {t("phone")}
              </label>
              <input
                name="phone"
                defaultValue={profile.phone ?? ""}
                placeholder={t("phonePlaceholder")}
                onBlur={(event) => validatePhone(event.target.value)}
                className="border-line focus-visible:ring-bleu/30 w-full rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
              />
              {phoneError ? (
                <p className="text-danger mt-1 text-xs">{phoneError}</p>
              ) : null}
            </div>
            <div>
              <label className="text-ink mb-1 block text-sm">{t("bio")}</label>
              <textarea
                name="bio"
                maxLength={500}
                defaultValue={profile.bio ?? ""}
                placeholder={t("bioPlaceholder")}
                className="border-line focus-visible:ring-bleu/30 h-28 w-full rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
              />
            </div>
          </section>

          <hr className="border-line" />
          <section className="space-y-3">
            <h2 className="text-ink text-sm font-semibold">
              {t("accountType")}
            </h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="account_type"
                value="individual"
                defaultChecked={
                  (profile.account_type ?? "individual") === "individual"
                }
              />
              {t("individual")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="account_type"
                value="professional"
                defaultChecked={profile.account_type === "professional"}
              />
              {t("professional")}
            </label>
          </section>

          <hr className="border-line" />
          <section className="space-y-3">
            <h2 className="text-ink text-sm font-semibold">
              {t("preferences")}
            </h2>
            <div>
              <label className="text-ink mb-1 block text-sm">
                {t("language")}
              </label>
              <select
                name="preferred_language"
                defaultValue={profile.preferred_language ?? "fr"}
                className="border-line focus-visible:ring-bleu/30 w-full rounded-xl border px-3 py-2 outline-none focus-visible:ring-2"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="notifications_email"
                defaultChecked={profile.notifications_email ?? true}
              />
              {t("emailNotifications")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="notifications_push"
                defaultChecked={profile.notifications_push ?? false}
              />
              {t("pushNotifications")}
            </label>
          </section>

          <hr className="border-line" />
          <section className="space-y-2">
            <h2 className="text-danger text-sm font-semibold">
              {t("dangerZone")}
            </h2>
            <a
              href="#"
              className="text-bleu inline-flex items-center gap-2 text-sm hover:underline"
            >
              <Mail className="h-4 w-4" />
              {t("changeEmail")}
            </a>
            <a
              href="#"
              className="text-danger inline-flex items-center gap-2 text-sm hover:underline"
            >
              <Trash2 className="h-4 w-4" />
              {t("deleteAccount")}
            </a>
            <p className="text-ink-soft inline-flex items-center gap-1 text-xs">
              <ShieldAlert className="h-3.5 w-3.5" />
              Zone sensible
            </p>
          </section>

          <div className="sticky bottom-0 bg-white/95 pt-2 backdrop-blur">
            <button
              type="submit"
              disabled={isPending}
              className="bg-bleu w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {t("save")}
            </button>
          </div>
        </form>

        {feedback ? (
          <p className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-sm">
            {feedback}
          </p>
        ) : null}
      </section>
    </div>
  );
}
