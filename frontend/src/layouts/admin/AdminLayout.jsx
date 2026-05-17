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

/* ═══════════════════════════════════════════════════════════════
   SVG ICON LIBRARY
═══════════════════════════════════════════════════════════════ */
const IC = {
  Grid:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Building:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/><line x1="4" y1="7" x2="9" y2="7"/><line x1="4" y1="12" x2="9" y2="12"/><line x1="4" y1="17" x2="9" y2="17"/><line x1="15" y1="7" x2="20" y2="7"/><line x1="15" y1="12" x2="20" y2="12"/><line x1="15" y1="17" x2="20" y2="17"/></svg>,
  Users:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Agent:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v4"/><path d="M10 15h4"/></svg>,
  DollarSign:() => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  Home:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  LogOut:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:         () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trash:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Edit:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Link:      () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  Unlink:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  Clock:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Star:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Bell:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  TrendUp:   () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Shield:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Briefcase: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  AlertCircle:() => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Search:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  CreditCard:() => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  UserCheck: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
};

/* ═══════════════════════════════════════════════════════════════
   REUSABLE PILLS
═══════════════════════════════════════════════════════════════ */
const RolePill = ({ role }) => {
  const map = {
    admin:  { bg: "#0d1117", color: "#fff" },
    seller: { bg: "#fef3c7", color: "#92400e" },
    buyer:  { bg: "#dbeafe", color: "#1e40af" },
    agent:  { bg: "#d1fae5", color: "#065f46" },
  };
  const s = map[role] || map.buyer;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, textTransform: "capitalize", letterSpacing: "0.02em" }}>
      {role}
    </span>
  );
};

const ApprovalPill = ({ approved, status }) => {
  if (approved) return <Pill bg="#d1fae5" color="#065f46" dot="●">Live</Pill>;
  if (status === "Pending") return <Pill bg="#fef3c7" color="#92400e" dot="●">Pending</Pill>;
  return <Pill bg="#fee2e2" color="#991b1b" dot="●">Rejected</Pill>;
};

const Pill = ({ bg, color, dot, children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: bg, color, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>
    {dot && <span style={{ fontSize: 8 }}>{dot}</span>}
    {children}
  </span>
);

const FeePill = ({ status }) => {
  const map = { paid: ["#d1fae5","#065f46","Paid"], unpaid: ["#fee2e2","#991b1b","Unpaid"], waived: ["#f3f4f6","#374151","Waived"] };
  const [bg, color, label] = map[status] || map.unpaid;
  return <Pill bg={bg} color={color}>{label}</Pill>;
};

/* ═══════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════ */
const StatCard = ({ label, value, sub, accent, icon }) => (
  <div className="stat-card">
    <div className="stat-icon-wrap" style={{ background: accent + "22", color: accent }}>{icon}</div>
    <div className="stat-val">{value ?? "—"}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "overview",   label: "Overview",    Icon: IC.Grid },
  { id: "properties", label: "Properties",  Icon: IC.Building },
  { id: "users",      label: "Users",       Icon: IC.Users },
  { id: "agents",     label: "Agents",      Icon: IC.Agent },
  { id: "fees",       label: "Seller Fees", Icon: IC.DollarSign },
];

const Sidebar = ({ tab, setTab, user, onLogout, badgeCounts }) => (
  <aside className="sidebar">
    <div className="sb-logo">
      <div className="sb-logo-mark"><IC.Home /></div>
      <div>
        <div className="sb-logo-name">NestFind</div>
        <div className="sb-logo-sub">Admin Panel</div>
      </div>
    </div>

    <div className="sb-user">
      <div className="sb-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
      <div>
        <div className="sb-uname">{user?.name}</div>
        <div className="sb-uemail">{user?.email}</div>
      </div>
    </div>

    <nav className="sb-nav">
      <p className="sb-nav-label">Navigation</p>
      {TABS.map(({ id, label, Icon }) => (
        <button key={id} className={`sb-item${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
          <Icon />
          <span>{label}</span>
          {badgeCounts?.[id] > 0 && <span className="sb-badge">{badgeCounts[id]}</span>}
        </button>
      ))}
    </nav>

    <button className="sb-logout" onClick={onLogout}>
      <IC.LogOut /> Sign out
    </button>
  </aside>
);

/* ═══════════════════════════════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════════════════════════════ */
const OverviewTab = ({ stats, pending, onApprove, onReject, loadingId }) => (
  <div className="tab-body">
    <div className="tab-head">
      <h2 className="tab-title">Site Overview</h2>
      <p className="tab-sub">Real-time snapshot of NestFind platform activity</p>
    </div>

    <div className="stats-grid">
      <StatCard icon={<IC.Users />}      accent="#2563eb" label="Total Users"     value={stats?.users?.total}      sub={`${stats?.users?.sellers ?? 0} sellers · ${stats?.users?.buyers ?? 0} buyers`} />
      <StatCard icon={<IC.Building />}   accent="#7c3aed" label="Total Listings"  value={stats?.properties?.total} />
      <StatCard icon={<IC.Clock />}      accent="#d97706" label="Pending Approval" value={stats?.properties?.pending} sub="Needs review" />
      <StatCard icon={<IC.Check />}      accent="#16a34a" label="Live Listings"   value={stats?.properties?.approved} />
      <StatCard icon={<IC.Agent />}      accent="#0891b2" label="Active Agents"   value={stats?.agents?.active}    sub={`${stats?.agents?.total ?? 0} total`} />
      <StatCard icon={<IC.CreditCard />} accent="#be185d" label="Fee Revenue"     value={fmtPrice(stats?.fees?.collected)} sub={`${stats?.fees?.unpaid ?? 0} unpaid`} />
    </div>

    {/* Pending approvals */}
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">
          <IC.AlertCircle style={{ color: "#d97706" }} /> Pending Property Approvals
        </h3>
        <span className="badge-count">{pending.length} waiting</span>
      </div>

      {pending.length === 0 ? (
        <div className="empty"><IC.Check style={{ color: "#16a34a" }} /><span>All caught up — no pending listings</span></div>
      ) : (
        <div className="pending-list">
          {pending.map((p) => (
            <div key={p._id} className="pending-row">
              <div className="pending-thumb">
                {p.thumbnail ? <img src={p.thumbnail} alt="" /> : <IC.Building />}
              </div>
              <div className="pending-info">
                <div className="pending-title">{p.title}</div>
                <div className="pending-meta">
                  {p.address?.city}, {p.address?.state} · {fmtPrice(p.price)} · by <strong>{p.userId?.name}</strong>
                </div>
              </div>
              <div className="row-actions">
                <button className="btn-approve" onClick={() => onApprove(p._id)} disabled={loadingId === p._id}>
                  <IC.Check /> Approve
                </button>
                <button className="btn-reject" onClick={() => onReject(p._id)} disabled={loadingId === p._id}>
                  <IC.X /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   PROPERTIES TAB
═══════════════════════════════════════════════════════════════ */
const PropertiesTab = ({ onApprove, onReject, onDelete, loadingId }) => {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = filter === "pending" ? "?approved=false" : filter === "approved" ? "?approved=true" : "";
      const { data } = await API.get(`/admin/properties${q}`);
      setRows(data.properties || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter]); // only re-create when filter changes

  useEffect(() => { load(); }, [load]);

  // ✅ FIX: wrap in arrow function so it's called on click, NOT during render
  const handleApprove = async (id) => { await onApprove(id); load(); };
  const handleReject  = async (id) => { await onReject(id);  load(); };
  const handleDelete  = async (id) => {
    if (!window.confirm("Permanently delete this property?")) return;
    await onDelete(id);
    load();
  };

  return (
    <div className="tab-body">
      <div className="tab-head-row">
        <div><h2 className="tab-title">All Properties</h2></div>
        <div className="filter-tabs">
          {["all","pending","approved"].map((f) => (
            <button key={f} className={`ftab${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card no-pad">
        {loading ? <div className="loading-state"><div className="spinner" /></div>
        : rows.length === 0 ? <div className="empty">No properties found</div>
        : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>{["Property","Seller","Price","Type","City","Status","Actions"].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="cell-title">{p.title}</div>
                      <div className="cell-sub">{fmtDate(p.createdAt)}</div>
                    </td>
                    <td>
                      <div className="cell-title">{p.userId?.name || "—"}</div>
                      <div className="cell-sub">{p.userId?.email}</div>
                    </td>
                    <td><span className="price-cell">{fmtPrice(p.price)}</span></td>
                    <td>{p.propertyInfo?.propertyType}</td>
                    <td>{p.address?.city}</td>
                    <td><ApprovalPill approved={p.isApprovedByCompany} status={p.status} /></td>
                    <td>
                      <div className="row-actions">
                        {/* ✅ FIX: onClick uses arrow functions, never calls immediately */}
                        {!p.isApprovedByCompany
                          ? <button className="btn-approve sm" onClick={() => handleApprove(p._id)} disabled={loadingId === p._id}><IC.Check /> Approve</button>
                          : <button className="btn-warn sm"    onClick={() => handleReject(p._id)}  disabled={loadingId === p._id}><IC.X /> Revoke</button>
                        }
                        <button className="btn-reject sm" onClick={() => handleDelete(p._id)} disabled={loadingId === p._id}>
                          <IC.Trash />
                        </button>
                      </div>
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
   USERS TAB  (with seller approval + agent assignment display)
═══════════════════════════════════════════════════════════════ */
const UsersTab = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [roleFilter, setRole] = useState("all");
  const [actionId, setAct]    = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (roleFilter !== "all") p.set("role", roleFilter);
      if (search) p.set("search", search);
      const { data } = await API.get(`/admin/users?${p}`);
      setUsers(data.users || []);
    } catch { }
    finally { setLoading(false); }
  }, [roleFilter, search]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const patch = async (id, url, body) => {
    setAct(id);
    try { await API.patch(url, body); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const del = async (id) => {
    if (!confirm("Permanently delete user and their data?")) return;
    setAct(id);
    try { await API.delete(`/admin/users/${id}`); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const approveSeller = (id) => patch(id, `/admin/users/${id}/approve-seller`, {});
  const changeRole    = (id, role) => patch(id, `/admin/users/${id}/role`, { role });
  const toggle        = (id) => patch(id, `/admin/users/${id}/toggle`, {});

  return (
    <div className="tab-body">
      <div className="tab-head-row">
        <h2 className="tab-title">All Users</h2>
        <div className="search-row">
          <div className="search-box">
            <IC.Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…" />
          </div>
          <select className="sel" value={roleFilter} onChange={e => setRole(e.target.value)}>
            <option value="all">All roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="card no-pad">
        {loading ? <div className="loading-state"><div className="spinner" /></div>
        : users.length === 0 ? <div className="empty">No users found</div>
        : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>{["User","Contact","Role","Seller Status","Agent Assigned","Joined","Actions"].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ opacity: u.isActive ? 1 : 0.55 }}>
                    <td>
                      <div className="user-cell">
                        <div className="u-avatar">{u.name?.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="cell-title">{u.name}</div>
                          <div className="cell-sub">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{u.contact || "—"}</td>
                    <td><RolePill role={u.role} /></td>
                    <td>
                      {u.role === "seller"
                        ? u.isApprovedByAdmin
                          ? <Pill bg="#d1fae5" color="#065f46" dot="●">Approved</Pill>
                          : <div className="double-action">
                              <Pill bg="#fef3c7" color="#92400e" dot="●">Pending</Pill>
                              <button className="btn-xs btn-approve" onClick={() => approveSeller(u._id)} disabled={actionId === u._id}>
                                <IC.UserCheck style={{width:11,height:11}} /> Approve
                              </button>
                            </div>
                        : <span className="na-text">—</span>
                      }
                    </td>
                    <td>
                      {u.role === "seller"
                        ? u.assignedAgent
                          ? <div className="agent-chip">
                              <div className="agent-chip-avatar">{u.assignedAgent.name?.charAt(0)}</div>
                              <span>{u.assignedAgent.name}</span>
                            </div>
                          : <span className="na-text">Not assigned</span>
                        : <span className="na-text">—</span>
                      }
                    </td>
                    <td>{fmtDate(u.createdAt)}</td>
                    <td>
                      {u.role !== "admin" && (
                        <div className="row-actions wrap">
                          <select className="sel sm" value={u.role} onChange={e => changeRole(u._id, e.target.value)} disabled={actionId === u._id}>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                            <option value="agent">Agent</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button className={u.isActive ? "btn-warn sm" : "btn-approve sm"} onClick={() => toggle(u._id)} disabled={actionId === u._id}>
                            {u.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button className="btn-reject sm" onClick={() => del(u._id)} disabled={actionId === u._id}><IC.Trash /></button>
                        </div>
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
   AGENTS TAB  (manage agents + assign seller ↔ agent)
═══════════════════════════════════════════════════════════════ */
const AgentsTab = () => {
  const [agents, setAgents]       = useState([]);
  const [sellers, setSellers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [actionId, setAct]        = useState(null);
  const [assigning, setAssigning] = useState(null); // agentId being assigned
  const [sellerPick, setPick]     = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [ag, sl] = await Promise.all([
        API.get("/admin/users?role=agent"),
        API.get("/admin/users?role=seller"),
      ]);
      setAgents(ag.data.users || []);
      setSellers(sl.data.users || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const assignSeller = async (agentId) => {
    if (!sellerPick) return;
    setAct(agentId);
    try {
      await API.patch(`/admin/agents/${agentId}/assign-seller`, { sellerId: sellerPick });
      setPick(""); setAssigning(null); load();
    } catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const unassign = async (agentId, sellerId) => {
    if (!confirm("Remove this seller from agent?")) return;
    setAct(agentId);
    try {
      await API.patch(`/admin/agents/${agentId}/unassign-seller`, { sellerId });
      load();
    } catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const toggleAgent = async (id) => {
    setAct(id);
    try { await API.patch(`/admin/users/${id}/toggle`); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const unassignedSellers = sellers.filter(s => !s.assignedAgent);

  return (
    <div className="tab-body">
      <div className="tab-head">
        <h2 className="tab-title">Agent Management</h2>
        <p className="tab-sub">Assign agents to sellers so they can assist with property sales</p>
      </div>

      {loading ? <div className="loading-state"><div className="spinner" /></div> : (
        <div className="agents-grid">
          {agents.length === 0 && (
            <div className="empty">No agents found. Promote a user to Agent role in the Users tab.</div>
          )}
          {agents.map((ag) => {
            const myS = sellers.filter(s => s.assignedAgent?._id === ag._id || s.assignedAgent === ag._id);
            return (
              <div key={ag._id} className={`agent-card${!ag.isActive ? " inactive" : ""}`}>
                {/* Agent header */}
                <div className="agent-card-head">
                  <div className="agent-avatar-lg">{ag.name?.charAt(0).toUpperCase()}</div>
                  <div className="agent-info">
                    <div className="agent-name">{ag.name}</div>
                    <div className="agent-email">{ag.email}</div>
                    <div className="agent-contact">{ag.contact}</div>
                  </div>
                  <div className="agent-card-actions">
                    <Pill bg={ag.isActive ? "#d1fae5" : "#fee2e2"} color={ag.isActive ? "#065f46" : "#991b1b"} dot="●">
                      {ag.isActive ? "Active" : "Inactive"}
                    </Pill>
                    <button className={ag.isActive ? "btn-warn sm" : "btn-approve sm"} onClick={() => toggleAgent(ag._id)} disabled={actionId === ag._id}>
                      {ag.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>

                {/* Sellers assigned to this agent */}
                <div className="agent-sellers">
                  <div className="agent-sellers-label">
                    <IC.Users style={{width:13,height:13}} />
                    Assigned Sellers ({myS.length})
                  </div>
                  {myS.length === 0
                    ? <p className="na-text" style={{padding:"6px 0"}}>No sellers assigned yet</p>
                    : myS.map(s => (
                      <div key={s._id} className="assigned-seller-row">
                        <div className="agent-chip">
                          <div className="agent-chip-avatar">{s.name?.charAt(0)}</div>
                          <div>
                            <div style={{fontSize:12,fontWeight:600,color:"var(--t1)"}}>{s.name}</div>
                            <div className="cell-sub">{s.email}</div>
                          </div>
                        </div>
                        <button className="btn-reject sm" onClick={() => unassign(ag._id, s._id)} disabled={actionId === ag._id} title="Remove assignment">
                          <IC.Unlink />
                        </button>
                      </div>
                    ))
                  }
                </div>

                {/* Assign new seller */}
                {ag.isActive && unassignedSellers.length > 0 && (
                  <div className="assign-row">
                    {assigning === ag._id ? (
                      <>
                        <select className="sel flex1" value={sellerPick} onChange={e => setPick(e.target.value)}>
                          <option value="">— Pick a seller —</option>
                          {unassignedSellers.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                        </select>
                        <button className="btn-approve sm" onClick={() => assignSeller(ag._id)} disabled={!sellerPick || actionId === ag._id}>
                          <IC.Link /> Assign
                        </button>
                        <button className="btn-ghost sm" onClick={() => { setAssigning(null); setPick(""); }}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn-primary-outline" onClick={() => { setAssigning(ag._id); setPick(""); }}>
                        <IC.Link /> Assign Seller
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FEES TAB  (seller listing fees management)
═══════════════════════════════════════════════════════════════ */
const FeesTab = () => {
  const [fees, setFees]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [actionId, setAct]    = useState(null);
  const [editId, setEditId]   = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = filter !== "all" ? `?status=${filter}` : "";
      const { data } = await API.get(`/admin/fees${q}`);
      setFees(data.fees || []);
    } catch { }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const markPaid = async (id) => {
    setAct(id);
    try { await API.patch(`/admin/fees/${id}/mark-paid`); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const waive = async (id) => {
    if (!confirm("Waive this fee?")) return;
    setAct(id);
    try { await API.patch(`/admin/fees/${id}/waive`); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const updateAmount = async (id) => {
    setAct(id);
    try { await API.patch(`/admin/fees/${id}`, { amount: Number(editAmount) }); setEditId(null); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setAct(null); }
  };

  const totalCollected = fees.filter(f => f.status === "paid").reduce((a, f) => a + (f.amount || 0), 0);
  const totalPending   = fees.filter(f => f.status === "unpaid").reduce((a, f) => a + (f.amount || 0), 0);

  return (
    <div className="tab-body">
      <div className="tab-head">
        <h2 className="tab-title">Seller Fees</h2>
        <p className="tab-sub">Charge and track fees for sellers who list properties on NestFind</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <StatCard icon={<IC.CreditCard />} accent="#16a34a" label="Collected"     value={fmtPrice(totalCollected)} />
        <StatCard icon={<IC.AlertCircle />} accent="#dc2626" label="Outstanding"  value={fmtPrice(totalPending)} sub={`${fees.filter(f=>f.status==="unpaid").length} unpaid`} />
        <StatCard icon={<IC.TrendUp />}    accent="#7c3aed" label="Total Fees"    value={fees.length} sub="all time" />
      </div>

      <div className="card no-pad">
        <div className="card-head" style={{padding:"12px 16px"}}>
          <div className="filter-tabs" style={{marginLeft:0}}>
            {["all","unpaid","paid","waived"].map(f => (
              <button key={f} className={`ftab${filter===f?" on":""}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className="loading-state"><div className="spinner" /></div>
        : fees.length === 0 ? <div className="empty">No fee records found</div>
        : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>{["Seller","Property","Amount","Status","Due Date","Actions"].map(h=><th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f._id}>
                    <td>
                      <div className="user-cell">
                        <div className="u-avatar sm">{f.sellerId?.name?.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="cell-title">{f.sellerId?.name || "—"}</div>
                          <div className="cell-sub">{f.sellerId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cell-title" style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.propertyId?.title || "—"}</div>
                      <div className="cell-sub">{f.feeType || "Listing Fee"}</div>
                    </td>
                    <td>
                      {editId === f._id
                        ? <div className="edit-inline">
                            <input className="amount-input" type="number" value={editAmount} onChange={e=>setEditAmount(e.target.value)} />
                            <button className="btn-approve sm" onClick={() => updateAmount(f._id)} disabled={actionId===f._id}><IC.Check /></button>
                            <button className="btn-ghost sm"   onClick={() => setEditId(null)}>✕</button>
                          </div>
                        : <span className="price-cell" style={{cursor:"pointer"}} onClick={() => { setEditId(f._id); setEditAmount(f.amount); }}>
                            {fmtPrice(f.amount)} <IC.Edit style={{opacity:0.4,verticalAlign:"middle"}} />
                          </span>
                      }
                    </td>
                    <td><FeePill status={f.status} /></td>
                    <td><span className={f.status==="unpaid" && new Date(f.dueDate)<new Date() ? "overdue-text" : ""}>{fmtDate(f.dueDate)}</span></td>
                    <td>
                      <div className="row-actions">
                        {f.status === "unpaid" && <>
                          <button className="btn-approve sm" onClick={() => markPaid(f._id)} disabled={actionId===f._id}><IC.Check /> Mark Paid</button>
                          <button className="btn-ghost sm"   onClick={() => waive(f._id)}    disabled={actionId===f._id}>Waive</button>
                        </>}
                        {f.status === "paid"   && <span className="na-text">Settled</span>}
                        {f.status === "waived" && <span className="na-text">Waived</span>}
                      </div>
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
  const { user, logout }    = useContext(AuthContext);
  const navigate            = useNavigate();
  const [tab, setTab]       = useState("overview");
  const [stats, setStats]   = useState(null);
  const [pending, setPend]  = useState([]);
  const [loadId, setLoadId] = useState(null);

  // ✅ FIX: defined before useEffect, stable reference with useCallback
  const fetchAll = useCallback(async () => {
    try {
      const [st, pd] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/properties?approved=false"),
      ]);
      setStats(st.data);
      setPend(pd.data.properties || []);
    } catch (e) {
      console.error("fetchAll error:", e);
    }
  }, []); // empty deps = stable, no infinite loop

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleApprove = async (id) => {
    setLoadId(id);
    try { await API.patch(`/admin/properties/${id}/approve`); fetchAll(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setLoadId(null); }
  };

  const handleReject = async (id) => {
    setLoadId(id);
    try { await API.patch(`/admin/properties/${id}/reject`); fetchAll(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
    finally { setLoadId(null); }
  };

  const handleDeleteProp = async (id) => {
    try { await API.delete(`/admin/properties/${id}`); fetchAll(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
  };

  const badgeCounts = {
    overview:   pending.length,
    properties: stats?.properties?.pending ?? 0,
    fees:       stats?.fees?.unpaid ?? 0,
  };

  return (
    <div className="admin-layout">
      <Sidebar tab={tab} setTab={setTab} user={user} badgeCounts={badgeCounts} onLogout={async () => { await logout(); navigate("/auth/login"); }} />

      <main className="admin-main">
        <div className="topbar">
          <div>
            <h1 className="topbar-title">Admin Dashboard</h1>
            <p className="topbar-sub">Full control over NestFind · Logged in as <strong>{user?.name}</strong></p>
          </div>
          {(stats?.properties?.pending > 0 || stats?.fees?.unpaid > 0) && (
            <div className="topbar-alerts">
              {stats?.properties?.pending > 0 && (
                <div className="alert-chip amber">
                  <IC.AlertCircle /> {stats.properties.pending} listing{stats.properties.pending !== 1 ? "s" : ""} pending
                </div>
              )}
              {stats?.fees?.unpaid > 0 && (
                <div className="alert-chip red">
                  <IC.DollarSign /> {stats.fees.unpaid} unpaid fee{stats.fees.unpaid !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}
        </div>

        {tab === "overview"   && <OverviewTab stats={stats} pending={pending} onApprove={handleApprove} onReject={handleReject} loadingId={loadId} />}
        {tab === "properties" && <PropertiesTab onApprove={handleApprove} onReject={handleReject} onDelete={handleDeleteProp} loadingId={loadId} />}
        {tab === "users"      && <UsersTab />}
        {tab === "agents"     && <AgentsTab />}
        {tab === "fees"       && <FeesTab />}
      </main>

      {/* ─── GLOBAL STYLES ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:    #f1f3f6;
          --surf:  #ffffff;
          --bdr:   #e4e7ec;
          --t1:    #0f172a;
          --t2:    #475569;
          --t3:    #94a3b8;
          --sb:    #0d1117;
          --sb2:   #161b22;
          --sb-bdr:#21262d;
          --sb-t:  #c9d1d9;
          --sb-m:  #8b949e;
          --acc:   #2563eb;
          --acc2:  #dbeafe;
          --green: #16a34a;
          --red:   #dc2626;
          --amber: #d97706;
          --radius:10px;
          --shadow:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);
          --shadow-md:0 4px 12px rgba(0,0,0,.08);
          font-family:'Plus Jakarta Sans',system-ui,sans-serif;
        }

        .admin-layout { display:flex; min-height:100vh; background:var(--bg); }

        /* ── Sidebar ── */
        .sidebar { width:232px; min-width:232px; background:var(--sb); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; overflow-y:auto; border-right:1px solid var(--sb-bdr); }
        .sb-logo { display:flex; align-items:center; gap:10px; padding:20px 18px 16px; border-bottom:1px solid var(--sb-bdr); }
        .sb-logo-mark { width:36px;height:36px;background:var(--acc);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0; }
        .sb-logo-name { font-size:16px;font-weight:800;color:#fff;letter-spacing:-.3px; }
        .sb-logo-sub { font-size:10px;font-weight:700;color:#f59e0b;letter-spacing:.08em;text-transform:uppercase; }
        .sb-user { display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--sb-bdr); }
        .sb-avatar { width:32px;height:32px;border-radius:50%;background:var(--acc);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .sb-uname { font-size:12.5px;font-weight:600;color:#e2e8f0; }
        .sb-uemail { font-size:10.5px;color:var(--sb-m);margin-top:1px; white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px; }
        .sb-nav { flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:2px; }
        .sb-nav-label { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--sb-m);padding:4px 8px 6px; }
        .sb-item { display:flex;align-items:center;gap:9px;padding:9px 10px;font-size:13px;font-weight:500;color:var(--sb-m);background:none;border:none;border-radius:7px;cursor:pointer;width:100%;text-align:left;font-family:inherit;transition:background .12s,color .12s;position:relative; }
        .sb-item span { flex:1; }
        .sb-item:hover { background:var(--sb2);color:var(--sb-t); }
        .sb-item.active { background:var(--sb2);color:#fff;border:1px solid var(--sb-bdr); }
        .sb-badge { background:#1e293b;color:#93c5fd;font-size:10.5px;font-weight:700;padding:1px 7px;border-radius:20px; }
        .sb-logout { margin:12px;padding:9px 14px;background:transparent;color:var(--sb-m);border:1px solid var(--sb-bdr);border-radius:8px;cursor:pointer;font-size:12.5px;font-family:inherit;font-weight:500;display:flex;align-items:center;gap:8px;transition:background .12s,color .12s; }
        .sb-logout:hover { background:var(--sb2);color:#e2e8f0; }

        /* ── Main ── */
        .admin-main { flex:1;overflow-y:auto;min-width:0; }
        .topbar { display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:24px 28px 20px;background:var(--surf);border-bottom:1px solid var(--bdr); }
        .topbar-title { font-size:20px;font-weight:800;color:var(--t1);letter-spacing:-.4px; }
        .topbar-sub { font-size:13px;color:var(--t2);margin-top:2px; }
        .topbar-sub strong { color:var(--t1); }
        .topbar-alerts { display:flex;gap:8px;align-items:center;flex-wrap:wrap; }
        .alert-chip { display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:6px 12px;border-radius:8px; }
        .alert-chip.amber { background:#fef3c7;color:#92400e;border:1px solid #fcd34d; }
        .alert-chip.red   { background:#fee2e2;color:#991b1b;border:1px solid #fca5a5; }

        /* ── Tab body ── */
        .tab-body { padding:24px 28px;display:flex;flex-direction:column;gap:20px; }
        .tab-head { display:flex;flex-direction:column;gap:3px; }
        .tab-head-row { display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap; }
        .tab-title { font-size:18px;font-weight:700;color:var(--t1);letter-spacing:-.3px; }
        .tab-sub { font-size:13px;color:var(--t2); }

        /* ── Stats ── */
        .stats-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px; }
        .stat-card { background:var(--surf);border:1px solid var(--bdr);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--shadow);transition:box-shadow .2s,transform .2s;cursor:default; }
        .stat-card:hover { box-shadow:var(--shadow-md);transform:translateY(-1px); }
        .stat-icon-wrap { width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-bottom:10px; }
        .stat-val { font-size:26px;font-weight:800;color:var(--t1);letter-spacing:-1px;line-height:1; }
        .stat-label { font-size:12.5px;font-weight:600;color:var(--t1);margin-top:5px; }
        .stat-sub { font-size:11px;color:var(--t3);margin-top:2px; }

        /* ── Card ── */
        .card { background:var(--surf);border:1px solid var(--bdr);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow); }
        .card.no-pad { padding:0;overflow:hidden; }
        .card-head { display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--bdr); }
        .card-title { display:flex;align-items:center;gap:7px;font-size:14px;font-weight:700;color:var(--t1); }
        .badge-count { font-size:12px;color:var(--t3);background:var(--bg);padding:3px 10px;border-radius:20px;border:1px solid var(--bdr); }

        /* ── Pending list ── */
        .pending-list { display:flex;flex-direction:column;gap:10px; }
        .pending-row { display:flex;align-items:center;gap:12px;padding:11px 14px;background:#fafbfd;border:1px solid var(--bdr);border-radius:9px;transition:background .12s; }
        .pending-row:hover { background:#f1f5f9; }
        .pending-thumb { width:46px;height:46px;border-radius:8px;background:var(--bg);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--t3);border:1px solid var(--bdr); }
        .pending-thumb img { width:100%;height:100%;object-fit:cover; }
        .pending-info { flex:1;min-width:0; }
        .pending-title { font-size:13px;font-weight:600;color:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .pending-meta { font-size:11.5px;color:var(--t3);margin-top:2px; }
        .pending-meta strong { color:var(--t2); }

        /* ── Table ── */
        .table-scroll { overflow-x:auto; }
        .data-table { width:100%;border-collapse:collapse;font-size:13px; }
        .data-table th { text-align:left;padding:10px 14px;color:var(--t3);font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.06em;background:#fafbfd;border-bottom:1px solid var(--bdr); }
        .data-table td { padding:12px 14px;border-bottom:1px solid #f1f5f9;vertical-align:middle;color:var(--t2); }
        .data-table tr:last-child td { border-bottom:none; }
        .data-table tr:hover td { background:#fafbfd; }
        .cell-title { font-weight:600;color:var(--t1);font-size:13px; }
        .cell-sub { font-size:11px;color:var(--t3);margin-top:1px; }
        .price-cell { font-weight:700;color:var(--t1);font-variant-numeric:tabular-nums; }
        .user-cell { display:flex;align-items:center;gap:9px; }
        .u-avatar { width:30px;height:30px;border-radius:50%;background:var(--t1);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .u-avatar.sm { width:26px;height:26px;font-size:11px; }
        .na-text { font-size:12px;color:var(--t3); }
        .overdue-text { color:var(--red);font-weight:600; }

        /* ── Buttons ── */
        .row-actions { display:flex;align-items:center;gap:6px; }
        .row-actions.wrap { flex-wrap:wrap; }
        .double-action { display:flex;align-items:center;gap:6px;flex-wrap:wrap; }

        button { font-family:inherit; }

        .btn-approve, .btn-reject, .btn-warn, .btn-ghost {
          display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;padding:7px 13px;border-radius:7px;cursor:pointer;border:none;transition:opacity .15s,transform .1s;
        }
        .btn-approve { background:#d1fae5;color:#065f46; }
        .btn-approve:hover { background:#a7f3d0; }
        .btn-reject  { background:#fee2e2;color:#991b1b;border:1px solid #fca5a5!important; }
        .btn-reject:hover { background:#fecaca; }
        .btn-warn    { background:#fef3c7;color:#92400e; }
        .btn-warn:hover { background:#fde68a; }
        .btn-ghost   { background:var(--bg);color:var(--t2);border:1px solid var(--bdr)!important; }
        .btn-ghost:hover { background:var(--bdr); }

        .btn-approve.sm,.btn-reject.sm,.btn-warn.sm,.btn-ghost.sm { font-size:11.5px;padding:5px 10px;border-radius:6px; }
        .btn-xs { font-size:11px;padding:3px 8px;border-radius:5px; }

        button:disabled { opacity:.5;cursor:not-allowed; }
        button:active:not(:disabled) { transform:scale(.97); }

        .btn-primary-outline { display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;padding:7px 13px;border-radius:7px;cursor:pointer;background:transparent;border:1.5px solid var(--acc);color:var(--acc);transition:background .12s; }
        .btn-primary-outline:hover { background:var(--acc2); }

        /* ── Filter tabs ── */
        .filter-tabs { display:flex;gap:6px; }
        .ftab { padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--bdr);background:none;color:var(--t2);font-family:inherit;transition:background .12s,color .12s,border-color .12s; }
        .ftab:hover { background:var(--bg); }
        .ftab.on { background:var(--t1);color:#fff;border-color:var(--t1); }

        /* ── Search ── */
        .search-row { display:flex;gap:8px;align-items:center; }
        .search-box { display:flex;align-items:center;gap:8px;border:1px solid var(--bdr);border-radius:8px;padding:7px 12px;background:var(--surf);color:var(--t3); }
        .search-box input { border:none;outline:none;font-size:13px;font-family:inherit;color:var(--t1);width:200px;background:transparent; }
        .sel { padding:7px 10px;border:1px solid var(--bdr);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surf);color:var(--t1);cursor:pointer;outline:none; }
        .sel.sm { font-size:11.5px;padding:4px 8px;border-radius:6px; }
        .sel.flex1 { flex:1; }

        /* ── Agent cards ── */
        .agents-grid { display:flex;flex-direction:column;gap:16px; }
        .agent-card { background:var(--surf);border:1px solid var(--bdr);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow); }
        .agent-card.inactive { opacity:.65; }
        .agent-card-head { display:flex;align-items:flex-start;gap:14px;margin-bottom:14px; }
        .agent-avatar-lg { width:46px;height:46px;border-radius:50%;background:var(--t1);color:#fff;font-size:17px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .agent-info { flex:1;min-width:0; }
        .agent-name { font-size:15px;font-weight:700;color:var(--t1); }
        .agent-email { font-size:12px;color:var(--t2);margin-top:2px; }
        .agent-contact { font-size:12px;color:var(--t3);margin-top:1px; }
        .agent-card-actions { display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex-shrink:0; }
        .agent-sellers { border-top:1px solid var(--bdr);padding-top:12px;margin-top:2px;display:flex;flex-direction:column;gap:7px; }
        .agent-sellers-label { display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px; }
        .assigned-seller-row { display:flex;align-items:center;justify-content:space-between;background:#fafbfd;border:1px solid var(--bdr);border-radius:7px;padding:8px 10px; }
        .agent-chip { display:flex;align-items:center;gap:8px; }
        .agent-chip-avatar { width:26px;height:26px;border-radius:50%;background:var(--acc);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .assign-row { display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px dashed var(--bdr);flex-wrap:wrap; }

        /* ── Inline edit ── */
        .edit-inline { display:flex;align-items:center;gap:6px; }
        .amount-input { padding:4px 8px;border:1px solid var(--acc);border-radius:6px;font-size:13px;font-family:inherit;outline:none;width:100px;color:var(--t1); }

        /* ── States ── */
        .loading-state { display:flex;justify-content:center;align-items:center;padding:56px; }
        .spinner { width:24px;height:24px;border:2.5px solid var(--bdr);border-top-color:var(--acc);border-radius:50%;animation:spin .7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .empty { display:flex;align-items:center;justify-content:center;gap:10px;padding:52px;color:var(--t3);font-size:13.5px;font-weight:500; }

        /* ── Responsive ── */
        @media(max-width:900px) {
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .admin-main .topbar { padding:16px 18px; }
          .tab-body { padding:18px; }
        }
        @media(max-width:680px) {
          .admin-layout { flex-direction:column; }
          .sidebar { width:100%;height:auto;position:static; }
          .sb-nav { flex-direction:row;flex-wrap:wrap; }
          .sb-nav-label { display:none; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .search-box input { width:140px; }
        }
      `}</style>
    </div>
  );
}