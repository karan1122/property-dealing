import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const fmtPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const avatarColor = (name = "") => {
  const colors = [
    ["#dbeafe","#1e40af"],["#d1fae5","#065f46"],["#fef3c7","#92400e"],
    ["#fce7f3","#9d174d"],["#ede9fe","#4c1d95"],["#ffedd5","#7c2d12"],
    ["#cffafe","#164e63"],["#f0fdf4","#14532d"],
  ];
  return colors[(name.charCodeAt(0)||0) % colors.length];
};

/* ═══════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════ */
const IC = {
  Grid:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Building:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/><line x1="4" y1="7" x2="9" y2="7"/><line x1="4" y1="12" x2="9" y2="12"/><line x1="4" y1="17" x2="9" y2="17"/><line x1="15" y1="7" x2="20" y2="7"/><line x1="15" y1="12" x2="20" y2="12"/><line x1="15" y1="17" x2="20" y2="17"/></svg>,
  Users:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Agent:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v4"/><path d="M10 15h4"/></svg>,
  Dollar:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Home:        () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  LogOut:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check:       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:           () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trash:       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Edit:        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Link:        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  Unlink:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  Clock:       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Alert:       () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Search:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  CreditCard:  () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  UserCheck:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
  TrendUp:     () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Phone:       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.14 1.22 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>,
  Mail:        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Eye:         () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Close:       () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus:        () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Award:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  GridSm:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  ListSm:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Save:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Key:         () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  EyeOff:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  ShieldCheck: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  ShieldOff:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.69 14a6.9 6.9 0 00.31-2V5l-8-3-3.16 1.18"/><path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 005.62-4.38"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  ClipboardCheck: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><polyline points="9 12 11 14 15 10"/></svg>,
};

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════ */
const Pill = ({ bg, color, dot, children }) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,background:bg,color,fontSize:11,padding:"3px 9px",borderRadius:20,fontWeight:700}}>
    {dot && <span style={{fontSize:7}}>{dot}</span>}{children}
  </span>
);
const Avatar = ({ name, size = 40 }) => {
  const [bg, color] = avatarColor(name || "?");
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:bg,color,fontSize:size*0.38,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,letterSpacing:"-0.5px"}}>
      {(name||"?").charAt(0).toUpperCase()}
    </div>
  );
};
const RolePill = ({ role }) => {
  const map = {admin:{bg:"#0d1117",color:"#fff"},seller:{bg:"#fef3c7",color:"#92400e"},buyer:{bg:"#dbeafe",color:"#1e40af"},agent:{bg:"#d1fae5",color:"#065f46"}};
  const s = map[role]||map.buyer;
  return <span style={{background:s.bg,color:s.color,fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:700,textTransform:"capitalize"}}>{role}</span>;
};

/* ── Agent Verdict Pill ── */
const AgentVerdictPill = ({ verdict }) => {
  if (!verdict || verdict === "pending")
    return <Pill bg="#fef3c7" color="#92400e" dot="●">Agent: Pending</Pill>;
  if (verdict === "approved")
    return <Pill bg="#dbeafe" color="#1e40af" dot="●">Agent: Approved</Pill>;
  if (verdict === "rejected")
    return <Pill bg="#fee2e2" color="#991b1b" dot="●">Agent: Rejected</Pill>;
  return null;
};

/* ── Final Approval Pill ── */
const ApprovalPill = ({ approved, status, agentVerdict }) => {
  if (approved) return <Pill bg="#d1fae5" color="#065f46" dot="●">Live</Pill>;
  if (agentVerdict === "rejected") return <Pill bg="#fee2e2" color="#991b1b" dot="●">Rejected</Pill>;
  if (agentVerdict === "approved") return <Pill bg="#ede9fe" color="#4c1d95" dot="●">Admin Review</Pill>;
  if (status === "Pending") return <Pill bg="#fef3c7" color="#92400e" dot="●">Pending</Pill>;
  return <Pill bg="#fee2e2" color="#991b1b" dot="●">Rejected</Pill>;
};

const FeePill = ({status}) => {
  const map={paid:["#d1fae5","#065f46","Paid"],unpaid:["#fee2e2","#991b1b","Unpaid"],waived:["#f3f4f6","#374151","Waived"]};
  const [bg,color,label]=map[status]||map.unpaid;
  return <Pill bg={bg} color={color}>{label}</Pill>;
};
const StatCard = ({label,value,sub,accent,icon}) => (
  <div className="stat-card">
    <div className="stat-icon-wrap" style={{background:accent+"22",color:accent}}>{icon}</div>
    <div className="stat-val">{value??"—"}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════ */
const TABS=[
  {id:"overview",  label:"Overview",   Icon:IC.Grid},
  {id:"properties",label:"Properties", Icon:IC.Building},
  {id:"users",     label:"Users",      Icon:IC.Users},
  {id:"agents",    label:"Agents",     Icon:IC.Agent},
  {id:"fees",      label:"Seller Fees",Icon:IC.Dollar},
  {
  id: "commissions",
  label: "Commissions",
  Icon: IC.CreditCard,
},
];
const Sidebar=({tab,setTab,user,onLogout,badgeCounts})=>(
  <aside className="sidebar">
    <div className="sb-logo">
      <div className="sb-logo-mark"><IC.Home /></div>
      <div><div className="sb-logo-name">NestFind</div><div className="sb-logo-sub">Admin Panel</div></div>
    </div>
    <div className="sb-user">
      <div className="sb-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
      <div><div className="sb-uname">{user?.name}</div><div className="sb-uemail">{user?.email}</div></div>
    </div>
    <nav className="sb-nav">
      <p className="sb-nav-label">Navigation</p>
      {TABS.map(({id,label,Icon})=>(
        <button key={id} className={`sb-item${tab===id?" active":""}`} onClick={()=>setTab(id)}>
          <Icon /><span>{label}</span>
          {badgeCounts?.[id]>0 && <span className="sb-badge">{badgeCounts[id]}</span>}
        </button>
      ))}
    </nav>
    <button className="sb-logout" onClick={onLogout}><IC.LogOut /> Sign out</button>
  </aside>
);

/* ═══════════════════════════════════════════════════════════════
   FLOW STEPS BANNER  — shown at top of Properties & Overview
═══════════════════════════════════════════════════════════════ */
const FlowBanner = () => (
  <div className="flow-banner">
    {[
      { step:"1", label:"Seller Submits",    color:"#64748b" },
      { step:"2", label:"Agent Verifies",    color:"#d97706" },
      { step:"3", label:"Admin Reviews",     color:"#7c3aed" },
      { step:"4", label:"Property Live",     color:"#16a34a" },
    ].map(({step,label,color},i,arr)=>(
      <div key={step} className="flow-banner-item">
        <div className="flow-step" style={{background:color+"18",color,border:`1.5px solid ${color}40`}}>
          <span className="flow-num">{step}</span> {label}
        </div>
        {i < arr.length-1 && <div className="flow-arrow">→</div>}
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════════════════════════════ */
const OverviewTab=({stats,pending,onApprove,onReject,loadingId})=>{
  // Split pending into two buckets
  const awaitingAgent  = pending.filter(p => !p.agentVerdict || p.agentVerdict === "pending");
  const readyForAdmin  = pending.filter(p => p.agentVerdict === "approved");

  return (
    <div className="tab-body">
      <div className="tab-head">
        <h2 className="tab-title">Site Overview</h2>
        <p className="tab-sub">Real-time snapshot of NestFind platform activity</p>
      </div>

      <FlowBanner />

      <div className="stats-grid">
        <StatCard icon={<IC.Users />}           accent="#2563eb" label="Total Users"        value={stats?.users?.total}              sub={`${stats?.users?.sellers??0} sellers · ${stats?.users?.buyers??0} buyers`}/>
        <StatCard icon={<IC.Building />}         accent="#7c3aed" label="Total Listings"     value={stats?.properties?.total}/>
        <StatCard icon={<IC.Clock />}            accent="#d97706" label="Awaiting Agent"     value={stats?.properties?.awaitingAgent ?? awaitingAgent.length} sub="Agent not yet verified"/>
        <StatCard icon={<IC.ClipboardCheck />}   accent="#7c3aed" label="Ready for Admin"    value={stats?.properties?.readyForAdmin ?? readyForAdmin.length}  sub="Agent approved · needs admin"/>
        <StatCard icon={<IC.Check />}            accent="#16a34a" label="Live Listings"      value={stats?.properties?.approved}/>
        <StatCard icon={<IC.CreditCard />}       accent="#be185d" label="Fee Revenue"        value={fmtPrice(stats?.fees?.collected)}  sub={`${stats?.fees?.unpaid??0} unpaid`}/>
      </div>

      {/* ── Step 2 Queue: Awaiting agent verdict ── */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-title"><IC.Agent style={{color:"#d97706"}}/> Awaiting Agent Verification</h3>
          <span className="badge-count">{awaitingAgent.length} waiting</span>
        </div>
        {awaitingAgent.length===0
          ? <div className="empty"><IC.Check style={{color:"#16a34a"}}/><span>No properties waiting for agent review</span></div>
          : <div className="pending-list">
              {awaitingAgent.map(p=>(
                <div key={p._id} className="pending-row">
                  <div className="pending-thumb">{p.thumbnail?<img src={p.thumbnail} alt=""/>:<IC.Building/>}</div>
                  <div className="pending-info">
                    <div className="pending-title">{p.title}</div>
                    <div className="pending-meta">{p.address?.city}, {p.address?.state} · {fmtPrice(p.price)} · by <strong>{p.userId?.name}</strong></div>
                  </div>
                  <AgentVerdictPill verdict={p.agentVerdict} />
                </div>
              ))}
            </div>
        }
      </div>

      {/* ── Step 3 Queue: Agent approved → Admin must decide ── */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-title"><IC.ShieldCheck style={{color:"#7c3aed"}}/> Ready for Admin Approval</h3>
          <span className="badge-count">{readyForAdmin.length} waiting</span>
        </div>
        {readyForAdmin.length===0
          ? <div className="empty"><IC.Check style={{color:"#16a34a"}}/><span>No properties awaiting admin decision</span></div>
          : <div className="pending-list">
              {readyForAdmin.map(p=>(
                <div key={p._id} className="pending-row">
                  <div className="pending-thumb">{p.thumbnail?<img src={p.thumbnail} alt=""/>:<IC.Building/>}</div>
                  <div className="pending-info">
                    <div className="pending-title">{p.title}</div>
                    <div className="pending-meta">{p.address?.city}, {p.address?.state} · {fmtPrice(p.price)} · by <strong>{p.userId?.name}</strong></div>
                  </div>
                  <div className="row-actions">
                    <AgentVerdictPill verdict="approved" />
                    <button className="btn-approve" onClick={()=>onApprove(p._id)} disabled={loadingId===p._id}><IC.Check/> Approve</button>
                    <button className="btn-reject"  onClick={()=>onReject(p._id)}  disabled={loadingId===p._id}><IC.X/> Reject</button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PROPERTIES TAB
═══════════════════════════════════════════════════════════════ */
const PropertiesTab=({onApprove,onReject,onDelete,loadingId})=>{
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");
  const load=useCallback(async()=>{
    setLoading(true);
    try{
      let q="";
      if(filter==="pending")       q="?approved=false&agentVerdict=pending";
      else if(filter==="agent_approved") q="?approved=false&agentVerdict=approved";
      else if(filter==="approved") q="?approved=true";
      const{data}=await API.get(`/admin/properties${q}`);
      setRows(data.properties||[]);
    }catch(e){console.error(e);}finally{setLoading(false);}
  },[filter]);
  useEffect(()=>{load();},[load]);
  const handleApprove=async(id)=>{await onApprove(id);load();};
  const handleReject =async(id)=>{await onReject(id); load();};
  const handleDelete =async(id)=>{if(!window.confirm("Permanently delete?"))return;await onDelete(id);load();};

  return(
    <div className="tab-body">
      <FlowBanner />
      <div className="tab-head-row">
        <h2 className="tab-title">All Properties</h2>
        <div className="filter-tabs">
          {[
            {key:"all",            label:"All"},
            {key:"pending",        label:"Awaiting Agent"},
            {key:"agent_approved", label:"Ready for Admin"},
            {key:"approved",       label:"Live"},
          ].map(f=>(
            <button key={f.key} className={`ftab${filter===f.key?" on":""}`} onClick={()=>setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="card no-pad">
        {loading?<div className="loading-state"><div className="spinner"/></div>
        :rows.length===0?<div className="empty">No properties found</div>
        :<div className="table-scroll"><table className="data-table">
          <thead>
            <tr>
              {["Property","Seller","Price","Type","City","Agent Verdict","Status","Actions"].map(h=><th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>{rows.map(p=>(
            <tr key={p._id}>
              <td><div className="cell-title">{p.title}</div><div className="cell-sub">{fmtDate(p.createdAt)}</div></td>
              <td><div className="cell-title">{p.userId?.name||"—"}</div><div className="cell-sub">{p.userId?.email}</div></td>
              <td><span className="price-cell">{fmtPrice(p.price)}</span></td>
              <td>{p.propertyInfo?.propertyType}</td>
              <td>{p.address?.city}</td>
              {/* ── NEW: Agent verdict column ── */}
              <td><AgentVerdictPill verdict={p.agentVerdict} /></td>
              <td><ApprovalPill approved={p.isApprovedByCompany} status={p.status} agentVerdict={p.agentVerdict}/></td>
              <td>
                <div className="row-actions">
                  {/* Admin can only approve/revoke after agent approves */}
                  {!p.isApprovedByCompany && p.agentVerdict === "approved" && (
                    <button className="btn-approve sm" onClick={()=>handleApprove(p._id)} disabled={loadingId===p._id}><IC.Check/> Approve</button>
                  )}
                  {!p.isApprovedByCompany && (!p.agentVerdict || p.agentVerdict === "pending") && (
                    <span className="waiting-chip"><IC.Clock/> Awaiting agent</span>
                  )}
                  {p.isApprovedByCompany && (
                    <button className="btn-warn sm" onClick={()=>handleReject(p._id)} disabled={loadingId===p._id}><IC.X/> Revoke</button>
                  )}
                  {!p.isApprovedByCompany && p.agentVerdict === "rejected" && (
                    <span className="rejected-chip"><IC.X/> Agent rejected</span>
                  )}
                  <button className="btn-reject sm" onClick={()=>handleDelete(p._id)} disabled={loadingId===p._id}><IC.Trash/></button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table></div>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   USERS TAB
═══════════════════════════════════════════════════════════════ */
const UsersTab=()=>{
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [roleFilter,setRole]=useState("all");
  const [actionId,setAct]=useState(null);
  const load=useCallback(async()=>{
    setLoading(true);
    try{const p=new URLSearchParams();if(roleFilter!=="all")p.set("role",roleFilter);if(search)p.set("search",search);const{data}=await API.get(`/admin/users?${p}`);setUsers(data.users||[]);}
    catch{}finally{setLoading(false);}
  },[roleFilter,search]);
  useEffect(()=>{const t=setTimeout(load,300);return()=>clearTimeout(t);},[load]);
  const patch=async(id,url,body)=>{setAct(id);try{await API.patch(url,body);load();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setAct(null);};};
  const del=async(id)=>{if(!window.confirm("Delete user and their data?"))return;setAct(id);try{await API.delete(`/admin/users/${id}`);load();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setAct(null);};};
  const approveSeller=(id)=>patch(id,`/admin/users/${id}/approve-seller`,{});
  const changeRole=(id,role)=>patch(id,`/admin/users/${id}/role`,{role});
  const toggle=(id)=>patch(id,`/admin/users/${id}/toggle`,{});
  return(
    <div className="tab-body">
      <div className="tab-head-row">
        <h2 className="tab-title">All Users</h2>
        <div className="search-row">
          <div className="search-box"><IC.Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or email…"/></div>
          <select className="sel" value={roleFilter} onChange={e=>setRole(e.target.value)}>
            <option value="all">All roles</option><option value="buyer">Buyer</option><option value="seller">Seller</option><option value="agent">Agent</option><option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div className="card no-pad">
        {loading?<div className="loading-state"><div className="spinner"/></div>
        :users.length===0?<div className="empty">No users found</div>
        :<div className="table-scroll"><table className="data-table">
          <thead><tr>{["User","Contact","Role","Seller Status","Agent Assigned","Joined","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>{users.map(u=>(
            <tr key={u._id} style={{opacity:u.isActive?1:0.55}}>
              <td><div className="user-cell"><Avatar name={u.name} size={30}/><div><div className="cell-title">{u.name}</div><div className="cell-sub">{u.email}</div></div></div></td>
              <td>{u.contact||"—"}</td>
              <td><RolePill role={u.role}/></td>
              <td>{u.role==="seller"
                ?u.isApprovedByAdmin
                  ?<Pill bg="#d1fae5" color="#065f46" dot="●">Approved</Pill>
                  :<div className="double-action"><Pill bg="#fef3c7" color="#92400e" dot="●">Pending</Pill><button className="btn-xs btn-approve" onClick={()=>approveSeller(u._id)} disabled={actionId===u._id}><IC.UserCheck/> Approve</button></div>
                :<span className="na-text">—</span>
              }</td>
              <td>{u.role==="seller"
                ?u.assignedAgent
                  ?<div className="agent-chip"><div className="agent-chip-av">{u.assignedAgent.name?.charAt(0)}</div><span>{u.assignedAgent.name}</span></div>
                  :<span className="na-text">Not assigned</span>
                :<span className="na-text">—</span>
              }</td>
              <td>{fmtDate(u.createdAt)}</td>
              <td>{u.role!=="admin"&&<div className="row-actions wrap">
                <select className="sel sm" value={u.role} onChange={e=>changeRole(u._id,e.target.value)} disabled={actionId===u._id}>
                  <option value="buyer">Buyer</option><option value="seller">Seller</option><option value="agent">Agent</option><option value="admin">Admin</option>
                </select>
                <button className={u.isActive?"btn-warn sm":"btn-approve sm"} onClick={()=>toggle(u._id)} disabled={actionId===u._id}>{u.isActive?"Deactivate":"Activate"}</button>
                <button className="btn-reject sm" onClick={()=>del(u._id)} disabled={actionId===u._id}><IC.Trash/></button>
              </div>}</td>
            </tr>
          ))}</tbody>
        </table></div>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   AGENT FORM MODAL  (Create + Edit)
═══════════════════════════════════════════════════════════════ */
const EMPTY_AGENT = { name:"", email:"", password:"", contact:"", specialization:"", bio:"" };

const AgentFormModal = ({ agent, onClose, onSaved }) => {
  const isEdit = Boolean(agent?._id);
  const [form, setForm]     = useState(isEdit ? { ...agent, password:"" } : { ...EMPTY_AGENT });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (k, v) => setForm(p => ({...p, [k]: v}));

  const validate = () => {
    const e = {};
    if (!form.name?.trim())   e.name  = "Name is required";
    if (!form.email?.trim())  e.email = "Email is required";
    if (!isEdit && !form.password?.trim()) e.password = "Password is required for new agents";
    if (form.password && form.password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, role: "agent" };
      if (!payload.password) delete payload.password;
      if (isEdit) {
        await API.patch(`/admin/agents/${agent._id}`, payload);
      } else {
        await API.post("/admin/agents", payload);
      }
      onSaved();
      onClose();
    } catch(e) {
      alert(e.response?.data?.message || "Failed to save agent");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-lg" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3 className="modal-title">{isEdit ? "Edit Agent" : "Create New Agent"}</h3>
            <p className="modal-sub">{isEdit ? `Editing ${agent.name}` : "Add a new agent to the platform"}</p>
          </div>
          <button className="modal-close" onClick={onClose}><IC.Close/></button>
        </div>
        <div className="modal-body">
          <div className="form-grid-2">
            <div className="mfield">
              <label className="mfield-label">Full Name *</label>
              <input className={`minput${errors.name?" merr":""}`} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Rahul Sharma" />
              {errors.name && <span className="mfield-err">{errors.name}</span>}
            </div>
            <div className="mfield">
              <label className="mfield-label">Email Address *</label>
              <div className="minput-icon-wrap">
                <IC.Mail/>
                <input className={`minput icon-input${errors.email?" merr":""}`} type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="agent@nestfind.com" />
              </div>
              {errors.email && <span className="mfield-err">{errors.email}</span>}
            </div>
            <div className="mfield">
              <label className="mfield-label">{isEdit ? "New Password" : "Password *"} {isEdit && <span className="mfield-hint">(leave blank to keep current)</span>}</label>
              <div className="minput-icon-wrap">
                <IC.Key/>
                <input
                  className={`minput icon-input${errors.password?" merr":""}`}
                  type={showPw?"text":"password"}
                  value={form.password}
                  onChange={e=>set("password",e.target.value)}
                  placeholder={isEdit?"New password (optional)":"Min 6 characters"}
                />
                <button type="button" className="pw-toggle" onClick={()=>setShowPw(p=>!p)}>
                  {showPw ? <IC.EyeOff/> : <IC.Eye/>}
                </button>
              </div>
              {errors.password && <span className="mfield-err">{errors.password}</span>}
            </div>
            <div className="mfield">
              <label className="mfield-label">Phone / Contact</label>
              <div className="minput-icon-wrap">
                <IC.Phone/>
                <input className="minput icon-input" type="tel" value={form.contact} onChange={e=>set("contact",e.target.value)} placeholder="+91 98765 43210"/>
              </div>
            </div>
            <div className="mfield">
              <label className="mfield-label">Specialization</label>
              <select className="minput" value={form.specialization} onChange={e=>set("specialization",e.target.value)}>
                <option value="">— Select —</option>
                {["Residential","Commercial","Luxury","Rental","Plots & Land","Industrial"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="mfield" style={{marginTop:4}}>
            <label className="mfield-label">Bio / Notes</label>
            <textarea className="minput" rows={3} value={form.bio} onChange={e=>set("bio",e.target.value)} placeholder="Brief description about this agent, experience, areas covered…" style={{resize:"vertical"}}/>
          </div>
          <div className="role-info-box">
            <IC.Agent/>
            <span>This user will be created/updated with the <strong>Agent</strong> role and will appear in the Agents tab.</span>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-ghost-sm" onClick={onClose}>Cancel</button>
          <button className="btn-primary-sm" onClick={handleSubmit} disabled={saving}>
            {saving ? <><div className="btn-spinner-sm"/> Saving…</> : <><IC.Save/> {isEdit?"Save Changes":"Create Agent"}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ASSIGN SELLER MODAL
═══════════════════════════════════════════════════════════════ */
const AssignModal=({agent,unassigned,onAssign,onClose,loading})=>{
  const [pick,setPick]=useState("");
  const [search,setSearch]=useState("");
  const filtered=unassigned.filter(s=>s.name?.toLowerCase().includes(search.toLowerCase())||s.email?.toLowerCase().includes(search.toLowerCase()));
  return(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <div><h3 className="modal-title">Assign Seller</h3><p className="modal-sub">to <strong>{agent.name}</strong></p></div>
          <button className="modal-close" onClick={onClose}><IC.Close/></button>
        </div>
        <div className="modal-body">
          <div className="modal-search"><IC.Search/><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search sellers…"/></div>
          <div className="seller-pick-list">
            {filtered.length===0
              ?<div className="pick-empty">No unassigned sellers</div>
              :filtered.map(s=>(
                <label key={s._id} className={`seller-pick-row${pick===s._id?" selected":""}`}>
                  <input type="radio" name="sp" value={s._id} checked={pick===s._id} onChange={()=>setPick(s._id)} style={{display:"none"}}/>
                  <Avatar name={s.name} size={34}/>
                  <div className="pick-info"><div className="pick-name">{s.name}</div><div className="pick-email">{s.email}</div></div>
                  {pick===s._id&&<div className="pick-check"><IC.Check/></div>}
                </label>
              ))
            }
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-ghost-sm" onClick={onClose}>Cancel</button>
          <button className="btn-primary-sm" onClick={()=>pick&&onAssign(agent._id,pick)} disabled={!pick||loading}>
            {loading?<><div className="btn-spinner-sm"/> Assigning…</>:<><IC.Link/> Assign</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   AGENT DETAIL DRAWER
═══════════════════════════════════════════════════════════════ */
const AgentDrawer=({agent,sellers,onUnassign,onEdit,onClose,loading})=>{
  const mySellers=sellers.filter(s=>s.assignedAgent?._id===agent._id||s.assignedAgent===agent._id);
  return(
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={e=>e.stopPropagation()}>
        <div className="drawer-head">
          <button className="modal-close" onClick={onClose}><IC.Close/></button>
          <h3 className="drawer-title">Agent Profile</h3>
          <button className="btn-edit-drawer" onClick={()=>onEdit(agent)}><IC.Edit/> Edit</button>
        </div>
        <div className="drawer-body">
          <div className="drawer-hero">
            <Avatar name={agent.name} size={64}/>
            <div className="drawer-hero-info">
              <div className="drawer-name">{agent.name}</div>
              <div className="drawer-email">{agent.email}</div>
              {agent.contact&&<div className="drawer-contact"><IC.Phone/> {agent.contact}</div>}
              {agent.specialization&&<div className="drawer-spec"><IC.Award/> {agent.specialization}</div>}
              <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>
                <Pill bg={agent.isActive?"#d1fae5":"#fee2e2"} color={agent.isActive?"#065f46":"#991b1b"} dot="●">{agent.isActive?"Active":"Inactive"}</Pill>
                <Pill bg="#d1fae5" color="#065f46">Agent</Pill>
              </div>
            </div>
          </div>
          {agent.bio&&<div className="drawer-bio">{agent.bio}</div>}
          <div className="drawer-stats">
            {[
              {label:"Sellers",  value:mySellers.length,                                      icon:<IC.Users/>},
              {label:"Listings", value:mySellers.reduce((a,s)=>a+(s.propertyCount||0),0),     icon:<IC.Building/>},
              {label:"Joined",   value:fmtDate(agent.createdAt),                              icon:<IC.Award/>},
            ].map(s=>(
              <div key={s.label} className="drawer-stat">
                <div className="ds-icon">{s.icon}</div>
                <div className="ds-val">{s.value}</div>
                <div className="ds-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="drawer-section-title"><IC.Users/> Assigned Sellers ({mySellers.length})</div>
          {mySellers.length===0
            ?<div className="drawer-empty">No sellers assigned yet.</div>
            :<div className="drawer-seller-list">
                {mySellers.map(s=>(
                  <div key={s._id} className="drawer-seller-row">
                    <Avatar name={s.name} size={36}/>
                    <div className="drawer-seller-info">
                      <div className="dsi-name">{s.name}</div>
                      <div className="dsi-email">{s.email}</div>
                    </div>
                    <div className="drawer-seller-meta">
                      <Pill bg={s.isApprovedByAdmin?"#d1fae5":"#fef3c7"} color={s.isApprovedByAdmin?"#065f46":"#92400e"}>{s.isApprovedByAdmin?"Approved":"Pending"}</Pill>
                      <button className="unassign-btn" onClick={()=>onUnassign(agent._id,s._id)} disabled={loading}><IC.Unlink/> Remove</button>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   AGENT CARD (grid)
═══════════════════════════════════════════════════════════════ */
const AgentCard=({agent,assignedCount,onView,onEdit,onToggle,onAssign,onDelete,canAssign,loading})=>{
  const [bg]=avatarColor(agent.name);
  return(
    <div className={`ag-card${!agent.isActive?" ag-inactive":""}`}>
      <div className="ag-accent" style={{background:bg}}/>
      <div className="ag-body">
        <div className="ag-header">
          <Avatar name={agent.name} size={48}/>
          <div className="ag-header-info">
            <div className="ag-name">{agent.name}</div>
            <div className="ag-email">{agent.email}</div>
            {agent.specialization&&<div className="ag-spec">{agent.specialization}</div>}
          </div>
          <Pill bg={agent.isActive?"#d1fae5":"#f1f5f9"} color={agent.isActive?"#065f46":"#64748b"} dot="●">{agent.isActive?"Active":"Off"}</Pill>
        </div>
        {agent.contact&&<div className="ag-contact"><IC.Phone/> {agent.contact}</div>}
        {agent.bio&&<div className="ag-bio">{agent.bio}</div>}
        <div className="ag-stats">
          <div className="ags-item"><div className="ags-val">{assignedCount}</div><div className="ags-label">Sellers</div></div>
          <div className="ags-div"/>
          <div className="ags-item"><div className="ags-val">{agent.totalListings??0}</div><div className="ags-label">Listings</div></div>
          <div className="ags-div"/>
          <div className="ags-item"><div className="ags-val" style={{fontSize:11}}>{fmtDate(agent.createdAt)}</div><div className="ags-label">Joined</div></div>
        </div>
        <div className="ag-actions">
          <button className="ag-btn view-btn" onClick={()=>onView(agent)}><IC.Eye/> View</button>
          <button className="ag-btn edit-ag-btn" onClick={()=>onEdit(agent)}><IC.Edit/> Edit</button>
          {agent.isActive&&canAssign&&<button className="ag-btn assign-btn" onClick={()=>onAssign(agent)}><IC.Link/> Assign</button>}
          <div className="ag-actions-right">
            <button className={`ag-icon-btn${agent.isActive?" deact-btn":" act-btn"}`} onClick={()=>onToggle(agent._id)} disabled={loading===agent._id} title={agent.isActive?"Deactivate":"Activate"}>{agent.isActive?<IC.X/>:<IC.Check/>}</button>
            <button className="ag-icon-btn del-btn" onClick={()=>onDelete(agent._id)} disabled={loading===agent._id} title="Delete"><IC.Trash/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   AGENT ROW (list)
═══════════════════════════════════════════════════════════════ */
const AgentRow=({agent,assignedCount,onView,onEdit,onToggle,onAssign,onDelete,canAssign,loading})=>(
  <tr className={!agent.isActive?"row-inactive":""}>
    <td><div className="user-cell"><Avatar name={agent.name} size={32}/><div><div className="cell-title">{agent.name}</div><div className="cell-sub">{agent.email}</div></div></div></td>
    <td>{agent.contact?<div style={{display:"flex",alignItems:"center",gap:5,fontSize:12.5,color:"#475569"}}><IC.Phone/>{agent.contact}</div>:<span className="na-text">—</span>}</td>
    <td>{agent.specialization||<span className="na-text">—</span>}</td>
    <td><span style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{assignedCount}</span> <span className="na-text">seller{assignedCount!==1?"s":""}</span></td>
    <td><Pill bg={agent.isActive?"#d1fae5":"#f1f5f9"} color={agent.isActive?"#065f46":"#64748b"} dot="●">{agent.isActive?"Active":"Inactive"}</Pill></td>
    <td>{fmtDate(agent.createdAt)}</td>
    <td><div className="row-actions">
      <button className="btn-xs-outline" onClick={()=>onView(agent)}><IC.Eye/> View</button>
      <button className="btn-xs-blue"    onClick={()=>onEdit(agent)}><IC.Edit/> Edit</button>
      {agent.isActive&&canAssign&&<button className="btn-xs-green" onClick={()=>onAssign(agent)}><IC.Link/> Assign</button>}
      <button className={agent.isActive?"btn-xs-warn":"btn-xs-green"} onClick={()=>onToggle(agent._id)} disabled={loading===agent._id}>{agent.isActive?"Deactivate":"Activate"}</button>
      <button className="btn-xs-red" onClick={()=>onDelete(agent._id)} disabled={loading===agent._id}><IC.Trash/></button>
    </div></td>
  </tr>
);

/* ═══════════════════════════════════════════════════════════════
   AGENTS TAB
═══════════════════════════════════════════════════════════════ */
const AgentsTab=()=>{
  const [agents,  setAgents]  = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId,setAct]     = useState(null);
  const [view,    setView]    = useState("grid");
  const [search,  setSearch]  = useState("");
  const [statusF, setStatusF] = useState("all");
  const [drawerAg,setDrawer]  = useState(null);
  const [assignAg,setAssignAg]= useState(null);
  const [assignLd,setAssignLd]= useState(false);
  const [formAg,  setFormAg]  = useState(null);

  const load=useCallback(async()=>{
    setLoading(true);
    try{
      const [agR,slR]=await Promise.all([API.get("/admin/agents"),API.get("/admin/users?role=seller")]);
      setAgents(agR.data.agents||agR.data.users||[]);
      setSellers(slR.data.users||[]);
    }catch(e){console.error(e);}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const assignedCount=(agentId)=>sellers.filter(s=>s.assignedAgent?._id===agentId||s.assignedAgent===agentId).length;
  const unassignedSellers=sellers.filter(s=>!s.assignedAgent);

  const handleToggle=async(id)=>{setAct(id);try{await API.patch(`/admin/users/${id}/toggle`);load();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setAct(null);};};
  const handleDelete=async(id)=>{
    if(!window.confirm("Permanently delete this agent? Their sellers will be unassigned."))return;
    setAct(id);try{await API.delete(`/admin/agents/${id}`);load();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setAct(null);};
  };
  const handleAssign=async(agentId,sellerId)=>{setAssignLd(true);try{await API.patch(`/admin/agents/${agentId}/assign-seller`,{sellerId});setAssignAg(null);load();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setAssignLd(false);};};
  const handleUnassign=async(agentId,sellerId)=>{
    if(!window.confirm("Remove this seller from the agent?"))return;
    setAct(agentId);try{await API.patch(`/admin/agents/${agentId}/unassign-seller`,{sellerId});load();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setAct(null);};
  };
  const handleEdit=(agent)=>{setDrawer(null);setFormAg(agent);};

  const filtered=agents.filter(ag=>{
    const ms=ag.name?.toLowerCase().includes(search.toLowerCase())||ag.email?.toLowerCase().includes(search.toLowerCase())||ag.contact?.includes(search);
    const mf=statusF==="all"||(statusF==="active"&&ag.isActive)||(statusF==="inactive"&&!ag.isActive);
    return ms&&mf;
  });

  const totalActive  =agents.filter(a=>a.isActive).length;
  const totalAssigned=sellers.filter(s=>s.assignedAgent).length;

  return(
    <div className="tab-body">
      <div className="tab-head-row">
        <div><h2 className="tab-title">Agent Management</h2><p className="tab-sub">Create, edit, and assign agents to sellers</p></div>
        <button className="btn-create-agent" onClick={()=>setFormAg({})}>
          <IC.Plus/> Create Agent
        </button>
      </div>

      <div className="ag-summary">
        {[
          {label:"Total Agents",       val:agents.length,               sub:`${totalActive} active`,                     color:"#2563eb"},
          {label:"Active Agents",      val:totalActive,                 sub:`${agents.length-totalActive} inactive`,     color:"#16a34a"},
          {label:"Sellers Assigned",   val:totalAssigned,               sub:"have an agent",                             color:"#7c3aed"},
          {label:"Unassigned Sellers", val:sellers.length-totalAssigned,sub:"need an agent",                             color:sellers.length-totalAssigned>0?"#d97706":"#16a34a"},
        ].map(s=>(
          <div key={s.label} className="ag-sc">
            <div className="ag-sc-val" style={{color:s.color}}>{s.val}</div>
            <div className="ag-sc-label">{s.label}</div>
            <div className="ag-sc-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="ag-toolbar">
        <div className="ag-toolbar-l">
          <div className="ag-search"><IC.Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search agents…"/></div>
          <div className="ag-fpills">
            {["all","active","inactive"].map(f=><button key={f} className={`ag-fpill${statusF===f?" on":""}`} onClick={()=>setStatusF(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>)}
          </div>
        </div>
        <div className="ag-toolbar-r">
          <span className="ag-count">{filtered.length} agent{filtered.length!==1?"s":""}</span>
          <div className="ag-vtoggle">
            <button className={`ag-vbtn${view==="grid"?" on":""}`} onClick={()=>setView("grid")}><IC.GridSm/></button>
            <button className={`ag-vbtn${view==="list"?" on":""}`} onClick={()=>setView("list")}><IC.ListSm/></button>
          </div>
        </div>
      </div>

      {loading&&<div className="loading-state" style={{padding:80}}><div className="spinner" style={{width:32,height:32,borderWidth:3}}/></div>}

      {!loading&&agents.length===0&&(
        <div className="ag-empty-state">
          <div className="ag-empty-icon"><IC.Agent/></div>
          <h3>No agents yet</h3>
          <p>Create your first agent to start assigning sellers.</p>
          <button className="btn-create-agent" onClick={()=>setFormAg({})}><IC.Plus/> Create First Agent</button>
        </div>
      )}

      {!loading&&view==="grid"&&filtered.length>0&&(
        <div className="ag-grid">
          {filtered.map(ag=>(
            <AgentCard key={ag._id} agent={ag} assignedCount={assignedCount(ag._id)}
              onView={setDrawer} onEdit={handleEdit} onToggle={handleToggle}
              onAssign={setAssignAg} onDelete={handleDelete}
              canAssign={unassignedSellers.length>0} loading={actionId}/>
          ))}
        </div>
      )}

      {!loading&&view==="list"&&filtered.length>0&&(
        <div className="ag-table-wrap">
          <table className="ag-table">
            <thead><tr>{["Agent","Contact","Specialization","Sellers","Status","Joined","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(ag=>(
              <AgentRow key={ag._id} agent={ag} assignedCount={assignedCount(ag._id)}
                onView={setDrawer} onEdit={handleEdit} onToggle={handleToggle}
                onAssign={setAssignAg} onDelete={handleDelete}
                canAssign={unassignedSellers.length>0} loading={actionId}/>
            ))}</tbody>
          </table>
        </div>
      )}

      {!loading&&filtered.length===0&&agents.length>0&&(
        <div className="empty"><IC.Search/><span>No agents match your search</span></div>
      )}

      {formAg!==null&&<AgentFormModal agent={formAg?._id?formAg:null} onClose={()=>setFormAg(null)} onSaved={load}/>}
      {assignAg&&<AssignModal agent={assignAg} unassigned={unassignedSellers} onAssign={handleAssign} onClose={()=>setAssignAg(null)} loading={assignLd}/>}
      {drawerAg&&<AgentDrawer agent={drawerAg} sellers={sellers} onUnassign={handleUnassign} onEdit={handleEdit} onClose={()=>setDrawer(null)} loading={actionId}/>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FEES TAB
═══════════════════════════════════════════════════════════════ */
const FeesTab=()=>{
  const [fees,setFees]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");
  const [actionId,setAct]=useState(null);
  const [editId,setEditId]=useState(null);
  const [editAmt,setEditAmt]=useState("");
  const load=useCallback(async()=>{setLoading(true);try{const q=filter!=="all"?`?status=${filter}`:"";const{data}=await API.get(`/admin/fees${q}`);setFees(data.fees||[]);}catch{}finally{setLoading(false);};},[filter]);
  useEffect(()=>{load();},[load]);
  const markPaid=async(id)=>{setAct(id);try{await API.patch(`/admin/fees/${id}/mark-paid`);load();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setAct(null);};};
  const waive   =async(id)=>{if(!window.confirm("Waive?"))return;setAct(id);try{await API.patch(`/admin/fees/${id}/waive`);load();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setAct(null);};};
  const updAmt  =async(id)=>{setAct(id);try{await API.patch(`/admin/fees/${id}`,{amount:Number(editAmt)});setEditId(null);load();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setAct(null);};};
  const totalC=fees.filter(f=>f.status==="paid").reduce((a,f)=>a+(f.amount||0),0);
  const totalP=fees.filter(f=>f.status==="unpaid").reduce((a,f)=>a+(f.amount||0),0);
  return(
    <div className="tab-body">
      <div className="tab-head"><h2 className="tab-title">Seller Fees</h2><p className="tab-sub">Charge and track fees for sellers listing on NestFind</p></div>
      <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <StatCard icon={<IC.CreditCard/>} accent="#16a34a" label="Collected"   value={fmtPrice(totalC)}/>
        <StatCard icon={<IC.Alert/>}      accent="#dc2626" label="Outstanding" value={fmtPrice(totalP)} sub={`${fees.filter(f=>f.status==="unpaid").length} unpaid`}/>
        <StatCard icon={<IC.TrendUp/>}    accent="#7c3aed" label="Total Fees"  value={fees.length} sub="all time"/>
      </div>
      <div className="card no-pad">
        <div className="card-head" style={{padding:"12px 16px"}}>
          <div className="filter-tabs">{["all","unpaid","paid","waived"].map(f=><button key={f} className={`ftab${filter===f?" on":""}`} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>)}</div>
        </div>
        {loading?<div className="loading-state"><div className="spinner"/></div>
        :fees.length===0?<div className="empty">No fee records found</div>
        :<div className="table-scroll"><table className="data-table">
          <thead><tr>{["Seller","Property","Amount","Status","Due Date","Actions"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>{fees.map(f=>(
            <tr key={f._id}>
              <td><div className="user-cell"><Avatar name={f.sellerId?.name} size={26}/><div><div className="cell-title">{f.sellerId?.name||"—"}</div><div className="cell-sub">{f.sellerId?.email}</div></div></div></td>
              <td><div className="cell-title" style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.propertyId?.title||"—"}</div><div className="cell-sub">{f.feeType||"Listing Fee"}</div></td>
              <td>{editId===f._id?<div className="edit-inline"><input className="amount-input" type="number" value={editAmt} onChange={e=>setEditAmt(e.target.value)}/><button className="btn-approve sm" onClick={()=>updAmt(f._id)} disabled={actionId===f._id}><IC.Check/></button><button className="btn-ghost sm" onClick={()=>setEditId(null)}>✕</button></div>:<span className="price-cell" style={{cursor:"pointer"}} onClick={()=>{setEditId(f._id);setEditAmt(f.amount);}}>{fmtPrice(f.amount)} <IC.Edit style={{opacity:0.4,verticalAlign:"middle"}}/></span>}</td>
              <td><FeePill status={f.status}/></td>
              <td><span className={f.status==="unpaid"&&new Date(f.dueDate)<new Date()?"overdue-text":""}>{fmtDate(f.dueDate)}</span></td>
              <td><div className="row-actions">
                {f.status==="unpaid"&&<><button className="btn-approve sm" onClick={()=>markPaid(f._id)} disabled={actionId===f._id}><IC.Check/> Mark Paid</button><button className="btn-ghost sm" onClick={()=>waive(f._id)} disabled={actionId===f._id}>Waive</button></>}
                {f.status==="paid"&&<span className="na-text">Settled</span>}
                {f.status==="waived"&&<span className="na-text">Waived</span>}
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>}
      </div>
    </div>
  );
};
const CommissionsTab = () => {

  const [rows, setRows] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("all");

  const [actionId, setActionId] =
    useState(null);

  const load = useCallback(
    async () => {

      setLoading(true);

      try {

        const q =
          filter !== "all"
            ? `?status=${filter}`
            : "";

        const { data } =
          await API.get(
            `/admin/commissions${q}`
          );

        setRows(
          data.commissions || []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    },
    [filter]
  );

  useEffect(() => {

    load();

  }, [load]);

  const markPaid =
    async (id) => {

      setActionId(id);

      try {

        await API.patch(
          `/admin/commissions/${id}/pay`
        );

        load();

      } catch (err) {

        alert(
          err.response?.data
            ?.message ||
            "Failed"
        );

      } finally {

        setActionId(null);
      }
    };

  const totalPaid =
    rows
      .filter(
        (r) =>
          r.status === "paid"
      )
      .reduce(
        (a, r) =>
          a + (r.amount || 0),
        0
      );

  const totalPending =
    rows
      .filter(
        (r) =>
          r.status ===
          "pending"
      )
      .reduce(
        (a, r) =>
          a + (r.amount || 0),
        0
      );

  return (

    <div className="tab-body">

      <div className="tab-head">

        <h2 className="tab-title">

          Agent Commissions

        </h2>

        <p className="tab-sub">

          Manage all agent payouts
          and commissions

        </p>

      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{
          gridTemplateColumns:
            "repeat(3,1fr)",
        }}
      >

        <StatCard
          icon={<IC.CreditCard />}
          accent="#16a34a"
          label="Paid"
          value={fmtPrice(
            totalPaid
          )}
        />

        <StatCard
          icon={<IC.Alert />}
          accent="#dc2626"
          label="Pending"
          value={fmtPrice(
            totalPending
          )}
        />

        <StatCard
          icon={<IC.TrendUp />}
          accent="#2563eb"
          label="Total Commissions"
          value={rows.length}
        />

      </div>

      {/* Filters */}
      <div className="filter-tabs">

        {[
          "all",
          "pending",
          "paid",
        ].map((f) => (

          <button
            key={f}
            className={`ftab ${
              filter === f
                ? "on"
                : ""
            }`}
            onClick={() =>
              setFilter(f)
            }
          >

            {f}

          </button>

        ))}

      </div>

      {/* Table */}
      <div className="card no-pad">

        {loading ? (

          <div className="loading-state">

            <div className="spinner" />

          </div>

        ) : rows.length === 0 ? (

          <div className="empty">

            No commissions found

          </div>

        ) : (

          <div className="table-scroll">

            <table className="data-table">

              <thead>

                <tr>

                  <th>Agent</th>

                  <th>Property</th>

                  <th>Seller</th>

                  <th>Amount</th>

                  <th>Status</th>

                  <th>Date</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {rows.map((r) => (

                  <tr key={r._id}>

                    {/* Agent */}
                    <td>

                      <div className="user-cell">

                        <Avatar
                          name={
                            r.agentId
                              ?.name
                          }
                          size={30}
                        />

                        <div>

                          <div className="cell-title">

                            {
                              r.agentId
                                ?.name
                            }

                          </div>

                          <div className="cell-sub">

                            {
                              r.agentId
                                ?.email
                            }

                          </div>

                        </div>

                      </div>

                    </td>

                    {/* Property */}
                    <td>

                      <div className="cell-title">

                        {
                          r.propertyId
                            ?.title
                        }

                      </div>

                    </td>

                    {/* Seller */}
                    <td>

                      <div className="cell-title">

                        {
                          r.sellerId
                            ?.name
                        }

                      </div>

                    </td>

                    {/* Amount */}
                    <td>

                      <span className="price-cell">

                        {fmtPrice(
                          r.amount
                        )}

                      </span>

                    </td>

                    {/* Status */}
                    <td>

                      {r.status ===
                      "paid" ? (

                        <Pill
                          bg="#d1fae5"
                          color="#065f46"
                          dot="●"
                        >

                          Paid

                        </Pill>

                      ) : (

                        <Pill
                          bg="#fee2e2"
                          color="#991b1b"
                          dot="●"
                        >

                          Pending

                        </Pill>

                      )}

                    </td>

                    {/* Date */}
                    <td>

                      {fmtDate(
                        r.createdAt
                      )}

                    </td>

                    {/* Actions */}
                    <td>

                      {r.status !==
                        "paid" && (

                        <button
                          className="btn-approve sm"
                          onClick={() =>
                            markPaid(
                              r._id
                            )
                          }
                          disabled={
                            actionId ===
                            r._id
                          }
                        >

                          <IC.Check />

                          Mark Paid

                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};
/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD
═══════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const {user,logout}=useContext(AuthContext);
  const navigate=useNavigate();
  const [tab,setTab]=useState("overview");
  const [stats,setStats]=useState(null);
  const [pending,setPend]=useState([]);
  const [loadId,setLoadId]=useState(null);

  const fetchAll=useCallback(async()=>{
    try{
      const [st,pd]=await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/properties?approved=false"),
      ]);
      setStats(st.data);
      setPend(pd.data.properties||[]);
    }catch(e){console.error(e);}
  },[]);
  useEffect(()=>{fetchAll();},[fetchAll]);

  const handleApprove   =async(id)=>{setLoadId(id);try{await API.patch(`/admin/properties/${id}/approve`);fetchAll();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setLoadId(null);};};
  const handleReject    =async(id)=>{setLoadId(id);try{await API.patch(`/admin/properties/${id}/reject`); fetchAll();}catch(e){alert(e.response?.data?.message||"Failed");}finally{setLoadId(null);};};
  const handleDeleteProp=async(id)=>{try{await API.delete(`/admin/properties/${id}`);fetchAll();}catch(e){alert(e.response?.data?.message||"Failed");};};

  // Badge counts
  const awaitingAgent = pending.filter(p => !p.agentVerdict || p.agentVerdict === "pending").length;
  const readyForAdmin = pending.filter(p => p.agentVerdict === "approved").length;
  const badgeCounts={
    overview: pending.length,
    properties: stats?.properties?.pending ?? 0,
    fees: stats?.fees?.unpaid ?? 0,
  };

  return(
    <div className="admin-layout">
      <Sidebar tab={tab} setTab={setTab} user={user} badgeCounts={badgeCounts} onLogout={async()=>{await logout();navigate("/auth/login");}}/>
      <main className="admin-main">
        <div className="topbar">
          <div>
            <h1 className="topbar-title">Admin Dashboard</h1>
            <p className="topbar-sub">Full control over NestFind · Logged in as <strong>{user?.name}</strong></p>
          </div>
          {(awaitingAgent > 0 || readyForAdmin > 0 || stats?.fees?.unpaid > 0) && (
            <div className="topbar-alerts">
              {awaitingAgent > 0 && (
                <div className="alert-chip amber"><IC.Agent/> {awaitingAgent} awaiting agent</div>
              )}
              {readyForAdmin > 0 && (
                <div className="alert-chip purple"><IC.ShieldCheck/> {readyForAdmin} ready for admin</div>
              )}
              {stats?.fees?.unpaid > 0 && (
                <div className="alert-chip red"><IC.Dollar/> {stats.fees.unpaid} unpaid fee{stats.fees.unpaid!==1?"s":""}</div>
              )}
            </div>
          )}
        </div>
        {tab==="overview"   &&<OverviewTab stats={stats} pending={pending} onApprove={handleApprove} onReject={handleReject} loadingId={loadId}/>}
        {tab==="properties" &&<PropertiesTab onApprove={handleApprove} onReject={handleReject} onDelete={handleDeleteProp} loadingId={loadId}/>}
        {tab==="users"      &&<UsersTab/>}
        {tab==="agents"     &&<AgentsTab/>}
        {tab==="fees"       &&<FeesTab/>}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#f1f3f6;--surf:#fff;--bdr:#e4e7ec;
          --t1:#0f172a;--t2:#475569;--t3:#94a3b8;
          --sb:#0d1117;--sb2:#161b22;--sb-bdr:#21262d;--sb-t:#c9d1d9;--sb-m:#8b949e;
          --acc:#2563eb;--acc2:#dbeafe;
          --green:#16a34a;--red:#dc2626;--amber:#d97706;
          --radius:10px;
          --shadow:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);
          --shadow-md:0 4px 12px rgba(0,0,0,.08);
          font-family:'Plus Jakarta Sans',system-ui,sans-serif;
        }

        /* Layout */
        .admin-layout{display:flex;min-height:100vh;background:var(--bg);}

        /* Sidebar */
        .sidebar{width:232px;min-width:232px;background:var(--sb);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;border-right:1px solid var(--sb-bdr);}
        .sb-logo{display:flex;align-items:center;gap:10px;padding:20px 18px 16px;border-bottom:1px solid var(--sb-bdr);}
        .sb-logo-mark{width:36px;height:36px;background:var(--acc);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
        .sb-logo-name{font-size:16px;font-weight:800;color:#fff;letter-spacing:-.3px;}
        .sb-logo-sub{font-size:10px;font-weight:700;color:#f59e0b;letter-spacing:.08em;text-transform:uppercase;}
        .sb-user{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--sb-bdr);}
        .sb-avatar{width:32px;height:32px;border-radius:50%;background:var(--acc);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .sb-uname{font-size:12.5px;font-weight:600;color:#e2e8f0;}
        .sb-uemail{font-size:10.5px;color:var(--sb-m);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;}
        .sb-nav{flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:2px;}
        .sb-nav-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--sb-m);padding:4px 8px 6px;}
        .sb-item{display:flex;align-items:center;gap:9px;padding:9px 10px;font-size:13px;font-weight:500;color:var(--sb-m);background:none;border:none;border-radius:7px;cursor:pointer;width:100%;text-align:left;font-family:inherit;transition:background .12s,color .12s;}
        .sb-item span{flex:1;}.sb-item:hover{background:var(--sb2);color:var(--sb-t);}
        .sb-item.active{background:var(--sb2);color:#fff;border:1px solid var(--sb-bdr);}
        .sb-badge{background:#1e293b;color:#93c5fd;font-size:10.5px;font-weight:700;padding:1px 7px;border-radius:20px;}
        .sb-logout{margin:12px;padding:9px 14px;background:transparent;color:var(--sb-m);border:1px solid var(--sb-bdr);border-radius:8px;cursor:pointer;font-size:12.5px;font-family:inherit;font-weight:500;display:flex;align-items:center;gap:8px;transition:background .12s,color .12s;}
        .sb-logout:hover{background:var(--sb2);color:#e2e8f0;}

        /* Main */
        .admin-main{flex:1;overflow-y:auto;min-width:0;}
        .topbar{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:24px 28px 20px;background:var(--surf);border-bottom:1px solid var(--bdr);}
        .topbar-title{font-size:20px;font-weight:800;color:var(--t1);letter-spacing:-.4px;}
        .topbar-sub{font-size:13px;color:var(--t2);margin-top:2px;}.topbar-sub strong{color:var(--t1);}
        .topbar-alerts{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
        .alert-chip{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:6px 12px;border-radius:8px;}
        .alert-chip.amber{background:#fef3c7;color:#92400e;border:1px solid #fcd34d;}
        .alert-chip.red{background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;}
        .alert-chip.purple{background:#ede9fe;color:#4c1d95;border:1px solid #c4b5fd;}

        /* Flow Banner */
        .flow-banner{display:flex;align-items:center;gap:6px;flex-wrap:wrap;background:var(--surf);border:1px solid var(--bdr);border-radius:var(--radius);padding:12px 18px;box-shadow:var(--shadow);}
        .flow-banner-item{display:flex;align-items:center;gap:6px;}
        .flow-step{display:inline-flex;align-items:center;gap:7px;padding:5px 13px;border-radius:20px;font-size:12px;font-weight:700;}
        .flow-num{font-size:10px;font-weight:800;opacity:.7;}
        .flow-arrow{font-size:14px;color:var(--t3);font-weight:700;}

        /* Tab */
        .tab-body{padding:24px 28px;display:flex;flex-direction:column;gap:20px;}
        .tab-head{display:flex;flex-direction:column;gap:3px;}
        .tab-head-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
        .tab-title{font-size:18px;font-weight:700;color:var(--t1);letter-spacing:-.3px;}
        .tab-sub{font-size:13px;color:var(--t2);}

        /* Stats */
        .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;}
        .stat-card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow);transition:box-shadow .2s,transform .2s;}
        .stat-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px);}
        .stat-icon-wrap{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
        .stat-val{font-size:26px;font-weight:800;color:var(--t1);letter-spacing:-1px;line-height:1;}
        .stat-label{font-size:12.5px;font-weight:600;color:var(--t1);margin-top:5px;}
        .stat-sub{font-size:11px;color:var(--t3);margin-top:2px;}

        /* Card */
        .card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow);}
        .card.no-pad{padding:0;overflow:hidden;}
        .card-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--bdr);}
        .card-title{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:700;color:var(--t1);}
        .badge-count{font-size:12px;color:var(--t3);background:var(--bg);padding:3px 10px;border-radius:20px;border:1px solid var(--bdr);}

        /* Pending */
        .pending-list{display:flex;flex-direction:column;gap:10px;padding:14px;}
        .pending-row{display:flex;align-items:center;gap:12px;padding:11px 14px;background:#fafbfd;border:1px solid var(--bdr);border-radius:9px;transition:background .12s;}
        .pending-row:hover{background:#f1f5f9;}
        .pending-thumb{width:46px;height:46px;border-radius:8px;background:var(--bg);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--t3);border:1px solid var(--bdr);}
        .pending-thumb img{width:100%;height:100%;object-fit:cover;}
        .pending-info{flex:1;min-width:0;}
        .pending-title{font-size:13px;font-weight:600;color:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .pending-meta{font-size:11.5px;color:var(--t3);margin-top:2px;}.pending-meta strong{color:var(--t2);}

        /* Waiting/rejected chips in table */
        .waiting-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--t3);padding:4px 9px;border-radius:6px;background:#f8fafc;border:1px solid var(--bdr);}
        .rejected-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:#991b1b;padding:4px 9px;border-radius:6px;background:#fee2e2;border:1px solid #fca5a5;}

        /* Table */
        .table-scroll{overflow-x:auto;}
        .data-table{width:100%;border-collapse:collapse;font-size:13px;}
        .data-table th{text-align:left;padding:10px 14px;color:var(--t3);font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.06em;background:#fafbfd;border-bottom:1px solid var(--bdr);}
        .data-table td{padding:12px 14px;border-bottom:1px solid #f1f5f9;vertical-align:middle;color:var(--t2);}
        .data-table tr:last-child td{border-bottom:none;}
        .data-table tr:hover td{background:#fafbfd;}
        .cell-title{font-weight:600;color:var(--t1);font-size:13px;}
        .cell-sub{font-size:11px;color:var(--t3);margin-top:1px;}
        .price-cell{font-weight:700;color:var(--t1);font-variant-numeric:tabular-nums;}
        .user-cell{display:flex;align-items:center;gap:9px;}
        .na-text{font-size:12px;color:var(--t3);}
        .overdue-text{color:var(--red);font-weight:600;}

        /* Buttons */
        button{font-family:inherit;}
        .row-actions{display:flex;align-items:center;gap:6px;}
        .row-actions.wrap{flex-wrap:wrap;}
        .double-action{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
        .btn-approve,.btn-reject,.btn-warn,.btn-ghost{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;padding:7px 13px;border-radius:7px;cursor:pointer;border:none;transition:opacity .15s,transform .1s;}
        .btn-approve{background:#d1fae5;color:#065f46;}.btn-approve:hover{background:#a7f3d0;}
        .btn-reject{background:#fee2e2;color:#991b1b;border:1px solid #fca5a5!important;}.btn-reject:hover{background:#fecaca;}
        .btn-warn{background:#fef3c7;color:#92400e;}.btn-warn:hover{background:#fde68a;}
        .btn-ghost{background:var(--bg);color:var(--t2);border:1px solid var(--bdr)!important;}.btn-ghost:hover{background:var(--bdr);}
        .btn-approve.sm,.btn-reject.sm,.btn-warn.sm,.btn-ghost.sm{font-size:11.5px;padding:5px 10px;border-radius:6px;}
        .btn-xs{font-size:11px;padding:3px 8px;border-radius:5px;}
        button:disabled{opacity:.5;cursor:not-allowed;}
        button:active:not(:disabled){transform:scale(.97);}

        /* Filter/Search */
        .filter-tabs{display:flex;gap:6px;flex-wrap:wrap;}
        .ftab{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--bdr);background:none;color:var(--t2);font-family:inherit;transition:background .12s,color .12s,border-color .12s;}
        .ftab:hover{background:var(--bg);}.ftab.on{background:var(--t1);color:#fff;border-color:var(--t1);}
        .search-row{display:flex;gap:8px;align-items:center;}
        .search-box{display:flex;align-items:center;gap:8px;border:1px solid var(--bdr);border-radius:8px;padding:7px 12px;background:var(--surf);color:var(--t3);}
        .search-box input{border:none;outline:none;font-size:13px;font-family:inherit;color:var(--t1);width:200px;background:transparent;}
        .sel{padding:7px 10px;border:1px solid var(--bdr);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surf);color:var(--t1);cursor:pointer;outline:none;}
        .sel.sm{font-size:11.5px;padding:4px 8px;border-radius:6px;}

        /* Users misc */
        .agent-chip{display:flex;align-items:center;gap:8px;}
        .agent-chip-av{width:24px;height:24px;border-radius:50%;background:var(--acc);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

        /* Inline edit */
        .edit-inline{display:flex;align-items:center;gap:6px;}
        .amount-input{padding:4px 8px;border:1px solid var(--acc);border-radius:6px;font-size:13px;font-family:inherit;outline:none;width:100px;color:var(--t1);}

        /* States */
        .loading-state{display:flex;justify-content:center;align-items:center;padding:56px;}
        .spinner{width:24px;height:24px;border:2.5px solid var(--bdr);border-top-color:var(--acc);border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .empty{display:flex;align-items:center;justify-content:center;gap:10px;padding:52px;color:var(--t3);font-size:13.5px;font-weight:500;}

        /* ══════════════════════════
           AGENTS TAB STYLES
        ══════════════════════════ */
        .btn-create-agent{display:inline-flex;align-items:center;gap:7px;background:var(--acc);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s,transform .1s;}
        .btn-create-agent:hover{background:#1d4ed8;transform:translateY(-1px);}

        .ag-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
        .ag-sc{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow);}
        .ag-sc-val{font-size:28px;font-weight:800;letter-spacing:-1px;line-height:1;}
        .ag-sc-label{font-size:12.5px;font-weight:600;color:var(--t1);margin-top:6px;}
        .ag-sc-sub{font-size:11px;color:var(--t3);margin-top:2px;}

        .ag-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
        .ag-toolbar-l{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .ag-toolbar-r{display:flex;align-items:center;gap:10px;}
        .ag-search{display:flex;align-items:center;gap:8px;border:1.5px solid var(--bdr);border-radius:9px;padding:8px 12px;background:var(--surf);color:var(--t3);min-width:220px;}
        .ag-search input{border:none;outline:none;font-size:13px;font-family:inherit;color:var(--t1);background:transparent;flex:1;}
        .ag-fpills{display:flex;gap:5px;}
        .ag-fpill{padding:6px 13px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid var(--bdr);background:none;color:var(--t2);cursor:pointer;font-family:inherit;transition:background .12s,color .12s,border-color .12s;}
        .ag-fpill:hover{background:#f8fafc;}.ag-fpill.on{background:var(--t1);color:#fff;border-color:var(--t1);}
        .ag-count{font-size:12px;color:var(--t3);font-weight:500;}
        .ag-vtoggle{display:flex;border:1px solid var(--bdr);border-radius:8px;overflow:hidden;}
        .ag-vbtn{width:34px;height:34px;border:none;background:none;color:var(--t3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .12s,color .12s;font-family:inherit;}
        .ag-vbtn:hover{background:#f8fafc;color:var(--t2);}.ag-vbtn.on{background:var(--t1);color:#fff;}

        .ag-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:64px 32px;text-align:center;background:var(--surf);border:1px solid var(--bdr);border-radius:var(--radius);}
        .ag-empty-icon{width:56px;height:56px;background:var(--bg);border:1px solid var(--bdr);border-radius:14px;display:flex;align-items:center;justify-content:center;color:var(--t3);}
        .ag-empty-state h3{font-size:15px;font-weight:700;color:var(--t2);}
        .ag-empty-state p{font-size:13px;color:var(--t3);}

        .ag-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;}
        .ag-card{background:var(--surf);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;box-shadow:var(--shadow);transition:box-shadow .2s,transform .2s;}
        .ag-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px);}
        .ag-card.ag-inactive{opacity:.65;}
        .ag-accent{height:5px;width:100%;}
        .ag-body{padding:16px 18px;display:flex;flex-direction:column;gap:11px;}
        .ag-header{display:flex;align-items:flex-start;gap:11px;}
        .ag-header-info{flex:1;min-width:0;}
        .ag-name{font-size:14px;font-weight:700;color:var(--t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .ag-email{font-size:11.5px;color:var(--t3);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .ag-spec{font-size:11px;color:var(--acc);font-weight:600;margin-top:2px;}
        .ag-contact{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--t2);}
        .ag-bio{font-size:12px;color:var(--t3);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .ag-stats{display:flex;align-items:center;background:#fafbfd;border:1px solid #f1f5f9;border-radius:8px;padding:10px 0;}
        .ags-item{flex:1;text-align:center;padding:0 8px;}
        .ags-val{font-size:16px;font-weight:800;color:var(--t1);letter-spacing:-.5px;}
        .ags-label{font-size:10px;color:var(--t3);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;}
        .ags-div{width:1px;background:var(--bdr);align-self:stretch;}
        .ag-actions{display:flex;align-items:center;gap:5px;flex-wrap:wrap;}
        .ag-actions-right{margin-left:auto;display:flex;gap:4px;}
        .ag-btn{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:5px 10px;border-radius:7px;border:1.5px solid var(--bdr);background:none;cursor:pointer;font-family:inherit;transition:background .12s,border-color .12s;}
        .view-btn:hover{background:#f8fafc;}
        .edit-ag-btn{border-color:#bfdbfe;color:#1d4ed8;background:#eff6ff;}.edit-ag-btn:hover{background:#dbeafe;}
        .assign-btn{border-color:#bbf7d0;color:#065f46;background:#f0fdf4;}.assign-btn:hover{background:#dcfce7;}
        .ag-icon-btn{width:28px;height:28px;border-radius:6px;border:1.5px solid var(--bdr);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .12s;font-family:inherit;}
        .deact-btn:hover{background:#fef3c7;border-color:#fcd34d;color:#92400e;}
        .act-btn:hover{background:#d1fae5;border-color:#6ee7b7;color:#065f46;}
        .del-btn:hover{background:#fee2e2;border-color:#fca5a5;color:#991b1b;}
        .ag-icon-btn:disabled{opacity:.5;cursor:not-allowed;}

        .ag-table-wrap{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);}
        .ag-table{width:100%;border-collapse:collapse;font-size:13px;}
        .ag-table th{text-align:left;padding:10px 14px;font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;background:#fafbfd;border-bottom:1px solid var(--bdr);}
        .ag-table td{padding:12px 14px;border-bottom:1px solid #f1f5f9;vertical-align:middle;color:var(--t2);}
        .ag-table tr:last-child td{border-bottom:none;}.ag-table tr:hover td{background:#fafbfd;}
        .ag-table tr.row-inactive{opacity:.6;}
        .btn-xs-outline,.btn-xs-blue,.btn-xs-warn,.btn-xs-green,.btn-xs-red{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:600;padding:5px 9px;border-radius:6px;cursor:pointer;font-family:inherit;transition:background .12s;}
        .btn-xs-outline{border:1px solid var(--bdr);background:none;color:var(--t2);}.btn-xs-outline:hover{background:#f8fafc;}
        .btn-xs-blue{border:none;background:#eff6ff;color:#1d4ed8;}.btn-xs-blue:hover{background:#dbeafe;}
        .btn-xs-warn{border:none;background:#fef3c7;color:#92400e;}.btn-xs-warn:hover{background:#fde68a;}
        .btn-xs-green{border:none;background:#d1fae5;color:#065f46;}.btn-xs-green:hover{background:#a7f3d0;}
        .btn-xs-red{border:none;background:#fee2e2;color:#991b1b;}.btn-xs-red:hover{background:#fecaca;}

        /* ══ Agent Form Modal ══ */
        .modal-lg{max-width:580px!important;}
        .form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .mfield{display:flex;flex-direction:column;gap:5px;}
        .mfield-label{font-size:11.5px;font-weight:600;color:var(--t2);}
        .mfield-hint{font-size:10px;color:var(--t3);font-weight:400;margin-left:4px;}
        .mfield-err{font-size:11px;color:var(--red);font-weight:500;}
        .minput{padding:9px 12px;border:1.5px solid var(--bdr);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surf);color:var(--t1);outline:none;transition:border-color .15s,box-shadow .15s;width:100%;}
        .minput:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(37,99,235,.1);}
        .minput.merr{border-color:var(--red);}
        .minput-icon-wrap{position:relative;display:flex;align-items:center;}
        .minput-icon-wrap>svg{position:absolute;left:11px;color:var(--t3);pointer-events:none;flex-shrink:0;}
        .minput.icon-input{padding-left:34px;}
        .pw-toggle{position:absolute;right:10px;background:none;border:none;cursor:pointer;color:var(--t3);display:flex;align-items:center;padding:0;}
        .pw-toggle:hover{color:var(--t1);}
        .role-info-box{display:flex;align-items:center;gap:10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:11px 14px;font-size:12.5px;color:#1e40af;}
        .role-info-box strong{font-weight:700;}

        /* ══ Modals (shared) ══ */
        .modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;}
        .modal-box{background:#fff;border-radius:14px;width:100%;max-width:480px;box-shadow:0 20px 60px rgba(0,0,0,.25);display:flex;flex-direction:column;max-height:90vh;animation:modal-in .2s cubic-bezier(.16,1,.3,1);}
        @keyframes modal-in{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:20px 20px 16px;border-bottom:1px solid var(--bdr);}
        .modal-title{font-size:15px;font-weight:700;color:var(--t1);}
        .modal-sub{font-size:12.5px;color:var(--t3);margin-top:2px;}.modal-sub strong{color:var(--t2);}
        .modal-close{width:30px;height:30px;border-radius:7px;border:1px solid var(--bdr);background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t3);flex-shrink:0;font-family:inherit;transition:background .12s;}
        .modal-close:hover{background:#f8fafc;color:var(--t1);}
        .modal-body{padding:16px 20px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:14px;}
        .modal-search{display:flex;align-items:center;gap:8px;border:1.5px solid var(--bdr);border-radius:8px;padding:8px 12px;color:var(--t3);}
        .modal-search input{border:none;outline:none;font-size:13px;font-family:inherit;color:var(--t1);background:transparent;flex:1;}
        .seller-pick-list{display:flex;flex-direction:column;gap:6px;max-height:300px;overflow-y:auto;}
        .pick-empty{text-align:center;padding:24px;color:var(--t3);font-size:13px;}
        .seller-pick-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:9px;border:1.5px solid #f1f5f9;cursor:pointer;transition:border-color .12s,background .12s;}
        .seller-pick-row:hover{border-color:#bfdbfe;background:#eff6ff;}
        .seller-pick-row.selected{border-color:#2563eb;background:#eff6ff;}
        .pick-info{flex:1;min-width:0;}.pick-name{font-size:13px;font-weight:600;color:var(--t1);}.pick-email{font-size:11px;color:var(--t3);margin-top:1px;}
        .pick-check{width:22px;height:22px;border-radius:50%;background:#2563eb;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--bdr);}
        .btn-ghost-sm{padding:8px 16px;border-radius:8px;border:1.5px solid var(--bdr);background:none;font-size:13px;font-weight:600;color:var(--t2);cursor:pointer;font-family:inherit;transition:background .12s;}
        .btn-ghost-sm:hover{background:#f8fafc;}
        .btn-primary-sm{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:8px;border:none;background:#2563eb;color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .12s;}
        .btn-primary-sm:hover:not(:disabled){background:#1d4ed8;}
        .btn-primary-sm:disabled{opacity:.6;cursor:not-allowed;}
        .btn-spinner-sm{width:13px;height:13px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;}

        /* ══ Drawer ══ */
        .drawer-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.4);backdrop-filter:blur(3px);z-index:1000;display:flex;justify-content:flex-end;}
        .drawer{width:100%;max-width:420px;background:#fff;height:100vh;display:flex;flex-direction:column;box-shadow:-8px 0 40px rgba(0,0,0,.15);animation:slide-in .25s cubic-bezier(.16,1,.3,1);}
        @keyframes slide-in{from{transform:translateX(100%)}to{transform:translateX(0)}}
        .drawer-head{display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid var(--bdr);}
        .drawer-title{font-size:15px;font-weight:700;color:var(--t1);flex:1;}
        .btn-edit-drawer{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:6px 12px;border-radius:7px;border:1.5px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;cursor:pointer;font-family:inherit;transition:background .12s;}
        .btn-edit-drawer:hover{background:#dbeafe;}
        .drawer-body{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;}
        .drawer-hero{display:flex;align-items:flex-start;gap:14px;}
        .drawer-hero-info{flex:1;min-width:0;}
        .drawer-name{font-size:18px;font-weight:800;color:var(--t1);letter-spacing:-.3px;}
        .drawer-email{font-size:13px;color:var(--t3);margin-top:2px;}
        .drawer-contact{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--t2);margin-top:5px;}
        .drawer-spec{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--acc);font-weight:600;margin-top:3px;}
        .drawer-bio{font-size:13px;color:var(--t2);line-height:1.6;background:#fafbfd;border:1px solid var(--bdr);border-radius:8px;padding:10px 12px;}
        .drawer-stats{display:flex;background:#fafbfd;border:1px solid var(--bdr);border-radius:10px;overflow:hidden;}
        .drawer-stat{flex:1;padding:12px 8px;text-align:center;border-right:1px solid var(--bdr);}
        .drawer-stat:last-child{border-right:none;}
        .ds-icon{color:var(--t3);display:flex;justify-content:center;margin-bottom:5px;}
        .ds-val{font-size:15px;font-weight:800;color:var(--t1);}
        .ds-label{font-size:10px;color:var(--t3);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;}
        .drawer-section-title{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--t3);border-bottom:1px solid #f1f5f9;padding-bottom:8px;}
        .drawer-empty{text-align:center;padding:20px 0;color:var(--t3);font-size:13px;}
        .drawer-seller-list{display:flex;flex-direction:column;gap:8px;}
        .drawer-seller-row{display:flex;align-items:flex-start;gap:10px;padding:11px 12px;background:#fafbfd;border:1px solid var(--bdr);border-radius:9px;transition:background .12s;}
        .drawer-seller-row:hover{background:#f1f5f9;}
        .drawer-seller-info{flex:1;min-width:0;}
        .dsi-name{font-size:13px;font-weight:600;color:var(--t1);}
        .dsi-email{font-size:11px;color:var(--t3);margin-top:1px;}
        .drawer-seller-meta{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;}
        .unassign-btn{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:4px 9px;border-radius:6px;border:1px solid #fca5a5;background:none;color:#991b1b;cursor:pointer;font-family:inherit;transition:background .12s;}
        .unassign-btn:hover{background:#fee2e2;}.unassign-btn:disabled{opacity:.5;cursor:not-allowed;}

        /* Responsive */
        @media(max-width:900px){
          .stats-grid{grid-template-columns:repeat(2,1fr);}
          .ag-summary{grid-template-columns:repeat(2,1fr);}
          .admin-main .topbar{padding:16px 18px;}
          .tab-body{padding:18px;}
          .form-grid-2{grid-template-columns:1fr;}
        }
        @media(max-width:680px){
          .admin-layout{flex-direction:column;}
          .sidebar{width:100%;height:auto;position:static;}
          .sb-nav{flex-direction:row;flex-wrap:wrap;}
          .sb-nav-label{display:none;}
          .stats-grid{grid-template-columns:repeat(2,1fr);}
          .ag-summary{grid-template-columns:repeat(2,1fr);}
          .ag-grid{grid-template-columns:1fr;}
          .drawer{max-width:100%;}
          .search-box input{width:140px;}
          .ag-toolbar{flex-direction:column;align-items:flex-start;}
          .flow-banner{gap:4px;}
        }
      `}</style>
    </div>
  );
}