import { useState, useEffect, useRef, useMemo } from "react";
import Header from "./header";
import Footer from "./contact";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, ScatterChart, Scatter, ZAxis,
  Cell, LabelList, ReferenceLine
} from "recharts";
import { ArrowLeft } from "lucide-react";
import cpaasVideo from "../../assets/cpaasblog.mp4";
import React from "react";

/* ─── DATA ──────────────────────────────────────────────────────── */
const META = { date: "March 16, 2026", read: "8 min read", category: "TECHNOLOGY" };

const HERO_INTRO =
  "Communication isn't just a feature anymore—it's infrastructure. Every text verification, video call, and real-time notification is now a fundamental building block of modern applications. Welcome to the era of programmable communication.";

const SIDEBAR_ARTICLES = [
  { title: "How Fintech Platforms Are Using OTP Authentication at Scale", author: "BY NEIL MACLEOD" },
  { title: "CPaaS vs UCaaS: Understanding the Key Differences", author: "BY LUCAS" },
  { title: "Why Asia-Pacific Is the Fastest Growing CPaaS Region", author: "BY MATEO" },
  { title: "The API-First Architecture Powering Modern Communication", author: "BY HAZEL" },
  { title: "Vendor Lock-In: The Hidden Risk in CPaaS Adoption", author: "BY NEIL MACLEOD" },
];

const STATS = [
  { value: "$17.2B", label: "CPaaS Market Value 2026", src: "Future Market Insights", href: "https://www.futuremarketinsights.com/reports/communications-platform-as-a-service-cpaas-market" },
  { value: "$108B+", label: "Projected Size by 2034", src: "Precedence Research", href: "https://www.precedenceresearch.com/communication-platform-as-a-service-market" },
  { value: "18.4%", label: "CAGR Through 2036", src: "Verified Market Research", href: "https://www.verifiedmarketresearch.com/product/communications-platform-as-a-service-cpaas-market" },
];

const HREF = {
  fmi:  "https://www.futuremarketinsights.com/reports/communications-platform-as-a-service-cpaas-market",
  pr:   "https://www.precedenceresearch.com/communication-platform-as-a-service-market",
  vmr:  "https://www.verifiedmarketresearch.com/product/communications-platform-as-a-service-cpaas-market",
  et:   "https://ciosea.economictimes.indiatimes.com/blog/unleashing-the-potential-of-generative-ai-redefining-real-time-communication-in-cpaas/98966363",
  uct:  "https://www.uctoday.com/unified-communications/the-practical-side-of-cpaas-implementation-overcoming-cpaas-deployment-challenges/",
};

const SECTIONS = [
  {
    id: "understanding",
    label: "THE BASICS",
    heading: "What Makes CPaaS Different",
    body: "Think of CPaaS as communication turned into LEGO blocks. Instead of building your own phone network or messaging infrastructure from scratch, you get ready-to-use APIs that snap right into your app. Need to send a verification code? There's an API. Want to add video calling to your platform? Another API. It's communication-as-a-service, where complexity gets abstracted away and you're left with simple, powerful building blocks that just work.",
  },
  {
    id: "market",
    label: "THE BOOM",
    heading: "Money Talks: A Market on Fire",
    bodyParts: [
      { text: "The numbers tell a compelling story. According to " },
      { text: "Future Market Insights", href: HREF.fmi },
      { text: ", we're looking at a $17.2 billion market in 2026 that's projected to explode to $87.8 billion by 2036—that's a 18.4% compound annual growth rate. " },
      { text: "Precedence Research", href: HREF.pr },
      { text: " paints an even rosier picture, forecasting the market could hit $108 billion by 2034. Why the gold rush? Because every app, platform, and digital service now needs real-time communication baked in, not bolted on." },
    ],
    links: [
      { text: "Future Market Insights", href: HREF.fmi },
      { text: "Precedence Research", href: HREF.pr },
      { text: "Verified Market Research", href: HREF.vmr },
    ],
    note: "While North America dominates today's market, the real action is heating up in Asia-Pacific. India, Indonesia, and other mobile-first economies are seeing explosive growth as fintech apps, ride-sharing platforms, and super apps make communication infrastructure their secret weapon.",
    noteLink: { text: "Verified Market Research", href: HREF.vmr },
  },
  {
    id: "drivers",
    label: "THE WHY",
    heading: "Why Everyone's Jumping In",
    subsections: [
      { title: "Your Customers Expect Instant Everything", body: "We live in a world where a three-second delay feels like an eternity. CPaaS lets you meet users where they are—SMS, WhatsApp, voice, video—and respond in real-time. It's not a luxury; it's table stakes." },
      { title: "Build Fast, Scale Faster", body: "Developers love APIs because they're plug-and-play. Why spend six months building a verification system when you can integrate one in a week? CPaaS turns months of infrastructure work into days of API integration, letting teams ship features at startup speed." },
      { title: "Pay Only for What You Use", body: "No upfront infrastructure costs. No idle servers. You send 100 messages or 100 million—the platform scales automatically. During Black Friday traffic spike? CPaaS has you covered without breaking a sweat (or your budget)." },
    ],
  },
  {
    id: "ai",
    label: "THE AI SHIFT",
    heading: "When AI Meets Communication",
    bodyParts: [
      { text: "Here's where things get interesting. AI isn't just a buzzword in the CPaaS world—it's fundamentally changing how communication works. We're moving from 'send a message when X happens' to 'AI decides when, how, and what to communicate.' Think chatbots that actually understand context, notifications that arrive at the perfect moment, and voice assistants that feel human. As " },
      { text: "Economic Times CIO SEA", href: HREF.et },
      { text: " highlights, generative AI is turning communication platforms from dumb pipes into intelligent orchestrators that understand user intent, predict needs, and personalize every interaction." },
    ],
    links: [{ text: "Economic Times CIO SEA — AI in CPaaS", href: HREF.et }],
  },
  {
    id: "challenges",
    label: "THE REALITY CHECK",
    heading: "It's Not All Smooth Sailing",
    bodyParts: [
      { text: "Let's be real: adopting CPaaS isn't always plug-and-play. " },
      { text: "UC Today", href: HREF.uct },
      { text: " breaks down the real-world headaches companies face when implementing these platforms." },
    ],
    links: [{ text: "UC Today — Implementation Challenges", href: HREF.uct }],
    subsections: [
      { title: "Legacy System Nightmares", body: "Your shiny new CPaaS API meets your 15-year-old enterprise CRM, and sparks fly—not the good kind. Integration often means building custom middleware, dealing with outdated protocols, and praying nothing breaks in production." },
      { title: "The Compliance Minefield", body: "Sending messages across borders? You're navigating GDPR in Europe, TCPA in the US, PDPA in Asia, and a dozen other regulations. One wrong move and you're looking at hefty fines or worse—banned from entire markets." },
      { title: "When Networks Misbehave", body: "Your users expect 99.99% uptime, but you're dependent on telecom networks that sometimes hiccup. Latency, dropped connections, and regional outages can turn your smooth communication flow into a customer service nightmare." },
      { title: "Vendor Handcuffs", body: "Lock yourself into one platform and you're stuck with their pricing, their roadmap, and their limitations. Switching vendors means rewriting code, remapping workflows, and explaining downtime to angry users." },
    ],
  },
  {
    id: "trends",
    label: "WHAT'S NEXT",
    heading: "The Future Is Getting Smart",
    bodyParts: [
      { text: "CPaaS has evolved way beyond basic 'send SMS' APIs. The cutting edge is all about intelligence, orchestration, and making communication context-aware. " },
      { text: "Economic Times CIO SEA", href: HREF.et },
      { text: " highlights how leading platforms are racing to become the operating system for all customer communication." },
    ],
    links: [{ text: "Economic Times CIO SEA — The Next Evolution", href: HREF.et }],
    subsections: [
      { title: "Smart Triggers, Not Dumb Events", body: "Modern systems don't just react—they think. Is the user likely to convert right now? Did they abandon their cart at 2 AM or 2 PM? The platform analyzes behavior patterns, risk signals, and engagement history before deciding if and how to reach out." },
      { title: "Journey-Based Communication", body: "Forget isolated messages. The new paradigm is workflow-driven: onboarding sequences that adapt based on user actions, verification flows that escalate intelligently, and support conversations that remember context from three interactions ago." },
      { title: "Everything Talks to Everything", body: "Your CPaaS doesn't live in isolation—it plugs into your CRM, your customer data platform, your analytics stack, and your support ticketing system. The result? Communication that knows your customer's entire history, not just their phone number." },
      { title: "The Communication OS Era", body: "The big players are betting on a future where they don't just provide APIs—they become the central nervous system for all customer interaction. Think orchestration engine, data layer, AI brain, and delivery network rolled into one." },
    ],
  },
  {
    id: "future",
    label: "FINAL THOUGHTS",
    heading: "Where This Is All Heading",
    bodyParts: [
      { text: "Communication infrastructure is having its cloud moment. Just like nobody builds their own servers anymore, soon nobody will build their own messaging infrastructure. The market data from " },
      { text: "Future Market Insights", href: HREF.fmi },
      { text: " and " },
      { text: "Precedence Research", href: HREF.pr },
      { text: " shows we're barely scratching the surface—expect explosive growth through the 2030s. The endgame? Communication that's not just programmable, but intelligent. Systems that don't wait for you to tell them what to do, but learn from millions of interactions and optimize themselves. Your app won't just send notifications—it'll know exactly when, how, and what to say to each user. That's not science fiction. That's the next five years." },
    ],
  },
];

const LATEST = [
  { category: "MARKET", title: "CPaaS Set to Hit $87.8B by 2036", date: "March 10, 2026", excerpt: "New forecasts reveal the programmable communication market is experiencing unprecedented growth as digital transformation accelerates globally.", href: HREF.fmi },
  { category: "AI", title: "How AI Is Making Communication Platforms Intelligent", date: "February 28, 2026", excerpt: "Generative AI is transforming CPaaS from simple message delivery into smart orchestration engines that understand context and intent.", href: HREF.et },
  { category: "DEPLOYMENT", title: "The Real Cost of CPaaS Implementation", date: "February 14, 2026", excerpt: "From legacy integration headaches to compliance hurdles, here's what companies actually face when deploying programmable communication.", href: HREF.uct },
  { category: "REGIONAL", title: "Asia-Pacific's CPaaS Explosion", date: "January 30, 2026", excerpt: "India and Southeast Asia are driving the fastest regional growth as mobile-first economies bet big on embedded communication.", href: HREF.vmr },
];

const SOURCES = [
  { text: "Future Market Insights — CPaaS Market", href: HREF.fmi },
  { text: "Precedence Research — Market Projections", href: HREF.pr },
  { text: "Verified Market Research — Regional Analysis", href: HREF.vmr },
  { text: "UC Today — Implementation Challenges", href: HREF.uct },
  { text: "Economic Times — AI in CPaaS", href: HREF.et },
];

/* ─── CHART DATA ─────────────────────────────────────────────── */
const MARKET_DATA = [
  { year: "2026", revenue: 17.2, cagr: 18.4 },
  { year: "2028", revenue: 24.1, cagr: 18.4 },
  { year: "2030", revenue: 33.8, cagr: 18.4 },
  { year: "2032", revenue: 47.4, cagr: 18.4 },
  { year: "2034", revenue: 66.5, cagr: 18.4 },
  { year: "2036", revenue: 87.8, cagr: 18.4 },
];

const REGIONAL_DATA = [
  { region: "North America", share: 42, cagr: 13.5, size: 4200, color: "#2563eb" },
  { region: "Asia-Pacific", share: 25, cagr: 24.0, size: 3200, color: "#16a34a" },
  { region: "Europe", share: 20, cagr: 15.2, size: 2200, color: "#ea580c" },
  { region: "Latin America", share: 7, cagr: 19.5, size: 900, color: "#dc2626" },
  { region: "Middle East & Africa", share: 6, cagr: 16.0, size: 700, color: "#9333ea" },
];

const CHALLENGES_DATA = [
  { name: "Security & Compliance", value: 85, color: "#dc2626" },
  { name: "Legacy System Integration", value: 75, color: "#ea580c" },
  { name: "Network Reliability", value: 60, color: "#16a34a" },
  { name: "Vendor Lock-In", value: 45, color: "#9333ea" },
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

/* ─── FADE UP WRAPPER ────────────────────────────────────────── */
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
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-orange-700 border border-orange-300/50 rounded-full px-3.5 py-1 bg-orange-50 hover:bg-orange-100 hover:border-orange-400/60 transition-all duration-200 hover:-translate-y-px"
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
      className="inline-flex items-center gap-0.5 text-orange-700 font-semibold no-underline relative group"
    >
      {children}
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className="flex-shrink-0 opacity-60 ml-px">
        <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-orange-700 group-hover:w-full transition-all duration-200" />
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
        <p key={i} style={{ color: p.color || p.fill }} className="my-0.5">
          {p.name}: <strong>{formatter ? formatter(p.value, p.name) : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

/* ─── MARKET REVENUE CHART ───────────────────────────────────── */
function MarketRevenueChart({ animate }) {
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
        Market Revenue Trajectory · 2026–2036
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={MARKET_DATA} margin={{ top: 20, right: 50, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#2563eb" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}B`} domain={[0, 100]} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#ea580c" }} axisLine={false} tickLine={false} domain={[10, 24]} tickFormatter={v => `${v}%`} />
          <Tooltip content={<ChartTooltip formatter={(v, n) => n === "Revenue" ? `$${v}B` : `${v}%`} />} />
          <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={52} isAnimationActive={animate} animationDuration={900} animationEasing="ease-out" fillOpacity={0.85}>
            <LabelList dataKey="revenue" position="top" formatter={v => `$${v}B`} style={{ fontSize: 11, fill: "#2563eb", fontWeight: 700 }} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="cagr" name="CAGR" stroke="#ea580c" strokeWidth={2} strokeDasharray="6 4" dot={{ fill: "#ea580c", r: 4, strokeWidth: 0 }} isAnimationActive={animate} animationDuration={1200} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-3">
        {[{ color: "#2563eb", label: "Revenue (USD Billions)" }, { color: "#ea580c", label: "CAGR (%)", dashed: true }].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-grey-500 font-normal">
            <span style={{ display: "inline-block", width: 20, height: 2, background: item.color, borderTop: item.dashed ? `2px dashed ${item.color}` : "none", borderRadius: 1 }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── REGIONAL CHART ─────────────────────────────────────────── */
function RegionalChart({ animate }) {
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const r = Math.sqrt(payload.size / Math.PI) * 0.78;
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={payload.color} fillOpacity={0.7} stroke={payload.color} strokeWidth={1.5} />
        <text x={cx + r + 8} y={cy - 3} fontSize={11} fontWeight={600} fill={payload.color}>
          {payload.region}
        </text>
        {payload.region === "Asia-Pacific" && (
          <text x={cx + r + 8} y={cy + 12} fontSize={10} fill={payload.color} opacity={0.7}>(Fastest Growing)</text>
        )}
        <text x={cx + r + 8} y={payload.region === "Asia-Pacific" ? cy + 24 : cy + 12} fontSize={10} fill="#999">{payload.cagr}% CAGR</text>
      </g>
    );
  };
  return (
    <div
      className="border border-grey-200 rounded p-6 bg-white/50 my-7"
      style={{
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
      }}
    >
      <p className="text-[10px] font-semibold tracking-widest uppercase text-center text-grey-400 mb-5">
        Regional Battle · Market Share vs Growth Rate
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis type="number" dataKey="share" name="Market Share" domain={[0, 55]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} label={{ value: "Current Market Share (%)", position: "insideBottom", offset: -10, fontSize: 11, fill: "#999" }} />
          <YAxis type="number" dataKey="cagr" name="Growth Rate" domain={[10, 26]} tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} label={{ value: "CAGR (%)", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#999" }} />
          <ZAxis type="number" dataKey="size" range={[400, 3000]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div className="bg-white border border-grey-200 rounded shadow-lg px-3.5 py-2.5 text-xs">
                <p className="font-bold mb-1" style={{ color: d.color }}>{d.region}</p>
                <p className="text-grey-600 font-normal">Share: <strong className="font-semibold">{d.share}%</strong></p>
                <p className="text-grey-600 font-normal">CAGR: <strong className="font-semibold">{d.cagr}%</strong></p>
              </div>
            );
          }} />
          <Scatter data={REGIONAL_DATA} isAnimationActive={animate} animationDuration={900} shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── CHALLENGES CHART ───────────────────────────────────────── */
function ChallengesChart({ animate }) {
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
        Implementation Pain Points · Concern Level
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={CHALLENGES_DATA} layout="vertical" margin={{ top: 5, right: 60, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} label={{ value: "Concern Level (%)", position: "insideBottom", offset: -10, fontSize: 11, fill: "#999" }} />
          <YAxis type="category" dataKey="name" width={165} tick={{ fontSize: 12, fill: "#1c1917", fontWeight: 600 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
          <Bar dataKey="value" name="Concern Level" radius={[0, 3, 3, 0]} maxBarSize={36} isAnimationActive={animate} animationDuration={900} animationEasing="ease-out">
            {CHALLENGES_DATA.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
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
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
            {section.label}
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-grey-900 mb-5 leading-tight tracking-tight">
          {section.heading}
        </h2>

        {/* Market chart (before body) */}
        {section.id === "market" && <MarketRevenueChart animate={chartVisible} />}

        {/* Body */}
        {section.bodyParts
          ? <RichBody parts={section.bodyParts} />
          : section.body && (
            <p className="text-base leading-relaxed text-grey-600 font-normal mb-5">{section.body}</p>
          )
        }

        {/* Callout note */}
        {section.note && (
          <>
            <div className="border-l-[3px] border-orange-600 pl-5 py-4 bg-orange-50 rounded-r my-6">
              <p className="text-sm leading-relaxed text-grey-700 font-normal">
                {section.note}
                {section.noteLink && (
                  <> — <ExtLink href={section.noteLink.href}>{section.noteLink.text}</ExtLink></>
                )}
              </p>
            </div>
            {section.id === "market" && <RegionalChart animate={chartVisible} />}
          </>
        )}

        {/* Source pills */}
        {section.links && section.links.length > 0 && (
          <div className="flex flex-wrap gap-2.5 my-4">
            {section.links.map((l, i) => (
              <ExtLink key={i} href={l.href} variant="pill">{l.text}</ExtLink>
            ))}
          </div>
        )}

        {/* Challenges chart */}
        {section.id === "challenges" && <ChallengesChart animate={chartVisible} />}

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
      {/* Top navigation bar */}
      <FadeUp delay={0}>
        <div className="flex items-center gap-4 mt-16 mb-0">
          <a
            href="/blogs"
            className="inline-flex  border px-4 py-2 border-gray-400 rounded-full items-center gap-2 text-grey-500 hover:text-grey-700 no-underline text-[13px] font-normal transition-colors duration-200"
          >
            <ArrowLeft size={15} />
            Back 
          </a>
        </div>
      </FadeUp>

      {/* Main hero grid */}
      <div className="flex-1 flex flex-col justify-center py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeUp delay={0.1}>
            <div>
              {/* Category dot */}
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 inline-block" />
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-grey-400">
                  Deep Dive — {META.date}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-grey-900 leading-[1.1] mb-6 tracking-tight">
                Communication as Code:<br />
                <em className="font-bold text-orange-700 not-italic">The CPaaS Revolution</em>
              </h1>

              <p className="text-base leading-relaxed text-grey-500 font-normal mb-8 max-w-md">
                {HERO_INTRO}
              </p>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-semibold tracking-[0.15em] text-grey-400 uppercase">{META.read}</span>
                <span className="w-px h-3.5 bg-grey-200" />
                <span className="text-[10px] font-semibold tracking-[0.15em] text-grey-400 uppercase">5 Data Sources</span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute inset-[-8px] border border-grey-200 rounded-md pointer-events-none z-0" />
              <video
                className="w-full rounded relative z-10 block"
                autoPlay muted loop playsInline controls preload="auto"
              >
                <source src={cpaasVideo} type="video/mp4" />
              </video>
              {/* Corner accents */}
              <div className="absolute top-[-12px] right-[-12px] w-6 h-6 border-t-2 border-r-2 border-orange-600 z-20" />
              <div className="absolute bottom-[-12px] left-[-12px] w-6 h-6 border-b-2 border-l-2 border-orange-600 z-20" />
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

/* ─── SIDEBAR / TOC ──────────────────────────────────────────── */
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
                background: active === i ? "#c2410c" : "#e7e5e4",
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
function SourcesSection() {
  return (
    <FadeUp>
      <div className="pt-4 mt-2  ">
        <p className="text-[9px] font-semibold tracking-[0.22em] uppercase text-grey-400 mb-4">
          Sources & Deep Dives
        </p>
        <div className="flex flex-wrap gap-2.5">
          {SOURCES.map((s, i) => (
            <ExtLink key={i} href={s.href} variant="pill">{s.text}</ExtLink>
          ))}
        </div>
      </div>
    </FadeUp>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────── */
export default function CPaaSBlog() {
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
        className="fixed top-0 left-0 h-0.5 bg-orange-600 z-[9999] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />

      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} nav={nav} />

      <div className="bg-[#F7F5F2] min-h-screen text-grey-900">
        <div className="max-w-[1200px] mx-auto px-6">

          <Hero />

          {/* Section header */}
          <FadeUp>
            <div className="flex items-center justify-between pb-3 mb-10 border-b-2 border-grey-900">
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-grey-900">Deep Dive</span>
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-grey-400">{META.read}</span>
            </div>
          </FadeUp>

          {/* Two-column layout */}
          <div className="flex gap-12 ">
            <Sidebar active={active} scrollTo={scrollTo} />

            <main className="flex-1 min-w-0 ">
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