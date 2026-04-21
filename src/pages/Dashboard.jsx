import { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, LayoutGrid, Brain, Database, Users, TrendingUp, Circle, MoreHorizontal } from "lucide-react";
import { Chart, registerables } from "chart.js";
import VynqeLogo from "../assets/vynqelogodark.svg";
import VynqeLogoIcon from "../assets/vynqelogob.svg";
Chart.register(...registerables);

// ── data ──────────────────────────────────────────────────────────────────────
const DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 2, 1 + i);
  return `${d.getMonth() + 1}/${d.getDate()}`;
});
const HRS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const PRODS = ["ec-1","ec-2","ec-3","ec-4","ec-5","ec-6","ms-1","ms-2","ms-3","ms-4","ms-5","ms-6"];
const F1S   = [0.835,0.879,0.862,0.819,0.789,0.845,0.805,0.860,0.835,0.861,0.809,0.804];

const clientData = [
  { name:"Apex Retail",    meta:"Retail Tech · Delhi",     ds:"Users, Products, Interactions", models:"M1, M2", m1:4200,  m2:1380, conf:0.84, state:"Next Product", since:"Jan 2026" },
  { name:"NovaTech ISV",   meta:"IT/ITES · London",        ds:"Users, Interactions",           models:"M1, M2", m1:3100,  m2:900,  conf:0.82, state:"Share",        since:"Feb 2026" },
  { name:"Meridian SAAS",  meta:"SAAS · Toronto",          ds:"Users",                         models:"M1",     m1:800,   m2:210,  conf:0.77, state:"Exit",         since:"Mar 2026" },
  { name:"CoreLogic CPaaS",meta:"CPaaS · New York",        ds:"Products, Interactions",        models:"M1, M2", m1:2800,  m2:760,  conf:0.79, state:"Rewatch",      since:"Jan 2026" },
  { name:"Strata MSP",     meta:"MSP · Singapore",         ds:"Users",                         models:"M1",     m1:0,     m2:0,    conf:0.72, state:"—",            since:"Dec 2025" },
  { name:"Velo ERP",       meta:"ERP · Dubai",             ds:"Products, Interactions",        models:"M1, M2", m1:1600,  m2:420,  conf:0.81, state:"Next Product", since:"Feb 2026" },
];

const rand = (base, range) => Math.round(base + Math.random() * range);

// ── chart configs ──────────────────────────────────────────────────────────────
const baseOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#b0b0ab", font: { size: 10 }, maxTicksLimit: 6 } },
    y: { grid: { color: "#f0efec" }, ticks: { color: "#b0b0ab", font: { size: 10 } } },
  },
};

function chartConfig(id) {
  if (id === "lineChart") return {
    type: "line",
    data: { labels: DAYS, datasets: [
      { label:"Decision continuity", data: DAYS.map(() => rand(3000,1200)), borderColor:"#1a1a1a", borderWidth:1.5, pointRadius:0, tension:0.4, fill:false },
      { label:"Exit signals",        data: DAYS.map(() => rand(800,600)),   borderColor:"#d1d5db", borderWidth:1,   pointRadius:0, tension:0.4, fill:false, borderDash:[4,4] },
    ]},
    options: baseOpts,
  };
  if (id === "barChart") return {
    type: "bar",
    data: { labels:["Exit","Next Product","Rewatch","Share"], datasets:[{ data:[6061,5798,4391,3750], backgroundColor:["#e5e7eb","#1a1a1a","#6b7280","#d1d5db"], borderRadius:5, borderSkipped:false }] },
    options: baseOpts,
  };
  if (id === "intelChart") return {
    type: "bar",
    data: { labels: PRODS, datasets:[{ data:[0.85,0.88,0.86,0.82,0.79,0.84,0.80,0.86,0.84,0.86,0.81,0.80], backgroundColor:"#1a1a1a", borderRadius:3, borderSkipped:false }] },
    options: { ...baseOpts, indexAxis:"y", scales:{ x:{ ...baseOpts.scales.x, max:1.0 }, y:{ ...baseOpts.scales.y, grid:{display:false}, ticks:{color:"#9b9b97",font:{size:10}} } } },
  };
  if (id === "tfChart") return {
    type: "line",
    data: { labels: HRS, datasets:[{ data: HRS.map(() => rand(900,700)), borderColor:"#1a1a1a", borderWidth:1.5, pointRadius:0, tension:0.4, fill:{target:"origin",above:"rgba(0,0,0,0.03)"} }] },
    options: { ...baseOpts, scales:{ x:{grid:{display:false},ticks:{color:"#b0b0ab",font:{size:9},maxTicksLimit:6}}, y:{grid:{color:"#f0efec"},ticks:{color:"#b0b0ab",font:{size:9}}} } },
  };
  if (id === "m2Chart") return {
    type: "bar",
    data: { labels: PRODS, datasets:[{ data: F1S, backgroundColor: F1S.map(v=>v>=0.85?"#1a1a1a":v>=0.82?"#6b7280":"#d1d5db"), borderRadius:4, borderSkipped:false }] },
    options: { ...baseOpts, scales:{ x:{...baseOpts.scales.x}, y:{...baseOpts.scales.y, min:0.75, max:0.92, ticks:{color:"#b0b0ab",font:{size:10},callback:v=>v.toFixed(2)}} } },
  };
  if (id === "dsBarChart") return {
    type: "bar",
    data: { labels:["Users.csv","Products.csv","Interactions.csv"], datasets:[{ data:[2000,12,20000], backgroundColor:["#1a1a1a","#6b7280","#d1d5db"], borderRadius:5, borderSkipped:false }] },
    options: baseOpts,
  };
  if (id === "syncChart") return {
    type: "line",
    data: { labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], datasets:[{ data:[3,3,3,3,3,1,3], borderColor:"#1a1a1a", borderWidth:1.5, pointRadius:3, tension:0.3, fill:false }] },
    options: { ...baseOpts, scales:{ x:{...baseOpts.scales.x}, y:{...baseOpts.scales.y, min:0, max:5, ticks:{color:"#b0b0ab",font:{size:10},stepSize:1}} } },
  };
  if (id === "intelLineChart") return {
    type: "line",
    data: { labels: DAYS.filter((_,i)=>i%5===0), datasets:[
      { label:"Apex Retail", data:[0.81,0.83,0.83,0.84,0.84,0.84], borderColor:"#1a1a1a", borderWidth:1.5, pointRadius:2, tension:0.4, fill:false },
      { label:"NovaTech",    data:[0.79,0.80,0.81,0.81,0.82,0.82], borderColor:"#9b9b97", borderWidth:1,   pointRadius:2, tension:0.4, fill:false, borderDash:[3,3] },
      { label:"CoreLogic",   data:[0.76,0.77,0.78,0.79,0.79,0.80], borderColor:"#d1d5db", borderWidth:1,   pointRadius:2, tension:0.4, fill:false, borderDash:[6,3] },
    ]},
    options: { ...baseOpts, plugins:{...baseOpts.plugins,legend:{display:false}}, scales:{ x:{...baseOpts.scales.x}, y:{...baseOpts.scales.y, min:0.7, max:0.9, ticks:{callback:v=>v.toFixed(2),color:"#b0b0ab",font:{size:10}}} } },
  };
  if (id === "intelBarChart") return {
    type: "bar",
    data: { labels:["Apex Retail","NovaTech","CoreLogic","Meridian"], datasets:[
      { label:"Next", data:[1380,450,380,80],  backgroundColor:"#1a1a1a", borderRadius:3, borderSkipped:false },
      { label:"Share",data:[800,900,200,60],   backgroundColor:"#6b7280", borderRadius:3, borderSkipped:false },
      { label:"Exit", data:[400,300,700,500],  backgroundColor:"#d1d5db", borderRadius:3, borderSkipped:false },
    ]},
    options: { ...baseOpts, plugins:{...baseOpts.plugins,legend:{display:false}}, scales:{ x:{...baseOpts.scales.x,stacked:true}, y:{...baseOpts.scales.y,stacked:true} } },
  };
  if (id === "confChart") return {
    type: "bar",
    data: { labels:["0–0.5","0.5–0.6","0.6–0.7","0.7–0.8","0.8–0.9","0.9–1.0"], datasets:[{ data:[165,120,280,480,1739,1216], backgroundColor:["#e5e7eb","#d1d5db","#9ca3af","#6b7280","#374151","#1a1a1a"], borderRadius:4, borderSkipped:false }] },
    options: baseOpts,
  };
  if (id === "m2BarChart") return {
    type: "bar",
    data: { labels: PRODS, datasets:[{ data: F1S, backgroundColor:"#1a1a1a", borderRadius:3, borderSkipped:false }] },
    options: { ...baseOpts, scales:{ x:{...baseOpts.scales.x}, y:{...baseOpts.scales.y, min:0.75, max:0.90, ticks:{callback:v=>v.toFixed(2),color:"#b0b0ab",font:{size:10}}} } },
  };
  if (id === "tfLineChart") return {
    type: "line",
    data: { labels: HRS, datasets:[
      { label:"Events", data: HRS.map(() => rand(700,900)), borderColor:"#1a1a1a", borderWidth:1.5, pointRadius:0, tension:0.4, fill:{target:"origin",above:"rgba(0,0,0,0.03)"} },
      { label:"Failed", data: HRS.map(() => rand(0,20)),    borderColor:"#d1d5db", borderWidth:1,   pointRadius:0, tension:0.3, fill:false, borderDash:[4,4] },
    ]},
    options: { ...baseOpts, plugins:{...baseOpts.plugins,legend:{display:false}} },
  };
  if (id === "tfPieChart") return {
    type: "doughnut",
    data: { labels:["Next Product","Share","Rewatch","Exit"], datasets:[{ data:[5798,3750,4391,6061], backgroundColor:["#1a1a1a","#6b7280","#9ca3af","#e5e7eb"], borderWidth:0, hoverOffset:4 }] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:true, position:"right", labels:{font:{size:11},color:"#6b6b68",boxWidth:10,padding:12} } }, cutout:"62%" },
  };
  // NEW CHARTS
  if (id === "radarChart") return {
    type: "radar",
    data: {
      labels: ["Accuracy","Confidence","Stability","Coverage","Freshness"],
      datasets: [{
        data: [0.834, 0.812, 0.810, 1.0, 0.920],
        backgroundColor: "rgba(26,26,26,0.08)",
        borderColor: "#1a1a1a",
        borderWidth: 1.5,
        pointBackgroundColor: "#1a1a1a",
        pointRadius: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0.6, max: 1.0,
          ticks: { display: false, stepSize: 0.1 },
          grid: { color: "#f0efec" },
          pointLabels: { color: "#6b6b68", font: { size: 11 } },
          angleLines: { color: "#e5e5e3" },
        }
      }
    },
  };
  if (id === "riskVelocityChart") return {
    type: "line",
    data: {
      labels: DAYS.filter((_,i) => i % 3 === 0),
      datasets: [{
        label: "Risk Velocity",
        data: [0.12,0.14,0.13,0.15,0.18,0.17,0.16,0.19,0.21,0.20],
        borderColor: "#374151",
        borderWidth: 1.5,
        pointRadius: 2,
        tension: 0.4,
        fill: { target: "origin", above: "rgba(55,65,81,0.06)" },
      }]
    },
    options: { ...baseOpts, scales: { x:{...baseOpts.scales.x}, y:{...baseOpts.scales.y, min:0, max:0.3, ticks:{color:"#b0b0ab",font:{size:10},callback:v=>v.toFixed(2)}} } },
  };
  if (id === "modelStabilityChart") return {
    type: "line",
    data: {
      labels: DAYS.filter((_,i) => i % 5 === 0),
      datasets: [
        { label:"M1 F1", data:[0.821,0.825,0.828,0.831,0.833,0.833], borderColor:"#1a1a1a", borderWidth:1.5, pointRadius:2, tension:0.4, fill:false },
        { label:"M2 F1", data:[0.818,0.822,0.826,0.830,0.833,0.834], borderColor:"#9b9b97", borderWidth:1, pointRadius:2, tension:0.4, fill:false, borderDash:[3,3] },
      ]
    },
    options: { ...baseOpts, plugins:{...baseOpts.plugins, legend:{display:false}}, scales:{ x:{...baseOpts.scales.x}, y:{...baseOpts.scales.y, min:0.80, max:0.85, ticks:{callback:v=>v.toFixed(3),color:"#b0b0ab",font:{size:10}}} } },
  };
  if (id === "failureChart") return {
    type: "bar",
    data: {
      labels: ["Timeout","Schema Error","Missing Data","Network"],
      datasets: [{ data:[48,31,22,14], backgroundColor:["#1a1a1a","#6b7280","#9ca3af","#d1d5db"], borderRadius:5, borderSkipped:false }]
    },
    options: baseOpts,
  };
  if (id === "latencyChart") return {
    type: "line",
    data: {
      labels: HRS,
      datasets: [{ data: HRS.map(() => rand(12,8)), borderColor:"#1a1a1a", borderWidth:1.5, pointRadius:0, tension:0.4, fill:{target:"origin",above:"rgba(0,0,0,0.03)"} }]
    },
    options: { ...baseOpts, scales:{ x:{grid:{display:false},ticks:{color:"#b0b0ab",font:{size:9},maxTicksLimit:6}}, y:{grid:{color:"#f0efec"},ticks:{color:"#b0b0ab",font:{size:9},callback:v=>`${v}ms`}} } },
  };
}

// ── ChartCanvas component ──────────────────────────────────────────────────────
function ChartCanvas({ id, height = 200 }) {
  const ref = useRef(null);
  const instance = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (instance.current) { instance.current.destroy(); instance.current = null; }
    const cfg = chartConfig(id);
    if (cfg) instance.current = new Chart(ref.current.getContext("2d"), cfg);
    return () => { if (instance.current) { instance.current.destroy(); instance.current = null; } };
  }, [id]);
  return <div style={{ height }} className="w-full relative"><canvas ref={ref} /></div>;
}

// ── small reusable pieces ──────────────────────────────────────────────────────
const Badge = ({ children, color }) => {
  const map = { green:"bg-green-100 text-green-800", amber:"bg-yellow-100 text-yellow-800", blue:"bg-blue-100 text-blue-800", gray:"bg-stone-100 text-stone-500" };
  return <span className={`inline-block text-[10.5px] px-[7px] py-[2px] rounded-[5px] mt-1.5 ${map[color]}`}>{children}</span>;
};
const Pill = ({ children, color }) => {
  const map = { green:"bg-green-100 text-green-800", blue:"bg-blue-100 text-blue-800", gray:"bg-stone-100 text-stone-500", amber:"bg-yellow-100 text-yellow-800", red:"bg-red-100 text-red-700" };
  return <span className={`inline-block text-[11px] px-2 py-[2px] rounded-full ${map[color]}`}>{children}</span>;
};
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-[#e5e5e3]/80 rounded-[14px] p-5 ${className}`}>{children}</div>
);
const CardTitle = ({ children }) => <div className="text-[13px] font-medium text-[#1a1a1a] mb-1">{children}</div>;
const CardSub   = ({ children }) => <div className="text-[12px] text-[#9b9b97] mb-4">{children}</div>;

const HealthBar = ({ pct, color = "green" }) => (
  <div className="flex-1 h-1 bg-[#f0efec] rounded-full overflow-hidden mx-3">
    <div className={`h-full rounded-full ${color === "green" ? "bg-green-500" : "bg-amber-400"}`} style={{ width: `${pct}%` }} />
  </div>
);

const FeatBar = ({ label, val, max, display }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-[12px] text-[#6b6b68] min-w-[140px]">{label}</span>
    <div className="flex-1 h-[5px] bg-[#f0efec] rounded-full overflow-hidden">
      <div className="h-full rounded-full bg-[#1a1a1a]" style={{ width: `${(val / max) * 100}%` }} />
    </div>
    <span className="text-[11.5px] text-[#9b9b97] min-w-[50px] text-right">{display}</span>
  </div>
);

// ── NEW: Decision Readiness Funnel ─────────────────────────────────────────────
function ReadinessFunnel({ steps }) {
  return (
    <div className="flex flex-col gap-1.5">
      {steps.map((step, i) => {
        const widthPct = step.pct;
        return (
          <div key={step.label} className="flex items-center gap-3">
            <div className="min-w-[110px] text-right text-[12px] text-[#6b6b68]">{step.label}</div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-[#f0efec] rounded-full h-[22px] overflow-hidden relative">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2.5"
                  style={{ width: `${widthPct}%`, backgroundColor: i === 0 ? "#1a1a1a" : i === steps.length - 1 ? "#374151" : `rgba(26,26,26,${1 - i * 0.15})` }}
                >
                  <span className="text-[10.5px] text-white font-medium">{step.pct}%</span>
                </div>
              </div>
              <span className="text-[11.5px] text-[#9b9b97] min-w-[38px]">{step.count.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── NEW: Governance Funnel ─────────────────────────────────────────────────────
function GovernanceFunnel() {
  const steps = [
    { label:"Onboarded",  pct:100, count:12, color:"#1a1a1a" },
    { label:"Active",     pct:75,  count:9,  color:"#374151" },
    { label:"Optimized",  pct:50,  count:6,  color:"#6b7280" },
    { label:"At Risk",    pct:17,  count:2,  color:"#9ca3af" },
  ];
  return (
    <Card>
      <CardTitle>Governance Funnel</CardTitle>
      <CardSub>Client lifecycle progression</CardSub>
      <div className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className="min-w-[80px] text-right text-[12px] text-[#6b6b68]">{step.label}</div>
            <div className="flex-1 bg-[#f0efec] rounded-full h-[22px] overflow-hidden">
              <div
                className="h-full rounded-full flex items-center justify-end pr-2.5 transition-all"
                style={{ width: `${step.pct}%`, backgroundColor: step.color }}
              >
                <span className="text-[10.5px] text-white font-medium">{step.count}</span>
              </div>
            </div>
            <span className="text-[11.5px] text-[#9b9b97] min-w-[30px]">{step.pct}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── NEW: State Transition Flow ─────────────────────────────────────────────────
function StateTransitionFlow() {
  const transitions = [
    { from:"Rewatch",      to:"Next Product", count:2840, pct:65 },
    { from:"Next Product", to:"Share",        count:1920, pct:33 },
    { from:"Share",        to:"Exit",         count:980,  pct:26 },
    { from:"Next Product", to:"Exit",         count:680,  pct:12 },
  ];
  const states = [
    { label:"Rewatch",      val:4391, color:"#9ca3af" },
    { label:"Next Product", val:5798, color:"#374151"  },
    { label:"Share",        val:3750, color:"#6b7280"  },
    { label:"Exit",         val:6061, color:"#1a1a1a"  },
  ];
  const maxVal = Math.max(...states.map(s => s.val));
  return (
    <Card>
      <CardTitle>State Transition Flow</CardTitle>
      <CardSub>Decision path progression</CardSub>
      <div className="flex items-end gap-3 mb-4">
        {states.map(s => (
          <div key={s.label} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[11px] text-[#9b9b97]">{s.val.toLocaleString()}</span>
            <div className="w-full rounded-t-[4px]" style={{ height: `${(s.val / maxVal) * 80}px`, backgroundColor: s.color }} />
            <span className="text-[10.5px] text-[#6b6b68] text-center leading-tight">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[#f0efec] pt-3 flex flex-col gap-1.5">
        <div className="text-[11.5px] text-[#9b9b97] mb-1.5">Top transitions</div>
        {transitions.map(t => (
          <div key={`${t.from}-${t.to}`} className="flex items-center gap-2 text-[12px]">
            <span className="text-[#6b6b68] min-w-[90px]">{t.from}</span>
            <span className="text-[#b0b0ab]">→</span>
            <span className="text-[#6b6b68] min-w-[90px]">{t.to}</span>
            <div className="flex-1 h-[4px] bg-[#f0efec] rounded-full overflow-hidden">
              <div className="h-full bg-[#1a1a1a] rounded-full" style={{ width: `${t.pct}%` }} />
            </div>
            <span className="text-[#9b9b97] min-w-[36px] text-right">{t.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── NEW: Content Aging Heatmap ─────────────────────────────────────────────────
function ContentAgingHeatmap() {
  const datasets = ["Users.csv","Products.csv","Interactions.csv"];
  const weeks = ["W1","W2","W3","W4","W5","W6","W7","W8"];
  // freshness: 1=dark(fresh), 0=light(stale)
  const freshness = [
    [1,1,1,1,1,1,1,1],
    [0.2,0.4,0.2,0.6,0.3,0.2,0.8,1],
    [1,1,1,1,1,1,1,1],
  ];
  const cellColor = (v) => {
    if (v >= 0.9) return "#1a1a1a";
    if (v >= 0.7) return "#374151";
    if (v >= 0.5) return "#6b7280";
    if (v >= 0.3) return "#d1d5db";
    return "#f0efec";
  };
  return (
    <Card>
      <CardTitle>Content Aging Heatmap</CardTitle>
      <CardSub>Data freshness by dataset · last 8 weeks</CardSub>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[11px] text-[#9b9b97] font-normal text-left pb-2 min-w-[110px]">Dataset</th>
              {weeks.map(w => <th key={w} className="text-[11px] text-[#9b9b97] font-normal pb-2 px-1">{w}</th>)}
            </tr>
          </thead>
          <tbody>
            {datasets.map((ds, di) => (
              <tr key={ds}>
                <td className="text-[12px] text-[#6b6b68] pr-3 py-1">{ds}</td>
                {freshness[di].map((v, wi) => (
                  <td key={wi} className="px-1 py-1">
                    <div
                      className="w-full h-[22px] rounded-[4px]"
                      style={{ backgroundColor: cellColor(v) }}
                      title={`${Math.round(v*100)}% fresh`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[11px] text-[#9b9b97]">Stale</span>
          {[0.1,0.3,0.5,0.7,0.9].map(v => (
            <div key={v} className="w-5 h-3 rounded-[3px]" style={{ backgroundColor: cellColor(v) }} />
          ))}
          <span className="text-[11px] text-[#9b9b97]">Fresh</span>
        </div>
      </div>
    </Card>
  );
}

// ── screens ────────────────────────────────────────────────────────────────────
function OverviewScreen() {
  const kpis = [
    { label:"Composite Trust Index", value:"84.2%", sub:"Accuracy + Confidence + Stability", badge:"Core",        color:"green" },
    { label:"Decision Model Health", value:"83.4%", sub:"M1 · M2 composite",                badge:"Operational", color:"green" },
    { label:"Active Clients",        value:"12",    sub:"Across 4 regions",                 badge:"Live",        color:"blue"  },
    { label:"Dataset Volume",        value:"20K",   sub:"Interaction records",              badge:"Healthy",     color:"green" },
    { label:"Intelligence Coverage", value:"100%",  sub:"12 of 12 products",                badge:"Full",        color:"green" },
    { label:"Trackflow Ingestion",   value:"98.7%", sub:"Event pass rate",                  badge:"Monitoring",  color:"amber" },
    { label:"High Risk Entities",    value:"128",   sub:"Low confidence / high exit users", badge:"Alert",       color:"amber" },
  ];
  return (
    <div className="flex flex-col gap-5">
      {/* KPI strip */}
      <div className="grid grid-cols-7 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white border border-[#e5e5e3]/80 rounded-[12px] px-[14px] py-4 cursor-pointer hover:border-[#c5c5c0] transition-colors">
            <div className="text-[11px] text-[#9b9b97] mb-1.5 leading-tight">{k.label}</div>
            <div className="text-[20px] font-medium tracking-tight text-[#1a1a1a]">{k.value}</div>
            <div className="text-[10.5px] text-[#9b9b97] mt-1 leading-tight">{k.sub}</div>
            <Badge color={k.color}>{k.badge}</Badge>
          </div>
        ))}
      </div>

      {/* Decision State + Client Registry */}
      <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
        <Card>
          <CardTitle>Decision State</CardTitle>
          <CardSub>Model readiness signals</CardSub>
          {[
            { name:"M1 — Action Continuity", meta:"842 estimators · 4 states",  pct:83.4, score:"83.4" },
            { name:"M2 — Direction Resolver",meta:"263 estimators · 12 states", pct:83.4, score:"83.4" },
          ].map(m => (
            <div key={m.name} className="flex items-center justify-between py-2.5 border-b border-[#f0efec] last:border-none">
              <div>
                <div className="text-[13px] text-[#1a1a1a]">{m.name}</div>
                <div className="text-[12px] text-[#9b9b97]">{m.meta}</div>
              </div>
              <div className="flex items-center flex-1 ml-4">
                <HealthBar pct={m.pct} />
                <span className="text-[20px] font-medium tracking-tight">{m.score}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between py-2.5">
            <div>
              <div className="text-[13px] text-[#1a1a1a]">Feature Alignment</div>
              <div className="text-[12px] text-[#9b9b97]">123 total · 50 TF-IDF</div>
            </div>
            <div className="flex items-center flex-1 ml-4">
              <HealthBar pct={100} />
              <span className="text-[14px] text-green-500">✓</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>Client Registry</CardTitle>
          <CardSub>Active decision contexts</CardSub>
          <table className="w-full border-collapse">
            <thead>
              <tr>{["Client","Region","State"].map(h=><th key={h} className="text-[11px] text-[#9b9b97] font-normal text-left pb-2 border-b border-[#f0efec]">{h}</th>)}</tr>
            </thead>
            <tbody>
              {[
                { name:"Apex Retail",    region:"Delhi",     color:"green", label:"Active"     },
                { name:"NovaTech ISV",   region:"London",    color:"green", label:"Active"     },
                { name:"Meridian SAAS",  region:"Toronto",   color:"blue",  label:"Onboarding" },
                { name:"CoreLogic CPaaS",region:"New York",  color:"green", label:"Active"     },
                { name:"Strata MSP",     region:"Singapore", color:"gray",  label:"Paused"     },
              ].map(r=>(
                <tr key={r.name} className="hover:opacity-75">
                  <td className="text-[12.5px] py-2 border-b border-[#f5f5f4] last:border-none">{r.name}</td>
                  <td className="text-[12.5px] py-2 border-b border-[#f5f5f4]">{r.region}</td>
                  <td className="py-2 border-b border-[#f5f5f4]"><Pill color={r.color}>{r.label}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardTitle>Decision Continuity Timeline</CardTitle>
          <CardSub>Context flow over 30 days</CardSub>
          <ChartCanvas id="lineChart" height={200} />
        </Card>
        <Card>
          <CardTitle>State Distribution</CardTitle>
          <CardSub>Decision state breakdown</CardSub>
          <ChartCanvas id="barChart" height={200} />
        </Card>
      </div>

      {/* NEW: Stable Decisions Score */}
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <Card>
          <CardTitle>Stable Decisions Score</CardTitle>
          <CardSub>Prediction consistency</CardSub>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[36px] font-medium tracking-tight">0.81</span>
          </div>
          <div className="text-[12px] text-[#9b9b97] mt-1">Low variance in predictions</div>
          <div className="mt-4 flex flex-col gap-2">
            {[
              { label:"Variance", val: "0.023", good: true },
              { label:"Std dev",  val: "0.152", good: true },
              { label:"Flip rate",val: "4.1%",  good: false },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between text-[12.5px] py-1.5 border-b border-[#f5f5f4] last:border-none">
                <span className="text-[#9b9b97]">{s.label}</span>
                <span className={s.good ? "text-[#1a1a1a]" : "text-amber-600"}>{s.val}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts row 2 */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardTitle>Intelligence Continuity</CardTitle>
            <CardSub>Coverage across decision paths</CardSub>
            <ChartCanvas id="intelChart" height={160} />
          </Card>
          <Card>
            <CardTitle>Trackflow Ingestion</CardTitle>
            <CardSub>Event pipeline continuity</CardSub>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[{ label:"Ingestion rate", val:"98.7%" }, { label:"Events / hour", val:"1,240" }].map(s=>(
                <div key={s.label} className="bg-[#f9f9f8] rounded-[9px] px-3.5 py-3">
                  <div className="text-[11.5px] text-[#9b9b97] mb-1">{s.label}</div>
                  <div className="text-[20px] font-medium">{s.val}</div>
                </div>
              ))}
            </div>
            <ChartCanvas id="tfChart" height={80} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function ModelsScreen() {
  const driftFeatures = [
    { name:"Time spent",       status:"Stable",  color:"green" },
    { name:"Engagement score", status:"Stable",  color:"green" },
    { name:"TF-IDF enterprise",status:"Drift ↑", color:"amber" },
    { name:"Device — Mobile",  status:"Stable",  color:"green" },
    { name:"Session depth",    status:"Drift ↑", color:"amber" },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardTitle>M1 — Action Continuity Model</CardTitle>
          <CardSub>LightGBM · Macro F1 0.8333</CardSub>
          <div className="flex items-baseline gap-1.5 mb-5">
            <span className="text-[36px] font-medium tracking-tight">83.4%</span>
            <span className="text-[13px] text-[#9b9b97]">accuracy</span>
          </div>
          <div className="text-[13px] font-medium mb-3">Feature Importance</div>
          <FeatBar label="Time spent"          val={11838} max={11838} display="11,838" />
          <FeatBar label="Engagement score"    val={10753} max={11838} display="10,753" />
          <FeatBar label="TF-IDF enterprise"   val={744}   max={11838} display="744"    />
          <FeatBar label="Device — Mobile"     val={619}   max={11838} display="619"    />
          <FeatBar label="Industry — Retail Tech" val={611} max={11838} display="611"   />

          {/* NEW: Drift Detection */}
          <div className="mt-4 pt-4 border-t border-[#f0efec]">
            <div className="text-[13px] font-medium mb-2">Drift Detection</div>
            <div className="flex flex-col gap-1.5">
              {driftFeatures.map(f => (
                <div key={f.name} className="flex items-center justify-between py-1 border-b border-[#f5f5f4] last:border-none">
                  <span className="text-[12px] text-[#6b6b68]">{f.name}</span>
                  <Pill color={f.color}>{f.status}</Pill>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <CardTitle>M2 — Direction Resolver</CardTitle>
          <CardSub>LightGBM · Macro F1 0.8335</CardSub>
          <div className="flex items-baseline gap-1.5 mb-5">
            <span className="text-[36px] font-medium tracking-tight">83.4%</span>
            <span className="text-[13px] text-[#9b9b97]">accuracy</span>
          </div>
          <ChartCanvas id="m2Chart" height={220} />
        </Card>
      </div>

      {/* NEW: Model Stability Trend */}
      <Card>
        <CardTitle>Model Stability Trend</CardTitle>
        <CardSub>F1 performance over 30 days · M1 vs M2</CardSub>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5"><div className="w-6 h-[2px] bg-[#1a1a1a]" /><span className="text-[12px] text-[#9b9b97]">M1 Action Continuity</span></div>
          <div className="flex items-center gap-1.5"><div className="w-6 h-[1px] bg-[#9b9b97] border-dashed" style={{borderTop:"1px dashed #9b9b97"}} /><span className="text-[12px] text-[#9b9b97]">M2 Direction Resolver</span></div>
        </div>
        <ChartCanvas id="modelStabilityChart" height={180} />
      </Card>

      <Card>
        <CardTitle>Model Registry</CardTitle>
        <CardSub>Version traceability</CardSub>
        <table className="w-full border-collapse">
          <thead>
            <tr>{["Model","Version","Estimators","Classes","F1 Macro","Status"].map(h=><th key={h} className="text-[11px] text-[#9b9b97] font-normal text-left pb-2 border-b border-[#f0efec]">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              { model:"Action Continuity",  v:"v2.4.1", est:842,  cls:4,  f1:"0.8333", s:"Production", c:"green" },
              { model:"Direction Resolver", v:"v2.4.1", est:263,  cls:12, f1:"0.8335", s:"Production", c:"green" },
              { model:"Action Continuity",  v:"v2.3.0", est:1000, cls:4,  f1:"0.8121", s:"Archived",   c:"gray"  },
              { model:"Direction Resolver", v:"v2.3.0", est:500,  cls:12, f1:"0.7944", s:"Archived",   c:"gray"  },
            ].map((r,i)=>(
              <tr key={i} className="hover:opacity-75">
                {[r.model,r.v,r.est,r.cls,r.f1].map((c,j)=><td key={j} className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">{c}</td>)}
                <td className="py-2.5 border-b border-[#f5f5f4]"><Pill color={r.c}>{r.s}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <CardTitle>Client Model Usage</CardTitle>
        <CardSub>Deployment context per client</CardSub>
        <table className="w-full border-collapse">
          <thead>
            <tr>{["Client","M1 Calls / day","M2 Calls / day","Avg Confidence","Primary State"].map(h=><th key={h} className="text-[11px] text-[#9b9b97] font-normal text-left pb-2 border-b border-[#f0efec]">{h}</th>)}</tr>
          </thead>
          <tbody>
            {[
              ["Apex Retail","4,200","1,380","0.84","Next Product"],
              ["NovaTech ISV","3,100","900","0.82","Share"],
              ["CoreLogic CPaaS","2,800","760","0.79","Rewatch"],
              ["Meridian SAAS","800","210","0.77","Exit"],
            ].map((r,i)=>(
              <tr key={i} className="hover:opacity-75">
                {r.map((c,j)=><td key={j} className="text-[12.5px] py-2.5 border-b border-[#f5f5f4] last:border-none">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function DatasetsScreen() {
  return (
    <div className="flex flex-col gap-5">
      {/* NEW: expanded KPI strip with Data Quality Score */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:"Data Quality Score", val:"96.3%", sub:"Missing / invalid records", green:true },
          { label:"Connections",        val:"3",     sub:"Active dataset sources"     },
          { label:"Total volume",       val:"22,012",sub:"Total records synced"       },
          { label:"Sync health",        val:"100%",  sub:"All sources healthy", green:true },
        ].map(k=>(
          <div key={k.label} className="bg-[#f9f9f8] rounded-[10px] px-4 py-3.5">
            <div className="text-[11.5px] text-[#9b9b97] mb-1">{k.label}</div>
            <div className={`text-[20px] font-medium ${k.green?"text-green-500":""}`}>{k.val}</div>
            {k.sub && <div className="text-[11px] text-[#b0b0ab] mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>
      <Card>
        <CardTitle>Dataset Connections</CardTitle>
        <CardSub>Source traceability</CardSub>
        <table className="w-full border-collapse">
          <thead><tr>{["Dataset","Type","Rows","Last sync","Health"].map(h=><th key={h} className="text-[11px] text-[#9b9b97] font-normal text-left pb-2 border-b border-[#f0efec]">{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Users.csv","Profile","2,000","2 hrs ago","Healthy"],
              ["Products.csv","Catalogue","12","2 hrs ago","Healthy"],
              ["Interactions.csv","Behavioral","20,000","2 hrs ago","Healthy"],
            ].map((r,i)=>(
              <tr key={i} className="hover:opacity-75">
                {r.slice(0,4).map((c,j)=><td key={j} className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">{c}</td>)}
                <td className="py-2.5 border-b border-[#f5f5f4]"><Pill color="green">{r[4]}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card><CardTitle>Dataset Volume</CardTitle><CardSub>Record distribution</CardSub><ChartCanvas id="dsBarChart" height={200} /></Card>
        <Card><CardTitle>Sync Activity</CardTitle><CardSub>Ingestion continuity</CardSub><ChartCanvas id="syncChart" height={200} /></Card>
      </div>
      {/* NEW: Content Aging Heatmap */}
      <ContentAgingHeatmap />
    </div>
  );
}

function ClientsScreen() {
  const [selected, setSelected] = useState(0);
  const d = clientData[selected];

  const highRiskClients = clientData.filter(c => c.conf < 0.8 || c.state === "—");

  return (
    <div className="flex flex-col gap-4">
      {/* NEW: Governance Funnel at top */}
      <GovernanceFunnel />

      <div className="grid grid-cols-[1.4fr_0.6fr] gap-4">
        <Card>
          <CardTitle>Client Directory</CardTitle>
          <CardSub>Click a row to view context</CardSub>
          <table className="w-full border-collapse">
            <thead><tr>{["Client","Industry","Region","Account","State"].map(h=><th key={h} className="text-[11px] text-[#9b9b97] font-normal text-left pb-2 border-b border-[#f0efec]">{h}</th>)}</tr></thead>
            <tbody>
              {[
                { ...clientData[0], industry:"Retail Tech", region:"Delhi",     account:"Customer",   color:"green", label:"Active"     },
                { ...clientData[1], industry:"IT/ITES",     region:"London",    account:"Integrator", color:"green", label:"Active"     },
                { ...clientData[2], industry:"SAAS",        region:"Toronto",   account:"Investor",   color:"blue",  label:"Onboarding" },
                { ...clientData[3], industry:"CPaaS",       region:"New York",  account:"Analyst",    color:"green", label:"Active"     },
                { ...clientData[4], industry:"MSP",         region:"Singapore", account:"Partner",    color:"gray",  label:"Paused"     },
                { ...clientData[5], industry:"ERP",         region:"Dubai",     account:"Reseller",   color:"green", label:"Active"     },
              ].map((r,i)=>(
                <tr key={i} onClick={()=>setSelected(i)} className={`cursor-pointer hover:opacity-75 ${selected===i?"bg-[#f9f9f8]":""}`}>
                  <td className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">{r.name}</td>
                  <td className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">{r.industry}</td>
                  <td className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">{r.region}</td>
                  <td className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">{r.account}</td>
                  <td className="py-2.5 border-b border-[#f5f5f4]"><Pill color={r.color}>{r.label}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="bg-white border border-[#e5e5e3]/80 rounded-[14px] p-5">
          <div className="text-[16px] font-medium mb-1">{d.name}</div>
          <div className="text-[12px] text-[#9b9b97] mb-4">{d.meta}</div>
          {[
            ["Datasets",       d.ds],
            ["Models active",  d.models],
            ["M1 calls / day", d.m1.toLocaleString()],
            ["M2 calls / day", d.m2.toLocaleString()],
            ["Avg confidence", d.conf],
            ["Primary state",  d.state],
            ["Since",          d.since],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-2 border-b border-[#f5f5f4] last:border-none text-[13px]">
              <span className="text-[#9b9b97]">{label}</span>
              <span>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: High Risk Clients Table */}
      <Card>
        <CardTitle>High Risk Clients</CardTitle>
        <CardSub>Low confidence (&lt;0.80) or inactive state</CardSub>
        <table className="w-full border-collapse">
          <thead>
            <tr>{["Client","Industry","Avg Confidence","Primary State","Risk"].map(h=><th key={h} className="text-[11px] text-[#9b9b97] font-normal text-left pb-2 border-b border-[#f0efec]">{h}</th>)}</tr>
          </thead>
          <tbody>
            {highRiskClients.map((c, i) => (
              <tr key={i} className="hover:opacity-75">
                <td className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">{c.name}</td>
                <td className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">{c.meta.split(" · ")[0]}</td>
                <td className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">
                  <span className={c.conf < 0.75 ? "text-red-600 font-medium" : "text-amber-600"}>{c.conf}</span>
                </td>
                <td className="text-[12.5px] py-2.5 border-b border-[#f5f5f4]">{c.state}</td>
                <td className="py-2.5 border-b border-[#f5f5f4]">
                  <Pill color={c.conf < 0.75 ? "red" : "amber"}>{c.conf < 0.75 ? "High" : "Medium"}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function IntelligenceScreen() {
  const [tab, setTab] = useState("client");

  const readinessSteps = [
    { label:"Data",           pct:100, count:22012 },
    { label:"Features",       pct:92,  count:20251 },
    { label:"Model Ready",    pct:87,  count:19158 },
    { label:"High Confidence",pct:73,  count:16069 },
    { label:"Action",         pct:61,  count:13427 },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-0.5 bg-[#f0efec] rounded-[9px] p-[3px] w-fit">
        {["client","model"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-[7px] text-[13px] cursor-pointer transition-all ${tab===t?"bg-white text-[#1a1a1a] font-medium":"text-[#6b6b68]"}`}>
            {t === "client" ? "Client-wise" : "Model-wise"}
          </button>
        ))}
      </div>

      {/* NEW: Decision Readiness Funnel + Radar at top */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardTitle>Decision Readiness Funnel</CardTitle>
          <CardSub>Record progression through pipeline stages</CardSub>
          <ReadinessFunnel steps={readinessSteps} />
        </Card>
        <Card>
          <CardTitle>Decision Health Radar</CardTitle>
          <CardSub>Multi-dimensional system quality</CardSub>
          <ChartCanvas id="radarChart" height={220} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {[
              { label:"Accuracy", val:"83.4%" },
              { label:"Confidence", val:"81.2%" },
              { label:"Stability", val:"81.0%" },
              { label:"Coverage", val:"100%" },
              { label:"Freshness", val:"92.0%" },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-1">
                <span className="text-[11.5px] text-[#9b9b97]">{m.label}</span>
                <span className="text-[11.5px] font-medium text-[#1a1a1a]">{m.val}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {tab === "client" && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[{ label:"Mean confidence", val:"0.834" },{ label:"High conf >0.9", val:"30.4%" },{ label:"Low conf <0.5", val:"4.1%" }].map(k=>(
              <div key={k.label} className="bg-[#f9f9f8] rounded-[10px] px-4 py-3.5">
                <div className="text-[11.5px] text-[#9b9b97] mb-1">{k.label}</div>
                <div className="text-[20px] font-medium">{k.val}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card><CardTitle>Accuracy Continuity</CardTitle><CardSub>30-day trend by client</CardSub><ChartCanvas id="intelLineChart" height={220} /></Card>
            <Card><CardTitle>State Distribution</CardTitle><CardSub>Predicted action states</CardSub><ChartCanvas id="intelBarChart" height={220} /></Card>
          </div>
          {/* NEW: Risk Velocity + State Transition */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardTitle>Risk Velocity Trend</CardTitle>
              <CardSub>Rate of rising decision risk over 30 days</CardSub>
              <ChartCanvas id="riskVelocityChart" height={200} />
            </Card>
            <StateTransitionFlow />
          </div>
        </>
      )}

      {tab === "model" && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[{ label:"M1 macro F1", val:"0.8333" },{ label:"M2 macro F1", val:"0.8335" },{ label:"Avg inference", val:"0.015ms" }].map(k=>(
              <div key={k.label} className="bg-[#f9f9f8] rounded-[10px] px-4 py-3.5">
                <div className="text-[11.5px] text-[#9b9b97] mb-1">{k.label}</div>
                <div className="text-[20px] font-medium">{k.val}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card><CardTitle>Confidence Distribution</CardTitle><CardSub>M1 prediction confidence bands</CardSub><ChartCanvas id="confChart" height={220} /></Card>
            <Card><CardTitle>M2 Per-Product F1</CardTitle><CardSub>Direction resolution accuracy</CardSub><ChartCanvas id="m2BarChart" height={220} /></Card>
          </div>
        </>
      )}
    </div>
  );
}

function TrackflowScreen() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:"Ingestion rate", val:"98.7%" },
          { label:"Events / hour",  val:"1,240" },
          { label:"Total events",   val:"20,000" },
          { label:"Pipeline health",val:"Good", green:true },
        ].map(k=>(
          <div key={k.label} className="bg-white border border-[#e5e5e3]/80 rounded-[12px] px-[18px] py-4">
            <div className="text-[11.5px] text-[#9b9b97] mb-1.5">{k.label}</div>
            <div className={`text-[22px] font-medium tracking-tight ${k.green?"text-green-500":""}`}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* NEW: Latency Trend */}
      <Card>
        <CardTitle>Latency Trend</CardTitle>
        <CardSub>Processing latency over 24 hours · ms</CardSub>
        <ChartCanvas id="latencyChart" height={140} />
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card><CardTitle>Event Flow</CardTitle><CardSub>Ingestion continuity · 24h</CardSub><ChartCanvas id="tfLineChart" height={220} /></Card>
        <Card><CardTitle>Event State Distribution</CardTitle><CardSub>Share of pipeline states</CardSub><ChartCanvas id="tfPieChart" height={220} /></Card>
      </div>

      {/* NEW: Failure Reason Breakdown */}
      <Card>
        <CardTitle>Failure Reason Breakdown</CardTitle>
        <CardSub>Event ingestion failure categories</CardSub>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label:"Timeout",      val:48, pct:"42%" },
            { label:"Schema Error", val:31, pct:"27%" },
            { label:"Missing Data", val:22, pct:"19%" },
            { label:"Network",      val:14, pct:"12%" },
          ].map(f => (
            <div key={f.label} className="bg-[#f9f9f8] rounded-[9px] px-3.5 py-3">
              <div className="text-[11.5px] text-[#9b9b97] mb-1">{f.label}</div>
              <div className="text-[20px] font-medium">{f.val}</div>
              <div className="text-[11px] text-[#9b9b97] mt-0.5">{f.pct} of failures</div>
            </div>
          ))}
        </div>
        <ChartCanvas id="failureChart" height={180} />
      </Card>
    </div>
  );
}

// ── nav config ─────────────────────────────────────────────────────────────────
const NAV = [
  { id:"overview",     label:"Overview",     Icon: LayoutGrid },
  { id:"models",       label:"Models",       Icon: Brain       },
  { id:"datasets",     label:"Data",         Icon: Database    },
  { id:"clients",      label:"Clients",      Icon: Users       },
  { id:"intelligence", label:"Intelligence", Icon: TrendingUp  },
  { id:"trackflow",    label:"Trackflow",    Icon: MoreHorizontal },
];

const SCREEN_MAP = {
  overview:     <OverviewScreen />,
  models:       <ModelsScreen />,
  datasets:     <DatasetsScreen />,
  clients:      <ClientsScreen />,
  intelligence: <IntelligenceScreen />,
  trackflow:    <TrackflowScreen />,
};

// ── root ───────────────────────────────────────────────────────────────────────
export default function MasterDashboard() {
  const [active,    setActive]    = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  const titles = { overview:"Overview", models:"Decision Models", datasets:"Data", clients:"Clients", intelligence:"Intelligence", trackflow:"Trackflow" };

  return (
    <div className="flex h-screen min-h-[600px] bg-[#f5f5f4] text-[#1a1a1a] text-[14px] overflow-hidden font-sans">
      {/* ── sidebar ── */}
      <aside
        className="bg-white border-r border-[#e5e5e3]/80 flex flex-col transition-all duration-[250ms] overflow-hidden flex-shrink-0"
        style={{ width: collapsed ? 56 : 220, minWidth: collapsed ? 56 : 220 }}
      >
      
{/* logo */}
<div className="flex items-center gap-2.5 px-[18px] py-5">
  <div className="flex items-center justify-center overflow-hidden">
    
    <img
      src={collapsed ? VynqeLogoIcon : VynqeLogo}
      alt="Vynqe"
      className={`h-[32px] object-contain transition-all duration-200 ${
        collapsed ? "w-[24px]" : "w-auto"
      }`}
    />

  </div>
</div>

        {/* nav */}
        <nav className="px-2 pt-3 pb-2 flex-1 flex flex-col gap-0.5">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] cursor-pointer transition-all whitespace-nowrap overflow-hidden w-full text-left
                ${active === id
                  ? "bg-[#f0efec] text-[#1a1a1a] font-medium"
                  : "text-[#6b6b68] hover:bg-[#f5f5f4] hover:text-[#1a1a1a]"}`}
            >
              <Icon size={16} className="min-w-[16px]" />
              {!collapsed && <span className="text-[13.5px]">{label}</span>}
            </button>
          ))}
        </nav>

        {/* collapse */}
        <div className="px-2 py-3 border-t border-[#f0efec]">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[#9b9b97] hover:bg-[#f5f5f4] hover:text-[#1a1a1a] transition-all cursor-pointer w-full text-left whitespace-nowrap overflow-hidden"
          >
            {collapsed
              ? <ChevronRight size={16} className="min-w-[16px]" />
              : <ChevronLeft  size={16} className="min-w-[16px]" />}
            {!collapsed && <span className="text-[13px]">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* header */}
        <header className="bg-white border-b border-[#e5e5e3]/80 px-6 h-14 flex items-center gap-4 flex-shrink-0">
          <span className="text-[15px] font-medium tracking-tight flex-shrink-0">{titles[active]}</span>
          <div className="relative max-w-[320px] w-full">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#b0b0ab]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-[34px] border border-[#e5e5e3]/80 rounded-[8px] pl-8 pr-3 text-[13px] bg-[#f9f9f8] outline-none placeholder:text-[#b0b0ab]"
            />
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <select className="h-[34px] border border-[#e5e5e3]/80 rounded-[8px] px-2.5 text-[13px] bg-white text-[#6b6b68] outline-none cursor-pointer">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </header>

        {/* content */}
        <main className="flex-1 overflow-y-auto p-6">
          {SCREEN_MAP[active]}
        </main>
      </div>
    </div>
  );
}