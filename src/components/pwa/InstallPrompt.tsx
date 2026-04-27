"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const COOKIE_NAME = "pwa-prompt-dismissed";

function hasDismissCookie() {
  return document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .some((entry) => entry.startsWith(`${COOKIE_NAME}=`));
}

function setDismissCookie() {
  const days = 30;
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${COOKIE_NAME}=1; expires=${expires}; path=/; SameSite=Lax`;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (hasDismissCookie()) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setHidden(false);
    };

    const handleAppInstalled = () => {
      setHidden(true);
      setDeferredPrompt(null);
      setDismissCookie();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (hidden || !deferredPrompt) return null;

  return (
    <button
      type="button"
      className="fixed right-4 bottom-4 z-50 rounded-full bg-[#1E5A96] px-4 py-2 text-sm font-semibold text-white shadow-lg"
      onClick={async () => {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setHidden(true);
        setDeferredPrompt(null);
        setDismissCookie();
      }}
    >
      📱 Installer papimo
    </button>
  );
}
