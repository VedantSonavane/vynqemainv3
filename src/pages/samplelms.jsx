import { useState, useEffect, useRef, useCallback } from "react";
import {
  User, Phone, ShieldCheck, CreditCard, CheckCircle,
  Clock, XCircle, ArrowRight, Building2, FileText, Camera,
  AlertCircle, Loader2, RefreshCw, Home, Edit2, Sparkles, X
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = n => "₹" + Number(Math.round(n)).toLocaleString("en-IN");
const RATE = 0.015;
function calcEMI(p, n) {
  const r = RATE;
  return Math.ceil((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}
const IFSC_BANKS = {
  SBIN: "State Bank of India", HDFC: "HDFC Bank", ICIC: "ICICI Bank",
  PUNB: "Punjab National Bank", UBIN: "Union Bank", UTIB: "Axis Bank",
  KKBK: "Kotak Mahindra Bank", IDIB: "Indian Bank", BARB: "Bank of Baroda",
};
function getBankName(ifsc) {
  return IFSC_BANKS[ifsc?.slice(0, 4).toUpperCase()] || null;
}
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// ── Event Logger ──────────────────────────────────────────────────────────────
function logEvent(type, data) { console.log(`[LENDLY:${type}]`, data); }

// ── Decision Engine ───────────────────────────────────────────────────────────
function evaluateApplication({ pan, aadhaar, address, amount }) {
  if (!PAN_RE.test(pan) || (aadhaar || "").length !== 12)
    return { eligibilityAmount: 0, riskLevel: "high", decision: "rejected", reason: "PAN or Aadhaar verification failed." };
  const weakAddr = !address || address.trim().length < 20;
  const highAmt = Number(amount) > 300000;
  if (highAmt) return { eligibilityAmount: 100000, riskLevel: "high", decision: "approved", reason: "Approved with reduced limit due to high loan request." };
  if (weakAddr) return { eligibilityAmount: 250000, riskLevel: "medium", decision: "approved", reason: "Approved. A complete address unlocks your full ₹5L limit." };
  return { eligibilityAmount: 500000, riskLevel: "low", decision: "approved", reason: "All checks passed. Full limit unlocked." };
}

// ══ SMART NUDGE SYSTEM ════════════════════════════════════════════════════════
// Field + screen specific nudges — human, fast, contextual
// hesitate (8s on a field)   → specific tip for that exact field
// stuck (1st error)          → exactly what's wrong and how to fix it
// repeat (2nd focus)         → gentle guide for that field
// idle (15s no activity)     → screen-specific encouragement
// no_progress (45s)          → you're X% done, what's next

// Per-field hesitation tips — shown after 8s on that field
const FIELD_HESITATE = {
  name:    "Just your full legal name — like on your Aadhaar card.",
  phone:   "Your 10-digit mobile number. We'll send an OTP to verify.",
  otp:     "Check your SMS — the 4-digit code expires in 10 minutes.",
  pan:     "PAN looks like ABCDE1234F — 5 letters, 4 numbers, 1 letter.",
  aadhaar: "Your 12-digit Aadhaar number. Find it on your Aadhaar card or mAadhaar app.",
  dob:     "Enter your date of birth exactly as on your Aadhaar.",
  address: "Include your full address — street, city, and PIN code.",
  accNo:   "Your bank account number is on your passbook or cheque.",
  ifsc:    "IFSC is on your cheque leaf — starts with bank code like SBIN, HDFC.",
};

// Per-field error nudges — shown immediately on validation failure
const FIELD_ERROR = {
  name:    "Full name needed — first and last name please.",
  phone:   "Looks off — Indian mobile numbers are exactly 10 digits.",
  otp:     "Wrong code? Wait a moment and try resending.",
  pan:     "PAN format: 5 letters + 4 numbers + 1 letter. Like ABCDE1234F.",
  aadhaar: "Aadhaar is exactly 12 digits — no spaces needed.",
  dob:     "Please pick your date of birth from the calendar.",
  address: "Add more detail — include your area, city and PIN.",
  accNo:   "Account numbers are usually 9–18 digits long.",
  ifsc:    "IFSC is 11 characters — 4 letters, a zero, then 6 more.",
};

// Screen-level idle nudges (15s no activity)
const SCREEN_IDLE = {
  basic:    "Almost started — just your name and number to go!",
  loan:     "Drag the slider to pick your amount. Takes 5 seconds. 👆",
  personal: "This step keeps your loan safe. Half done already!",
  upload:   "Snap a photo with your phone — no scanner needed.",
  bank:     "Last step before review — just your account details.",
  review:   "Everything looks good? One tap and you're done! 🎉",
};

// Screen entry encouragement (shown once, 2s after arriving)
const SCREEN_WELCOME = {
  loan:     "Great start! Now pick your loan amount.",
  personal: "Step 3 of 7 — identity check. Safe and encrypted.",
  upload:   "Almost halfway! Just 3 quick uploads.",
  bank:     "One step away from review — where should we send the money?",
  review:   "You're 90% there — just confirm your details!",
};

function useNudge(screen, stepIndex, totalSteps) {
  const [nudge, setNudge] = useState(null);
  const timers = useRef({});
  const shownRef = useRef({});
  const lastScreen = useRef(screen);

  const show = useCallback((key, message) => {
    if (shownRef.current[key]) return;
    shownRef.current[key] = true;
    const id = Date.now();
    setNudge({ id, message });
    logEvent("NUDGE", { key, message });
    clearTimeout(timers.current.autoDismiss);
    timers.current.autoDismiss = setTimeout(() => setNudge(n => n?.id === id ? null : n), 6000);
  }, []);

  const dismissNudge = useCallback(() => setNudge(null), []);

  // Reset on screen change + show welcome nudge
  useEffect(() => {
    if (lastScreen.current !== screen) {
      lastScreen.current = screen;
      shownRef.current = {};
      setNudge(null);
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
      // Show welcome nudge 1.5s after screen arrives
      if (SCREEN_WELCOME[screen]) {
        timers.current.welcome = setTimeout(() => show("welcome", SCREEN_WELCOME[screen]), 1500);
      }
    }
  }, [screen, show]);

  // Idle: 15s on same screen with no interaction
  useEffect(() => {
    const IDLE_MS = 15000;
    let t;
    const reset = () => {
      clearTimeout(t);
      if (SCREEN_IDLE[screen]) t = setTimeout(() => show("idle_" + screen, SCREEN_IDLE[screen]), IDLE_MS);
    };
    const events = ["mousemove", "keydown", "touchstart", "click"];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => { clearTimeout(t); events.forEach(e => window.removeEventListener(e, reset)); };
  }, [screen, show]);

  // No progress: 45s on same step
  useEffect(() => {
    const pct = Math.round(((stepIndex - 1) / totalSteps) * 100);
    const msg = `You're ${pct}% done — keep going, almost there! 💪`;
    const t = setTimeout(() => show("noprogress_" + screen, msg), 45000);
    return () => clearTimeout(t);
  }, [screen, stepIndex, totalSteps, show]);

  // trackFocus: call with fieldKey on input focus
  const trackFocus = useCallback((fieldKey) => {
    // Hesitate: 8s on same field → specific tip
    clearTimeout(timers.current["h_" + fieldKey]);
    timers.current["h_" + fieldKey] = setTimeout(() => {
      if (FIELD_HESITATE[fieldKey]) show("hesitate_" + fieldKey, FIELD_HESITATE[fieldKey]);
    }, 8000);
  }, [show]);

  // trackError: call with fieldKey when validation fails
  const trackError = useCallback((fieldKey) => {
    if (FIELD_ERROR[fieldKey]) show("err_" + fieldKey, FIELD_ERROR[fieldKey]);
  }, [show]);

  return { nudge, dismissNudge, trackFocus, trackError };
}

// ── Nudge Card UI ─────────────────────────────────────────────────────────────
function NudgeCard({ nudge, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (nudge) {
      setVisible(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
    }
  }, [nudge?.id]);

  if (!nudge) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "20px",
        zIndex: 9999,
        maxWidth: "280px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div style={{
        background: "#1e293b",
        borderRadius: "14px",
        padding: "12px 14px 12px 14px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
      }}>
        <Sparkles size={15} style={{ color: "#facc15", flexShrink: 0, marginTop: "2px" }} />
        <span style={{ color: "#f1f5f9", fontSize: "13px", lineHeight: "1.5", fontWeight: 500, flex: 1 }}>
          {nudge.message}
        </span>
        <button
          onClick={onDismiss}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 0 4px", color: "#64748b", flexShrink: 0, marginTop: "1px" }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Progress % pill (bottom-left) ─────────────────────────────────────────────
function ProgressPill({ step, total }) {
  if (step <= 0 || step > total) return null;
  const pct = Math.round((step / total) * 100);
  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      left: "20px",
      zIndex: 9999,
      background: "#fff",
      border: "1.5px solid #e2e8f0",
      borderRadius: "999px",
      padding: "6px 12px",
      fontSize: "12px",
      fontWeight: 700,
      color: "#334155",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      display: "flex",
      alignItems: "center",
      gap: "7px",
    }}>
      <div style={{
        width: "32px",
        height: "4px",
        background: "#e2e8f0",
        borderRadius: "99px",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: "#0f172a",
          borderRadius: "99px",
          transition: "width 0.5s ease",
        }} />
      </div>
      {pct}% done
    </div>
  );
}

// ── Reusable primitives ───────────────────────────────────────────────────────
function Inp({ label, error, ok, icon: Icon, iconRight, onFocus: externalFocus, ...rest }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        <input
          className={`w-full h-12 rounded-xl border bg-white text-slate-900 text-sm font-medium outline-none transition-all duration-150
            ${Icon ? "pl-10" : "pl-4"} pr-4
            ${error ? "border-red-400 focus:ring-2 focus:ring-red-100" : ok ? "border-emerald-400" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"}`}
          onFocus={externalFocus}
          {...rest}
        />
        {iconRight && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{iconRight}</div>}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
          <AlertCircle size={11} />{error}
        </div>
      )}
    </div>
  );
}

function Btn({ children, variant = "primary", disabled, className = "", ...rest }) {
  const base = "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-semibold text-sm transition-all duration-150 w-full disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/20",
    outline: "bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50",
    ghost: "bg-transparent text-blue-600 border-none h-auto w-auto px-0 text-xs font-semibold hover:opacity-70",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...rest}>{children}</button>;
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-3 ${className}`}>{children}</div>;
}

function Spinner({ size = 17 }) {
  return <Loader2 size={size} className="animate-spin" />;
}

// ── OTP Timer ─────────────────────────────────────────────────────────────────
function OTPTimer({ onResend }) {
  const [sec, setSec] = useState(30);
  useEffect(() => {
    if (sec === 0) return;
    const t = setTimeout(() => setSec(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [sec]);
  return sec > 0
    ? <span className="text-xs text-slate-400 tabular-nums">Resend in {sec}s</span>
    : <button className="text-xs font-semibold text-blue-600 hover:opacity-70 flex items-center gap-1" onClick={() => { setSec(30); onResend(); }}>
        <RefreshCw size={11} />Resend code
      </button>;
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function TopBar({ step, total }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-slate-100 z-50">
      <div className="h-full bg-slate-900 transition-all duration-500 ease-out" style={{ width: `${(step / total) * 100}%` }} />
    </div>
  );
}

function Header({ step, total }) {
  return (
    <div className="w-full max-w-2xl flex justify-between items-center pt-7 pb-0 px-0">
      <div className="font-serif text-lg tracking-tight text-slate-900">Lend·ly</div>
      {step > 0 && step <= total && (
        <div className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Step {step} of {total}</div>
      )}
    </div>
  );
}

// ── Upload zone ───────────────────────────────────────────────────────────────
function UploadZone({ label, Icon, state, filename, progress, onFile }) {
  return (
    <div className={`relative rounded-xl border-2 border-dashed p-5 text-center transition-all duration-150 cursor-pointer overflow-hidden
      ${state === "done" ? "border-emerald-400 bg-emerald-50 cursor-default" : state === "loading" ? "border-blue-400 bg-blue-50 cursor-default" : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"}`}>
      {state !== "done" && (
        <input type="file" accept="image/*,.pdf" onChange={e => e.target.files[0] && onFile(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer" />
      )}
      <div className="flex justify-center mb-2">
        {state === "done" ? <CheckCircle size={22} className="text-emerald-500" />
          : state === "loading" ? <Loader2 size={22} className="text-blue-500 animate-spin" />
          : <Icon size={22} className="text-slate-400" />}
      </div>
      <div className="text-xs font-semibold text-slate-500 mb-0.5">
        {state === "done" ? (filename || "Uploaded") : state === "loading" ? "Uploading…" : label}
      </div>
      {filename && state === "done" && (
        <div className="text-xs text-slate-400 truncate max-w-full">{filename}</div>
      )}
      {state === "loading" && (
        <div className="h-0.5 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

// ══ SCREENS ═══════════════════════════════════════════════════════════════════

function Screen({ children }) {
  return (
    <div className="w-full max-w-2xl pt-14 animate-[fadeUp_0.3s_ease_both]"
      style={{ animation: "fadeUp 0.3s cubic-bezier(0.4,0,0.2,1) both" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {children}
    </div>
  );
}

function Landing({ onNext }) {
  return (
    <Screen>
      <div className="pt-10 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-semibold tracking-wide mb-7">
          <ShieldCheck size={11} />RBI Registered NBFC
        </div>
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-slate-900 mb-3">
          Get money<br />when you need it.
        </h1>
        <p className="text-slate-500 text-base leading-relaxed mb-8">
          No paperwork. No branch visits.<br />Simple, fast, and fully online.
        </p>
        <div className="flex flex-wrap gap-5 mb-10">
          {["No hidden charges", "Decision in minutes", "Money same day", "Safe & encrypted"].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle size={13} className="text-slate-900" />{f}
            </div>
          ))}
        </div>
        <div className="max-w-xs">
          <Btn onClick={onNext}>Get started <ArrowRight size={16} /></Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[["₹500Cr+", "Disbursed"], ["2.1L+", "Borrowers"], ["4.8 / 5", "Rating"], ["< 4 hrs", "Approval"]].map(([n, s]) => (
          <div key={s} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
            <div className="font-serif text-2xl text-slate-900 tracking-tight">{n}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s}</div>
          </div>
        ))}
      </div>

      <Card className="!p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-slate-400 shrink-0" />
          <div>
            <div className="font-semibold text-sm text-slate-800">Your data stays private</div>
            <div className="text-xs text-slate-400 mt-0.5">256-bit encryption · Never sold · RBI compliant</div>
          </div>
        </div>
      </Card>
    </Screen>
  );
}

function BasicInfo({ data, setData, onNext, trackFocus, trackError }) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [errors, setErrors] = useState({});
  const refs = [useRef(), useRef(), useRef(), useRef()];

  function validate() {
    const e = {};
    if (!data.name.trim() || data.name.trim().length < 2) { e.name = "Enter your full name"; trackError && trackError("name"); }
    if (!/^\d{10}$/.test(data.phone)) { e.phone = "Enter a valid 10-digit number"; trackError && trackError("phone"); }
    setErrors(e);
    return !Object.keys(e).length;
  }

  function sendOtp() { if (validate()) setOtpSent(true); }

  function handleOtp(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 3) refs[i + 1].current.focus();
  }

  function verify() {
    setVerifying(true);
    setTimeout(() => { setVerifying(false); logEvent("OTP_VERIFIED", { phone: data.phone }); onNext(); }, 1500);
  }

  return (
    <Screen>
      <Card>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Who are you?</h2>
        <p className="text-sm text-slate-500 mt-1 mb-7">Takes 30 seconds.</p>
        <Inp label="Full name" icon={User} placeholder="Rahul Sharma"
          value={data.name} error={errors.name} ok={data.name.trim().length > 1}
          onFocus={() => trackFocus && trackFocus("name")}
          onChange={e => { setData({ ...data, name: e.target.value }); setErrors(v => ({...v, name: ""})); }} />
        <Inp label="Phone number" icon={Phone} placeholder="9876543210" maxLength={10}
          value={data.phone} error={errors.phone} ok={data.phone.length === 10}
          onFocus={() => trackFocus && trackFocus("phone")}
          onChange={e => { setData({ ...data, phone: e.target.value.replace(/\D/g, "") }); setErrors(v => ({...v, phone: ""})); }} />

        {!otpSent ? (
          <Btn onClick={sendOtp}>Send verification code</Btn>
        ) : (
          <>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Enter 4-digit code sent to +91 {data.phone}
            </label>
            <div className="flex gap-2 mb-5">
              {otp.map((d, i) => (
                <input key={i} ref={refs[i]}
                  className="flex-1 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all"
                  maxLength={1} value={d} inputMode="numeric"
                  onFocus={() => trackFocus && trackFocus("otp")}
                  onChange={e => handleOtp(i, e.target.value)}
                  onKeyDown={e => e.key === "Backspace" && !d && i > 0 && refs[i - 1].current.focus()} />
              ))}
            </div>
            <Btn onClick={verify} disabled={!otp.every(d => d) || verifying}>
              {verifying ? <><Spinner /> Verifying…</> : <>Verify &amp; continue <ArrowRight size={15} /></>}
            </Btn>
            <div className="text-center mt-4">
              <OTPTimer onResend={() => {}} />
            </div>
          </>
        )}
      </Card>
    </Screen>
  );
}

function LoanSelect({ data, setData, onNext, personal }) {
  const DURATIONS = [6, 12, 18, 24];
  const eligibility = evaluateApplication({ ...(personal || {}), amount: data.amount });
  const cappedMax = eligibility.eligibilityAmount || 500000;
  const emi = calcEMI(data.amount, data.months);
  const procFee = Math.round(data.amount * 0.02);
  const interest = emi * data.months - data.amount;
  const total = emi * data.months;

  return (
    <Screen>
      <Card>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">How much do you need?</h2>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Loan amount</label>
        <div className="font-serif text-5xl text-slate-900 tracking-tighter leading-none mb-5">{fmt(data.amount)}</div>
        <input type="range" min={10000} max={cappedMax} step={5000} value={data.amount}
          onChange={e => setData({ ...data, amount: +e.target.value })}
          className="w-full h-1 appearance-none bg-slate-200 rounded-full outline-none cursor-pointer accent-slate-900 mb-2" />
        <div className="flex justify-between mb-1">
          <span className="text-xs text-slate-400">₹10,000</span>
          <span className="text-xs text-slate-400">{fmt(cappedMax)}</span>
        </div>
        {cappedMax < 500000 && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 mt-2 mb-1">
            <AlertCircle size={11} /> You are eligible up to {fmt(cappedMax)}
          </div>
        )}

        <div className="h-px bg-slate-100 my-6" />

        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Repay over</label>
        <div className="flex flex-wrap gap-2 mb-6">
          {DURATIONS.map(m => (
            <button key={m}
              className={`px-5 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-150
                ${data.months === m ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"}`}
              onClick={() => setData({ ...data, months: m })}>{m} months</button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[["Monthly EMI", fmt(emi)], ["Total repayment", fmt(total)], ["Interest rate", "18% p.a."]].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">{k}</div>
              <div className="text-base font-bold text-slate-900 tracking-tight">{v}</div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm">
          {[["Loan amount", fmt(data.amount)], ["Processing fee (2%)", fmt(procFee)], ["Total interest", fmt(interest)], ["Total repayment", fmt(total)]].map(([k, v], i) => (
            <div key={k} className={`flex justify-between py-1.5 ${i < 3 ? "border-b border-slate-200" : "font-bold pt-2.5"}`}>
              <span className="text-slate-500">{k}</span><span className="text-slate-900">{v}</span>
            </div>
          ))}
        </div>

        <Btn onClick={onNext}>Continue <ArrowRight size={15} /></Btn>
      </Card>
    </Screen>
  );
}

function PersonalInfo({ data, setData, onNext, trackFocus, trackError }) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [verifyMsg, setVerifyMsg] = useState("");

  function touch(field) { setTouched(t => ({ ...t, [field]: true })); }

  function validate() {
    const e = {};
    if (!PAN_RE.test(data.pan)) { e.pan = "Enter valid PAN (e.g. ABCDE1234F)"; trackError && trackError("pan"); }
    if (data.aadhaar.length !== 12) { e.aadhaar = "Aadhaar must be 12 digits"; trackError && trackError("aadhaar"); }
    if (!data.dob) { e.dob = "Enter your date of birth"; trackError && trackError("dob"); }
    if (data.address.trim().length < 10) { e.address = "Enter your complete address"; trackError && trackError("address"); }
    setErrors(e); return !Object.keys(e).length;
  }

  function next() {
    if (!validate()) return;
    setVerifyMsg("Verifying PAN...");
    setTimeout(() => {
      setVerifyMsg("Aadhaar linked ✓");
      setTimeout(() => { setVerifyMsg(""); onNext(); }, 1000);
    }, 1000);
  }

  const f = (field, val) => { setData({ ...data, [field]: val }); setErrors(e => ({ ...e, [field]: "" })); };

  return (
    <Screen>
      <Card>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verify identity</h2>
        <p className="text-sm text-slate-500 mt-1 mb-7">Required by law. Stays private and encrypted.</p>
        <Inp label="PAN number" icon={CreditCard} placeholder="ABCDE1234F" maxLength={10}
          value={data.pan} error={touched.pan && errors.pan} ok={PAN_RE.test(data.pan)}
          style={{ letterSpacing: "2px", textTransform: "uppercase" }}
          onFocus={() => trackFocus && trackFocus("pan")}
          onChange={e => f("pan", e.target.value.toUpperCase())}
          onBlur={() => { touch("pan"); if (!PAN_RE.test(data.pan)) setErrors(e => ({...e, pan: "Enter valid PAN (e.g. ABCDE1234F)"})); }} />
        <Inp label="Aadhaar number" icon={ShieldCheck} placeholder="123456789012" maxLength={12}
          value={data.aadhaar} error={touched.aadhaar && errors.aadhaar} ok={data.aadhaar.length === 12}
          style={{ letterSpacing: "2px" }}
          onFocus={() => trackFocus && trackFocus("aadhaar")}
          onChange={e => f("aadhaar", e.target.value.replace(/\D/g, ""))}
          onBlur={() => { touch("aadhaar"); if (data.aadhaar.length !== 12) setErrors(e => ({...e, aadhaar: "Aadhaar must be 12 digits"})); }} />
        <Inp label="Date of birth" type="date"
          value={data.dob} error={touched.dob && errors.dob} ok={!!data.dob}
          onFocus={() => trackFocus && trackFocus("dob")}
          onChange={e => f("dob", e.target.value)} onBlur={() => touch("dob")} />
        <Inp label="Home address" placeholder="123 MG Road, Mumbai, Maharashtra 400001"
          value={data.address} error={touched.address && errors.address} ok={data.address.trim().length >= 10}
          onFocus={() => trackFocus && trackFocus("address")}
          onChange={e => f("address", e.target.value)} onBlur={() => touch("address")} />

        {verifyMsg && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-xl px-4 py-3 mb-4">
            <Loader2 size={13} className="animate-spin" />{verifyMsg}
          </div>
        )}
        <Btn onClick={next} disabled={!!verifyMsg}>Continue <ArrowRight size={15} /></Btn>
        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
          <ShieldCheck size={11} />Encrypted and never shared
        </div>
      </Card>
    </Screen>
  );
}

function UploadDocs({ uploads, setUploads, onNext }) {
  const [states, setStates] = useState({ pan: "idle", aadhaar: "idle", selfie: "idle" });
  const [names, setNames] = useState({});
  const [progress, setProgress] = useState({});

  function handleFile(key, file) {
    setStates(s => ({ ...s, [key]: "loading" }));
    setNames(n => ({ ...n, [key]: file.name }));
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 25;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        const failed = Math.random() < 0.1;
        if (failed) {
          setStates(s => ({ ...s, [key]: "idle" }));
          setNames(n => ({ ...n, [key]: "⚠ Upload failed, try again" }));
        } else {
          setStates(s => ({ ...s, [key]: "done" }));
          setUploads(u => ({ ...u, [key]: true }));
          logEvent("DOC_UPLOADED", { doc: key });
        }
      }
      setProgress(pr => ({ ...pr, [key]: Math.round(p) }));
    }, 200);
  }

  const allDone = ["pan", "aadhaar", "selfie"].every(k => uploads[k]);

  return (
    <Screen>
      <Card>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Upload documents</h2>
        <p className="text-sm text-slate-500 mt-1 mb-7">Clear photos work fine. No scanner needed.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <UploadZone label="PAN card" Icon={CreditCard} state={states.pan} filename={names.pan} progress={progress.pan || 0} onFile={f => handleFile("pan", f)} />
          <UploadZone label="Aadhaar card" Icon={FileText} state={states.aadhaar} filename={names.aadhaar} progress={progress.aadhaar || 0} onFile={f => handleFile("aadhaar", f)} />
          <UploadZone label="Your selfie" Icon={Camera} state={states.selfie} filename={names.selfie} progress={progress.selfie || 0} onFile={f => handleFile("selfie", f)} />
        </div>
        {allDone && (
          <div className="flex flex-col gap-1.5 mb-5">
            {["Document clear ✓", "Face match success ✓"].map(m => (
              <div key={m} className="flex items-center gap-2 text-xs text-emerald-600">
                <CheckCircle size={11} className="text-emerald-500" />{m}
              </div>
            ))}
          </div>
        )}
        <Btn onClick={onNext} disabled={!allDone}>Continue <ArrowRight size={15} /></Btn>
        {!allDone && <p className="text-center text-xs text-slate-400 mt-3">Upload all 3 documents to continue</p>}
      </Card>
    </Screen>
  );
}

function BankDetails({ data, setData, onNext, trackFocus }) {
  const [errors, setErrors] = useState({});
  const bankName = getBankName(data.ifsc);
  const validIfsc = IFSC_RE.test(data.ifsc);
  const validAcc = data.accNo.length >= 9;

  function validate() {
    const e = {};
    if (!validAcc) e.accNo = "Enter a valid account number (min 9 digits)";
    if (!validIfsc) e.ifsc = "Enter valid IFSC code (e.g. SBIN0001234)";
    setErrors(e); return !Object.keys(e).length;
  }

  return (
    <Screen>
      <Card>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Where to send money?</h2>
        <p className="text-sm text-slate-500 mt-1 mb-7">Loan amount will be sent directly here.</p>
        <Inp label="Account number" placeholder="0123456789"
          value={data.accNo} error={errors.accNo} ok={validAcc}
          style={{ letterSpacing: "2px" }}
          onFocus={() => trackFocus && trackFocus("accNo")}
          onChange={e => { setData({ ...data, accNo: e.target.value.replace(/\D/g, "") }); setErrors(v => ({...v, accNo: ""})); }} />
        <Inp label="IFSC code" placeholder="SBIN0001234" maxLength={11}
          value={data.ifsc} error={errors.ifsc} ok={validIfsc}
          style={{ letterSpacing: "2px", textTransform: "uppercase" }}
          onFocus={() => trackFocus && trackFocus("ifsc")}
          onChange={e => { setData({ ...data, ifsc: e.target.value.toUpperCase() }); setErrors(v => ({...v, ifsc: ""})); }}
          iconRight={validIfsc && bankName ? <CheckCircle size={15} className="text-emerald-500" /> : null} />
        {validIfsc && bankName && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 rounded-xl -mt-2 mb-4">
            <Building2 size={14} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">{bankName}</span>
          </div>
        )}
        <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-500 leading-relaxed mb-5">
          Auto-pay will be set up for monthly payments. No charges for using auto-pay.
        </div>
        <Btn onClick={() => validate() && onNext()}>Continue <ArrowRight size={15} /></Btn>
      </Card>
    </Screen>
  );
}

function Review({ personal, loan, bank, onSubmit, onEdit }) {
  const [submitting, setSubmitting] = useState(false);
  const emi = calcEMI(loan.amount, loan.months);

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      const result = evaluateApplication({ ...personal, amount: loan.amount });
      logEvent("DECISION_MADE", result);
      setSubmitting(false);
      onSubmit(result);
    }, 2000);
  }

  const sections = [
    { title: "Personal details", screen: "basic", rows: [["Name", personal.name], ["Phone", personal.phone]] },
    { title: "Identity", screen: "personal", rows: [["PAN", personal.pan], ["Aadhaar", "XXXX XXXX " + personal.aadhaar.slice(-4)], ["Date of birth", personal.dob], ["Address", personal.address]] },
    { title: "Loan", screen: "loan", rows: [["Amount", fmt(loan.amount)], ["Duration", `${loan.months} months`], ["Monthly EMI", fmt(emi)]] },
    { title: "Bank account", screen: "bank", rows: [["Account", "XXXX" + bank.accNo.slice(-4)], ["IFSC", bank.ifsc]] },
  ];

  return (
    <Screen>
      <Card>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Check your details</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">Review before submitting.</p>
        {sections.map(sec => (
          <div key={sec.title} className="mb-1">
            <div className="flex justify-between items-center pb-2.5 border-b-2 border-slate-100 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{sec.title}</span>
              <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:opacity-70"
                onClick={() => onEdit(sec.screen)}>
                <Edit2 size={11} />Edit
              </button>
            </div>
            {sec.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between items-start py-3 border-b border-slate-50 last:border-b-0">
                <span className="text-xs text-slate-400">{k}</span>
                <span className="text-xs font-semibold text-slate-800 text-right max-w-[60%] break-all">{v}</span>
              </div>
            ))}
            <div className="h-4" />
          </div>
        ))}
        <Btn onClick={handleSubmit} disabled={submitting}>
          {submitting ? <><Spinner /> Submitting application…</> : <>Submit application <ArrowRight size={15} /></>}
        </Btn>
        <p className="text-center text-xs text-slate-400 mt-3">By submitting you agree to our terms &amp; privacy policy</p>
      </Card>
    </Screen>
  );
}

function StatusScreen({ decision, onDashboard }) {
  const [phase, setPhase] = useState("processing");

  useEffect(() => {
    const t = setTimeout(() => setPhase("result"), 2500);
    return () => clearTimeout(t);
  }, []);

  const dec = decision || { decision: "pending", reason: "Evaluating your application…", riskLevel: "" };

  const cfg = {
    approved: { Icon: CheckCircle, bg: "bg-emerald-50", ic: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", text: "Approved", head: "Money coming soon" },
    rejected: { Icon: XCircle, bg: "bg-red-50", ic: "text-red-500", badge: "bg-red-100 text-red-700", text: "Not approved", head: "Application declined" },
    pending: { Icon: Clock, bg: "bg-amber-50", ic: "text-amber-600", badge: "bg-amber-100 text-amber-700", text: "Under review", head: "We're checking your application" },
  };

  if (phase === "processing") return (
    <Screen>
      <Card className="!text-center !py-14">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
          <Loader2 size={28} className="text-blue-500 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Evaluating your application</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">Running risk checks…</p>
        <div className="flex flex-col gap-2 text-left max-w-xs mx-auto">
          {["Identity verification", "Credit risk analysis", "Document review"].map((s, i) => (
            <div key={s} className="flex items-center gap-2.5 text-sm text-slate-500">
              <Loader2 size={12} className="animate-spin text-blue-400 shrink-0" style={{ animationDelay: `${i * 0.3}s` }} />{s}
            </div>
          ))}
        </div>
      </Card>
    </Screen>
  );

  const c = cfg[dec.decision] || cfg.pending;
  return (
    <Screen>
      <Card className="!text-center !py-14">
        <div className={`w-16 h-16 rounded-full ${c.bg} flex items-center justify-center mx-auto mb-5`}>
          <c.Icon size={28} className={c.ic} />
        </div>
        <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold ${c.badge} mb-4`}>{c.text}</span>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{c.head}</h2>
        <p className="text-sm text-slate-500 mt-2">{dec.reason}</p>
        {dec.decision === "approved" && (
          <div className="bg-slate-50 rounded-xl p-4 mt-6 text-left max-w-xs mx-auto">
            <div className="flex flex-col gap-2">
              {["Application received", "Verification complete", "Sending money…"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <CheckCircle size={13} className={i < 2 ? "text-emerald-500" : "text-slate-300"} />
                  <span className={`text-sm ${i < 2 ? "text-slate-800" : "text-slate-400"}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {dec.decision !== "pending" && (
          <div className="mt-8 max-w-xs mx-auto">
            <Btn onClick={onDashboard}>
              {dec.decision === "approved" ? "Go to dashboard" : "Back to home"} <ArrowRight size={15} />
            </Btn>
          </div>
        )}
      </Card>
    </Screen>
  );
}

function Dashboard({ loan, payments, onPay, onHome, decision }) {
  const emi = calcEMI(loan.amount, loan.months);
  const paidCount = payments.length;
  const paidTotal = emi * paidCount;
  const remaining = emi * loan.months - paidTotal;
  const pct = Math.round((paidTotal / (emi * loan.months)) * 100);
  const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 12);

  const riskColors = {
    low: { bg: "bg-emerald-100", text: "text-emerald-700" },
    medium: { bg: "bg-amber-100", text: "text-amber-700" },
    high: { bg: "bg-red-100", text: "text-red-700" },
  };

  return (
    <Screen>
      <div className="font-bold text-2xl text-slate-900 tracking-tight mb-2">Your loan</div>
      {decision && (
        <div className="flex items-center gap-2.5 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${riskColors[decision.riskLevel]?.bg} ${riskColors[decision.riskLevel]?.text}`}>
            {decision.riskLevel.toUpperCase()} RISK
          </span>
          {decision.riskLevel === "low" && <span className="text-xs text-emerald-600 font-semibold">You are on track ✓</span>}
        </div>
      )}

      <div className="bg-slate-900 rounded-2xl p-6 mb-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total loan</div>
        <div className="font-serif text-3xl text-white tracking-tight">{fmt(loan.amount)}</div>
        <div className="mt-6">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-slate-500">Paid so far</span>
            <span className="text-xs text-white font-semibold">{pct}%</span>
          </div>
          <div className="h-1 bg-white/15 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Paid</div>
          <div className="font-serif text-2xl text-slate-900 tracking-tight">{fmt(paidTotal)}</div>
          <div className="text-xs text-slate-400 mt-1">{paidCount} payment{paidCount !== 1 ? "s" : ""}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Remaining</div>
          <div className="font-serif text-2xl text-slate-900 tracking-tight">{fmt(remaining)}</div>
          <div className="text-xs text-slate-400 mt-1">{loan.months - paidCount} payments left</div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 mb-3 gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Next payment</div>
          <div className="text-xl font-bold text-slate-900">{fmt(emi)}</div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <Clock size={11} />Due in 12 days · {dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </div>
        </div>
        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors shrink-0"
          onClick={onPay}>Pay now</button>
      </div>

      {payments.length > 0 && (
        <Card className="!p-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Payment history</div>
          {payments.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-b-0">
              <div>
                <div className="text-sm font-semibold text-slate-800">{p.label}</div>
                <div className="text-xs text-slate-400">{p.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{fmt(p.amount)}</span>
                <CheckCircle size={14} className="text-emerald-500" />
              </div>
            </div>
          ))}
        </Card>
      )}

      <Btn variant="outline" className="mt-3" onClick={onHome}>
        <Home size={15} />Back to home
      </Btn>
    </Screen>
  );
}

function Payment({ emi, onDone, onBack }) {
  const [method, setMethod] = useState("upi");
  const [state, setState] = useState("idle");
  const methods = [
    { id: "upi", label: "UPI", sub: "Google Pay, PhonePe, Paytm" },
    { id: "card", label: "Debit / Credit card", sub: "Visa, Mastercard, RuPay" },
    { id: "netbanking", label: "Net banking", sub: "All major banks supported" },
  ];

  function pay() {
    setState("paying");
    setTimeout(() => setState(Math.random() > 0.15 ? "success" : "failed"), 2200);
  }

  if (state === "success") return (
    <Screen>
      <Card className="!text-center !py-14">
        <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-5"
          style={{ animation: "pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both" }}>
          <style>{`@keyframes pop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
          <CheckCircle size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Payment successful</h2>
        <p className="text-sm text-slate-500 mt-2 mb-8">{fmt(emi)} paid.<br />Receipt sent to your phone.</p>
        <div className="max-w-xs mx-auto">
          <Btn onClick={onDone}>Back to dashboard</Btn>
        </div>
      </Card>
    </Screen>
  );

  return (
    <Screen>
      <Card>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pay your EMI</h2>
        <div className="text-center py-9">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Amount due</div>
          <div className="font-serif text-5xl text-slate-900 tracking-tighter leading-none">{fmt(emi)}</div>
          <div className="text-xs text-slate-400 mt-3">Due in 12 days</div>
        </div>

        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment method</div>
        <div className="flex flex-col gap-2 mb-5">
          {methods.map(m => (
            <div key={m.id}
              className={`flex items-center gap-3.5 px-4 py-4 rounded-xl border-2 cursor-pointer transition-all duration-150
                ${method === m.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-400 bg-white"}`}
              onClick={() => { setState("idle"); setMethod(m.id); }}>
              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                ${method === m.id ? "border-slate-900 bg-slate-900" : "border-slate-300"}`}>
                {method === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">{m.label}</div>
                <div className="text-xs text-slate-400">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {state === "failed" && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl mb-4">
            <XCircle size={16} className="text-red-500 shrink-0" />
            <span className="text-sm text-red-600">Payment failed. Please try again or use a different method.</span>
          </div>
        )}

        <Btn onClick={pay} disabled={state === "paying"}>
          {state === "paying" ? <><Spinner />Processing payment…</> : `Pay ${fmt(emi)}`}
        </Btn>
        <Btn variant="outline" className="mt-2" onClick={onBack}>Cancel</Btn>
      </Card>
    </Screen>
  );
}

// ══ APP ═══════════════════════════════════════════════════════════════════════
const TOTAL = 7;
const STEP = { landing: 0, basic: 1, loan: 2, personal: 3, upload: 4, bank: 5, review: 6, status: 7, dashboard: 0, payment: 0 };

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [basic, setBasic] = useState({ name: "", phone: "" });
  const [loan, setLoan] = useState({ amount: 100000, months: 12 });
  const [personal, setPersonal] = useState({ pan: "", aadhaar: "", dob: "", address: "" });
  const [uploads, setUploads] = useState({ pan: false, aadhaar: false, selfie: false });
  const [bank, setBank] = useState({ accNo: "", ifsc: "" });
  const [payments, setPayments] = useState([]);
  const [decision, setDecision] = useState(null);

  // ── Nudge system wired here ────────────────────────────────────────────────
  const step = STEP[screen] || 0;
  const { nudge, dismissNudge, trackFocus, trackError } = useNudge(screen, step, TOTAL);

  const go = useCallback(s => {
    logEvent("STEP_CHANGE", { to: s });
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const emi = calcEMI(loan.amount, loan.months);

  function handlePayDone() {
    const now = new Date();
    setPayments(p => [...p, {
      label: `EMI ${p.length + 1}`,
      date: now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      amount: emi,
    }]);
    go("dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-5 pb-20 font-sans">
      {step > 0 && step <= TOTAL && <TopBar step={step} total={TOTAL} />}
      <Header step={step} total={TOTAL} />
      {screen === "landing"   && <Landing onNext={() => go("basic")} />}
      {screen === "basic"     && <BasicInfo data={basic} setData={setBasic} onNext={() => go("loan")} trackFocus={trackFocus} />}
      {screen === "loan"      && <LoanSelect data={loan} setData={setLoan} personal={personal} onNext={() => go("personal")} />}
      {screen === "personal"  && <PersonalInfo data={personal} setData={setPersonal} onNext={() => go("upload")} trackFocus={trackFocus} />}
      {screen === "upload"    && <UploadDocs uploads={uploads} setUploads={setUploads} onNext={() => go("bank")} />}
      {screen === "bank"      && <BankDetails data={bank} setData={setBank} onNext={() => go("review")} trackFocus={trackFocus} />}
      {screen === "review"    && <Review personal={{ ...basic, ...personal }} loan={loan} bank={bank} onSubmit={(result) => { setDecision(result); go("status"); }} onEdit={go} />}
      {screen === "status"    && <StatusScreen decision={decision} onDashboard={() => go("dashboard")} />}
      {screen === "dashboard" && <Dashboard loan={loan} payments={payments} decision={decision} onPay={() => go("payment")} onHome={() => go("landing")} />}
      {screen === "payment"   && <Payment emi={emi} onDone={handlePayDone} onBack={() => go("dashboard")} />}

      {/* ── Smart Nudge Card (bottom-right, auto-fade) ── */}
      <NudgeCard nudge={nudge} onDismiss={dismissNudge} />

      {/* ── Progress % Pill (bottom-left, only during application flow) ── */}
      <ProgressPill step={step} total={TOTAL} />
    </div>
  );
}