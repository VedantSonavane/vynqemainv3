"use client";

import React, { useEffect, useState } from "react";
import { Squircle } from "@squircle-js/react";
import { Cookie, X } from "lucide-react";

const KEY = "vynqe_consent_v1";

export default function ConsentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) setOpen(true);
  }, []);

  const save = (analytics) => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        accepted: true,
        analytics,
        timestamp: new Date().toISOString(),
      })
    );
    setOpen(false);
  };

  const acceptAll = () => save(true);
  const acceptEssential = () => save(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* optional backdrop (click = essential) */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-[2px] pointer-events-auto"
        onClick={acceptEssential}
        aria-hidden="true"
      />

      {/* bottom-left tray (mobile centers & stretches, desktop bottom-left) */}
      <div
        className="
          absolute pointer-events-none
          left-3 right-3 bottom-3
          sm:left-5 sm:right-auto sm:bottom-5
          safe-bottom
        "
      >
        <div className="pointer-events-auto w-full sm:w-[420px] max-w-[92vw] ">
          <div className="relative">
            {/* subtle outer glow */}
            <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-b from-white/25 via-white/10 to-transparent blur-xl opacity-70" />

            <Squircle
              cornerRadius={28}
              cornerSmoothing={1}
              className="relative overflow-hidden border border-white/25 bg-white/70 backdrop-blur-xl shadow-2xl"
            >
              <div className="p-4 sm:p-5">
                {/* header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-10 w-10 rounded-2xl bg-black/5 border border-black/10 grid place-items-center">
                      <Cookie className="h-5 w-5 text-black/70" />
                    </div>

                    <div>
                      <p className="text-[11px] tracking-[0.28em] text-black/55 uppercase">
                        Cookies
                      </p>
                      <h3 className="mt-1 text-[16px] sm:text-[18px] font-medium text-black/90 leading-snug">
                        Your choices, your control.
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={acceptEssential}
                    className="h-9 w-9 rounded-full bg-black/5 hover:bg-black/10 transition grid place-items-center"
                    aria-label="Close"
                    title="Close"
                  >
                    <X className="h-3.5 w-3.5 text-black/50" />
                  </button>
                </div>

                {/* body */}
                <p className="mt-3 text-[13px] sm:text-[14px] leading-relaxed text-black/70">
                  We don’t sell your data. We use cookies to keep the website
                  secure, remember your preferences, and understand what’s
                  working.
                </p>

                {/* links */}
                <div className="mt-4 text-[13px] text-black/65">
                  Learn more in{" "}
                  <a
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-black/80"
                  >
                    Privacy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/security"
                    className="underline underline-offset-4 hover:text-black/80"
                  >
                    Security
                  </a>
                  .
                </div>

                {/* actions */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={acceptEssential}
                    className="w-full rounded-full px-4 py-3 text-[14px] font-medium
                               bg-white/70 hover:bg-white/90 border border-black/10
                               text-black/80 transition"
                  >
                    Essential only
                  </button>

                  <button
                    type="button"
                    onClick={acceptAll}
                    className="w-full rounded-full px-4 py-3 text-[14px] font-medium
                               bg-[#121212] hover:bg-black text-white transition"
                  >
                    Accept all
                  </button>
                </div>

                <p className="mt-3 text-[12px] text-black/45">
                  You can change this later by clearing your browser storage.
                </p>
              </div>
            </Squircle>
          </div>
        </div>
      </div>

      {/* safe-area helper (iOS notch) */}
      <style jsx global>{`
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
