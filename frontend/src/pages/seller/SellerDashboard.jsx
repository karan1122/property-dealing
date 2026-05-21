import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const IC = {
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  Build: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="22" x2="9" y2="2" /><line x1="15" y1="22" x2="15" y2="2" /><line x1="4" y1="7" x2="9" y2="7" /><line x1="4" y1="12" x2="9" y2="12" /><line x1="15" y1="7" x2="20" y2="7" /><line x1="15" y1="12" x2="20" y2="12" /></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Trash: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>,
  Agent: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  Phone: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.14 1.22 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>,
  MailSm: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  Award: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
  CheckCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  XCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
  AlertTriangle: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  Note: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
};

const fmtPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const resolveAgent = (agentField, agentMap) => {
  if (!agentField) return null;
  if (typeof agentField === "object" && agentField._id) return agentField;
  return agentMap[agentField] || null;
};

const agentBg = (name = "") => {
  const c = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2"];
  return c[(name.charCodeAt(0) || 0) % c.length];
};

// ── Agent Verification Badge shown per-property ────────────────────────────
const VSTATUS = {
  approved: { bg: "#d1fae5", color: "#065f46", label: "Agent Approved", icon: "✓" },
  rejected: { bg: "#fee2e2", color: "#991b1b", label: "Agent Rejected", icon: "✗" },
  needs_changes: { bg: "#fef3c7", color: "#92400e", label: "Changes Requested", icon: "⚠" },
  pending: { bg: "#f1f5f9", color: "#475569", label: "Agent Review Pending", icon: "⏳" },
};

function AgentVerificationBadge({ property }) {
  const vs = property.agentVerdict || "pending";
  const cfg = VSTATUS[vs] || VSTATUS.pending;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: cfg.bg, color: cfg.color,
        fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
        width: "fit-content"
      }}>
        {cfg.icon} {cfg.label}
      </span>
      {property.agentNote && (vs === "needs_changes" || vs === "rejected") && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 4,
          background: vs === "rejected" ? "#fff5f5" : "#fffbeb",
          border: `1px solid ${vs === "rejected" ? "#fca5a5" : "#fcd34d"}`,
          borderRadius: 7, padding: "5px 8px", maxWidth: 200,
        }}>
          <IC.Note />
          <span style={{ fontSize: 11, color: vs === "rejected" ? "#991b1b" : "#92400e", lineHeight: 1.4 }}>
            {property.agentNote}
          </span>
        </div>
      )}
    </div>
  );
}

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0, pending: 0, inquiries: 0 });
  const [properties, setProperties] = useState([]);
  const [agentMap, setAgentMap] = useState({});
  const [myAgent, setMyAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const [propsRes, statsRes] = await Promise.all([
        api.get("/properties/my/all"),
        api.get("/properties/my/stats"),
      ]);
      const props = propsRes.data.properties || [];
      setProperties(props);
      setStats(statsRes.data || {});

      // Fetch assigned agent
      let fetchedAgent = null;
      try {
        const agentRes = await api.get("/admin/seller/my-agent");
        fetchedAgent = agentRes.data?.agent || null;
      } catch (agentErr) {
        if (agentErr?.response?.status !== 404) {
          console.warn("Agent fetch error:", agentErr?.response?.data?.message || agentErr.message);
        }
      }
      setMyAgent(fetchedAgent);

      // Build agentMap for property-level agentId
      const rawIds = props.map(p => p.agentId).filter(a => a && typeof a === "string");
      const uniqueIds = [...new Set(rawIds)];
      if (uniqueIds.length > 0) {
        const fetched = await Promise.allSettled(
          uniqueIds.map(id => api.get(`/admin/agents/${id}`).then(r => r.data?.agent || r.data))
        );
        const map = {};
        fetched.forEach((res, i) => {
          if (res.status === "fulfilled" && res.value) map[uniqueIds[i]] = res.value;
        });
        setAgentMap(map);
      }
    } catch (err) {
      console.error("fetchDashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch {
      alert("Failed to delete property");
    }
  };

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = properties.filter(p => {
    if (filter === "approved") return p.isApprovedByCompany;
    if (filter === "pending") return !p.isApprovedByCompany && p.status !== "Rejected" && p.isActive !== false;
    if (filter === "rejected") return p.status === "Rejected" || p.isActive === false;
    if (filter === "changes") return p.agentVerdict === "needs_changes";
    return true;
  });

  const counts = {
    all: properties.length,
    approved: properties.filter(p => p.isApprovedByCompany).length,
    pending: properties.filter(p => !p.isApprovedByCompany && p.status !== "Rejected" && p.isActive !== false).length,
    rejected: properties.filter(p => p.status === "Rejected" || p.isActive === false).length,
    changes: properties.filter(p => p.agentVerdict === "needs_changes").length,
  };

  // ── Alert: properties needing attention ──────────────────────────────────
  const needsAttention = properties.filter(p =>
    p.agentVerdict === "needs_changes" || p.agentVerdict === "rejected"
  );

  const propertyAgents = properties.map(p => resolveAgent(p.agentId, agentMap)).filter(Boolean);
  const uniqueAgents = [...new Map(propertyAgents.map(a => [a._id, a])).values()];
  const hasAnyAgent = myAgent || uniqueAgents.length > 0;

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
          <p className="sd-nav-group" style={{ marginTop: 20 }}>Other</p>
          <Link to="/seller/inquiries" className="sd-nl"><IC.Mail /><span>Inquiries</span>{stats.inquiries > 0 && <span className="sd-badge warn">{stats.inquiries}</span>}</Link>
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

        {/* Account pending notice */}
        {!user?.isApprovedByAdmin && (
          <div className="notice notice-yellow">
            <IC.Clock />
            <div>
              <strong>Account Pending Approval</strong>
              <p>Your seller account is under review. Listings won't be visible to buyers until an admin approves your account.</p>
            </div>
          </div>
        )}

        {/* ── Agent feedback alert ─────────────────────────────────────── */}
        {!loading && needsAttention.length > 0 && (
          <div className="notice notice-orange">
            <IC.AlertTriangle />
            <div>
              <strong>{needsAttention.length} {needsAttention.length === 1 ? "property needs" : "properties need"} your attention</strong>
              <p>
                Your agent has reviewed some listings and left feedback. Check the
                <strong> "Changes Requested"</strong> tab below, fix the issues, and resubmit.
              </p>
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {needsAttention.slice(0, 3).map(p => (
                  <span key={p._id} style={{
                    fontSize: 11.5, fontWeight: 600, background: "rgba(0,0,0,.06)",
                    padding: "2px 9px", borderRadius: 20
                  }}>
                    {p.title}
                  </span>
                ))}
                {needsAttention.length > 3 && (
                  <span style={{ fontSize: 11.5, color: "#78350f" }}>+{needsAttention.length - 3} more</span>
                )}
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
              <p className="sd-agent-section-sub">Your dedicated point of contact — they verify your listings before admin approval</p>
            </div>
          </div>

          {loading ? (
            <div className="sd-agent-loading"><div className="sd-spinner" /> Loading agent info…</div>
          ) : !hasAnyAgent ? (
            <div className="sd-no-agent-box">
              <div className="sd-no-agent-icon"><IC.Agent /></div>
              <div className="sd-no-agent-text">
                <strong>No agent assigned yet</strong>
                <p>Once admin assigns an agent to you, their contact details will appear here. They will visit and verify your properties.</p>
              </div>
              <div className="sd-no-agent-badge">Pending Assignment</div>
            </div>
          ) : (
            <div className="sd-agent-cards">
              {myAgent && <AgentCard agent={myAgent} properties={properties} />}
              {uniqueAgents
                .filter(a => !myAgent || a._id !== myAgent._id)
                .map(agent => (
                  <AgentCard
                    key={agent._id}
                    agent={agent}
                    properties={properties.filter(p => resolveAgent(p.agentId, agentMap)?._id === agent._id)}
                  />
                ))}
            </div>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="sd-stats">
          {[
            { label: "Total Listings", value: stats.total, color: "blue", Icon: IC.Build },
            { label: "Live / Approved", value: stats.available || counts.approved, color: "green", Icon: IC.CheckCircle },
            { label: "Pending Review", value: stats.pending || counts.pending, color: "yellow", Icon: IC.Clock },
            { label: "Sold", value: stats.sold, color: "orange", Icon: IC.Award },
          ].map(s => (
            <div key={s.label} className={`sd-stat sd-stat-${s.color}`}>
              <div className="sd-stat-icon"><s.Icon /></div>
              <div className="sd-stat-val">{s.value ?? 0}</div>
              <div className="sd-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Properties table ── */}
        <div className="sd-card">
          <div className="sd-card-header">
            <div>
              <h2 className="sd-card-title">My Properties</h2>
              <p className="sd-card-sub">{properties.length} total listing{properties.length !== 1 ? "s" : ""}</p>
            </div>
            <Link to="/seller/add-property" className="sd-btn-primary" style={{ fontSize: 13 }}>
              <IC.Plus /> Add
            </Link>
          </div>

          <div className="sd-filter-tabs">
            {[
              { key: "all", label: "All", count: counts.all },
              { key: "approved", label: "Live", count: counts.approved },
              { key: "pending", label: "Pending", count: counts.pending },
              { key: "changes", label: "Changes Requested", count: counts.changes },
              { key: "rejected", label: "Rejected", count: counts.rejected },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`sd-filter-tab${filter === f.key ? " active" : ""}${f.key === "changes" && counts.changes > 0 ? " warn-tab" : ""}`}>
                {f.label}
                <span className="sd-filter-count">{f.count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="sd-loading"><div className="sd-spinner" />Loading properties…</div>
          ) : filtered.length === 0 ? (
            <div className="sd-empty">
              <div className="sd-empty-icon"><IC.Build /></div>
              <h3>No {filter !== "all" ? filter.replace("_", " ") : ""} properties</h3>
              <p>{filter === "all" ? "Add your first listing to get started." : `No properties in this state.`}</p>
              {filter === "all" && <Link to="/seller/add-property" className="sd-btn-primary"><IC.Plus /> Add Property</Link>}
            </div>
          ) : (
            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>City</th>
                    <th>Admin Status</th>
                    <th>Agent Verification</th>
                    <th>Assigned Agent</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const agent = resolveAgent(p.agentId, agentMap) || myAgent;
                    const vs = p.agentVerdict || "pending";
                    const rowBg = vs === "needs_changes" ? "#fffbeb" : vs === "rejected" ? "#fff5f5" : "transparent";
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
                          ) : p.status === "Rejected" || p.isActive === false ? (
                            <span className="sd-pill sd-pill-rejected"><IC.XCircle /> Rejected</span>
                          ) : (
                            <span className="sd-pill sd-pill-waiting"><IC.Clock /> Pending</span>
                          )}
                        </td>
                        <td><AgentVerificationBadge property={p} /></td>
                        <td>
                          {agent ? (
                            <div className="sd-agent-cell">
                              <div className="sd-agent-cell-av" style={{ background: agentBg(agent.name) }}>
                                {agent.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="sd-agent-cell-name">{agent.name}</div>
                                {agent.contact && <div className="sd-agent-cell-meta"><IC.Phone /> {agent.contact}</div>}
                                {agent.email && <div className="sd-agent-cell-meta"><IC.MailSm /> {agent.email}</div>}
                              </div>
                            </div>
                          ) : (
                            <span className="sd-no-agent-tag">Not assigned</span>
                          )}
                        </td>
                        <td className="sd-date">{fmtDate(p.createdAt)}</td>
                        <td>
                          <div className="sd-actions">
                            {/* Allow edit if pending or needs changes */}
                            {/* {!p.isApprovedByCompany && p.status !== "Rejected" && p.isActive !== false && (
                              <Link to={`/seller/edit-property/${p._id}`} className="sd-btn-edit">
                                <IC.Edit /> Edit
                              </Link>
                            )} */}
                            
                            {!p.isApprovedByCompany &&
                              p.isActive !== false &&
                              (p.agentVerdict === "pending" || p.agentVerdict === "needs_changes" || !p.agentVerdict) && (
                                <Link to={`/seller/edit-property/${p._id}`} className="sd-btn-edit">
                                  <IC.Edit /> Edit
                                </Link>
                              )}
                            <button onClick={() => handleDelete(p._id)} className="sd-btn-delete">
                              <IC.Trash /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="sd-info-note">
          <strong>How it works:</strong> Submit a property → Agent visits & verifies → Admin reviews agent verdict →
          Goes <span style={{ color: "#16a34a", fontWeight: 700 }}>Live</span>.
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
        /* Agent section */
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
        /* Stats */
        .sd-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .sd-stat{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);padding:18px 20px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:4px}
        .sd-stat-icon{margin-bottom:6px}
        .sd-stat-val{font-size:30px;font-weight:800;letter-spacing:-1px;line-height:1}
        .sd-stat-label{font-size:12.5px;color:var(--t2);font-weight:500}
        .sd-stat-blue .sd-stat-icon,.sd-stat-blue .sd-stat-val{color:var(--blue)}
        .sd-stat-green .sd-stat-icon,.sd-stat-green .sd-stat-val{color:var(--green)}
        .sd-stat-yellow .sd-stat-icon,.sd-stat-yellow .sd-stat-val{color:var(--yellow)}
        .sd-stat-orange .sd-stat-icon,.sd-stat-orange .sd-stat-val{color:var(--orange)}
        /* Card */
        .sd-card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow)}
        .sd-card-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--bdr)}
        .sd-card-title{font-size:15px;font-weight:700}
        .sd-card-sub{font-size:12px;color:var(--t3);margin-top:2px}
        /* Filter tabs */
        .sd-filter-tabs{display:flex;gap:4px;padding:12px 20px;border-bottom:1px solid var(--bdr);background:#fafafa;flex-wrap:wrap}
        .sd-filter-tab{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;font-size:12.5px;font-weight:600;cursor:pointer;border:1px solid transparent;background:none;color:var(--t2);font-family:inherit;transition:all .12s}
        .sd-filter-tab:hover{background:var(--bdr);color:var(--t1)}
        .sd-filter-tab.active{background:var(--t1);color:#fff}
        .sd-filter-tab.warn-tab{border-color:#fcd34d;color:#92400e;background:#fef3c7}
        .sd-filter-tab.warn-tab.active{background:#d97706;color:#fff;border-color:#d97706}
        .sd-filter-count{font-size:11px;background:rgba(255,255,255,.2);padding:1px 6px;border-radius:10px;min-width:18px;text-align:center}
        .sd-filter-tab:not(.active) .sd-filter-count{background:#f3f4f6;color:var(--t3)}
        /* Table */
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
        /* Pills */
        .sd-pill{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:20px}
        .sd-pill-available,.sd-pill-live{background:var(--green-l);color:#14532d}
        .sd-pill-pending{background:var(--yellow-l);color:#78350f}
        .sd-pill-sold{background:var(--orange-l);color:#7c2d12}
        .sd-pill-waiting{background:#f1f5f9;color:#475569;border:1px solid #e2e8f0}
        .sd-pill-rejected{background:var(--red-l);color:#7f1d1d}
        /* Buttons */
        .sd-btn-primary{display:inline-flex;align-items:center;gap:7px;background:var(--blue);color:#fff;border:none;padding:9px 18px;border-radius:8px;font-size:14px;font-family:inherit;font-weight:600;cursor:pointer;text-decoration:none;transition:background .12s}
        .sd-btn-primary:hover{background:#1d4ed8}
        .sd-actions{display:flex;gap:6px}
        .sd-btn-edit,.sd-btn-delete{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-family:inherit;font-weight:600;padding:6px 11px;border-radius:7px;cursor:pointer;text-decoration:none;transition:background .12s}
        .sd-btn-edit{border:1px solid var(--bdr);color:var(--t1);background:var(--surf)}.sd-btn-edit:hover{background:var(--bg)}
        .sd-btn-delete{border:1px solid #fca5a5;color:var(--red);background:var(--surf)}.sd-btn-delete:hover{background:var(--red-l)}
        /* Loading/Empty */
        .sd-loading{display:flex;flex-direction:column;align-items:center;gap:12px;padding:56px;color:var(--t3);font-size:13px}
        .sd-spinner{width:24px;height:24px;border:2.5px solid var(--bdr);border-top-color:var(--blue);border-radius:50%;animation:sd-spin .7s linear infinite;flex-shrink:0}
        @keyframes sd-spin{to{transform:rotate(360deg)}}
        .sd-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:60px 32px;color:var(--t3);text-align:center}
        .sd-empty-icon{width:52px;height:52px;background:var(--bg);border:1px solid var(--bdr);border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--t3);margin-bottom:4px}
        .sd-empty h3{font-size:15px;font-weight:700;color:var(--t2)}.sd-empty p{font-size:13px;margin-bottom:6px}
        .sd-info-note{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);padding:14px 18px;font-size:12.5px;color:var(--t2);line-height:1.6}
        @media(max-width:900px){.sd-stats{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:768px){
          .sd-layout{flex-direction:column}
          .sd-sidebar{width:100%;height:auto;position:static}
          .sd-main{padding:16px}
          .sd-stats{grid-template-columns:repeat(2,1fr)}
          .sd-agent-card{grid-template-columns:auto 1fr;grid-template-rows:auto auto}
          .sd-agent-right{grid-column:1/-1;align-items:flex-start}
        }
      `}</style>
    </div>
  );
}

function AgentCard({ agent, properties = [] }) {
  const bg = agentBg(agent.name);
  return (
    <div className="sd-agent-card">
      <div className="sd-agent-left">
        <div className="sd-agent-av" style={{ background: bg }}>
          {agent.name?.charAt(0).toUpperCase()}
        </div>
        <div className="sd-agent-status" style={{
          background: agent.isActive ? "#dcfce7" : "#f1f5f9",
          color: agent.isActive ? "#14532d" : "#64748b",
        }}>
          <span style={{ fontSize: 7 }}>●</span>
          {agent.isActive ? "Active" : "Inactive"}
        </div>
      </div>

      <div className="sd-agent-middle">
        <div className="sd-agent-name">{agent.name}</div>
        <div className="sd-agent-role-tag">Your Dedicated Agent</div>
        <div className="sd-agent-contacts">
          {agent.contact && (
            <div className="sd-agent-contact-row">
              <div className="sd-agent-contact-icon" style={{ background: "#eff6ff", color: "#2563eb" }}><IC.Phone /></div>
              <a href={`tel:${agent.contact}`}>{agent.contact}</a>
            </div>
          )}
          {agent.email && (
            <div className="sd-agent-contact-row">
              <div className="sd-agent-contact-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><IC.MailSm /></div>
              <a href={`mailto:${agent.email}`}>{agent.email}</a>
            </div>
          )}
        </div>
        {agent.specialization && (
          <div className="sd-agent-spec"><IC.Award /> {agent.specialization}</div>
        )}
      </div>

      {properties.length > 0 && (
        <div className="sd-agent-right">
          <div className="sd-agent-prop-label">Handling your properties</div>
          {properties.slice(0, 3).map(p => (
            <div key={p._id} className="sd-agent-prop-chip">
              <IC.Build />
              <span>{p.title}</span>
              {p.isApprovedByCompany
                ? <span style={{ marginLeft: "auto", color: "#16a34a", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>LIVE</span>
                : p.agentVerdict === "needs_changes"

                  ? <span style={{ marginLeft: "auto", color: "#d97706", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>CHANGES</span>
                  : p.agentVerdict === "approved"
                    ? <span style={{ marginLeft: "auto", color: "#2563eb", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>APPROVED</span>
                    : <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>PENDING</span>
              }
            </div>
          ))}
          {properties.length > 3 && (
            <div className="sd-agent-prop-chip" style={{ color: "#94a3b8", justifyContent: "center" }}>
              +{properties.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}