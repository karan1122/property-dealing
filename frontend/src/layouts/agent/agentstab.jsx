import { useState, useEffect, useCallback, useRef } from "react";
import API from "../../api/axios";

/* ═══════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════ */
const IC = {
  Search:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Users:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Phone:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.14 1.22 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>,
  Mail:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Link:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  Unlink:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  Check:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:        () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Eye:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Building: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/><line x1="4" y1="7" x2="9" y2="7"/><line x1="4" y1="12" x2="9" y2="12"/></svg>,
  ChevDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Close:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Star:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Grid:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  List:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Plus:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  TrendUp:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Award:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
};

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);

// Deterministic avatar color from name
const avatarColor = (name = "") => {
  const colors = [
    ["#dbeafe","#1e40af"], ["#d1fae5","#065f46"], ["#fef3c7","#92400e"],
    ["#fce7f3","#9d174d"], ["#ede9fe","#4c1d95"], ["#ffedd5","#7c2d12"],
    ["#cffafe","#164e63"], ["#f0fdf4","#14532d"],
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

/* ═══════════════════════════════════════════════
   MINI COMPONENTS
═══════════════════════════════════════════════ */
const Pill = ({ bg, color, dot, children }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:bg, color, fontSize:11, padding:"3px 9px", borderRadius:20, fontWeight:700 }}>
    {dot && <span style={{fontSize:7}}>{dot}</span>}{children}
  </span>
);

const Avatar = ({ name, size = 40 }) => {
  const [bg, color] = avatarColor(name);
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg, color, fontSize:size*0.38, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, letterSpacing:"-0.5px" }}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   ASSIGN SELLER MODAL
═══════════════════════════════════════════════ */
const AssignModal = ({ agent, unassigned, onAssign, onClose, loading }) => {
  const [pick, setPick] = useState("");
  const [search, setSearch] = useState("");
  const filtered = unassigned.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3 className="modal-title">Assign Seller to Agent</h3>
            <p className="modal-sub">Assigning to <strong>{agent.name}</strong></p>
          </div>
          <button className="modal-close" onClick={onClose}><IC.Close /></button>
        </div>

        <div className="modal-body">
          <div className="modal-search">
            <IC.Search />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search sellers by name or email…"
            />
          </div>

          <div className="seller-pick-list">
            {filtered.length === 0
              ? <div className="pick-empty">No unassigned sellers found</div>
              : filtered.map(s => (
                <label key={s._id} className={`seller-pick-row${pick === s._id ? " selected" : ""}`}>
                  <input
                    type="radio"
                    name="seller"
                    value={s._id}
                    checked={pick === s._id}
                    onChange={() => setPick(s._id)}
                    style={{ display: "none" }}
                  />
                  <Avatar name={s.name} size={34} />
                  <div className="pick-info">
                    <div className="pick-name">{s.name}</div>
                    <div className="pick-email">{s.email}</div>
                  </div>
                  {s.propertyCount != null && (
                    <div className="pick-props">
                      <IC.Building /> {s.propertyCount} listing{s.propertyCount !== 1 ? "s" : ""}
                    </div>
                  )}
                  {pick === s._id && (
                    <div className="pick-check"><IC.Check /></div>
                  )}
                </label>
              ))
            }
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-ghost-sm" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary-sm"
            onClick={() => pick && onAssign(agent._id, pick)}
            disabled={!pick || loading}
          >
            {loading ? <><div className="btn-spinner-sm" /> Assigning…</> : <><IC.Link /> Assign Seller</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   AGENT DETAIL DRAWER
═══════════════════════════════════════════════ */
const AgentDrawer = ({ agent, sellers, onUnassign, onClose, loading }) => {
  const mySellers = sellers.filter(s =>
    s.assignedAgent?._id === agent._id || s.assignedAgent === agent._id
  );

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <button className="modal-close" onClick={onClose}><IC.Close /></button>
          <h3 className="drawer-title">Agent Profile</h3>
        </div>

        <div className="drawer-body">
          {/* Agent hero */}
          <div className="drawer-hero">
            <Avatar name={agent.name} size={64} />
            <div className="drawer-hero-info">
              <div className="drawer-name">{agent.name}</div>
              <div className="drawer-email">{agent.email}</div>
              {agent.contact && (
                <div className="drawer-contact"><IC.Phone /> {agent.contact}</div>
              )}
              <div style={{marginTop:8}}>
                <Pill
                  bg={agent.isActive ? "#d1fae5" : "#fee2e2"}
                  color={agent.isActive ? "#065f46" : "#991b1b"}
                  dot="●"
                >
                  {agent.isActive ? "Active" : "Inactive"}
                </Pill>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="drawer-stats">
            {[
              { label: "Sellers", value: mySellers.length, icon: <IC.Users /> },
              { label: "Listings", value: mySellers.reduce((a,s) => a + (s.propertyCount||0), 0), icon: <IC.Building /> },
              { label: "Joined", value: fmtDate(agent.createdAt), icon: <IC.Award /> },
            ].map(s => (
              <div key={s.label} className="drawer-stat">
                <div className="ds-icon">{s.icon}</div>
                <div className="ds-val">{s.value}</div>
                <div className="ds-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Assigned sellers */}
          <div className="drawer-section-title">
            <IC.Users /> Assigned Sellers ({mySellers.length})
          </div>

          {mySellers.length === 0 ? (
            <div className="drawer-empty">No sellers assigned to this agent yet.</div>
          ) : (
            <div className="drawer-seller-list">
              {mySellers.map(s => (
                <div key={s._id} className="drawer-seller-row">
                  <Avatar name={s.name} size={36} />
                  <div className="drawer-seller-info">
                    <div className="dsi-name">{s.name}</div>
                    <div className="dsi-email">{s.email}</div>
                    {s.propertyCount != null && (
                      <div className="dsi-props"><IC.Building /> {s.propertyCount} listing{s.propertyCount !== 1 ? "s" : ""}</div>
                    )}
                  </div>
                  <div className="drawer-seller-meta">
                    <Pill bg={s.isApprovedByAdmin ? "#d1fae5" : "#fef3c7"} color={s.isApprovedByAdmin ? "#065f46" : "#92400e"}>
                      {s.isApprovedByAdmin ? "Approved" : "Pending"}
                    </Pill>
                    <button
                      className="unassign-btn"
                      onClick={() => onUnassign(agent._id, s._id)}
                      disabled={loading}
                      title="Remove from agent"
                    >
                      <IC.Unlink /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   AGENT CARD (grid view)
═══════════════════════════════════════════════ */
const AgentCard = ({ agent, assignedCount, onView, onToggle, onAssign, onDelete, canAssign, loading }) => {
  const [bg, color] = avatarColor(agent.name);

  return (
    <div className={`agent-card${!agent.isActive ? " inactive-card" : ""}`}>
      {/* Card top accent */}
      <div className="card-accent" style={{ background: bg }} />

      <div className="card-body">
        {/* Header */}
        <div className="card-header">
          <Avatar name={agent.name} size={48} />
          <div className="card-header-info">
            <div className="card-name">{agent.name}</div>
            <div className="card-email">{agent.email}</div>
          </div>
          <Pill
            bg={agent.isActive ? "#d1fae5" : "#f1f5f9"}
            color={agent.isActive ? "#065f46" : "#64748b"}
            dot="●"
          >
            {agent.isActive ? "Active" : "Off"}
          </Pill>
        </div>

        {/* Contact */}
        {agent.contact && (
          <div className="card-contact">
            <IC.Phone /> {agent.contact}
          </div>
        )}

        {/* Stats */}
        <div className="card-stats">
          <div className="cs-item">
            <div className="cs-val">{assignedCount}</div>
            <div className="cs-label">Sellers</div>
          </div>
          <div className="cs-divider" />
          <div className="cs-item">
            <div className="cs-val">{agent.totalListings ?? 0}</div>
            <div className="cs-label">Listings</div>
          </div>
          <div className="cs-divider" />
          <div className="cs-item">
            <div className="cs-val">{fmtDate(agent.createdAt)}</div>
            <div className="cs-label">Joined</div>
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions">
          <button className="ca-btn view-btn" onClick={() => onView(agent)}>
            <IC.Eye /> View
          </button>
          {agent.isActive && canAssign && (
            <button className="ca-btn assign-btn" onClick={() => onAssign(agent)}>
              <IC.Link /> Assign Seller
            </button>
          )}
          <div className="card-actions-right">
            <button
              className={`ca-icon-btn${agent.isActive ? " deact-btn" : " act-btn"}`}
              onClick={() => onToggle(agent._id)}
              disabled={loading === agent._id}
              title={agent.isActive ? "Deactivate" : "Activate"}
            >
              {agent.isActive ? <IC.X /> : <IC.Check />}
            </button>
            <button
              className="ca-icon-btn del-btn"
              onClick={() => onDelete(agent._id)}
              disabled={loading === agent._id}
              title="Delete agent"
            >
              <IC.Trash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   AGENT ROW (list view)
═══════════════════════════════════════════════ */
const AgentRow = ({ agent, assignedCount, onView, onToggle, onAssign, onDelete, canAssign, loading }) => (
  <tr className={!agent.isActive ? "row-inactive" : ""}>
    <td>
      <div className="user-cell">
        <Avatar name={agent.name} size={32} />
        <div>
          <div className="cell-name">{agent.name}</div>
          <div className="cell-sub">{agent.email}</div>
        </div>
      </div>
    </td>
    <td>
      {agent.contact
        ? <div className="contact-cell"><IC.Phone /> {agent.contact}</div>
        : <span className="na">—</span>
      }
    </td>
    <td>
      <div className="sellers-cell">
        <span className="sellers-count">{assignedCount}</span>
        <span className="na">seller{assignedCount !== 1 ? "s" : ""}</span>
      </div>
    </td>
    <td>{agent.totalListings ?? 0}</td>
    <td>
      <Pill
        bg={agent.isActive ? "#d1fae5" : "#f1f5f9"}
        color={agent.isActive ? "#065f46" : "#64748b"}
        dot="●"
      >
        {agent.isActive ? "Active" : "Inactive"}
      </Pill>
    </td>
    <td>{fmtDate(agent.createdAt)}</td>
    <td>
      <div className="row-actions">
        <button className="btn-xs-outline" onClick={() => onView(agent)}>
          <IC.Eye /> View
        </button>
        {agent.isActive && canAssign && (
          <button className="btn-xs-blue" onClick={() => onAssign(agent)}>
            <IC.Link /> Assign
          </button>
        )}
        <button
          className={agent.isActive ? "btn-xs-warn" : "btn-xs-green"}
          onClick={() => onToggle(agent._id)}
          disabled={loading === agent._id}
        >
          {agent.isActive ? "Deactivate" : "Activate"}
        </button>
        <button
          className="btn-xs-red"
          onClick={() => onDelete(agent._id)}
          disabled={loading === agent._id}
        >
          <IC.Trash />
        </button>
      </div>
    </td>
  </tr>
);

/* ═══════════════════════════════════════════════
   MAIN AGENTS TAB
═══════════════════════════════════════════════ */
export default function AgentsTab() {
  const [agents,   setAgents]   = useState([]);
  const [sellers,  setSellers]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [actionId, setAct]      = useState(null);

  // UI state
  const [view,      setView]     = useState("grid"); // "grid" | "list"
  const [search,    setSearch]   = useState("");
  const [statusF,   setStatusF]  = useState("all"); // "all" | "active" | "inactive"
  const [drawerAg,  setDrawer]   = useState(null);
  const [assignAg,  setAssignAg] = useState(null);
  const [assignLd,  setAssignLd] = useState(false);

  /* ── Load ── */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [agRes, slRes] = await Promise.all([
        API.get("/admin/users?role=agent"),
        API.get("/admin/users?role=seller"),
      ]);
      setAgents(agRes.data.users || []);
      setSellers(slRes.data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Helpers ── */
  const assignedCount = (agentId) =>
    sellers.filter(s => s.assignedAgent?._id === agentId || s.assignedAgent === agentId).length;

  const unassignedSellers = sellers.filter(s => !s.assignedAgent);

  /* ── Actions ── */
  const handleToggle = async (id) => {
    setAct(id);
    try { await API.patch(`/admin/users/${id}/toggle`); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this agent? Their sellers will be unassigned.")) return;
    setAct(id);
    try { await API.delete(`/admin/users/${id}`); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const handleAssign = async (agentId, sellerId) => {
    setAssignLd(true);
    try {
      await API.patch(`/admin/agents/${agentId}/assign-seller`, { sellerId });
      setAssignAg(null);
      load();
    } catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAssignLd(false); }
  };

  const handleUnassign = async (agentId, sellerId) => {
    if (!window.confirm("Remove this seller from the agent?")) return;
    setAct(agentId);
    try {
      await API.patch(`/admin/agents/${agentId}/unassign-seller`, { sellerId });
      load();
      // Refresh drawer data if open
      if (drawerAg?._id === agentId) {
        setDrawer(ag => agents.find(a => a._id === ag._id) || ag);
      }
    } catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  /* ── Filtered list ── */
  const filtered = agents.filter(ag => {
    const matchSearch =
      ag.name?.toLowerCase().includes(search.toLowerCase()) ||
      ag.email?.toLowerCase().includes(search.toLowerCase()) ||
      ag.contact?.includes(search);
    const matchStatus =
      statusF === "all" ||
      (statusF === "active" && ag.isActive) ||
      (statusF === "inactive" && !ag.isActive);
    return matchSearch && matchStatus;
  });

  /* ── Stats ── */
  const totalActive   = agents.filter(a => a.isActive).length;
  const totalAssigned = sellers.filter(s => s.assignedAgent).length;
  const totalUnassign = sellers.length - totalAssigned;

  /* ═══════════════════════
     RENDER
  ═══════════════════════ */
  return (
    <div className="agents-page">

      {/* ── Top summary stats ── */}
      <div className="summary-row">
        {[
          { label: "Total Agents",       val: agents.length,  sub: `${totalActive} active`,     color: "#2563eb" },
          { label: "Active Agents",      val: totalActive,    sub: `${agents.length - totalActive} inactive`, color: "#16a34a" },
          { label: "Sellers Assigned",   val: totalAssigned,  sub: "have an agent",              color: "#7c3aed" },
          { label: "Unassigned Sellers", val: totalUnassign,  sub: "need an agent",              color: totalUnassign > 0 ? "#d97706" : "#16a34a" },
        ].map(s => (
          <div key={s.label} className="summary-card">
            <div className="sc-val" style={{ color: s.color }}>{s.val}</div>
            <div className="sc-label">{s.label}</div>
            <div className="sc-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrap">
            <IC.Search />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search agents…"
            />
          </div>
          <div className="filter-pills">
            {["all","active","inactive"].map(f => (
              <button
                key={f}
                className={`fpill${statusF === f ? " on" : ""}`}
                onClick={() => setStatusF(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
       <div className="toolbar-right">

  {/* ADMIN ONLY */}
  {JSON.parse(localStorage.getItem("user"))?.role === "admin" && (
    <button
      className="create-agent-btn"
      onClick={() => window.location.href = "/admin/users"}
    >
      <IC.Plus />
      Create Agent
    </button>
  )}

  <span className="result-count">
    {filtered.length} agent{filtered.length !== 1 ? "s" : ""}
  </span>

  <div className="view-toggle">
      </div>

      {/* ── No agents hint ── */}
      {!loading && agents.length === 0 && (
        <div className="empty-agents">
          <IC.Award />
          <h3>No agents yet</h3>
          <p>Go to the <strong>Users</strong> tab and change a user's role to <em>Agent</em> to add them here.</p>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="agents-loading">
          <div className="big-spinner" />
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {!loading && view === "grid" && filtered.length > 0 && (
        <div className="agents-grid">
          {filtered.map(ag => (
            <AgentCard
              key={ag._id}
              agent={ag}
              assignedCount={assignedCount(ag._id)}
              onView={setDrawer}
              onToggle={handleToggle}
              onAssign={setAssignAg}
              onDelete={handleDelete}
              canAssign={unassignedSellers.length > 0}
              loading={actionId}
            />
          ))}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {!loading && view === "list" && filtered.length > 0 && (
        <div className="agents-table-wrap">
          <table className="agents-table">
            <thead>
              <tr>
                {["Agent","Contact","Sellers","Listings","Status","Joined","Actions"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ag => (
                <AgentRow
                  key={ag._id}
                  agent={ag}
                  assignedCount={assignedCount(ag._id)}
                  onView={setDrawer}
                  onToggle={handleToggle}
                  onAssign={setAssignAg}
                  onDelete={handleDelete}
                  canAssign={unassignedSellers.length > 0}
                  loading={actionId}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── No results ── */}
      {!loading && filtered.length === 0 && agents.length > 0 && (
        <div className="empty-agents">
          <IC.Search />
          <h3>No agents match your search</h3>
          <p>Try clearing the search or changing the filter.</p>
        </div>
      )}

      {/* ── ASSIGN MODAL ── */}
      {assignAg && (
        <AssignModal
          agent={assignAg}
          unassigned={unassignedSellers}
          onAssign={handleAssign}
          onClose={() => setAssignAg(null)}
          loading={assignLd}
        />
      )}

      {/* ── DRAWER ── */}
      {drawerAg && (
        <AgentDrawer
          agent={drawerAg}
          sellers={sellers}
          onUnassign={handleUnassign}
          onClose={() => setDrawer(null)}
          loading={actionId}
        />
      )}

      {/* ═══════════ STYLES ═══════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .agents-page {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        /* ── Summary ── */
        .summary-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .summary-card {
          background: #fff;
          border: 1px solid #e4e7ec;
          border-radius: 10px;
          padding: 16px 18px;
          box-shadow: 0 1px 3px rgba(0,0,0,.06);
        }
        .sc-val   { font-size: 28px; font-weight: 800; letter-spacing: -1px; line-height: 1; }
        .sc-label { font-size: 12.5px; font-weight: 600; color: #0f172a; margin-top: 6px; }
        .sc-sub   { font-size: 11px; color: #94a3b8; margin-top: 2px; }

        /* ── Toolbar ── */
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .toolbar-left  { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .toolbar-right { display: flex; align-items: center; gap: 10px; }

        .search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1.5px solid #e4e7ec;
          border-radius: 9px;
          padding: 8px 12px;
          background: #fff;
          color: #94a3b8;
          min-width: 220px;
        }
        .search-wrap input {
          border: none;
          outline: none;
          font-size: 13px;
          font-family: inherit;
          color: #0f172a;
          background: transparent;
          flex: 1;
        }

        .filter-pills { display: flex; gap: 5px; }
        .fpill {
          padding: 6px 13px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid #e4e7ec;
          background: none;
          color: #475569;
          cursor: pointer;
          font-family: inherit;
          transition: background .12s, color .12s, border-color .12s;
        }
        .fpill:hover { background: #f8fafc; }
        .fpill.on { background: #0f172a; color: #fff; border-color: #0f172a; }

        .result-count { font-size: 12px; color: #94a3b8; font-weight: 500; }

        .view-toggle { display: flex; border: 1px solid #e4e7ec; border-radius: 8px; overflow: hidden; }
        .vt-btn {
          width: 34px; height: 34px;
          border: none;
          background: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .12s, color .12s;
          font-family: inherit;
        }
        .vt-btn:hover { background: #f8fafc; color: #475569; }
        .vt-btn.on { background: #0f172a; color: #fff; }

        /* ── Agent cards ── */
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 14px;
        }

        .agent-card {
          background: #fff;
          border: 1px solid #e4e7ec;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,.06);
          transition: box-shadow .2s, transform .2s;
        }
        .agent-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.1); transform: translateY(-2px); }
        .agent-card.inactive-card { opacity: .65; }

        .card-accent { height: 5px; width: 100%; }
        .card-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }

        .card-header { display: flex; align-items: flex-start; gap: 11px; }
        .card-header-info { flex: 1; min-width: 0; }
        .card-name  { font-size: 14px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-email { font-size: 11.5px; color: #94a3b8; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .card-contact {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #475569;
        }

        .card-stats {
          display: flex;
          align-items: center;
          background: #fafbfd;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          padding: 10px 0;
        }
        .cs-item { flex: 1; text-align: center; padding: 0 8px; }
        .cs-val   { font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: -.5px; }
        .cs-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }
        .cs-divider { width: 1px; background: #e4e7ec; align-self: stretch; }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .card-actions-right { margin-left: auto; display: flex; gap: 5px; }

        .ca-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 11px;
          border-radius: 7px;
          border: 1.5px solid #e4e7ec;
          background: none;
          cursor: pointer;
          font-family: inherit;
          transition: background .12s, border-color .12s;
        }
        .view-btn:hover   { background: #f8fafc; }
        .assign-btn       { border-color: #bfdbfe; color: #1d4ed8; background: #eff6ff; }
        .assign-btn:hover { background: #dbeafe; }

        .ca-icon-btn {
          width: 30px; height: 30px;
          border-radius: 7px;
          border: 1.5px solid #e4e7ec;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .12s;
          font-family: inherit;
        }
        .deact-btn:hover { background: #fef3c7; border-color: #fcd34d; color: #92400e; }
        .act-btn:hover   { background: #d1fae5; border-color: #6ee7b7; color: #065f46; }
        .del-btn:hover   { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
        .ca-icon-btn:disabled { opacity: .5; cursor: not-allowed; }

        /* ── Table ── */
        .agents-table-wrap { background: #fff; border: 1px solid #e4e7ec; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.06); }
        .agents-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .agents-table th {
          text-align: left;
          padding: 10px 14px;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: .06em;
          background: #fafbfd;
          border-bottom: 1px solid #e4e7ec;
        }
        .agents-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          color: #475569;
        }
        .agents-table tr:last-child td { border-bottom: none; }
        .agents-table tr:hover td { background: #fafbfd; }
        .agents-table tr.row-inactive { opacity: .6; }

        .user-cell { display: flex; align-items: center; gap: 9px; }
        .cell-name { font-size: 13px; font-weight: 600; color: #0f172a; }
        .cell-sub  { font-size: 11px; color: #94a3b8; margin-top: 1px; }
        .contact-cell { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: #475569; }
        .sellers-cell { display: flex; align-items: center; gap: 5px; }
        .sellers-count { font-size: 14px; font-weight: 700; color: #0f172a; }
        .na { font-size: 12px; color: #94a3b8; }

        .row-actions { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }

        .btn-xs-outline, .btn-xs-blue, .btn-xs-warn, .btn-xs-green, .btn-xs-red {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11.5px; font-weight: 600;
          padding: 5px 9px; border-radius: 6px;
          cursor: pointer; font-family: inherit;
          transition: background .12s;
        }
        .btn-xs-outline { border: 1px solid #e4e7ec; background: none; color: #475569; }
        .btn-xs-outline:hover { background: #f8fafc; }
        .btn-xs-blue  { border: none; background: #eff6ff; color: #1d4ed8; }
        .btn-xs-blue:hover { background: #dbeafe; }
        .btn-xs-warn  { border: none; background: #fef3c7; color: #92400e; }
        .btn-xs-warn:hover { background: #fde68a; }
        .btn-xs-green { border: none; background: #d1fae5; color: #065f46; }
        .btn-xs-green:hover { background: #a7f3d0; }
        .btn-xs-red   { border: none; background: #fee2e2; color: #991b1b; }
        .btn-xs-red:hover { background: #fecaca; }
        button:disabled { opacity: .5; cursor: not-allowed !important; }

        /* ── Empty / Loading ── */
        .empty-agents {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; padding: 64px 32px; text-align: center;
          background: #fff; border: 1px solid #e4e7ec; border-radius: 12px;
          color: #94a3b8;
        }
        .empty-agents h3 { font-size: 15px; font-weight: 700; color: #475569; }
        .empty-agents p  { font-size: 13px; color: #94a3b8; }
        .empty-agents strong { color: #0f172a; }
        .empty-agents em { font-style: normal; font-weight: 600; color: #2563eb; }

        .agents-loading { display: flex; justify-content: center; align-items: center; padding: 80px; }
        .big-spinner { width: 32px; height: 32px; border: 3px solid #e4e7ec; border-top-color: #2563eb; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Modal ── */
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(15,23,42,.5);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }
        .modal-box {
          background: #fff;
          border-radius: 14px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 60px rgba(0,0,0,.25);
          display: flex; flex-direction: column;
          max-height: 90vh;
          animation: modal-in .2s cubic-bezier(.16,1,.3,1);
        }
        @keyframes modal-in {
          from { opacity:0; transform: scale(.95) translateY(8px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .modal-head {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; padding: 20px 20px 16px;
          border-bottom: 1px solid #e4e7ec;
        }
        .modal-title { font-size: 15px; font-weight: 700; color: #0f172a; }
        .modal-sub   { font-size: 12.5px; color: #94a3b8; margin-top: 2px; }
        .modal-sub strong { color: #475569; }
        .modal-close {
          width: 30px; height: 30px; border-radius: 7px;
          border: 1px solid #e4e7ec; background: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #94a3b8; flex-shrink: 0; font-family: inherit;
          transition: background .12s;
        }
        .modal-close:hover { background: #f8fafc; color: #0f172a; }

        .modal-body { padding: 16px 20px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .modal-search {
          display: flex; align-items: center; gap: 8px;
          border: 1.5px solid #e4e7ec; border-radius: 8px;
          padding: 8px 12px; color: #94a3b8;
        }
        .modal-search input {
          border: none; outline: none;
          font-size: 13px; font-family: inherit;
          color: #0f172a; background: transparent; flex: 1;
        }

        .seller-pick-list { display: flex; flex-direction: column; gap: 6px; max-height: 300px; overflow-y: auto; }
        .pick-empty { text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; }

        .seller-pick-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 9px;
          border: 1.5px solid #f1f5f9; cursor: pointer;
          transition: border-color .12s, background .12s;
        }
        .seller-pick-row:hover   { border-color: #bfdbfe; background: #eff6ff; }
        .seller-pick-row.selected { border-color: #2563eb; background: #eff6ff; }
        .pick-info { flex: 1; min-width: 0; }
        .pick-name  { font-size: 13px; font-weight: 600; color: #0f172a; }
        .pick-email { font-size: 11px; color: #94a3b8; margin-top: 1px; }
        .pick-props { display: flex; align-items: center; gap: 4px; font-size: 11.5px; color: #94a3b8; white-space: nowrap; }
        .pick-check { width: 22px; height: 22px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .modal-foot {
          display: flex; justify-content: flex-end; gap: 8px;
          padding: 14px 20px; border-top: 1px solid #e4e7ec;
        }
        .btn-ghost-sm {
          padding: 8px 16px; border-radius: 8px;
          border: 1.5px solid #e4e7ec; background: none;
          font-size: 13px; font-weight: 600; color: #475569;
          cursor: pointer; font-family: inherit;
          transition: background .12s;
        }
        .btn-ghost-sm:hover { background: #f8fafc; }
        .btn-primary-sm {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 18px; border-radius: 8px;
          border: none; background: #2563eb; color: #fff;
          font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
          transition: background .12s;
        }
        .btn-primary-sm:hover:not(:disabled) { background: #1d4ed8; }
        .btn-primary-sm:disabled { opacity: .6; cursor: not-allowed; }
        .btn-spinner-sm { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }

        /* ── Drawer ── */
        .drawer-backdrop {
          position: fixed; inset: 0;
          background: rgba(15,23,42,.4);
          backdrop-filter: blur(3px);
          z-index: 1000;
          display: flex; justify-content: flex-end;
        }
        .drawer {
          width: 100%; max-width: 420px;
          background: #fff;
          height: 100vh;
          display: flex; flex-direction: column;
          box-shadow: -8px 0 40px rgba(0,0,0,.15);
          animation: slide-in .25s cubic-bezier(.16,1,.3,1);
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .drawer-head {
          display: flex; align-items: center; gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid #e4e7ec;
        }
        .drawer-title { font-size: 15px; font-weight: 700; color: #0f172a; }

        .drawer-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 18px; }

        .drawer-hero { display: flex; align-items: flex-start; gap: 14px; }
        .drawer-hero-info { flex: 1; min-width: 0; }
        .drawer-name    { font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -.3px; }
        .drawer-email   { font-size: 13px; color: #94a3b8; margin-top: 2px; }
        .drawer-contact { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #475569; margin-top: 5px; }

        .drawer-stats {
          display: flex; background: #fafbfd;
          border: 1px solid #e4e7ec; border-radius: 10px;
          overflow: hidden;
        }
        .drawer-stat { flex: 1; padding: 12px 8px; text-align: center; border-right: 1px solid #e4e7ec; }
        .drawer-stat:last-child { border-right: none; }
        .ds-icon  { color: #94a3b8; display: flex; justify-content: center; margin-bottom: 5px; }
        .ds-val   { font-size: 15px; font-weight: 800; color: #0f172a; }
        .ds-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; margin-top: 2px; }

        .drawer-section-title {
          display: flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .07em;
          color: #94a3b8;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 8px;
        }

        .drawer-empty { text-align: center; padding: 24px 0; color: #94a3b8; font-size: 13px; }

        .drawer-seller-list { display: flex; flex-direction: column; gap: 8px; }
        .drawer-seller-row {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 11px 12px; background: #fafbfd;
          border: 1px solid #e4e7ec; border-radius: 9px;
          transition: background .12s;
        }
        .drawer-seller-row:hover { background: #f1f5f9; }

        .drawer-seller-info { flex: 1; min-width: 0; }
        .dsi-name  { font-size: 13px; font-weight: 600; color: #0f172a; }
        .dsi-email { font-size: 11px; color: #94a3b8; margin-top: 1px; }
        .dsi-props { display: flex; align-items: center; gap: 4px; font-size: 11.5px; color: #94a3b8; margin-top: 3px; }

        .drawer-seller-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
        .unassign-btn {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600;
          padding: 4px 9px; border-radius: 6px;
          border: 1px solid #fca5a5; background: none; color: #991b1b;
          cursor: pointer; font-family: inherit;
          transition: background .12s;
        }
        .unassign-btn:hover { background: #fee2e2; }
        .unassign-btn:disabled { opacity: .5; cursor: not-allowed; }

        /* ── Responsive ── */
        @media (max-width: 900px) { .summary-row { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px) {
          .agents-page { padding: 16px; }
          .summary-row { grid-template-columns: repeat(2,1fr); }
          .toolbar { flex-direction: column; align-items: flex-start; }
          .agents-grid { grid-template-columns: 1fr; }
          .drawer { max-width: 100%; }
        }
          .create-agent-btn{
  display:flex;
  align-items:center;
  gap:6px;
  height:36px;
  padding:0 14px;
  border:none;
  border-radius:9px;
  background:#2563eb; 
  color:#fff;
  font-size:12px;
  font-weight:700;
  cursor:pointer;
  font-family:inherit;
  transition:all .15s ease;
}

.create-agent-btn:hover{
  background:#1d4ed8;
  transform:translateY(-1px);
}
      `}</style>
    </div>
  );
}