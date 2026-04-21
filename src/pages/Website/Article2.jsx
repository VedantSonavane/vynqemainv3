import { useState, useEffect, useRef, useMemo } from "react";
import Header from "./header";
import Footer from "./contact";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, Cell, LabelList,
} from "recharts";
import { ArrowLeft } from "lucide-react";
import churnVideo from "../../assets/saasblog.mp4";
import React from "react";

/* ─── DATA ──────────────────────────────────────────────────────── */
const META = { date: "April 9, 2026", read: "9 min read", category: "STRATEGY" };

const HERO_INTRO =
  "Most SaaS companies only notice churn at renewal. By then, it's already too late. The real story starts months earlier—hidden inside onboarding gaps, missed activation moments, and pricing friction that quietly erodes trust.";

const STATS = [
  { value: "5–7×", label: "Cost to acquire vs. retain a customer", src: "Forrester Research", href: "https://www.forrester.com" },
  { value: "67%", label: "Of churn is preventable with early signals", src: "Gainsight", href: "https://www.gainsight.com" },
  { value: "90 days", label: "Window where most churn seeds are planted", src: "Intercom Blog", href: "https://www.intercom.com/blog" },
];

const HREF = {
  intercom:   "https://www.intercom.com/blog",
  gartner:    "https://www.gartner.com",
  amplitude:  "https://amplitude.com/blog",
  gainsight:  "https://www.gainsight.com",
  forrester:  "https://www.forrester.com",
  tomtunguz:  "https://tomtunguz.com",
  openview:   "https://openview.com",
  paddle:     "https://paddle.com",
  totango:    "https://www.totango.com",
  looker:     "https://www.looker.com",
  reforge:    "https://reforge.com",
  stripe:     "https://stripe.com",
  newrelic:   "https://newrelic.com",
  pagerduty:  "https://www.pagerduty.com",
  g2:         "https://www.g2.com",
};

const SECTIONS = [
  {
    id: "problem",
    label: "THE BLIND SPOT",
    heading: "Churn Doesn't Start at Renewal",
    body: "Renewal is where churn shows up on a spreadsheet. But the actual decision to leave was made weeks—sometimes months—earlier. A customer who logs in less, skips their QBR, stops submitting support tickets, or quietly stops inviting teammates has already checked out mentally. Watching renewal rates alone is like diagnosing a fever after the patient has left the hospital.",
  },
  {
    id: "onboarding",
    label: "THE FIRST 90 DAYS",
    heading: "Onboarding Is Where Trust Is Made or Broken",
    bodyParts: [
      { text: "The first 90 days are everything. According to " },
      { text: "Intercom's research", href: HREF.intercom },
      { text: ", customers who don't reach their first meaningful success moment within the first few weeks are dramatically more likely to churn—often before ever engaging a sales team about renewal. The product has to prove itself fast. If it doesn't, no amount of outreach saves the relationship." },
    ],
    links: [
      { text: "Intercom Blog", href: HREF.intercom },
      { text: "Forrester Research", href: HREF.forrester },
      { text: "Gainsight", href: HREF.gainsight },
    ],
    note: "The fastest-churning customers often look like good leads—high intent, fast signups, early adoption. The problem isn't motivation. It's friction. A single broken workflow, a confusing setup step, or a missing integration can silently kill a promising relationship before it starts.",
    noteLink: { text: "Gainsight", href: HREF.gainsight },
    subsections: [
      { title: "Generic Onboarding Kills Engagement", body: "One flow for everyone is a flow built for no one. Enterprise buyers need compliance walkthroughs. Developers want API docs upfront. Ops teams want integration guides first. Segmented onboarding built around customer type reliably outperforms one-size-fits-all." },
      { title: "Internal Process Drag", body: "Most onboarding delays aren't caused by the customer. They're caused by the vendor—slow provisioning, manual setup steps, disjointed handoffs between sales and success teams. Fixing internal drag is the fastest onboarding win most companies overlook." },
    ],
  },
  {
    id: "activation",
    label: "THE REAL METRIC",
    heading: "Activation Isn't a Login. It's a Lightbulb.",
    bodyParts: [
      { text: "Most teams define activation wrong. Logging in isn't activation. Completing a setup wizard isn't activation. " },
      { text: "Amplitude's framework", href: HREF.amplitude },
      { text: " is clear: activation happens when a customer performs the specific action that is statistically correlated with long-term retention for their segment. That action is different for every product—and finding it requires comparing retained vs. churned cohorts, not guessing." },
    ],
    links: [
      { text: "Amplitude Blog", href: HREF.amplitude },
      { text: "Reforge", href: HREF.reforge },
      { text: "Looker Analytics", href: HREF.looker },
    ],
    subsections: [
      { title: "The Signup Growth Trap", body: "Strong signup numbers make teams feel safe. But signups that don't activate are noise—they inflate dashboards while masking genuine adoption problems underneath. High growth can hide broken activation for months before it shows up in renewal data." },
      { title: "Segment-Specific Milegreys", body: "The activation action for an enterprise user is rarely the same as for an SMB user. Measuring one activation rate for your entire user base averages away the insight. Segment first, then find the milegrey that matters in each group." },
    ],
  },
  {
    id: "segments",
    label: "THE HIDDEN PATTERN",
    heading: "Aggregate Metrics Are Lying to You",
    bodyParts: [
      { text: "A company-level churn rate of 8% can hide a 22% churn rate in a specific segment. " },
      { text: "OpenView's SaaS benchmarks", href: HREF.openview },
      { text: " consistently show that non-uniform churn across customer types is the norm, not the exception. Without cohort-level visibility, you're flying blind—making retention investments in the wrong places and missing the segments that actually need help." },
    ],
    links: [
      { text: "OpenView Partners", href: HREF.openview },
      { text: "Amplitude Blog", href: HREF.amplitude },
    ],
    note: "ICP drift is a stealth churn driver. When sales expands into adjacent segments before the product is ready, churn spikes in those new segments—but it's often chalked up to 'market fit issues' rather than premature expansion. The data usually tells a clearer story than the narrative does.",
    noteLink: { text: "OpenView Partners", href: HREF.openview },
  },
  {
    id: "pricing",
    label: "THE FRICTION POINT",
    heading: "Pricing Confusion Is a Retention Problem",
    bodyParts: [
      { text: "Customers who feel surprised by their bill churn. " },
      { text: "Paddle's pricing research", href: HREF.paddle },
      { text: " across B2B SaaS companies shows that value transparency functions as a direct retention lever—customers who clearly understand what they're paying for and why stay longer. Pricing surprises, unexpected seat overages, and unclear usage limits consistently rank among the top churn drivers in exit surveys, according to " },
      { text: "G2's churn data", href: HREF.g2 },
      { text: "." },
    ],
    links: [
      { text: "Paddle Pricing Research", href: HREF.paddle },
      { text: "G2 Reviews & Churn Data", href: HREF.g2 },
    ],
    subsections: [
      { title: "Outcome-Aligned Pricing Retains Better", body: "When pricing maps to customer outcomes—seats used, revenue generated, workflows automated—it becomes self-evidently fair. Customers can see the value they're getting reflected in what they pay. Misaligned pricing metrics create resentment that compounds over time." },
      { title: "Surprise Is the Enemy", body: "Usage-based billing is powerful but risky. Without clear visibility into spend trajectories, customers get hit with unexpected invoices. A single billing shock late in a contract year poisons renewal conversations that were otherwise on track." },
    ],
  },
  {
    id: "proactive",
    label: "THE PLAYBOOK",
    heading: "Get There Before the Customer Decides to Leave",
    bodyParts: [
      { text: "Reactive customer success—waiting for red flags before reaching out—is fighting a battle that's mostly already lost. " },
      { text: "Gainsight's benchmarks", href: HREF.gainsight },
      { text: " show proactive programs deliver meaningfully better retention than reactive models. The difference isn't effort—it's timing. The same conversation that fails at day 300 succeeds at day 60." },
    ],
    links: [
      { text: "Gainsight", href: HREF.gainsight },
      { text: "Forrester Research", href: HREF.forrester },
      { text: "Totango", href: HREF.totango },
    ],
    subsections: [
      { title: "Build an Integrated Risk Score", body: "Product usage, support ticket frequency, stakeholder engagement, NPS trends, and billing health all signal churn risk independently. The most effective teams combine these signals into a unified health score that surfaces accounts needing attention months before renewal." },
      { title: "Timing Is the Intervention", body: "Reaching out 30 days before a renewal isn't proactive—it's just less late. Proactive success means making contact at the first meaningful drop in engagement, regardless of where the customer is in their contract year." },
      { title: "Performance Matters More Than Features", body: "Slow load times, reliability incidents, and downtime are invisible churn drivers that product and success teams often silo separately. Customers don't distinguish between a product bug and a reliability failure—both erode trust at the same rate." },
    ],
  },
  {
    id: "data",
    label: "THE FOUNDATION",
    heading: "You Can't Fix What You Can't See",
    bodyParts: [
      { text: "Bad data is the silent partner in most churn problems. " },
      { text: "Amplitude's instrumentation research", href: HREF.amplitude },
      { text: " shows widespread gaps—untracked interactions, broken identity resolution, dashboards that disagree with billing systems. When your churn analytics are built on incomplete data, you're optimizing based on a distorted picture. The fix isn't a new tool. It's clean instrumentation of what you already have." },
    ],
    links: [
      { text: "Amplitude Data Analytics", href: HREF.amplitude },
      { text: "Looker Analytics", href: HREF.looker },
      { text: "Reforge", href: HREF.reforge },
      { text: "Stripe", href: HREF.stripe },
    ],
    subsections: [
      { title: "Involuntary Churn Is Recoverable", body: "A meaningful slice of SaaS churn isn't a product decision—it's a billing failure. Failed payments, expired cards, and procurement delays cause revenue loss that automated dunning and proactive billing outreach can largely recover, according to Stripe's payment data." },
      { title: "Renewal Ops Is an Underrated Lever", body: "Long B2B approval cycles create churn risk through delay alone. Accounts that intended to renew get tangled in procurement timelines and legal reviews. Early flagging, automated reminders, and clear renewal paperwork reduce the friction that turns willing customers into involuntary churners." },
    ],
  },
  {
    id: "closing",
    label: "THE TAKEAWAY",
    heading: "Churn Is Diagnosable. Start Earlier.",
    bodyParts: [
      { text: "The companies that win on retention don't have magic. They have earlier visibility. They define activation correctly. They segment their cohorts. They build proactive success programs instead of reactive rescue squads. " },
      { text: "Tomtunguz's analysis", href: HREF.tomtunguz },
      { text: " frames it simply: early intervention is cheaper than renewal rescue—always. The data from " },
      { text: "Gainsight", href: HREF.gainsight },
      { text: ", " },
      { text: "Forrester", href: HREF.forrester },
      { text: ", and " },
      { text: "Intercom", href: HREF.intercom },
      { text: " all point the same direction. The best time to prevent churn was at onboarding. The second best time is right now." },
    ],
  },
];

const SOURCES = [
  { text: "Intercom — Onboarding & Retention", href: HREF.intercom },
  { text: "Gainsight — Customer Success", href: HREF.gainsight },
  { text: "Amplitude — Product Analytics", href: HREF.amplitude },
  { text: "Forrester — B2B Research", href: HREF.forrester },
  { text: "OpenView Partners — SaaS Benchmarks", href: HREF.openview },
  { text: "Paddle — Pricing Research", href: HREF.paddle },
  { text: "G2 — Churn Survey Data", href: HREF.g2 },
  { text: "Totango — Renewal Management", href: HREF.totango },
  { text: "Stripe — Payment & Billing", href: HREF.stripe },
  { text: "Tomtunguz — SaaS Strategy", href: HREF.tomtunguz },
];

/* ─── CHART DATA ─────────────────────────────────────────────── */
const RETENTION_DATA = [
  { stage: "Day 1",   strong: 100, delayed: 100, poor: 100 },
  { stage: "Day 7",   strong: 78,  delayed: 62,  poor: 45  },
  { stage: "Day 30",  strong: 65,  delayed: 42,  poor: 22  },
  { stage: "Day 90",  strong: 58,  delayed: 28,  poor: 8   },
  { stage: "Day 180", strong: 52,  delayed: 18,  poor: 3   },
  { stage: "Day 365", strong: 48,  delayed: 12,  poor: 1   },
];

const CASCADE_DATA = [
  { stage: "Onboarding",       remaining: 100, color: "#3b82f6" },
  { stage: "Activation",       remaining: 85,  color: "#22c55e" },
  { stage: "Value Realized",   remaining: 72,  color: "#f59e0b" },
  { stage: "Habituation",      remaining: 64,  color: "#f97316" },
  { stage: "Expansion",        remaining: 58,  color: "#ef4444" },
  { stage: "Renewal",          remaining: 52,  color: "#b91c1c" },
];

const CHURN_DRIVERS = [
  { name: "Poor Onboarding / TTV", value: 82, color: "#dc2626" },
  { name: "Pricing Confusion",     value: 71, color: "#ea580c" },
  { name: "Low Feature Adoption",  value: 65, color: "#d97706" },
  { name: "No Proactive CSM",      value: 58, color: "#16a34a" },
  { name: "Data / Billing Gaps",   value: 43, color: "#9333ea" },
];

/* ─── HOOKS ──────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

/* ─── FADE UP ────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView(0.08);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(26px)",
        transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── EXT LINK ───────────────────────────────────────────────── */
function ExtLink({ href, children, variant = "inline" }) {
  if (variant === "pill") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-pink-700 border border-pink-300/50 rounded-full px-3.5 py-1 bg-pink-50 hover:bg-pink-100 hover:border-pink-400/60 transition-all duration-200 hover:-translate-y-px"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <circle cx="4" cy="4" r="3" fill="currentColor" opacity="0.6" />
        </svg>
        {children}
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className="opacity-55">
          <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 text-pink-700 font-semibold no-underline relative group"
    >
      {children}
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className="flex-shrink-0 opacity-60 ml-px">
        <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-pink-700 group-hover:w-full transition-all duration-200" />
    </a>
  );
}

function RichBody({ parts }) {
  if (!parts) return null;
  return (
    <p className="text-base leading-relaxed text-grey-700 font-normal mb-5">
      {parts.map((p, i) =>
        p.href
          ? <ExtLink key={i} href={p.href}>{p.text}</ExtLink>
          : <span key={i}>{p.text}</span>
      )}
    </p>
  );
}

/* ─── CHART TOOLTIP ──────────────────────────────────────────── */
function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-grey-200 rounded shadow-lg px-3.5 py-2.5 text-xs">
      {label && <p className="font-bold mb-1.5 text-grey-900">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.stroke }} className="my-0.5">
          {p.name}: <strong>{formatter ? formatter(p.value, p.name) : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

/* ─── RETENTION CURVE CHART ──────────────────────────────────── */
function RetentionCurveChart({ animate }) {
  return (
    <div
      className="border border-grey-200 rounded p-6 bg-white/50 my-7"
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
      }}
    >
      <p className="text-[10px] font-semibold tracking-widest uppercase text-center text-grey-400 mb-5">
        Cohort Retention Curves · By Onboarding Quality
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={RETENTION_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis dataKey="stage" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
          <Line type="monotone" dataKey="strong" name="Strong value realization" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: "#16a34a", r: 4, strokeWidth: 0 }} isAnimationActive={animate} animationDuration={1100} />
          <Line type="monotone" dataKey="delayed" name="Delayed activation" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }} isAnimationActive={animate} animationDuration={1300} />
          <Line type="monotone" dataKey="poor" name="Product-market fit issue" stroke="#dc2626" strokeWidth={2.5} dot={{ fill: "#dc2626", r: 4, strokeWidth: 0 }} isAnimationActive={animate} animationDuration={1500} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-5 mt-3">
        {[
          { color: "#16a34a", label: "Strong value realization" },
          { color: "#f59e0b", label: "Delayed activation" },
          { color: "#dc2626", label: "Product-market fit issue" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-grey-500 font-normal">
            <span style={{ display: "inline-block", width: 20, height: 2.5, background: item.color, borderRadius: 1 }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CASCADE CHART ──────────────────────────────────────────── */
function CascadeChart({ animate }) {
  return (
    <div
      className="border border-grey-200 rounded p-6 bg-white/50 my-7"
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
      }}
    >
      <p className="text-[10px] font-semibold tracking-widest uppercase text-center text-grey-400 mb-5">
        Where Customers Actually Drop Off · The Churn Cascade
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={CASCADE_DATA} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="stage" width={120} tick={{ fontSize: 12, fill: "#1c1917", fontWeight: 600 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}% remaining`} />} />
          <Bar dataKey="remaining" name="Customers Remaining" radius={[0, 3, 3, 0]} maxBarSize={32} isAnimationActive={animate} animationDuration={900} animationEasing="ease-out">
            {CASCADE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
            <LabelList dataKey="remaining" position="right" formatter={v => `${v}%`} style={{ fontSize: 12, fill: "#555", fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── CHURN DRIVERS CHART ────────────────────────────────────── */
function ChurnDriversChart({ animate }) {
  return (
    <div
      className="border border-grey-200 rounded p-6 bg-white/50 my-7"
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
      }}
    >
      <p className="text-[10px] font-semibold tracking-widest uppercase text-center text-grey-400 mb-5">
        Top Churn Drivers · Reported Concern Level
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={CHURN_DRIVERS} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} label={{ value: "Impact Score (%)", position: "insideBottom", offset: -10, fontSize: 11, fill: "#999" }} />
          <YAxis type="category" dataKey="name" width={175} tick={{ fontSize: 12, fill: "#1c1917", fontWeight: 600 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
          <Bar dataKey="value" name="Impact Score" radius={[0, 3, 3, 0]} maxBarSize={34} isAnimationActive={animate} animationDuration={900} animationEasing="ease-out">
            {CHURN_DRIVERS.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
            <LabelList dataKey="value" position="right" formatter={v => `${v}%`} style={{ fontSize: 12, fill: "#555", fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── ANIMATED RULE ──────────────────────────────────────────── */
function AnimatedRule() {
  const [ref, visible] = useInView(0.5);
  return (
    <div
      ref={ref}
      className="mt-10 mb-10 h-px bg-grey-900"
      style={{
        opacity: visible ? 0.1 : 0,
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "opacity 0.6s ease, transform 0.8s cubic-bezier(0.4,0,0.2,1)",
      }}
    />
  );
}

/* ─── STATS BAR ──────────────────────────────────────────────── */
function StatsBar() {
  return (
    <FadeUp delay={0.15}>
      <div className="grid grid-cols-3 border border-grey-200 rounded overflow-hidden mb-12">
        {STATS.map((s, i) => (
          <div
            key={i}
            className={`bg-white/60 px-6 py-7 flex flex-col gap-2 items-center text-center ${i < 2 ? "border-r border-grey-200" : ""}`}
          >
            <div className="text-4xl font-bold tracking-tight text-grey-900 leading-none">{s.value}</div>
            <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-grey-400 leading-tight">{s.label}</span>
            <ExtLink href={s.href} variant="pill">{s.src}</ExtLink>
          </div>
        ))}
      </div>
    </FadeUp>
  );
}

/* ─── SUBSECTION CARDS ───────────────────────────────────────── */
function SubsectionCards({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {items.map((sub, i) => (
        <FadeUp key={i} delay={i * 0.08}>
          <div className="border border-grey-200 rounded p-5 bg-white/50 h-full hover:-translate-y-0.5 hover:shadow-lg hover:border-grey-300 transition-all duration-300">
            <p className="text-[15px] font-semibold text-grey-900 mb-2.5 leading-snug">{sub.title}</p>
            <p className="text-sm leading-relaxed text-grey-500 font-normal">{sub.body}</p>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}

/* ─── SECTION BLOCK ──────────────────────────────────────────── */
function SectionBlock({ section }) {
  const [ref, chartVisible] = useInView(0.08);

  return (
    <FadeUp delay={0.04}>
      <div id={section.id} className="scroll-mt-24 mb-0" ref={ref}>
        {/* Label pill */}
        <div className="mb-3.5">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-grey-500 border border-grey-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse" />
            {section.label}
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-grey-900 mb-5 leading-tight tracking-tight">
          {section.heading}
        </h2>

        {/* Retention chart — onboarding section */}
        {section.id === "onboarding" && <RetentionCurveChart animate={chartVisible} />}

        {/* Body */}
        {section.bodyParts
          ? <RichBody parts={section.bodyParts} />
          : section.body && (
            <p className="text-base leading-relaxed text-grey-600 font-normal mb-5">{section.body}</p>
          )
        }

        {/* Callout note */}
        {section.note && (
          <div className="border-l-[3px] border-pink-600 pl-5 py-4 bg-pink-50 rounded-r my-6">
            <p className="text-sm leading-relaxed text-grey-700 font-normal">
              {section.note}
              {section.noteLink && (
                <> — <ExtLink href={section.noteLink.href}>{section.noteLink.text}</ExtLink></>
              )}
            </p>
          </div>
        )}

        {/* Cascade chart — activation section */}
        {section.id === "activation" && <CascadeChart animate={chartVisible} />}

        {/* Churn drivers chart — proactive section */}
        {section.id === "proactive" && <ChurnDriversChart animate={chartVisible} />}

        {/* Source pills */}
        {section.links && section.links.length > 0 && (
          <div className="flex flex-wrap gap-2.5 my-4">
            {section.links.map((l, i) => (
              <ExtLink key={i} href={l.href} variant="pill">{l.text}</ExtLink>
            ))}
          </div>
        )}

        {/* Subsection cards */}
        {section.subsections && <SubsectionCards items={section.subsections} />}

        <AnimatedRule />
      </div>
    </FadeUp>
  );
}

/* ─── HERO ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <div className="min-h-screen flex flex-col py-12">
      {/* Back button */}
      <FadeUp delay={0}>
        <div className="flex items-center gap-4 mt-16 mb-0">
          <a
            href="/blogs"
            className="inline-flex border px-4 py-2 border-grey-300 rounded-full items-center gap-2 text-grey-500 hover:text-grey-700 no-underline text-[13px] font-normal transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            Back
          </a>
        </div>
      </FadeUp>

      {/* Hero grid */}
      <div className="flex-1 flex flex-col justify-center py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeUp delay={0.1}>
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-600 inline-block" />
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-grey-400">
                  Deep Dive — {META.date}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-grey-900 leading-[1.1] mb-6 tracking-tight">
                Stop the Bleed:<br />
                <em className="font-bold text-pink-700 not-italic">Diagnosing SaaS Churn</em>
              </h1>

              <p className="text-base leading-relaxed text-grey-500 font-normal mb-8 max-w-md">
                {HERO_INTRO}
              </p>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-semibold tracking-[0.15em] text-grey-400 uppercase">{META.read}</span>
                <span className="w-px h-3.5 bg-grey-200" />
                <span className="text-[10px] font-semibold tracking-[0.15em] text-grey-400 uppercase">10 Data Sources</span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="relative">
              <div className="absolute inset-[-8px] border border-grey-200 rounded-md pointer-events-none z-0" />
              <video
                className="w-full rounded relative z-10 block"
                autoPlay muted loop playsInline controls preload="auto"
              >
                <source src={churnVideo} type="video/mp4" />
              </video>
              <div className="absolute top-[-12px] right-[-12px] w-6 h-6 border-t-2 border-r-2 border-pink-600 z-20" />
              <div className="absolute bottom-[-12px] left-[-12px] w-6 h-6 border-b-2 border-l-2 border-pink-600 z-20" />
            </div>
          </FadeUp>
        </div>
      </div>

      <StatsBar />

      {/* Scroll indicator */}
      <div className="flex flex-col items-center gap-2 pb-8 opacity-40">
        <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-grey-900">Scroll</span>
        <div className="relative w-px h-9 bg-grey-200 overflow-hidden rounded-sm">
          <div
            className="absolute top-0 left-0 w-full h-[40%] bg-grey-900 opacity-40 rounded-sm"
            style={{ animation: "scrollDrop 1.9s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR TOC ────────────────────────────────────────────── */
function Sidebar({ active, scrollTo }) {
  return (
    <aside className="hidden lg:block w-40 flex-shrink-0">
      <div className="sticky top-24">
        <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-grey-400 mb-5 pl-2.5">Contents</p>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`w-full text-left flex items-center gap-2 text-[11px] px-2.5 py-1.5 rounded transition-all duration-150 ${active === i ? "text-grey-900 font-bold" : "text-grey-300 font-normal hover:text-grey-500 hover:bg-grey-100"}`}
          >
            <span
              className="flex-shrink-0 w-0.5 rounded-sm transition-all duration-200"
              style={{
                height: active === i ? 20 : 12,
                background: active === i ? "#1d4ed8" : "#e7e5e4",
              }}
            />
            {s.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

/* ─── SOURCES SECTION ────────────────────────────────────────── */


/* ─── PAGE ───────────────────────────────────────────────────── */
export default function ChurnBlog() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useReadingProgress();

  const nav = useMemo(() => [
    { label: "Gap", href: "/#problem" },
    { label: "Solution", href: "/#solution" },
    { label: "Values", href: "/#values" },
    { label: "Kynos", href: "/#kynos" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ], []);

  useEffect(() => {
    const handler = () => {
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.45 && rect.bottom > 0) setActive(i);
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <style>{`
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(280%); opacity: 0; }
        }
      `}</style>

      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-pink-600 z-[9999] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />

      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} nav={nav} />

      <div className="bg-[#F7F5F2] min-h-screen text-grey-900">
        <div className="max-w-[1200px] mx-auto px-6">

          <Hero />

          {/* Section header bar */}
          <FadeUp>
            <div className="flex items-center justify-between pb-3 mb-10 border-b-2 border-grey-900">
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-grey-900">Deep Dive</span>
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-grey-400">{META.read}</span>
            </div>
          </FadeUp>

          {/* Two-column layout */}
          <div className="flex gap-12">
            <Sidebar active={active} scrollTo={scrollTo} />

            <main className="flex-1 min-w-0">
              {SECTIONS.map((section) => (
                <SectionBlock key={section.id} section={section} />
              ))}
            </main>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}