import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../API/axios"

// ─── Icons ────────────────────────────────────────────────────────────────────
const IC = {
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  Build: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="22" x2="9" y2="2" /><line x1="15" y1="22" x2="15" y2="2" /><line x1="4" y1="7" x2="9" y2="7" /><line x1="4" y1="12" x2="9" y2="12" /><line x1="15" y1="7" x2="20" y2="7" /><line x1="15" y1="12" x2="20" y2="12" /></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  MailSm: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Trash: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>,
  Agent: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  Phone: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.14 1.22 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>,
  Award: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
  CheckCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  XCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
  AlertTriangle: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  Note: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  MessageCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
  Eye: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const resolveAgent = (agentField, agentMap) => {
  if (!agentField) return null;
  if (typeof agentField === "object" && agentField._id) return agentField;
  return agentMap[agentField] || null;
};
const agentBg = (name = "") => {
  const c = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2"];
  return c[(name.charCodeAt(0) || 0) % c.length];
};

const VSTATUS = {
  approved:      { bg: "#d1fae5", color: "#065f46", label: "Agent Approved",       icon: "✓" },
  rejected:      { bg: "#fee2e2", color: "#991b1b", label: "Agent Rejected",        icon: "✗" },
  needs_changes: { bg: "#fef3c7", color: "#92400e", label: "Changes Requested",     icon: "⚠" },
  pending:       { bg: "#f1f5f9", color: "#475569", label: "Agent Review Pending",  icon: "⏳" },
};

function AgentVerificationBadge({ property }) {
  const vs  = property.agentVerdict || "pending";
  const cfg = VSTATUS[vs] || VSTATUS.pending;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ display:"inline-flex",alignItems:"center",gap:4,background:cfg.bg,color:cfg.color,fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20,width:"fit-content" }}>
        {cfg.icon} {cfg.label}
      </span>
      {property.agentNote && (vs === "needs_changes" || vs === "rejected") && (
        <div style={{ display:"flex",alignItems:"flex-start",gap:4,background:vs==="rejected"?"#fff5f5":"#fffbeb",border:`1px solid ${vs==="rejected"?"#fca5a5":"#fcd34d"}`,borderRadius:7,padding:"5px 8px",maxWidth:200 }}>
          <IC.Note />
          <span style={{ fontSize:11,color:vs==="rejected"?"#991b1b":"#92400e",lineHeight:1.4 }}>{property.agentNote}</span>
        </div>
      )}
    </div>
  );
}

// ─── Inquiry status badge ─────────────────────────────────────────────────────
const INQUIRY_STATUS = {
  unread:  { bg: "#dbeafe", color: "#1d4ed8", label: "New" },
  read:    { bg: "#f1f5f9", color: "#64748b", label: "Read" },
  replied: { bg: "#dcfce7", color: "#15803d", label: "Replied" },
};
const MEETING_STATUS = {
  pending:   { bg: "#fef3c7", color: "#92400e", label: "Pending" },
  confirmed: { bg: "#dcfce7", color: "#15803d", label: "Confirmed" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
  completed: { bg: "#f0fdf4", color: "#166534", label: "Completed" },
};

// ─── Inquiries Panel ──────────────────────────────────────────────────────────
function InquiriesPanel() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      const res = await API.get("/inquiries/seller/my");
      setInquiries(res.data.inquiries || []);
    } catch (err) {
      console.error("fetchInquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await API.patch(`/inquiries/seller/${id}/read`);         
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, status: "read" } : i));
    } catch (err) {
      console.error("markRead:", err);
    }
  };

  const toggleExpand = (id, status) => {
    setExpanded(prev => prev === id ? null : id);
    if (status === "unread") markRead(id);
  };

  if (loading) return <div className="sd-loading"><div className="sd-spinner" />Loading inquiries…</div>;
  if (inquiries.length === 0) return (
    <div className="sd-empty">
      <div className="sd-empty-icon"><IC.MessageCircle /></div>
      <h3>No inquiries yet</h3>
      <p>When buyers send you messages about your properties, they'll appear here.</p>
    </div>
  );

  const unread = inquiries.filter(i => i.status === "unread").length;

  return (
    <div>
      {unread > 0 && (
        <div style={{ padding:"10px 16px", background:"#eff6ff", borderBottom:"1px solid #bfdbfe", fontSize:13, color:"#1d4ed8", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
          <IC.Mail /> {unread} unread {unread === 1 ? "inquiry" : "inquiries"}
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column" }}>
        {inquiries.map(inq => {
          const scfg  = INQUIRY_STATUS[inq.status] || INQUIRY_STATUS.read;
          const prop  = inq.propertyId;
          const isExp = expanded === inq._id;
          return (
            <div key={inq._id} style={{ borderBottom:"1px solid #f1f5f9", background: inq.status==="unread"?"#fafbff":"#fff" }}>
              <div
                style={{ display:"grid", gridTemplateColumns:"auto 1fr auto auto", gap:12, alignItems:"center", padding:"14px 18px", cursor:"pointer" }}
                onClick={() => toggleExpand(inq._id, inq.status)}
              >
                {/* Avatar */}
                <div style={{ width:38,height:38,borderRadius:"50%",background:"#e0e7ff",color:"#4338ca",fontWeight:800,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                  {inq.name?.[0]?.toUpperCase()}
                </div>
                {/* Info */}
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontWeight: inq.status==="unread" ? 700 : 600, fontSize:13.5, color:"#0f172a" }}>{inq.name}</span>
                    <span style={{ background:scfg.bg, color:scfg.color, fontSize:10.5, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{scfg.label}</span>
                  </div>
                  <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>
                    {prop?.title || "Property"} · {fmtDate(inq.createdAt)}
                  </div>
                  {!isExp && <div style={{ fontSize:12.5, color:"#475569", marginTop:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:320 }}>{inq.message}</div>}
                </div>
                {/* Contact */}
                <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"flex-end" }}>
                  {inq.email && <a href={`mailto:${inq.email}`} onClick={e=>e.stopPropagation()} style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#2563eb",textDecoration:"none",fontWeight:500 }}><IC.MailSm/>{inq.email}</a>}
                  {inq.phone && <a href={`tel:${inq.phone}`}   onClick={e=>e.stopPropagation()} style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#059669",textDecoration:"none",fontWeight:500 }}><IC.Phone/>{inq.phone}</a>}
                </div>
                {/* Chevron */}
                <div style={{ fontSize:11, color:"#94a3b8", transform: isExp?"rotate(180deg)":"none", transition:"transform .2s" }}>▼</div>
              </div>

              {/* Expanded message */}
              {isExp && (
                <div style={{ padding:"0 18px 16px 68px" }}>
                  <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"12px 14px", fontSize:13.5, color:"#334155", lineHeight:1.65, whiteSpace:"pre-wrap" }}>
                    {inq.message}
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:10 }}>
                    {inq.email && (
                      <a href={`mailto:${inq.email}?subject=Re: ${prop?.title || "Your Inquiry"}`}
                         className="sd-btn-primary" style={{ fontSize:12, padding:"7px 14px", textDecoration:"none" }}>
                        <IC.MailSm /> Reply via Email
                      </a>
                    )}
                    {inq.phone && (
                      <a href={`tel:${inq.phone}`}
                         style={{ display:"inline-flex",alignItems:"center",gap:6,fontSize:12,padding:"7px 14px",border:"1px solid #e2e8f0",borderRadius:8,color:"#0f172a",textDecoration:"none",fontWeight:600,background:"#fff" }}>
                        <IC.Phone /> Call
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Meetings Panel ───────────────────────────────────────────────────────────
function MeetingsPanel() {
  const [meetings, setMeetings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { fetchMeetings(); }, []);

  const fetchMeetings = async () => {
    try {
      const res = await API.get("/meetings/my");
      setMeetings(res.data.meetings || []);
    } catch (err) {
      console.error("fetchMeetings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      const res = await API.patch(`/meetings/${id}/status`, { status });
      setMeetings(prev => prev.map(m => m._id === id ? res.data.meeting : m));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="sd-loading"><div className="sd-spinner" />Loading meetings…</div>;
  if (meetings.length === 0) return (
    <div className="sd-empty">
      <div className="sd-empty-icon"><IC.Calendar /></div>
      <h3>No meeting requests yet</h3>
      <p>When buyers request to visit your properties, you'll see them here.</p>
    </div>
  );

  const pending = meetings.filter(m => m.status === "pending").length;

  return (
    <div>
      {pending > 0 && (
        <div style={{ padding:"10px 16px", background:"#fffbeb", borderBottom:"1px solid #fcd34d", fontSize:13, color:"#92400e", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
          <IC.Clock /> {pending} meeting {pending === 1 ? "request" : "requests"} awaiting your response
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column" }}>
        {meetings.map(m => {
          const scfg = MEETING_STATUS[m.status] || MEETING_STATUS.pending;
          const prop = m.propertyId;
          const isPast = new Date(m.scheduledAt) < new Date();
          return (
            <div key={m._id} style={{ borderBottom:"1px solid #f1f5f9", padding:"16px 18px", display:"grid", gridTemplateColumns:"auto 1fr auto", gap:14, alignItems:"flex-start" }}>
              {/* Date block */}
              <div style={{ width:52, flexShrink:0, textAlign:"center", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"8px 4px" }}>
                <div style={{ fontSize:18, fontWeight:800, color:"#0f172a", lineHeight:1 }}>
                  {new Date(m.scheduledAt).getDate()}
                </div>
                <div style={{ fontSize:10, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:".04em", marginTop:2 }}>
                  {new Date(m.scheduledAt).toLocaleString("en-IN", { month: "short" })}
                </div>
                <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>
                  {new Date(m.scheduledAt).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })}
                </div>
              </div>

              {/* Details */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontWeight:700, fontSize:13.5, color:"#0f172a" }}>{m.name}</span>
                  <span style={{ background:scfg.bg, color:scfg.color, fontSize:10.5, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{scfg.label}</span>
                  {isPast && m.status==="pending" && <span style={{ background:"#fee2e2",color:"#991b1b",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20 }}>Overdue</span>}
                </div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:3 }}>
                  {prop?.title || "Property"} · Requested {fmtDate(m.createdAt)}
                </div>
                <div style={{ display:"flex", gap:12, marginTop:5, flexWrap:"wrap" }}>
                  <a href={`tel:${m.phone}`} style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#059669",textDecoration:"none",fontWeight:500 }}><IC.Phone />{m.phone}</a>
                  {m.email && <a href={`mailto:${m.email}`} style={{ display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#2563eb",textDecoration:"none",fontWeight:500 }}><IC.MailSm />{m.email}</a>}
                </div>
                {m.note && (
                  <div style={{ marginTop:7, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:7, padding:"7px 10px", fontSize:12.5, color:"#334155", lineHeight:1.5 }}>
                    {m.note}
                  </div>
                )}
              </div>

              {/* Actions */}
              {m.status === "pending" && (
                <div style={{ display:"flex", flexDirection:"column", gap:6, minWidth:110 }}>
                  <button
                    disabled={!!updating}
                    onClick={() => updateStatus(m._id, "confirmed")}
                    style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"7px 12px",background:"#dcfce7",color:"#15803d",border:"1px solid #86efac",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"background .12s" }}
                  >
                    {updating===m._id+"confirmed" ? "…" : <><IC.CheckCircle /> Confirm</>}
                  </button>
                  <button
                    disabled={!!updating}
                    onClick={() => updateStatus(m._id, "cancelled")}
                    style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"7px 12px",background:"#fee2e2",color:"#dc2626",border:"1px solid #fca5a5",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"background .12s" }}
                  >
                    {updating===m._id+"cancelled" ? "…" : <><IC.XCircle /> Decline</>}
                  </button>
                </div>
              )}
              {m.status === "confirmed" && (
                <button
                  disabled={!!updating}
                  onClick={() => updateStatus(m._id, "completed")}
                  style={{ padding:"7px 12px",background:"#eff6ff",color:"#2563eb",border:"1px solid #93c5fd",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",alignSelf:"flex-start" }}
                >
                  {updating===m._id+"completed" ? "…" : "Mark Done"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats,      setStats]      = useState({ total:0, available:0, sold:0, pending:0, inquiries:0, meetings:0 });
  const [properties, setProperties] = useState([]);
  const [agentMap,   setAgentMap]   = useState({});
  const [myAgent,    setMyAgent]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState("all");
  const [tab,        setTab]        = useState("properties"); // "properties" | "inquiries" | "meetings"

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const [propsRes, statsRes] = await Promise.all([
        API.get("/properties/my/all"),
        API.get("/properties/my/stats"),
      ]);
      const props = propsRes.data.properties || [];
      setProperties(props);
      setStats(statsRes.data || {});

      let fetchedAgent = null;
      try {
        const agentRes = await API.get("/admin/seller/my-agent");
        fetchedAgent = agentRes.data?.agent || null;
      } catch (e) {
        if (e?.response?.status !== 404) console.warn("Agent fetch:", e?.response?.data?.message || e.message);
      }
      setMyAgent(fetchedAgent);

      const rawIds   = props.map(p => p.agentId).filter(a => a && typeof a === "string");
      const uniqueIds = [...new Set(rawIds)];
      if (uniqueIds.length > 0) {
        const fetched = await Promise.allSettled(uniqueIds.map(id => API.get(`/admin/agents/${id}`).then(r => r.data?.agent || r.data)));
        const map = {};
        fetched.forEach((res, i) => { if (res.status==="fulfilled" && res.value) map[uniqueIds[i]] = res.value; });
        setAgentMap(map);
      }
    } catch (err) {
      console.error("fetchDashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await API.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch { alert("Failed to delete property"); }
  };

  const filtered = properties.filter(p => {
    if (filter === "approved") return p.isApprovedByCompany;
    if (filter === "pending")  return !p.isApprovedByCompany && p.status !== "Rejected" && p.isActive !== false;
    if (filter === "rejected") return p.status === "Rejected" || p.isActive === false;
    if (filter === "changes")  return p.agentVerdict === "needs_changes";
    return true;
  });

  const counts = {
    all:      properties.length,
    approved: properties.filter(p => p.isApprovedByCompany).length,
    pending:  properties.filter(p => !p.isApprovedByCompany && p.status !== "Rejected" && p.isActive !== false).length,
    rejected: properties.filter(p => p.status === "Rejected" || p.isActive === false).length,
    changes:  properties.filter(p => p.agentVerdict === "needs_changes").length,
  };

  const needsAttention = properties.filter(p => p.agentVerdict === "needs_changes" || p.agentVerdict === "rejected");
  const propertyAgents = properties.map(p => resolveAgent(p.agentId, agentMap)).filter(Boolean);
  const uniqueAgents   = [...new Map(propertyAgents.map(a => [a._id, a])).values()];
  const hasAnyAgent    = myAgent || uniqueAgents.length > 0;

  return (
    <div className="sd-layout">
      {/* ── Sidebar ── */}
      <aside className="sd-sidebar">
        <div className="sd-logo">
          <div className="sd-logo-mark"><IC.Home /></div>
          <span>NestFind</span>
        </div>
        <div className="sd-user">
          <div className="sd-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div className="sd-uname">{user?.name}</div>
            <div className="sd-urole">Seller</div>
          </div>
        </div>
        <nav className="sd-nav">
          <p className="sd-nav-group">Main</p>
          <Link to="/seller/dashboard" className="sd-nl active"><IC.Grid /><span>Overview</span></Link>
          <Link to="/seller/properties" className="sd-nl"><IC.Build /><span>My Properties</span>{stats.total > 0 && <span className="sd-badge">{stats.total}</span>}</Link>
          <Link to="/seller/add-property" className="sd-nl"><IC.Plus /><span>Add Property</span></Link>
          <p className="sd-nav-group" style={{ marginTop: 20 }}>Communication</p>
          {/* Sidebar nav items now switch tabs instead of routing */}
          <button onClick={() => setTab("inquiries")} className={`sd-nl sd-nl-btn${tab==="inquiries"?" active":""}`}>
            <IC.Mail /><span>Inquiries</span>
            {stats.inquiries > 0 && <span className="sd-badge warn">{stats.inquiries}</span>}
          </button>
          <button onClick={() => setTab("meetings")} className={`sd-nl sd-nl-btn${tab==="meetings"?" active":""}`}>
            <IC.Calendar /><span>Meetings</span>
            {stats.meetings > 0 && <span className="sd-badge warn">{stats.meetings}</span>}
          </button>
          <p className="sd-nav-group" style={{ marginTop: 20 }}>Account</p>
          <Link to="/seller/profile" className="sd-nl"><IC.User /><span>Profile</span></Link>
        </nav>
        <button className="sd-logout" onClick={() => { logout(); navigate("/auth/login"); }}>
          <IC.Logout /> Sign out
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="sd-main">
        <div className="sd-header">
          <div>
            <h1 className="sd-title">Dashboard</h1>
            <p className="sd-sub">Welcome back, <strong>{user?.name}</strong></p>
          </div>
          <Link to="/seller/add-property" className="sd-btn-primary">
            <IC.Plus /> Add Property
          </Link>
        </div>

        {!user?.isApprovedByAdmin && (
          <div className="notice notice-yellow">
            <IC.Clock />
            <div>
              <strong>Account Pending Approval</strong>
              <p>Your seller account is under review. Listings won't be visible to buyers until an admin approves your account.</p>
            </div>
          </div>
        )}

        {!loading && needsAttention.length > 0 && (
          <div className="notice notice-orange">
            <IC.AlertTriangle />
            <div>
              <strong>{needsAttention.length} {needsAttention.length === 1 ? "property needs" : "properties need"} your attention</strong>
              <p>Your agent has reviewed some listings and left feedback. Check the <strong> "Changes Requested"</strong> tab, fix the issues, and resubmit.</p>
              <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:6 }}>
                {needsAttention.slice(0,3).map(p => (
                  <span key={p._id} style={{ fontSize:11.5, fontWeight:600, background:"rgba(0,0,0,.06)", padding:"2px 9px", borderRadius:20 }}>{p.title}</span>
                ))}
                {needsAttention.length > 3 && <span style={{ fontSize:11.5, color:"#78350f" }}>+{needsAttention.length-3} more</span>}
              </div>
            </div>
          </div>
        )}

        {/* ── Agent Section ── */}
        <div className="sd-agent-section">
          <div className="sd-agent-section-head">
            <div className="sd-agent-section-icon"><IC.Agent /></div>
            <div>
              <h2 className="sd-agent-section-title">Your Assigned Agent</h2>
              <p className="sd-agent-section-sub">They verify your listings before admin approval</p>
            </div>
          </div>
          {loading ? (
            <div className="sd-agent-loading"><div className="sd-spinner" /> Loading agent info…</div>
          ) : !hasAnyAgent ? (
            <div className="sd-no-agent-box">
              <div className="sd-no-agent-icon"><IC.Agent /></div>
              <div className="sd-no-agent-text">
                <strong>No agent assigned yet</strong>
                <p>Once admin assigns an agent, their details appear here.</p>
              </div>
              <div className="sd-no-agent-badge">Pending Assignment</div>
            </div>
          ) : (
            <div className="sd-agent-cards">
              {myAgent && <AgentCard agent={myAgent} properties={properties} agentMap={agentMap} />}
              {uniqueAgents.filter(a => !myAgent || a._id !== myAgent._id).map(agent => (
                <AgentCard key={agent._id} agent={agent} properties={properties.filter(p => resolveAgent(p.agentId, agentMap)?._id === agent._id)} agentMap={agentMap} />
              ))}
            </div>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="sd-stats">
          {[
            { label:"Total Listings",   value: stats.total,                      color:"blue",   Icon: IC.Build         },
            { label:"Live / Approved",  value: stats.available || counts.approved, color:"green",  Icon: IC.CheckCircle  },
            { label:"Pending Review",   value: stats.pending   || counts.pending,  color:"yellow", Icon: IC.Clock        },
            { label:"Sold",             value: stats.sold,                         color:"orange", Icon: IC.Award        },
          ].map(s => (
            <div key={s.label} className={`sd-stat sd-stat-${s.color}`}>
              <div className="sd-stat-icon"><s.Icon /></div>
              <div className="sd-stat-val">{s.value ?? 0}</div>
              <div className="sd-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tab switcher: Properties / Inquiries / Meetings ── */}
        <div className="sd-card">
          <div className="sd-main-tabs">
            <button onClick={() => setTab("properties")} className={`sd-main-tab${tab==="properties"?" active":""}`}>
              <IC.Build /> Properties
              <span className="sd-filter-count" style={{ background: tab==="properties"?"rgba(255,255,255,.2)":"#f3f4f6", color: tab==="properties"?"inherit":"#94a3b8" }}>{properties.length}</span>
            </button>
            <button onClick={() => setTab("inquiries")} className={`sd-main-tab${tab==="inquiries"?" active":""}`}>
              <IC.MessageCircle /> Inquiries
              {stats.inquiries > 0 && (
                <span style={{ background:"#dc2626",color:"#fff",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:20,minWidth:18,textAlign:"center" }}>{stats.inquiries}</span>
              )}
            </button>
            <button onClick={() => setTab("meetings")} className={`sd-main-tab${tab==="meetings"?" active":""}`}>
              <IC.Calendar /> Meetings
              {stats.meetings > 0 && (
                <span style={{ background:"#d97706",color:"#fff",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:20,minWidth:18,textAlign:"center" }}>{stats.meetings}</span>
              )}
            </button>
          </div>

          {/* ── Properties tab ── */}
          {tab === "properties" && (
            <>
              <div className="sd-card-header" style={{ borderTop:"1px solid var(--bdr)" }}>
                <div>
                  <h2 className="sd-card-title">My Properties</h2>
                  <p className="sd-card-sub">{properties.length} total listing{properties.length !== 1 ? "s" : ""}</p>
                </div>
                <Link to="/seller/add-property" className="sd-btn-primary" style={{ fontSize:13 }}><IC.Plus /> Add</Link>
              </div>
              <div className="sd-filter-tabs">
                {[
                  { key:"all",      label:"All",               count: counts.all },
                  { key:"approved", label:"Live",              count: counts.approved },
                  { key:"pending",  label:"Pending",           count: counts.pending },
                  { key:"changes",  label:"Changes Requested", count: counts.changes },
                  { key:"rejected", label:"Rejected",          count: counts.rejected },
                ].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    className={`sd-filter-tab${filter===f.key?" active":""}${f.key==="changes"&&counts.changes>0?" warn-tab":""}`}>
                    {f.label}<span className="sd-filter-count">{f.count}</span>
                  </button>
                ))}
              </div>
              {loading ? (
                <div className="sd-loading"><div className="sd-spinner" />Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="sd-empty">
                  <div className="sd-empty-icon"><IC.Build /></div>
                  <h3>No {filter !== "all" ? filter : ""} properties</h3>
                  <p>{filter==="all" ? "Add your first listing." : "No properties in this state."}</p>
                  {filter==="all" && <Link to="/seller/add-property" className="sd-btn-primary"><IC.Plus /> Add Property</Link>}
                </div>
              ) : (
                <div className="sd-table-wrap">
                  <table className="sd-table">
                    <thead><tr>
                      <th>Title</th><th>Type</th><th>Price</th><th>City</th>
                      <th>Admin Status</th><th>Agent Verification</th><th>Assigned Agent</th>
                      <th>Added</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                      {filtered.map(p => {
                        const agent = resolveAgent(p.agentId, agentMap) || myAgent;
                        const vs    = p.agentVerdict || "pending";
                        const rowBg = vs==="needs_changes"?"#fffbeb":vs==="rejected"?"#fff5f5":"transparent";
                        return (
                          <tr key={p._id} style={{ background: rowBg }}>
                            <td>
                              <div className="sd-prop-title">{p.title}</div>
                              {p.address?.city && <div className="sd-prop-loc">{p.address.city}, {p.address.state}</div>}
                            </td>
                            <td>{p.propertyInfo?.propertyType || "—"}</td>
                            <td className="sd-price">{fmtPrice(p.price)}</td>
                            <td>{p.address?.city || "—"}</td>
                            <td>
                              {p.isApprovedByCompany ? (
                                <span className="sd-pill sd-pill-live"><IC.CheckCircle /> Live</span>
                              ) : p.status==="Rejected"||p.isActive===false ? (
                                <span className="sd-pill sd-pill-rejected"><IC.XCircle /> Rejected</span>
                              ) : (
                                <span className="sd-pill sd-pill-waiting"><IC.Clock /> Pending</span>
                              )}
                            </td>
                            <td><AgentVerificationBadge property={p} /></td>
                            <td>
                              {agent ? (
                                <div className="sd-agent-cell">
                                  <div className="sd-agent-cell-av" style={{ background: agentBg(agent.name) }}>{agent.name?.charAt(0).toUpperCase()}</div>
                                  <div>
                                    <div className="sd-agent-cell-name">{agent.name}</div>
                                    {agent.contact && <div className="sd-agent-cell-meta"><IC.Phone />{agent.contact}</div>}
                                    {agent.email   && <div className="sd-agent-cell-meta"><IC.MailSm />{agent.email}</div>}
                                  </div>
                                </div>
                              ) : <span className="sd-no-agent-tag">Not assigned</span>}
                            </td>
                            <td className="sd-date">{fmtDate(p.createdAt)}</td>
                            <td>
                              <div className="sd-actions">
                                {!p.isApprovedByCompany && p.isActive !== false &&
                                 (p.agentVerdict==="pending"||p.agentVerdict==="needs_changes"||!p.agentVerdict) && (
                                  <Link to={`/seller/edit-property/${p._id}`} className="sd-btn-edit"><IC.Edit /> Edit</Link>
                                )}
                                <button onClick={() => handleDelete(p._id)} className="sd-btn-delete"><IC.Trash /> Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ── Inquiries tab ── */}
          {tab === "inquiries" && (
            <>
              <div className="sd-card-header" style={{ borderTop:"1px solid var(--bdr)" }}>
                <div>
                  <h2 className="sd-card-title">Buyer Inquiries</h2>
                  <p className="sd-card-sub">Messages sent by interested buyers about your properties</p>
                </div>
              </div>
              <InquiriesPanel />
            </>
          )}

          {/* ── Meetings tab ── */}
          {tab === "meetings" && (
            <>
              <div className="sd-card-header" style={{ borderTop:"1px solid var(--bdr)" }}>
                <div>
                  <h2 className="sd-card-title">Meeting Requests</h2>
                  <p className="sd-card-sub">Buyers who want to visit your properties</p>
                </div>
              </div>
              <MeetingsPanel />
            </>
          )}
        </div>

        <div className="sd-info-note">
          <strong>How it works:</strong> Submit a property → Agent visits & verifies → Admin reviews agent verdict →
          Goes <span style={{ color:"#16a34a",fontWeight:700 }}>Live</span>.
          If agent requests changes, edit your listing and resubmit. Approved listings are locked from editing.
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#f1f3f6;--surf:#fff;--bdr:#e4e7ec;
          --t1:#0f172a;--t2:#475569;--t3:#94a3b8;
          --sb:#0d1117;--sb2:#161b22;--sb-bdr:#21262d;--sb-t:#c9d1d9;--sb-m:#8b949e;
          --blue:#2563eb;--blue-l:#dbeafe;
          --green:#16a34a;--green-l:#dcfce7;
          --yellow:#d97706;--yellow-l:#fef3c7;
          --orange:#ea580c;--orange-l:#ffedd5;
          --red:#dc2626;--red-l:#fee2e2;
          --purple:#7c3aed;--purple-l:#ede9fe;
          --r:10px;
          --shadow:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);
          font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--t1);
        }
        .sd-layout{display:flex;min-height:100vh;background:var(--bg)}
        .sd-sidebar{width:240px;min-width:240px;background:var(--sb);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;border-right:1px solid var(--sb-bdr)}
        .sd-logo{display:flex;align-items:center;gap:10px;padding:22px 20px 18px;font-size:17px;font-weight:700;color:#fff;border-bottom:1px solid var(--sb-bdr)}
        .sd-logo-mark{width:32px;height:32px;background:var(--blue);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
        .sd-user{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid var(--sb-bdr)}
        .sd-avatar{width:34px;height:34px;border-radius:50%;background:var(--blue);color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sd-uname{font-size:13px;font-weight:600;color:#e6edf3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sd-urole{font-size:11px;color:var(--sb-m);margin-top:1px}
        .sd-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:2px}
        .sd-nav-group{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--sb-m);padding:4px 8px 6px}
        .sd-nl{display:flex;align-items:center;gap:10px;padding:9px 10px;font-size:13.5px;font-weight:500;color:var(--sb-m);text-decoration:none;border-radius:7px;transition:background .12s,color .12s}
        .sd-nl-btn{background:none;border:none;cursor:pointer;width:100%;text-align:left;font-family:inherit}
        .sd-nl span{flex:1}.sd-nl:hover{background:var(--sb2);color:var(--sb-t)}
        .sd-nl.active{background:var(--sb2);color:#fff;border:1px solid var(--sb-bdr)}
        .sd-badge{background:#1f2937;color:#93c5fd;font-size:11px;font-weight:700;padding:1px 7px;border-radius:20px}
        .sd-badge.warn{background:#451a03;color:#fbbf24}
        .sd-logout{margin:12px;padding:10px 14px;background:transparent;color:var(--sb-m);border:1px solid var(--sb-bdr);border-radius:8px;cursor:pointer;font-size:13px;font-family:inherit;font-weight:500;display:flex;align-items:center;gap:8px;transition:background .12s,color .12s}
        .sd-logout:hover{background:#1c2128;color:#e6edf3}
        .sd-main{flex:1;padding:28px 32px;overflow-y:auto;min-width:0;display:flex;flex-direction:column;gap:20px}
        .sd-header{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .sd-title{font-size:22px;font-weight:800;letter-spacing:-.4px}
        .sd-sub{font-size:13.5px;color:var(--t2);margin-top:2px}.sd-sub strong{color:var(--t1);font-weight:700}
        .notice{display:flex;align-items:flex-start;gap:12px;border-radius:var(--r);padding:14px 16px;border:1px solid;font-size:13px;line-height:1.5}
        .notice strong{display:block;font-weight:700;margin-bottom:3px}
        .notice p{opacity:.85;margin-bottom:2px}
        .notice-yellow{background:var(--yellow-l);border-color:#fcd34d;border-left:4px solid var(--yellow);color:#78350f}
        .notice-orange{background:#fff7ed;border-color:#fdba74;border-left:4px solid var(--orange);color:#7c2d12}
        .sd-agent-section{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow)}
        .sd-agent-section-head{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--bdr);background:linear-gradient(135deg,#eff6ff,#f0fdf4)}
        .sd-agent-section-icon{width:42px;height:42px;border-radius:10px;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sd-agent-section-title{font-size:15px;font-weight:700;color:var(--t1)}
        .sd-agent-section-sub{font-size:12.5px;color:var(--t3);margin-top:2px}
        .sd-agent-loading{display:flex;align-items:center;gap:10px;padding:24px 20px;font-size:13px;color:var(--t3)}
        .sd-no-agent-box{display:flex;align-items:center;gap:16px;padding:20px;flex-wrap:wrap}
        .sd-no-agent-icon{width:48px;height:48px;border-radius:12px;background:#f1f5f9;border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;color:var(--t3);flex-shrink:0}
        .sd-no-agent-text{flex:1;min-width:200px}
        .sd-no-agent-text strong{display:block;font-size:13.5px;font-weight:700;color:var(--t2);margin-bottom:4px}
        .sd-no-agent-text p{font-size:12.5px;color:var(--t3);line-height:1.5}
        .sd-no-agent-badge{background:#f1f5f9;color:var(--t3);font-size:11.5px;font-weight:600;padding:5px 12px;border-radius:20px;border:1px solid var(--bdr);white-space:nowrap}
        .sd-agent-cards{display:flex;flex-direction:column}
        .sd-agent-card{display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center;padding:20px 24px;border-bottom:1px solid var(--bdr)}
        .sd-agent-card:last-child{border-bottom:none}
        .sd-agent-left{display:flex;flex-direction:column;align-items:center;gap:8px}
        .sd-agent-av{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:0 4px 14px rgba(0,0,0,.15)}
        .sd-agent-status{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap}
        .sd-agent-middle{display:flex;flex-direction:column;gap:3px}
        .sd-agent-name{font-size:18px;font-weight:800;color:var(--t1);letter-spacing:-.3px}
        .sd-agent-role-tag{font-size:11.5px;font-weight:600;color:var(--blue);margin-bottom:6px}
        .sd-agent-contacts{display:flex;flex-direction:column;gap:6px;margin-top:2px}
        .sd-agent-contact-row{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--t2)}
        .sd-agent-contact-row a{color:var(--t1);text-decoration:none;font-weight:600}.sd-agent-contact-row a:hover{color:var(--blue);text-decoration:underline}
        .sd-agent-contact-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sd-agent-spec{display:inline-flex;align-items:center;gap:5px;background:var(--purple-l);color:var(--purple);font-size:11.5px;font-weight:600;padding:4px 12px;border-radius:20px;margin-top:8px;width:fit-content}
        .sd-agent-right{display:flex;flex-direction:column;gap:5px;align-items:flex-end}
        .sd-agent-prop-label{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t3);margin-bottom:3px}
        .sd-agent-prop-chip{display:flex;align-items:center;gap:8px;background:#fafbfd;border:1px solid var(--bdr);border-radius:8px;padding:6px 10px;font-size:12px;font-weight:500;color:var(--t2);min-width:180px}
        .sd-agent-prop-chip span:first-of-type{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .sd-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .sd-stat{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);padding:18px 20px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:4px}
        .sd-stat-icon{margin-bottom:6px}
        .sd-stat-val{font-size:30px;font-weight:800;letter-spacing:-1px;line-height:1}
        .sd-stat-label{font-size:12.5px;color:var(--t2);font-weight:500}
        .sd-stat-blue .sd-stat-icon,.sd-stat-blue .sd-stat-val{color:var(--blue)}
        .sd-stat-green .sd-stat-icon,.sd-stat-green .sd-stat-val{color:var(--green)}
        .sd-stat-yellow .sd-stat-icon,.sd-stat-yellow .sd-stat-val{color:var(--yellow)}
        .sd-stat-orange .sd-stat-icon,.sd-stat-orange .sd-stat-val{color:var(--orange)}
        .sd-card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow)}
        /* Main tabs */
        .sd-main-tabs{display:flex;gap:0;border-bottom:1px solid var(--bdr);background:#fafafa;overflow-x:auto}
        .sd-main-tab{display:flex;align-items:center;gap:7px;padding:14px 20px;font-size:13.5px;font-weight:600;color:var(--t2);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap}
        .sd-main-tab:hover{color:var(--t1);background:rgba(0,0,0,.02)}
        .sd-main-tab.active{color:var(--blue);border-bottom-color:var(--blue);background:#fff}
        .sd-card-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--bdr)}
        .sd-card-title{font-size:15px;font-weight:700}
        .sd-card-sub{font-size:12px;color:var(--t3);margin-top:2px}
        .sd-filter-tabs{display:flex;gap:4px;padding:12px 20px;border-bottom:1px solid var(--bdr);background:#fafafa;flex-wrap:wrap}
        .sd-filter-tab{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;font-size:12.5px;font-weight:600;cursor:pointer;border:1px solid transparent;background:none;color:var(--t2);font-family:inherit;transition:all .12s}
        .sd-filter-tab:hover{background:var(--bdr);color:var(--t1)}
        .sd-filter-tab.active{background:var(--t1);color:#fff}
        .sd-filter-tab.warn-tab{border-color:#fcd34d;color:#92400e;background:#fef3c7}
        .sd-filter-tab.warn-tab.active{background:#d97706;color:#fff;border-color:#d97706}
        .sd-filter-count{font-size:11px;background:rgba(255,255,255,.2);padding:1px 6px;border-radius:10px;min-width:18px;text-align:center}
        .sd-filter-tab:not(.active) .sd-filter-count{background:#f3f4f6;color:var(--t3)}
        .sd-table-wrap{overflow-x:auto}
        .sd-table{width:100%;border-collapse:collapse;font-size:13px}
        .sd-table th{text-align:left;padding:11px 14px;color:var(--t3);font-weight:700;font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;background:#fafafa;border-bottom:1px solid var(--bdr)}
        .sd-table td{padding:12px 14px;border-bottom:1px solid #f3f4f6;color:var(--t2);vertical-align:middle}
        .sd-table tr:last-child td{border-bottom:none}.sd-table tr:hover td{background:rgba(0,0,0,.01)}
        .sd-prop-title{font-weight:700;color:var(--t1);font-size:13px}
        .sd-prop-loc{font-size:11px;color:var(--t3);margin-top:2px}
        .sd-price{font-weight:700;color:var(--t1)!important}
        .sd-date{font-size:12px;color:var(--t3)!important}
        .sd-agent-cell{display:flex;align-items:center;gap:8px}
        .sd-agent-cell-av{width:30px;height:30px;border-radius:50%;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sd-agent-cell-name{font-size:12.5px;font-weight:700;color:var(--t1)}
        .sd-agent-cell-meta{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--t3);margin-top:2px}
        .sd-no-agent-tag{font-size:12px;color:var(--t3);font-style:italic;background:#f8fafc;padding:3px 8px;border-radius:6px;border:1px solid var(--bdr)}
        .sd-pill{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:20px}
        .sd-pill-available,.sd-pill-live{background:var(--green-l);color:#14532d}
        .sd-pill-pending{background:var(--yellow-l);color:#78350f}
        .sd-pill-sold{background:var(--orange-l);color:#7c2d12}
        .sd-pill-waiting{background:#f1f5f9;color:#475569;border:1px solid #e2e8f0}
        .sd-pill-rejected{background:var(--red-l);color:#7f1d1d}
        .sd-btn-primary{display:inline-flex;align-items:center;gap:7px;background:var(--blue);color:#fff;border:none;padding:9px 18px;border-radius:8px;font-size:14px;font-family:inherit;font-weight:600;cursor:pointer;text-decoration:none;transition:background .12s}
        .sd-btn-primary:hover{background:#1d4ed8}
        .sd-actions{display:flex;gap:6px}
        .sd-btn-edit,.sd-btn-delete{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-family:inherit;font-weight:600;padding:6px 11px;border-radius:7px;cursor:pointer;text-decoration:none;transition:background .12s}
        .sd-btn-edit{border:1px solid var(--bdr);color:var(--t1);background:var(--surf)}.sd-btn-edit:hover{background:var(--bg)}
        .sd-btn-delete{border:1px solid #fca5a5;color:var(--red);background:var(--surf)}.sd-btn-delete:hover{background:var(--red-l)}
        .sd-loading{display:flex;flex-direction:column;align-items:center;gap:12px;padding:56px;color:var(--t3);font-size:13px}
        .sd-spinner{width:24px;height:24px;border:2.5px solid var(--bdr);border-top-color:var(--blue);border-radius:50%;animation:sd-spin .7s linear infinite;flex-shrink:0}
        @keyframes sd-spin{to{transform:rotate(360deg)}}
        .sd-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:60px 32px;color:var(--t3);text-align:center}
        .sd-empty-icon{width:52px;height:52px;background:var(--bg);border:1px solid var(--bdr);border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--t3);margin-bottom:4px}
        .sd-empty h3{font-size:15px;font-weight:700;color:var(--t2)}.sd-empty p{font-size:13px;margin-bottom:6px}
        .sd-info-note{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);padding:14px 18px;font-size:12.5px;color:var(--t2);line-height:1.6}
        @media(max-width:900px){.sd-stats{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:768px){.sd-layout{flex-direction:column}.sd-sidebar{width:100%;height:auto;position:static}.sd-main{padding:16px}.sd-stats{grid-template-columns:repeat(2,1fr)}.sd-agent-card{grid-template-columns:auto 1fr;grid-template-rows:auto auto}.sd-agent-right{grid-column:1/-1;align-items:flex-start}}
      `}</style>
    </div>
  );
}

function AgentCard({ agent, properties = [], agentMap = {} }) {
  const bg = agentBg(agent.name);
  return (
    <div className="sd-agent-card">
      <div className="sd-agent-left">
        <div className="sd-agent-av" style={{ background: bg }}>{agent.name?.charAt(0).toUpperCase()}</div>
        <div className="sd-agent-status" style={{ background: agent.isActive?"#dcfce7":"#f1f5f9", color: agent.isActive?"#14532d":"#64748b" }}>
          <span style={{ fontSize:7 }}>●</span>{agent.isActive ? "Active" : "Inactive"}
        </div>
      </div>
      <div className="sd-agent-middle">
        <div className="sd-agent-name">{agent.name}</div>
        <div className="sd-agent-role-tag">Your Dedicated Agent</div>
        <div className="sd-agent-contacts">
          {agent.contact && <div className="sd-agent-contact-row"><div className="sd-agent-contact-icon" style={{ background:"#eff6ff",color:"#2563eb" }}><IC.Phone /></div><a href={`tel:${agent.contact}`}>{agent.contact}</a></div>}
          {agent.email   && <div className="sd-agent-contact-row"><div className="sd-agent-contact-icon" style={{ background:"#f0fdf4",color:"#16a34a" }}><IC.MailSm /></div><a href={`mailto:${agent.email}`}>{agent.email}</a></div>}
        </div>
        {agent.specialization && <div className="sd-agent-spec"><IC.Award /> {agent.specialization}</div>}
      </div>
      {properties.length > 0 && (
        <div className="sd-agent-right">
          <div className="sd-agent-prop-label">Handling your properties</div>
          {properties.slice(0,3).map(p => (
            <div key={p._id} className="sd-agent-prop-chip">
              <IC.Build />
              <span>{p.title}</span>
              {p.isApprovedByCompany
                ? <span style={{ marginLeft:"auto",color:"#16a34a",fontSize:10,fontWeight:700,whiteSpace:"nowrap" }}>LIVE</span>
                : p.agentVerdict==="needs_changes"
                ? <span style={{ marginLeft:"auto",color:"#d97706",fontSize:10,fontWeight:700,whiteSpace:"nowrap" }}>CHANGES</span>
                : p.agentVerdict==="approved"
                ? <span style={{ marginLeft:"auto",color:"#2563eb",fontSize:10,fontWeight:700,whiteSpace:"nowrap" }}>APPROVED</span>
                : <span style={{ marginLeft:"auto",color:"#94a3b8",fontSize:10,fontWeight:700,whiteSpace:"nowrap" }}>PENDING</span>}
            </div>
          ))}
          {properties.length > 3 && <div className="sd-agent-prop-chip" style={{ color:"#94a3b8",justifyContent:"center" }}>+{properties.length-3} more</div>}
        </div>
      )}
    </div>
  );
}