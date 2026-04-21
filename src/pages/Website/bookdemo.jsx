"use client";

import React, { useState, useRef, useEffect } from "react";
import Footer from "./contact";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowUpRight, ChevronDown, Check } from "lucide-react";
import demoVideo from "../../assets/demo.mp4";
import { setBookDemoData } from "../../utils/session";
import { logBookDemo } from "../../utils/sheetsLogger";

/* ── Custom themed dropdown ── */
function CustomSelect({ label, placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="border-b border-gray-300 focus-within:border-black transition-colors pb-2 relative"
      ref={ref}
    >
      <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 text-[13px] sm:text-sm bg-transparent outline-none text-left"
      >
        <span className={value ? "text-[#1A1A1A]" : "text-gray-300"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={13}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-[#F7F5F2] border border-black/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.09)] overflow-hidden">
          <div className="max-h-44 overflow-y-auto py-1.5">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => { onChange(o); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-[12px] sm:text-[13px] text-left transition-colors hover:bg-black/5 ${
                  value === o ? "text-[#1A1A1A] font-semibold" : "text-gray-500"
                }`}
              >
                {o}
                {value === o && <Check size={11} className="text-black/40 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Underline text field wrapper ── */
function Field({ label, children }) {
  return (
    <div className="border-b border-gray-300 focus-within:border-black transition-colors pb-2">
      <label className="block text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Data ── */
const INDUSTRIES = [
  "Financial Services & Banking",
  "Insurance",
  "Healthcare & Life Sciences",
  "Retail & E-commerce",
  "Technology & SaaS",
  "Manufacturing & Supply Chain",
  "Real Estate & PropTech",
  "Media & Entertainment",
  "Education & EdTech",
  "Government & Public Sector",
  "Other",
];

const ROLES = [
  "Founder / CEO",
  "C-Suite (COO, CFO, CTO, CMO)",
  "VP / Director",
  "Product Manager",
  "Engineering Lead",
  "Sales & Business Development",
  "Marketing & Growth",
  "Operations & Strategy",
  "Consultant / Advisor",
  "Other",
];

const ACCOUNT_TYPES = [
  "Enterprise",
  "Mid-Market",
  "Startup",
  "Agency / Consultancy",
  "Independent / Freelancer",
  "Investor / VC",
];

/* ══════════════════════════════════════════════════════ */
export default function BookDemo() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    role: "",
    industry: "",
    accountType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const set       = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setSelect = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Persist form data to session AND create/get userId
    const { userId } = setBookDemoData({
      fullName:    form.fullName,
      email:       form.email,
      jobTitle:    form.role,
      company:     form.company,
      message:     form.message,
      industry:    form.industry,
      accountType: form.accountType,
    });

    // 2. Log to Google Sheets (fire and forget)
    try {
      await logBookDemo({
        fullName:    form.fullName,
        email:       form.email,
        company:     form.company,
        role:        form.role,
        jobTitle:    form.role,
        industry:    form.industry,
        accountType: form.accountType,
        message:     form.message,
        userId,     // Pass userId explicitly
      });
    } catch (_) {
      // Fail silently — allow demo to continue even if Sheets is unreachable
    }

    // 3. Navigate to demo WITH userId in URL
    navigate(`/demo?uid=${userId}`);
  };

  return (
    <div className="bg-[#F7F5F2] text-[#1A1A1A] font-sans flex flex-col min-h-screen">

      <section className="flex flex-col md:flex-row flex-1 min-h-screen">

        {/* ── LEFT — VIDEO (desktop only) ── */}
        <div className="hidden md:flex md:w-[42%] relative overflow-hidden flex-col justify-end">
          <video
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={demoVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="relative z-10 p-10 pb-14">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
              What to expect
            </p>
            <p className="text-white/85 text-[14px] leading-relaxed max-w-XL">
              A focused 20-minute walkthrough built around your use case — not a slide deck, not a sales call. You'll leave knowing exactly what's possible.
            </p>
          </div>
        </div>

        {/* ── RIGHT — FORM ── */}
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-10 md:px-14 lg:px-16 py-16 sm:py-20 relative">

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-5 right-5 sm:top-7 sm:right-7 flex items-center gap-1.5 px-3 py-1.5 text-[12px] uppercase tracking-widest border border-black/15 rounded-full text-black/85 hover:border-black/40 hover:text-black/60 transition-all duration-300"
          >
            <ChevronLeft size={13} />
            Back
          </button>

          <div className="w-full">

            {/* Eyebrow + heading */}
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3" />
            <h1 className="text-[clamp(24px,3.8vw,42px)] font-bold text-[#1A1A1A] leading-[1.1]">
              See it working<br />for your world.
            </h1>
            <p className="mt-3 text-[12px] sm:text-[13px] text-gray-500 leading-relaxed max-w-[280px]">
              Fill this in and we'll tailor a demo around what you actually care about. No generic walkthroughs.
            </p>

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* Full Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name *">
                  <input
                    required
                    type="text"
                    value={form.fullName}
                    onChange={set("fullName")}
                    placeholder="John Doe"
                    className="w-full py-2 text-[13px] bg-transparent outline-none placeholder-gray-300"
                  />
                </Field>
                <Field label="Work Email *">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="john@company.com"
                    className="w-full py-2 text-[13px] bg-transparent outline-none placeholder-gray-300"
                  />
                </Field>
              </div>

              {/* Company + Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Company *">
                  <input
                    required
                    type="text"
                    value={form.company}
                    onChange={set("company")}
                    placeholder="Acme Corp"
                    className="w-full py-2 text-[13px] bg-transparent outline-none placeholder-gray-300"
                  />
                </Field>
                <CustomSelect
                  label="Your Role *"
                  placeholder="Select role"
                  options={ROLES}
                  value={form.role}
                  onChange={setSelect("role")}
                />
              </div>

              {/* Industry + Account Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <CustomSelect
                  label="Industry *"
                  placeholder="Select industry"
                  options={INDUSTRIES}
                  value={form.industry}
                  onChange={setSelect("industry")}
                />
                <CustomSelect
                  label="Account Type *"
                  placeholder="Select type"
                  options={ACCOUNT_TYPES}
                  value={form.accountType}
                  onChange={setSelect("accountType")}
                />
              </div>

              {/* Message */}
              <Field label="What are you hoping to see?">
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  placeholder="The challenge you're working on, the outcome you want — give us the honest version."
                  rows={3}
                  className="w-full py-2 text-[13px] bg-transparent outline-none placeholder-gray-300 resize-none"
                />
              </Field>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center gap-3 px-3 py-3 pl-6 rounded-full text-[11px] font-semibold uppercase tracking-widest text-[#8A5A00] bg-[linear-gradient(180deg,#FFE8A3_0%,#FFCC33_45%,#FFC252_100%)] shadow-md transition-all duration-300 hover:-translate-y-[1px] disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  {loading ? "Setting things up…" : "Explore Demo"}
                  <span className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0">
                    {loading ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                    ) : (
                      <ArrowUpRight size={13} className="group-hover:rotate-45 transition-transform" />
                    )}
                  </span>
                </button>
              </div>

              <p className="text-[10px] text-gray-400 pt-1 leading-relaxed">
                We respond within one business day.
                Your details are never shared or sold.
              </p>

            </form>
          </div>
        </div>

      </section>

      <Footer />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}