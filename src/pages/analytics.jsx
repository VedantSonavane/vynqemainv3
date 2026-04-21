import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const API_BASE = "http://localhost:4000";
const PALETTE = { blue:"#3b82f6", indigo:"#6366f1", teal:"#14b8a6", amber:"#f59e0b", rose:"#f43f5e", slate:"#64748b", green:"#22c55e" };
const PIE_COLORS = [PALETTE.blue, PALETTE.indigo, PALETTE.teal, PALETTE.amber, PALETTE.rose];
const SOURCE_COLORS = [PALETTE.blue, PALETTE.indigo, PALETTE.teal, PALETTE.amber, PALETTE.rose, "#a855f7", "#ec4899"];

const fmt     = (n)   => { if (!n && n !== 0) return "—"; if (n >= 1e6) return (n/1e6).toFixed(1)+"M"; if (n >= 1e3) return (n/1e3).toFixed(1)+"k"; return n.toLocaleString(); };
const fmtTime = (sec) => { if (!sec) return "0s"; const m=Math.floor(sec/60),s=Math.round(sec%60); return m===0?`${s}s`:`${m}m ${s}s`; };
const fmtPct  = (v)   => v==null ? "—" : (v*100).toFixed(1)+"%";
const bounceColor = (r) => r<0.35?PALETTE.green:r<0.6?PALETTE.amber:PALETTE.rose;

const Skeleton = ({ w="100%", h=16, r=6 }) => (
  <div style={{ width:w, height:h, borderRadius:r, background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite" }} />
);

function KpiCard({ label, value, change, invert, loading }) {
  const up = invert ? change < 0 : change > 0;
  const down = invert ? change > 0 : change < 0;
  const chgColor = change==null?"#94a3b8":up?PALETTE.green:down?PALETTE.rose:"#94a3b8";
  const chgLabel = change==null?null:`${change>0?"↑":"↓"} ${Math.abs(change).toFixed(1)}%`;
  return (
    <div style={{ background:"#fff", borderRadius:12, padding:"16px 18px", border:"1px solid #e2e8f0", display:"flex", flexDirection:"column", gap:4, boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
      <span style={{ fontSize:11, fontWeight:600, color:"#94a3b8", letterSpacing:"0.06em", textTransform:"uppercase" }}>{label}</span>
      {loading ? <Skeleton h={28} w="70%" /> : <span style={{ fontSize:24, fontWeight:700, color:"#0f172a", lineHeight:1.2 }}>{value}</span>}
      {chgLabel && !loading && <span style={{ fontSize:11, fontWeight:600, color:chgColor }}>{chgLabel} vs prev</span>}
    </div>
  );
}

const SectionHead = ({ title, sub }) => (
  <div style={{ marginBottom:14 }}>
    <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{title}</div>
    {sub && <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{sub}</div>}
  </div>
);

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 12px", fontSize:12, boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight:600, color:"#334155", marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color||"#334155" }}>{p.name}: <strong>{p.value?.toLocaleString()}</strong></div>)}
    </div>
  );
};

function LeftSidebar({ data, tab, setTab, days, setDays, loading, onRefresh }) {
  const navItems = [
    { id:"overview", icon:"◈", label:"Overview" },
    { id:"pages",    icon:"☰", label:"Pages" },
    { id:"sources",  icon:"⊕", label:"Sources" },
    { id:"devices",  icon:"◻", label:"Devices" },
    { id:"funnel",   icon:"▽", label:"Funnel" },
    { id:"leads",    icon:"⬇", label:"Leads Export", accent:true },
  ];
  return (
    <aside style={{ width:200, flexShrink:0, background:"#fff", borderRight:"1px solid #e2e8f0", display:"flex", flexDirection:"column", padding:"20px 0" }}>
      <div style={{ padding:"0 20px 24px", borderBottom:"1px solid #f1f5f9" }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>ana<span style={{ color:PALETTE.blue }}>lytics</span></div>
        <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>website intelligence</div>
      </div>
      <div style={{ padding:"16px 20px 8px" }}>
        <div style={{ fontSize:10, fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Period</div>
        {[7,14,30].map(d => (
          <button key={d} onClick={()=>setDays(d)} style={{ display:"block", width:"100%", textAlign:"left", padding:"7px 10px", borderRadius:7, border:"none", background:days===d?"#eff6ff":"transparent", color:days===d?PALETTE.blue:"#64748b", fontSize:12, fontWeight:days===d?700:500, cursor:"pointer", marginBottom:2, transition:"all 0.15s" }}>
            Last {d} days
          </button>
        ))}
      </div>
      <div style={{ height:1, background:"#f1f5f9", margin:"12px 0" }} />
      <nav style={{ padding:"0 12px", flex:1 }}>
        <div style={{ fontSize:10, fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", padding:"0 8px", marginBottom:8 }}>Views</div>
        {navItems.map(item => (
          <button key={item.id} onClick={()=>setTab(item.id)} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 10px", borderRadius:8, border:"none", cursor:"pointer", transition:"all 0.15s", background:tab===item.id?"#eff6ff":"transparent", color:tab===item.id?PALETTE.blue:item.accent?"#7c3aed":"#475569", fontSize:12, fontWeight:tab===item.id?700:item.accent?600:500, marginBottom:2 }}>
            <span style={{ fontSize:14 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding:"12px 20px 0", borderTop:"1px solid #f1f5f9" }}>
        <button onClick={onRefresh} disabled={loading} style={{ width:"100%", padding:"9px", borderRadius:8, border:"1px solid #e2e8f0", background:loading?"#f8fafc":"#fff", color:loading?"#94a3b8":"#334155", fontSize:11, fontWeight:600, cursor:loading?"default":"pointer" }}>
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
        {data?.period && <div style={{ fontSize:10, color:"#94a3b8", textAlign:"center", marginTop:8 }}>{new Date().toLocaleTimeString()}</div>}
      </div>
    </aside>
  );
}

function RightSidebar({ data, insight, insightLoading, alerts }) {
  if (!data) return (
    <aside style={{ width:240, flexShrink:0, background:"#fff", borderLeft:"1px solid #e2e8f0", padding:20 }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#0f172a", marginBottom:16 }}>Insights</div>
      {[1,2,3].map(i => <Skeleton key={i} h={60} r={10} />)}
    </aside>
  );
  const { overview, changes, sources, pages } = data;
  const cards = [
    { icon:"👤", label:"Users",       value:fmt(overview.activeUsers),      note:changes.userChange!==0?`${changes.userChange>0?"+":""}${changes.userChange.toFixed(1)}% vs last period`:"Stable", color:changes.userChange>10?PALETTE.green:changes.userChange<-10?PALETTE.rose:PALETTE.blue },
    { icon:"⏱",  label:"Avg Session", value:fmtTime(overview.avgSessionSec), note:overview.avgSessionSec>120?"Good engagement":overview.avgSessionSec>60?"Average":"Sessions feel short",          color:overview.avgSessionSec>120?PALETTE.green:overview.avgSessionSec>60?PALETTE.amber:PALETTE.rose },
    { icon:"↩",  label:"Bounce Rate", value:fmtPct(overview.bounceRate),    note:overview.bounceRate<0.35?"Excellent retention":overview.bounceRate<0.6?"Room to improve":"High — check pages",    color:bounceColor(overview.bounceRate) },
    { icon:"🔝", label:"Top Source",  value:sources?.[0]?.channel||"—",     note:sources?.[0]?`${sources[0].pct}% of sessions`:"",                                                                 color:PALETTE.indigo },
    { icon:"📄", label:"Best Page",   value:pages?.[0]?.path||"—",          note:pages?.[0]?`${fmt(pages[0].views)} views`:"",                                                                     color:PALETTE.teal },
  ];
  return (
    <aside style={{ width:240, flexShrink:0, background:"#fff", borderLeft:"1px solid #e2e8f0", display:"flex", flexDirection:"column", overflowY:"auto" }}>
      <div style={{ padding:"20px 18px 12px", borderBottom:"1px solid #f1f5f9" }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>Quick Insights</div>
        <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>Last {data.period.days} days</div>
      </div>
      <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
        {cards.map((c,i) => (
          <div key={i} style={{ background:"#f8fafc", borderRadius:10, padding:"12px 14px", borderLeft:`3px solid ${c.color}` }}>
            <span style={{ fontSize:11, color:"#64748b", fontWeight:600 }}>{c.icon} {c.label}</span>
            <div style={{ fontSize:15, fontWeight:700, color:"#0f172a", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginTop:4 }}>{c.value}</div>
            <div style={{ fontSize:10, color:c.color, fontWeight:600, marginTop:3 }}>{c.note}</div>
          </div>
        ))}
      </div>
      {alerts?.length>0 && (
        <div style={{ padding:"0 16px 12px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#0f172a", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Alerts</div>
          {alerts.map((a,i) => (
            <div key={i} style={{ background:a.type==="positive"?"#f0fdf4":"#fff7ed", border:`1px solid ${a.type==="positive"?"#bbf7d0":"#fed7aa"}`, borderRadius:8, padding:"10px 12px", marginBottom:8, fontSize:11, color:a.type==="positive"?"#15803d":"#c2410c", lineHeight:1.5 }}>
              {a.type==="positive"?"🟢":"⚠️"} {a.message}
            </div>
          ))}
        </div>
      )}
      <div style={{ padding:"0 16px 20px", flex:1 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#0f172a", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>AI Summary</div>
        <div style={{ background:"linear-gradient(135deg,#eff6ff,#f0f9ff)", border:"1px solid #bfdbfe", borderRadius:10, padding:"12px 14px", fontSize:12, lineHeight:1.7, color:"#1e40af" }}>
          {insightLoading
            ? <div style={{ display:"flex", alignItems:"center", gap:8, color:"#94a3b8", fontSize:11 }}><span style={{ animation:"spin 0.8s linear infinite", display:"inline-block" }}>◌</span>Analyzing…</div>
            : <div dangerouslySetInnerHTML={{ __html: insight || "Click refresh to generate AI insight." }} />
          }
        </div>
      </div>
    </aside>
  );
}

function OverviewTab({ data, loading }) {
  if (loading || !data) return <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>{[1,2,3,4,5,6].map(i => <div key={i} style={{ background:"#fff", borderRadius:12, padding:18, border:"1px solid #e2e8f0" }}><Skeleton h={60} /></div>)}</div>;
  const kpis = [
    { label:"Active Users", value:fmt(data.overview.activeUsers),       change:data.changes.userChange },
    { label:"Page Views",   value:fmt(data.overview.pageViews),         change:data.changes.viewChange },
    { label:"Sessions",     value:fmt(data.overview.sessions),          change:null },
    { label:"New Users",    value:fmt(data.overview.newUsers),          change:null },
    { label:"Avg Session",  value:fmtTime(data.overview.avgSessionSec), change:null },
    { label:"Bounce Rate",  value:fmtPct(data.overview.bounceRate),     change:data.changes.bounceChange, invert:true },
  ];
  const sparkData = (data.pages||[]).slice(0,7).map(p=>({ name:p.path.replace("/","")||"home", views:p.views }));
  const pieData   = (data.sources||[]).slice(0,5).map(s=>({ name:s.channel, value:s.sessions }));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>{kpis.map((k,i)=><KpiCard key={i} {...k} />)}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:14 }}>
        <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #e2e8f0" }}>
          <SectionHead title="Page Views by Page" sub="Top pages this period" />
          <ResponsiveContainer width="100%" height={200}><BarChart data={sparkData} barSize={20}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} /><XAxis dataKey="name" tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} width={36} /><Tooltip content={<ChartTip />} /><Bar dataKey="views" fill={PALETTE.blue} radius={[4,4,0,0]} name="Views" /></BarChart></ResponsiveContainer>
        </div>
        <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #e2e8f0" }}>
          <SectionHead title="Traffic Sources" sub="By session share" />
          <ResponsiveContainer width="100%" height={140}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>{pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}</Pie><Tooltip formatter={(v)=>[fmt(v),"Sessions"]} /></PieChart></ResponsiveContainer>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>{pieData.map((d,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#64748b" }}><span style={{ width:8, height:8, borderRadius:2, background:PIE_COLORS[i%PIE_COLORS.length], display:"inline-block" }} />{d.name}</div>)}</div>
        </div>
      </div>
    </div>
  );
}

function PagesTab({ data, loading }) {
  if (loading || !data) return <Skeleton h={300} />;
  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9" }}><SectionHead title="Top Pages" sub={`${data.pages.length} pages tracked`} /></div>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead><tr style={{ background:"#f8fafc" }}>{["#","Page","Views","Avg Time","Users","Bounce"].map((h,i)=><th key={i} style={{ padding:"10px 16px", fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:i>1?"right":"left", borderBottom:"1px solid #f1f5f9" }}>{h}</th>)}</tr></thead>
        <tbody>{data.pages.map((p,i)=>(
          <tr key={i} style={{ borderBottom:"1px solid #f8fafc" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <td style={{ padding:"12px 16px", fontSize:11, color:"#94a3b8", fontWeight:600 }}>{i+1}</td>
            <td style={{ padding:"12px 16px", fontSize:12, color:PALETTE.blue, fontWeight:600, maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.path}</td>
            <td style={{ padding:"12px 16px", fontSize:12, color:"#0f172a", fontWeight:700, textAlign:"right" }}>{fmt(p.views)}</td>
            <td style={{ padding:"12px 16px", fontSize:12, color:"#475569", textAlign:"right" }}>{fmtTime(p.avgTimeSec)}</td>
            <td style={{ padding:"12px 16px", fontSize:12, color:"#475569", textAlign:"right" }}>{fmt(p.users)}</td>
            <td style={{ padding:"12px 16px", textAlign:"right" }}><span style={{ fontSize:11, fontWeight:700, color:bounceColor(p.bounceRate) }}>{fmtPct(p.bounceRate)}</span></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function SourcesTab({ data, loading }) {
  if (loading || !data) return <Skeleton h={300} />;
  const sources = data.sources||[];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
      <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #e2e8f0" }}>
        <SectionHead title="Sessions by Channel" />
        <ResponsiveContainer width="100%" height={220}><BarChart data={sources} layout="vertical" barSize={14}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} /><XAxis type="number" tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} /><YAxis dataKey="channel" type="category" tick={{ fontSize:11, fill:"#475569" }} axisLine={false} tickLine={false} width={80} /><Tooltip content={<ChartTip />} /><Bar dataKey="sessions" name="Sessions" radius={[0,4,4,0]}>{sources.map((_,i)=><Cell key={i} fill={SOURCE_COLORS[i%SOURCE_COLORS.length]} />)}</Bar></BarChart></ResponsiveContainer>
      </div>
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
        <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f1f5f9" }}><SectionHead title="Channel Breakdown" /></div>
        {sources.map((s,i)=>(
          <div key={i} style={{ padding:"12px 20px", borderBottom:"1px solid #f8fafc", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ width:10, height:10, borderRadius:3, background:SOURCE_COLORS[i%SOURCE_COLORS.length], flexShrink:0 }} />
            <span style={{ fontSize:12, fontWeight:600, color:"#334155", flex:1 }}>{s.channel}</span>
            <span style={{ fontSize:12, fontWeight:700, color:"#0f172a" }}>{fmt(s.sessions)}</span>
            <span style={{ fontSize:11, color:"#94a3b8", minWidth:36, textAlign:"right" }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DevicesTab({ data, loading }) {
  if (loading || !data) return <Skeleton h={300} />;
  const devices = data.devices||[];
  const icons = { mobile:"📱", desktop:"💻", tablet:"⬜" };
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
      <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #e2e8f0" }}>
        <SectionHead title="Device Split" sub="By sessions" />
        <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={devices.map(d=>({name:d.device,value:d.sessions}))} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={4} labelLine={false}>{devices.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}</Pie><Tooltip formatter={(v)=>[fmt(v),"Sessions"]} /></PieChart></ResponsiveContainer>
      </div>
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
        <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f1f5f9" }}><SectionHead title="By Device" /></div>
        {devices.map((d,i)=>(
          <div key={i} style={{ padding:"16px 20px", borderBottom:"1px solid #f8fafc" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, fontWeight:600, color:"#334155" }}>{icons[d.device.toLowerCase()]||"💻"} {d.device}</span>
              <span style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{d.pct}%</span>
            </div>
            <div style={{ height:6, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}><div style={{ height:"100%", width:`${d.pct}%`, background:PIE_COLORS[i%PIE_COLORS.length], borderRadius:3, transition:"width 0.8s ease" }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelTab({ data, loading }) {
  if (loading || !data) return <Skeleton h={300} />;
  const funnel = [...(data.funnel||[])].sort((a,b)=>b.sessions-a.sessions);
  const max = funnel[0]?.sessions||1;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #e2e8f0" }}>
        <SectionHead title="User Journey & Drop-offs" sub="Sorted by sessions" />
        {funnel.map((f,i)=>{
          const pct  = Math.round((f.sessions/max)*100);
          const drop = i>0?Math.round(((funnel[i-1].sessions-f.sessions)/funnel[i-1].sessions)*100):null;
          return (
            <div key={i} style={{ marginBottom:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div>
                  <span style={{ fontSize:12, fontWeight:700, color:PALETTE.blue }}>{f.path}</span>
                  <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>bounce {fmtPct(f.bounceRate)} · engagement {fmtPct(f.engagementRate)}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:16, fontWeight:800, color:"#0f172a" }}>{fmt(f.sessions)}</div>
                  {drop!==null?<div style={{ fontSize:10, fontWeight:700, color:PALETTE.rose }}>−{drop}% drop</div>:<div style={{ fontSize:10, fontWeight:700, color:PALETTE.green }}>entry</div>}
                </div>
              </div>
              <div style={{ height:8, background:"#f1f5f9", borderRadius:4, overflow:"hidden" }}><div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${PALETTE.blue},${PALETTE.indigo})`, borderRadius:4, transition:"width 1s ease" }} /></div>
            </div>
          );
        })}
      </div>
      <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #e2e8f0" }}>
        <SectionHead title="Sessions per Page" />
        <ResponsiveContainer width="100%" height={180}><BarChart data={funnel} barSize={22}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} /><XAxis dataKey="path" tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} width={36} /><Tooltip content={<ChartTip />} /><Bar dataKey="sessions" fill={PALETTE.blue} radius={[4,4,0,0]} name="Sessions" /></BarChart></ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Leads Export Tab ──────────────────────────────────────────────────────
const LEAD_COLS = [
  { key:"user_id",      label:"User ID" },
  { key:"submitted_at", label:"Submitted At" },
  { key:"full_name",    label:"Full Name" },
  { key:"email",        label:"Email" },
  { key:"company",      label:"Company" },
  { key:"job_title",    label:"Job Title" },
  { key:"industry",     label:"Industry" },
  { key:"account_type", label:"Account Type" },
  { key:"message",      label:"Message" },
];

function downloadCSV(rows) {
  const header = LEAD_COLS.map(c => `"${c.label}"`).join(",");
  const body   = rows.map(r => LEAD_COLS.map(c => `"${(r[c.key]||"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob   = new Blob([header+"\n"+body], { type:"text/csv;charset=utf-8;" });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement("a");
  a.href = url; a.download = `leads_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function downloadJSON(rows) {
  const blob = new Blob([JSON.stringify(rows,null,2)], { type:"application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `leads_${new Date().toISOString().slice(0,10)}.json`; a.click();
  URL.revokeObjectURL(url);
}

function LeadsTab({ days }) {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [sortCol, setSortCol] = useState("submitted_at");
  const [sortDir, setSortDir] = useState("desc");
  const [fetched, setFetched] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API_BASE}/api/form-submissions?days=${days}`);
      const json = await res.json();
      if (json.ok) { setRows(json.rows); setFetched(true); }
      else setError(json.error || "Failed to fetch");
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [days]);

  const toggleSort = (col) => { if (sortCol===col) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortCol(col); setSortDir("asc"); } };

  const filtered = rows
    .filter(r => { if (!search) return true; const q=search.toLowerCase(); return Object.values(r).some(v=>String(v||"").toLowerCase().includes(q)); })
    .sort((a,b) => { const va=String(a[sortCol]||""), vb=String(b[sortCol]||""); return sortDir==="asc"?va.localeCompare(vb):vb.localeCompare(va); });

  const industryCounts = {};
  rows.forEach(r=>{ if(r.industry) industryCounts[r.industry]=(industryCounts[r.industry]||0)+1; });
  const industryData = Object.entries(industryCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({name,value}));

  const acctCounts = {};
  rows.forEach(r=>{ if(r.account_type) acctCounts[r.account_type]=(acctCounts[r.account_type]||0)+1; });
  const acctSorted = Object.entries(acctCounts).sort((a,b)=>b[1]-a[1]);
  const acctMax    = acctSorted[0]?.[1]||1;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Toolbar */}
      <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>Form Leads Export</div>
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{fetched?`${rows.length} leads · last ${days} days`:"Fetch form_submit events from GA4"}</div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          {fetched && <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:"8px 12px", borderRadius:8, border:"1px solid #e2e8f0", fontSize:12, color:"#334155", outline:"none", width:170 }} />}
          <button onClick={load} disabled={loading} style={{ padding:"9px 16px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", color:"#334155", fontSize:12, fontWeight:600, cursor:loading?"default":"pointer" }}>
            {loading?"Loading…":fetched?"↻ Reload":"⬇ Pull Leads"}
          </button>
          {fetched && rows.length>0 && <>
            <button onClick={()=>downloadCSV(filtered)} style={{ padding:"9px 16px", borderRadius:8, border:"none", background:PALETTE.blue, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>↓ CSV</button>
            <button onClick={()=>downloadJSON(filtered)} style={{ padding:"9px 16px", borderRadius:8, border:"none", background:PALETTE.indigo, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>↓ JSON</button>
          </>}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"14px 18px", fontSize:12, color:"#c2410c" }}>
          ⚠️ {error}
          <div style={{ marginTop:6, fontSize:11, color:"#92400e" }}>Add the <code>/api/form-submissions</code> route to server.js and ensure your GA4 event is named <code>form_submit</code>.</div>
        </div>
      )}

      {/* Empty CTA */}
      {!fetched && !loading && !error && (
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"48px 24px", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>📋</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:6 }}>No leads loaded yet</div>
          <div style={{ fontSize:12, color:"#94a3b8", maxWidth:400, margin:"0 auto 20px" }}>Click below to fetch form submissions from your GA4 property. Requires the <code>/api/form-submissions</code> route in server.js.</div>
          <button onClick={load} style={{ padding:"10px 28px", borderRadius:8, border:"none", background:PALETTE.blue, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>⬇ Pull Leads from GA4</button>
        </div>
      )}

      {/* Loading */}
      {loading && <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:24, display:"flex", flexDirection:"column", gap:10 }}>{[1,2,3,4,5].map(i=><Skeleton key={i} h={36} />)}</div>}

      {/* Charts row */}
      {fetched && rows.length>0 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #e2e8f0" }}>
            <SectionHead title="Leads by Industry" sub={`${rows.length} total`} />
            <ResponsiveContainer width="100%" height={170}><PieChart><Pie data={industryData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" paddingAngle={3}>{industryData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>{industryData.map((d,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#64748b" }}><span style={{ width:8, height:8, borderRadius:2, background:PIE_COLORS[i%PIE_COLORS.length], display:"inline-block" }} />{d.name} ({d.value})</div>)}</div>
          </div>
          <div style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #e2e8f0" }}>
            <SectionHead title="Leads by Account Type" />
            {acctSorted.map(([label,count],i)=>(
              <div key={i} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#475569", fontWeight:600, marginBottom:4 }}><span>{label}</span><span>{count}</span></div>
                <div style={{ height:6, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}><div style={{ height:"100%", width:`${Math.round((count/acctMax)*100)}%`, background:SOURCE_COLORS[i%SOURCE_COLORS.length], borderRadius:3, transition:"width 0.8s ease" }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {fetched && rows.length>0 && (
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#0f172a" }}>{filtered.length} leads{search?` (filtered from ${rows.length})`:""}</span>
            <span style={{ fontSize:11, color:"#94a3b8" }}>Click column to sort · emails are clickable</span>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:960 }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  {LEAD_COLS.map(col=>(
                    <th key={col.key} onClick={()=>toggleSort(col.key)} style={{ padding:"10px 14px", fontSize:10, fontWeight:700, color:sortCol===col.key?PALETTE.blue:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #f1f5f9", cursor:"pointer", whiteSpace:"nowrap", userSelect:"none" }}>
                      {col.label}{sortCol===col.key?(sortDir==="asc"?" ↑":" ↓"):""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row,i)=>(
                  <tr key={i} style={{ borderBottom:"1px solid #f8fafc" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <td style={{ padding:"11px 14px", fontSize:11, color:"#94a3b8", fontFamily:"monospace", whiteSpace:"nowrap" }}>{row.user_id}</td>
                    <td style={{ padding:"11px 14px", fontSize:11, color:"#475569", whiteSpace:"nowrap" }}>{row.submitted_at}</td>
                    <td style={{ padding:"11px 14px", fontSize:12, fontWeight:600, color:"#0f172a", whiteSpace:"nowrap" }}>{row.full_name}</td>
                    <td style={{ padding:"11px 14px", fontSize:12 }}><a href={`mailto:${row.email}`} style={{ color:PALETTE.blue, textDecoration:"none" }}>{row.email}</a></td>
                    <td style={{ padding:"11px 14px", fontSize:12, color:"#475569" }}>{row.company}</td>
                    <td style={{ padding:"11px 14px", fontSize:11, color:"#475569", whiteSpace:"nowrap" }}>{row.job_title}</td>
                    <td style={{ padding:"11px 14px" }}><span style={{ fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:20, background:"#eff6ff", color:PALETTE.blue, whiteSpace:"nowrap" }}>{row.industry}</span></td>
                    <td style={{ padding:"11px 14px" }}><span style={{ fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:20, background:"#f0fdf4", color:"#15803d", whiteSpace:"nowrap" }}>{row.account_type}</span></td>
                    <td style={{ padding:"11px 14px", fontSize:11, color:"#475569", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={row.message}>{row.message||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {fetched && rows.length===0 && !loading && (
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"40px 24px", textAlign:"center" }}>
          <div style={{ fontSize:28, marginBottom:10 }}>🔍</div>
          <div style={{ fontSize:13, fontWeight:700, color:"#0f172a", marginBottom:6 }}>No form submissions found</div>
          <div style={{ fontSize:12, color:"#94a3b8" }}>No <code>form_submit</code> events in the last {days} days, or the GA4 event parameter names don't match.</div>
        </div>
      )}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [tab,            setTab]            = useState("overview");
  const [days,           setDays]           = useState(7);
  const [data,           setData]           = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [insight,        setInsight]        = useState("");
  const [insightLoading, setInsightLoading] = useState(false);

  const fetchInsight = async (d) => {
    setInsightLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/insight`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({data:d}) });
      const json = await res.json();
      setInsight(json.ok?json.insight:"Could not generate insight.");
    } catch { setInsight("AI insight unavailable."); }
    finally { setInsightLoading(false); }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/analytics?days=${days}`);
      const json = await res.json();
      if (json.ok) { setData(json); fetchInsight(json); }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [days]);

  useEffect(()=>{ loadData(); }, [loadData]);

  const tabContent = () => {
    switch(tab) {
      case "overview": return <OverviewTab data={data} loading={loading} />;
      case "pages":    return <PagesTab    data={data} loading={loading} />;
      case "sources":  return <SourcesTab  data={data} loading={loading} />;
      case "devices":  return <DevicesTab  data={data} loading={loading} />;
      case "funnel":   return <FunnelTab   data={data} loading={loading} />;
      case "leads":    return <LeadsTab    days={days} />;
      default:         return null;
    }
  };

  const pageTitle = tab==="leads"?"Leads Export":tab.charAt(0).toUpperCase()+tab.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#f1f5f9;}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px}
        code{background:#f1f5f9;padding:2px 5px;border-radius:4px;font-size:11px}
      `}</style>
      <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <LeftSidebar data={data} tab={tab} setTab={setTab} days={days} setDays={setDays} loading={loading} onRefresh={loadData} />
        <main style={{ flex:1, overflowY:"auto", padding:"24px 22px", background:"#f1f5f9" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:20, fontWeight:800, color:"#0f172a", letterSpacing:"-0.02em" }}>{pageTitle}</div>
            <div style={{ fontSize:12, color:"#94a3b8", marginTop:3 }}>
              {tab==="leads"?`Export form submissions · last ${days} days`:data?`${data.overview.activeUsers.toLocaleString()} active users · last ${days} days`:"Loading data…"}
            </div>
          </div>
          {tabContent()}
        </main>
        <RightSidebar data={data} insight={insight} insightLoading={insightLoading} alerts={data?.alerts||[]} />
      </div>
    </>
  );
}