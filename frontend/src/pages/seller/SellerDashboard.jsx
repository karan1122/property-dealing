import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0, inquiries: 0, views: 0 });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [propsRes, statsRes] = await Promise.all([
        api.get("/properties/my"),
        api.get("/properties/my/stats"),
      ]);
      setProperties(propsRes.data.properties || []);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete property");
    }
  };

  const statusPill = (status) => {
    const map = {
      Available: "pill-available",
      Pending: "pill-pending",
      Sold: "pill-sold",
    };
    return <span className={`pill ${map[status] || "pill-pending"}`}>{status}</span>;
  };

  const approvalPill = (approved) =>
    approved ? (
      <span className="pill pill-approved">✓ Approved</span>
    ) : (
      <span className="pill pill-waiting">⏳ Waiting</span>
    );

  // Icons as SVG components to avoid HTML entity rendering issues
  const Icon = {
    Home: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    Grid: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    Building: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/><line x1="4" y1="7" x2="9" y2="7"/><line x1="4" y1="12" x2="9" y2="12"/><line x1="4" y1="17" x2="9" y2="17"/><line x1="15" y1="7" x2="20" y2="7"/><line x1="15" y1="12" x2="20" y2="12"/><line x1="15" y1="17" x2="20" y2="17"/>
      </svg>
    ),
    Plus: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    Mail: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    User: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    LogOut: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    TotalList: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      </svg>
    ),
    CheckCircle: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    Tag: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    Bell: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
    Alert: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    Edit: () => (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    Trash: () => (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
      </svg>
    ),
  };

  return (
    <div className="seller-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <Icon.Home />
          </div>
          <span>NestFind</span>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">Seller</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-group-label">Main</p>
          <Link to="/seller/dashboard" className="nav-item active">
            <Icon.Grid /> <span>Overview</span>
          </Link>
          <Link to="/seller/properties" className="nav-item">
            <Icon.Building /> <span>My Properties</span>
            {stats.total > 0 && <span className="nav-badge">{stats.total}</span>}
          </Link>
          <Link to="/seller/add-property" className="nav-item">
            <Icon.Plus /> <span>Add Property</span>
          </Link>

          <p className="nav-group-label" style={{ marginTop: 20 }}>Communication</p>
          <Link to="/seller/inquiries" className="nav-item">
            <Icon.Mail /> <span>Inquiries</span>
            {stats.inquiries > 0 && <span className="nav-badge warn">{stats.inquiries}</span>}
          </Link>
          <Link to="/seller/profile" className="nav-item">
            <Icon.User /> <span>Profile</span>
          </Link>
        </nav>

        <button
          className="sidebar-logout"
          onClick={() => { logout(); navigate("/login"); }}
        >
          <Icon.LogOut /> Logout
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">

        {/* Header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Dashboard</h1>
            <p className="dash-sub">Welcome back, <strong>{user?.name}</strong></p>
          </div>
          <Link to="/seller/add-property" className="btn-primary">
            <Icon.Plus /> Add Property
          </Link>
        </header>

        {/* ── FIXED: Only show notice if user account is NOT yet approved by admin ── */}
        {!user?.isApprovedByAdmin && (
          <div className="approval-notice">
            <span className="notice-icon"><Icon.Alert /></span>
            <div>
              <strong>Account Pending Approval</strong>
              <p>Your seller account is under review. Your listings won't be visible to buyers until an admin approves your account.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <section className="stats-grid">
          {[
            { label: "Total Listings", value: stats.total, icon: <Icon.TotalList />, color: "blue" },
            { label: "Available", value: stats.available, icon: <Icon.CheckCircle />, color: "green" },
            { label: "Sold", value: stats.sold, icon: <Icon.Tag />, color: "orange" },
            { label: "New Inquiries", value: stats.inquiries, icon: <Icon.Bell />, color: "purple" },
          ].map((s) => (
            <div className={`stat-card stat-${s.color}`} key={s.label}>
              <div className="stat-icon-wrap">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Properties Table */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">My Properties</h2>
            <span className="prop-count">{properties.length} listing{properties.length !== 1 ? "s" : ""}</span>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <span>Loading properties…</span>
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Icon.Building /></div>
              <h3>No properties yet</h3>
              <p>Start by adding your first property listing.</p>
              <Link to="/seller/add-property" className="btn-primary">
                <Icon.Plus /> Add Property
              </Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="prop-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Approved</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p._id}>
                      <td className="prop-title">{p.title}</td>
                      <td className="prop-type">{p.propertyInfo?.propertyType}</td>
                      <td className="prop-price">₹{Number(p.price).toLocaleString("en-IN")}</td>
                      <td>{p.address?.city}</td>
                      <td>{statusPill(p.status)}</td>
                      <td>{approvalPill(p.isApprovedByCompany)}</td>
                      <td>
                        <div className="action-btns">
                          <Link to={`/seller/edit-property/${p._id}`} className="btn-edit">
                            <Icon.Edit /> Edit
                          </Link>
                          <button onClick={() => handleDelete(p._id)} className="btn-delete">
                            <Icon.Trash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #f4f5f7;
          --surface: #ffffff;
          --border: #e4e6eb;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --sidebar-bg: #0d1117;
          --sidebar-surface: #161b22;
          --sidebar-border: #21262d;
          --sidebar-text: #c9d1d9;
          --sidebar-muted: #8b949e;
          --accent: #2563eb;
          --accent-light: #dbeafe;
          --green: #16a34a;
          --green-light: #dcfce7;
          --orange: #ea580c;
          --orange-light: #ffedd5;
          --purple: #7c3aed;
          --purple-light: #ede9fe;
          --red: #dc2626;
          --red-light: #fee2e2;
          --yellow: #d97706;
          --yellow-light: #fef3c7;
          --radius: 10px;
          --shadow: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,.07), 0 2px 4px -2px rgba(0,0,0,.05);
        }

        .seller-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Outfit', sans-serif;
          color: var(--text-primary);
        }

        /* ── Sidebar ── */
        .sidebar {
          width: 240px;
          min-width: 240px;
          background: var(--sidebar-bg);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          border-right: 1px solid var(--sidebar-border);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 22px 20px 18px;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          border-bottom: 1px solid var(--sidebar-border);
          letter-spacing: -0.3px;
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          background: var(--accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-bottom: 1px solid var(--sidebar-border);
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-info { display: flex; flex-direction: column; min-width: 0; }
        .user-name { font-size: 13px; font-weight: 600; color: #e6edf3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 11px; color: var(--sidebar-muted); margin-top: 1px; }

        .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }

        .nav-group-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--sidebar-muted);
          padding: 4px 8px 6px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--sidebar-muted);
          text-decoration: none;
          border-radius: 7px;
          transition: background 0.15s, color 0.15s;
        }

        .nav-item span { flex: 1; }
        .nav-item svg { flex-shrink: 0; }

        .nav-item:hover { background: var(--sidebar-surface); color: var(--sidebar-text); }

        .nav-item.active {
          background: var(--sidebar-surface);
          color: #fff;
          border: 1px solid var(--sidebar-border);
        }

        .nav-badge {
          background: #1f2937;
          color: #93c5fd;
          font-size: 11px;
          font-weight: 600;
          padding: 1px 7px;
          border-radius: 20px;
        }

        .nav-badge.warn { background: #451a03; color: #fbbf24; }

        .sidebar-logout {
          margin: 12px;
          padding: 10px 14px;
          background: transparent;
          color: var(--sidebar-muted);
          border: 1px solid var(--sidebar-border);
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-family: inherit;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s, color 0.15s;
        }

        .sidebar-logout:hover { background: #1c2128; color: #e6edf3; }

        /* ── Main ── */
        .main-content { flex: 1; padding: 28px 32px; overflow-y: auto; min-width: 0; }

        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .dash-title { font-size: 22px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.4px; }
        .dash-sub { font-size: 13.5px; color: var(--text-secondary); margin-top: 2px; }
        .dash-sub strong { color: var(--text-primary); font-weight: 600; }

        /* ── Approval Notice ── */
        .approval-notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--yellow-light);
          border: 1px solid #fcd34d;
          border-left: 4px solid var(--yellow);
          border-radius: var(--radius);
          padding: 14px 16px;
          margin-bottom: 24px;
          font-size: 13px;
          color: #78350f;
        }

        .notice-icon { margin-top: 1px; flex-shrink: 0; color: var(--yellow); }
        .approval-notice strong { display: block; font-weight: 600; font-size: 13.5px; margin-bottom: 3px; }
        .approval-notice p { line-height: 1.5; color: #92400e; }

        /* ── Stats ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px 20px;
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }

        .stat-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }

        .stat-blue .stat-icon-wrap { background: var(--accent-light); color: var(--accent); }
        .stat-green .stat-icon-wrap { background: var(--green-light); color: var(--green); }
        .stat-orange .stat-icon-wrap { background: var(--orange-light); color: var(--orange); }
        .stat-purple .stat-icon-wrap { background: var(--purple-light); color: var(--purple); }

        .stat-value { font-size: 30px; font-weight: 700; color: var(--text-primary); letter-spacing: -1px; line-height: 1; }
        .stat-label { font-size: 12.5px; color: var(--text-secondary); font-weight: 500; }

        /* ── Section ── */
        .section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }

        .section-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
        .prop-count { font-size: 12px; color: var(--text-muted); background: var(--bg); padding: 3px 10px; border-radius: 20px; border: 1px solid var(--border); }

        /* ── Buttons ── */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--accent);
          color: #fff;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 13.5px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: -0.1px;
        }

        .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        /* ── Table ── */
        .table-wrap { overflow-x: auto; }

        .prop-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }

        .prop-table th {
          text-align: left;
          padding: 11px 16px;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #fafafa;
          border-bottom: 1px solid var(--border);
        }

        .prop-table td {
          padding: 13px 16px;
          border-bottom: 1px solid #f3f4f6;
          color: var(--text-secondary);
          vertical-align: middle;
        }

        .prop-table tr:last-child td { border-bottom: none; }
        .prop-table tr:hover td { background: #fafbfc; }

        .prop-title { font-weight: 600; color: var(--text-primary) !important; }
        .prop-type { color: var(--text-secondary); }
        .prop-price { font-weight: 600; color: var(--text-primary) !important; font-variant-numeric: tabular-nums; }

        /* ── Pills ── */
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.01em;
        }

        .pill-available { background: var(--green-light); color: #14532d; }
        .pill-pending { background: var(--yellow-light); color: #78350f; }
        .pill-sold { background: var(--red-light); color: #7f1d1d; }
        .pill-approved { background: var(--accent-light); color: #1e3a8a; }
        .pill-waiting { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

        /* ── Action Buttons ── */
        .action-btns { display: flex; gap: 6px; }

        .btn-edit, .btn-delete {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-family: inherit;
          font-weight: 500;
          padding: 6px 11px;
          border-radius: 7px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }

        .btn-edit { border: 1px solid var(--border); color: var(--text-primary); background: var(--surface); }
        .btn-edit:hover { background: var(--bg); border-color: #d1d5db; }

        .btn-delete { border: 1px solid #fca5a5; color: var(--red); background: var(--surface); }
        .btn-delete:hover { background: var(--red-light); border-color: #f87171; }

        /* ── Loading ── */
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 56px;
          color: var(--text-muted);
          font-size: 13px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Empty State ── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 60px 32px;
          color: var(--text-muted);
          text-align: center;
        }

        .empty-icon {
          width: 52px;
          height: 52px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .empty-state h3 { font-size: 15px; font-weight: 600; color: var(--text-secondary); }
        .empty-state p { font-size: 13px; margin-bottom: 6px; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .seller-layout { flex-direction: column; }
          .sidebar { width: 100%; height: auto; position: static; }
          .sidebar-nav { flex-direction: row; flex-wrap: wrap; padding: 10px; }
          .nav-group-label { display: none; }
          .main-content { padding: 16px; }
          .dash-header { flex-direction: column; align-items: flex-start; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}