"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Squircle } from "@squircle-js/react";
import { ArrowUpRight, AtSign, Check } from "lucide-react";
import Footer from "./footer";
import contactBg from "../../assets/p3.jpeg";

// ✅ Formspree
// npm i @formspree/react
import { useForm } from "@formspree/react";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ContactSectionVynqe() {
  const formRef = useRef(null);
  const dropdownRef = useRef(null);

  const pronounsList = useMemo(
    () => ["He/Him", "She/Her", "They/Them", "Prefer not to say"],
    []
  );

  const workAreas = useMemo(
    () => [
      "Customer journeys",
      "Two-way engagement",
      "Decision readiness",
      "Stakeholder alignment",
      "Relevant content",
      "Journey progress",
    ],
    []
  );

  const momentumOptions = useMemo(
    () => ["Exploring", "This quarter", "This month", "Immediate"],
    []
  );

  const [showPronouns, setShowPronouns] = useState(false);
  const [loading, setLoading] = useState(false); // local UI loading
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    pronouns: "",
    workArea: [],
    momentum: "",
    email: "",
    message: "",
  });

  // ✅ Formspree hook (replace with your form ID)
  const [state, submitToFormspree] = useForm("mpqjwpbl");

  // ✅ close pronouns dropdown on outside click / ESC
  useEffect(() => {
    const onDown = (e) => {
      if (!showPronouns) return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPronouns(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") setShowPronouns(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [showPronouns]);

  const toggleSelection = (key, value) => {
    setFormData((prev) => {
      const arr = prev[key] || [];
      const exists = arr.includes(value);
      return {
        ...prev,
        [key]: exists ? arr.filter((x) => x !== value) : [...arr, value],
      };
    });
  };

  // ✅ Formspree submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || success || state.submitting) return;

    setLoading(true);
    setSuccess(false);

    try {
      // Build a FormData payload for Formspree
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("designation", formData.designation);
      payload.append("pronouns", formData.pronouns);
      payload.append("focus_areas", (formData.workArea || []).join(", "));
      payload.append("timeline", formData.momentum);
      payload.append("email", formData.email);
      payload.append("message", formData.message);

      // OPTIONAL: one combined string (handy for email body)
      payload.append(
        "summary",
        [
          `Name: ${formData.name}`,
          formData.designation ? `Designation: ${formData.designation}` : "",
          formData.pronouns ? `Pronouns: ${formData.pronouns}` : "",
          formData.workArea?.length
            ? `Focus Areas: ${formData.workArea.join(", ")}`
            : "",
          formData.momentum ? `Timeline: ${formData.momentum}` : "",
          formData.email ? `Email: ${formData.email}` : "",
          formData.message ? `Message: ${formData.message}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      );

      // Submit to Formspree
      await submitToFormspree(payload);

      // If Formspree returned errors, don't show success
      if (state.errors && state.errors.length) {
        throw new Error("Formspree validation error");
      }

      // UX
      await new Promise((r) => setTimeout(r, 400));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1800);

      // Reset
      setFormData({
        name: "",
        designation: "",
        pronouns: "",
        workArea: [],
        momentum: "",
        email: "",
        message: "",
      });
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Chip = ({ active, children, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border transition-all duration-300",
        "px-3 py-1.5 text-[12px] sm:px-3.5 sm:text-sm",
        active
          ? "bg-white text-black border-white"
          : "bg-white/5 border-white/18 hover:border-white/55 text-white/90"
      )}
    >
      {children}
    </button>
  );

  return (
    <section
      id="contact"
      className="relative w-full dark-section overflow-hidden bg-black"
    >
      {/* ✅ ONE background for BOTH contact + footer */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${contactBg})`,
            backgroundAttachment: "scroll",
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ✅ CONTACT AREA */}
      <div className="relative z-10 min-h-[100svh] py-8 px-2 flex items-center justify-center">
        <div className="w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/55 mb-4 text-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,204,51,0.65)]" />
              <span>Contact</span>
            </div>
          </div>

          {/* Card */}
          <div className="mt-6 sm:mt-10 flex justify-center">
            <div className="relative w-full max-w-7xl">
              {/* soft ambient glow */}
              <div className="absolute -inset-8 opacity-70 blur-3xl pointer-events-none">
                <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.14),transparent_70%)]" />
                <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(45%_45%_at_20%_80%,rgba(255,204,51,0.10),transparent_75%)]" />
                <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(45%_45%_at_80%_70%,rgba(255,255,255,0.08),transparent_75%)]" />
              </div>

              {/* grain overlay */}
              <div
                className="absolute inset-0 rounded-[32px] sm:rounded-[40px] pointer-events-none opacity-[0.12] mix-blend-overlay
                [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')]"
              />

              <Squircle
                cornerRadius={36}
                cornerSmoothing={1}
                className="relative overflow-hidden bg-white/[0.09] backdrop-blur-2xl"
              >
                <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_70%_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)]" />

                <div className="relative px-4 py-6 sm:px-7 sm:py-7 md:px-10 md:py-9">
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {/* Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Name */}
                      <div className="flex flex-col">
                        <span className="text-[15px] uppercase font-regular sm:text-sm text-white">
                          Name
                        </span>
                        <input
                          name="name"
                          placeholder="Full name"
                          className={cn(
                            "bg-transparent text-white",
                            "outline-none",
                            "py-3",
                            "text-[14px] sm:text-[15px] md:text-base font-light",
                            "placeholder:text-white/25",
                            "border-0 ring-0",
                            "focus:outline-none"
                          )}
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                        <div className="h-px w-full bg-white/10" />
                      </div>

                      {/* Designation */}
                      <div className="flex flex-col">
                        <span className="text-[15px] uppercase font-regular sm:text-sm text-white">
                          Designation
                        </span>
                        <input
                          name="designation"
                          placeholder="e.g. CXO, Head of..."
                          className={cn(
                            "bg-transparent text-white",
                            "outline-none",
                            "py-3",
                            "text-[14px] sm:text-[15px] md:text-base font-light",
                            "placeholder:text-white/25",
                            "border-0 ring-0",
                            "focus:outline-none"
                          )}
                          value={formData.designation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              designation: e.target.value,
                            })
                          }
                        />
                        <div className="h-px w-full bg-white/10" />
                      </div>

                      {/* Pronouns */}
                      <div className="flex flex-col relative" ref={dropdownRef}>
                        <span className="text-[15px] uppercase font-regular sm:text-sm text-white">
                          Pronouns
                        </span>

                        <button
                          type="button"
                          onClick={() => setShowPronouns((s) => !s)}
                          className={cn(
                            "py-3",
                            "text-[14px] sm:text-[15px] md:text-base font-light",
                            "text-white/85 flex justify-between items-center w-full",
                            "outline-none focus:outline-none"
                          )}
                          aria-expanded={showPronouns}
                          aria-haspopup="listbox"
                        >
                          <span className={cn(!formData.pronouns && "text-white/40")}>
                            {formData.pronouns || "Select"}
                          </span>

                          <ArrowUpRight
                            className={cn(
                              "w-4 h-4 transition-transform text-white/60",
                              showPronouns && "rotate-90"
                            )}
                          />
                        </button>

                        <div className="h-px w-full bg-white/10" />

                        {showPronouns && (
                          <div
                            role="listbox"
                            className="absolute top-full left-0 w-full mt-2 bg-black/80 backdrop-blur-xl rounded-2xl z-50 overflow-hidden shadow-2xl"
                          >
                            {pronounsList.map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, pronouns: p });
                                  setShowPronouns(false);
                                }}
                                className={cn(
                                  "w-full text-left px-5 py-3",
                                  "hover:bg-white hover:text-black transition-colors",
                                  "text-sm text-white/95"
                                )}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Focus areas */}
                    <div className="space-y-2.5">
                      <p className="text-[15px] uppercase font-regular sm:text-sm text-white">
                        Focus areas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {workAreas.map((area) => (
                          <Chip
                            key={area}
                            active={formData.workArea.includes(area)}
                            onClick={() => toggleSelection("workArea", area)}
                          >
                            {area}
                          </Chip>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-2.5">
                      <p className="text-[15px] uppercase font-regular sm:text-sm text-white">
                        Timeline
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {momentumOptions.map((opt) => (
                          <Chip
                            key={opt}
                            active={formData.momentum === opt}
                            onClick={() =>
                              setFormData({ ...formData, momentum: opt })
                            }
                          >
                            {opt}
                          </Chip>
                        ))}
                      </div>
                    </div>

                    {/* Email + Message */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <span className="text-[15px] uppercase font-regular sm:text-sm text-white">
                          Email
                        </span>
                        <div className="relative">
                          <AtSign
                            className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30"
                            size={18}
                          />
                          <input
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            className={cn(
                              "bg-transparent text-white w-full",
                              "outline-none pl-8 py-3",
                              "text-[14px] sm:text-[15px] md:text-base font-light",
                              "placeholder:text-white/25",
                              "border-0 ring-0 focus:outline-none"
                            )}
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="h-px w-full bg-white/10" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[15px] uppercase font-regular sm:text-sm text-white">
                          Message
                        </span>
                        <textarea
                          name="message"
                          rows={1}
                          placeholder="Tell us what you need, and what must stay accountable."
                          className={cn(
                            "bg-transparent text-white w-full resize-none",
                            "outline-none py-3",
                            "text-[14px] sm:text-[15px] md:text-base font-light",
                            "placeholder:text-white/25",
                            "border-0 ring-0 focus:outline-none"
                          )}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          required
                        />
                        <div className="h-px w-full bg-white/10" />
                      </div>
                    </div>

                    {/* Optional: show Formspree error text (compact) */}
                    {state.errors?.length ? (
                      <p className="text-xs text-red-200/90">
                        Please check the form and try again.
                      </p>
                    ) : null}

                    {/* Actions */}
                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-[11px] sm:text-xs text-white/40 leading-relaxed">
                        We reply within 1–2 business days.
                      </p>

                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <button
                          type="submit"
                          disabled={loading || success || state.submitting}
                          className={cn(
                            "group inline-flex items-center justify-center gap-3",
                            "h-11 px-5 sm:h-12 sm:px-6 rounded-full",
                            "text-[11px] sm:text-xs font-medium tracking-widest",
                            "transition-all duration-300",
                            loading || success || state.submitting
                              ? "cursor-default"
                              : "hover:-translate-y-[1px] active:translate-y-0",
                            !success
                              ? "text-[#8A5A00] bg-[linear-gradient(180deg,#FFE8A3_0%,#FFCC33_55%,#FFC252_100%)] shadow-[0_10px_26px_rgba(181,148,88,0.30)]"
                              : "bg-white text-black shadow-[0_10px_26px_rgba(0,0,0,0.20)]"
                          )}
                        >
                          {!loading && !success && !state.submitting && (
                            <>
                              SUBMIT
                              <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                                <ArrowUpRight
                                  size={12}
                                  className="text-[#8A5A00] group-hover:rotate-45 transition-transform duration-300"
                                />
                              </span>
                            </>
                          )}

                          {(loading || state.submitting) && (
                            <>
                              SUBMIT
                              <span
                                className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black/70 animate-spin"
                                aria-label="Loading"
                              />
                            </>
                          )}

                          {success && (
                            <>
                              SENT
                              <span className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center">
                                <Check
                                  size={14}
                                  className="text-black"
                                  strokeWidth={2.5}
                                />
                              </span>
                            </>
                          )}
                        </button>

                        <div className="min-h-[18px]">
                          {success ? (
                            <p className="text-xs text-white/65">
                              We&apos;ll connect soon.
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Squircle>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FOOTER AFTER CONTACT, STILL ON SAME BACKGROUND */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* ✅ CSS: enable fixed background on desktop only */}
      <style jsx global>{`
        @media (min-width: 768px) {
          #contact > div.absolute.inset-0 > div.absolute.inset-0.bg-cover.bg-center {
            background-attachment: fixed !important;
          }
        }
      `}</style>
    </section>
  );
}
