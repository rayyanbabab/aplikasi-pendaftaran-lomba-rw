"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(
          (registration) => {
            console.log("🇮🇩 PWA Service Worker berhasil diaktifkan:", registration.scope);
          },
          (error) => {
            console.warn("⚠️ PWA Service Worker gagal mendaftar:", error);
          }
        );
      });
    }
  }, []);

  return null;
}
