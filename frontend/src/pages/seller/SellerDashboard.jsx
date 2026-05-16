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
      <span className="pill pill-approved">&#10003; Approved</span>
    ) : (
      <span className="pill pill-waiting">&#8987; Waiting</span>
    );

  return (
    <div className="seller-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">&#8962;</span>
          NestFind
        </div>
        <nav className="sidebar-nav">
          <Link to="/seller/dashboard" className="nav-item active">
            <span className="nav-icon">&#9783;</span> Overview
          </Link>
          <Link to="/seller/properties" className="nav-item">
            <span className="nav-icon">&#127968;</span> My Properties
            <span className="nav-badge">{stats.total}</span>
          </Link>
          <Link to="/seller/add-property" className="nav-item">
            <span className="nav-icon">&#43;</span> Add Property
          </Link>
          <Link to="/seller/inquiries" className="nav-item">
            <span className="nav-icon">&#9993;</span> Inquiries
            {stats.inquiries > 0 && <span className="nav-badge warn">{stats.inquiries}</span>}
          </Link>
          <Link to="/seller/profile" className="nav-item">
            <span className="nav-icon">&#9664;</span> Profile
          </Link>
        </nav>
        <button className="sidebar-logout" onClick={() => { logout(); navigate("/login"); }}>
          &#8594; Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Seller Dashboard</h1>
            <p className="dash-sub">Welcome back, {user?.name}</p>
          </div>
          {!user?.isApprovedByAdmin && (
            <div className="approval-notice">
              &#8987; Your account is pending admin approval. Listings won't be visible to buyers yet.
            </div>
          )}
        </header>

        <section className="stats-grid">
          {[
            { label: "Total Listings", value: stats.total, icon: "&#127968;" },
            { label: "Available", value: stats.available, icon: "&#9989;" },
            { label: "Sold", value: stats.sold, icon: "&#127881;" },
            { label: "New Inquiries", value: stats.inquiries, icon: "&#9993;" },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">My Properties</h2>
            <Link to="/seller/add-property" className="btn-primary">
              + Add Property
            </Link>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <p>No properties yet.</p>
              <Link to="/seller/add-property" className="btn-primary">Add your first property</Link>
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
                      <td>{p.propertyInfo?.propertyType}</td>
                      <td>&#8377;{Number(p.price).toLocaleString("en-IN")}</td>
                      <td>{p.address?.city}</td>
                      <td>{statusPill(p.status)}</td>
                      <td>{approvalPill(p.isApprovedByCompany)}</td>
                      <td>
                        <div className="action-btns">
                          <Link to={`/seller/edit-property/${p._id}`} className="btn-edit">Edit</Link>
                          <button onClick={() => handleDelete(p._id)} className="btn-delete">Delete</button>
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .seller-layout { display: flex; min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; }

        .sidebar { width: 220px; background: #0f1117; color: #e8e6e1; display: flex; flex-direction: column; padding: 0; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { font-size: 18px; font-weight: 600; padding: 24px 20px 20px; border-bottom: 1px solid #1e2028; display: flex; align-items: center; gap: 8px; color: #fff; }
        .logo-icon { font-size: 22px; }
        .sidebar-nav { flex: 1; padding: 16px 0; display: flex; flex-direction: column; gap: 2px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; font-size: 13px; color: #9e9c97; text-decoration: none; border-radius: 0; transition: all 0.15s; position: relative; }
        .nav-item:hover { background: #1a1d26; color: #fff; }
        .nav-item.active { background: #1a1d26; color: #fff; border-left: 3px solid #d4a853; padding-left: 17px; }
        .nav-icon { font-size: 16px; }
        .nav-badge { margin-left: auto; background: #2a3050; color: #8bb4f0; font-size: 11px; padding: 2px 7px; border-radius: 20px; }
        .nav-badge.warn { background: #3a2a10; color: #d4a853; }
        .sidebar-logout { margin: 16px; padding: 10px; background: #1a1d26; color: #9e9c97; border: 1px solid #2a2d38; border-radius: 8px; cursor: pointer; font-size: 13px; text-align: left; }
        .sidebar-logout:hover { color: #fff; }

        .main-content { flex: 1; padding: 28px 32px; overflow-y: auto; }
        .dash-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
        .dash-title { font-size: 24px; font-weight: 600; color: #1a1d26; }
        .dash-sub { font-size: 13px; color: #6b6863; margin-top: 2px; }
        .approval-notice { background: #fef3cd; border: 1px solid #f4c75a; border-radius: 8px; padding: 10px 16px; font-size: 12px; color: #7a5c00; max-width: 400px; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
        .stat-card { background: #fff; border: 1px solid #e8e5e0; border-radius: 12px; padding: 18px; }
        .stat-icon { font-size: 22px; margin-bottom: 8px; }
        .stat-value { font-size: 28px; font-weight: 600; color: #1a1d26; }
        .stat-label { font-size: 12px; color: #6b6863; margin-top: 3px; }

        .section { background: #fff; border: 1px solid #e8e5e0; border-radius: 12px; padding: 20px; }
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .section-title { font-size: 15px; font-weight: 600; color: #1a1d26; }
        .btn-primary { background: #1a1d26; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; text-decoration: none; font-weight: 500; }
        .btn-primary:hover { background: #2a2d38; }

        .table-wrap { overflow-x: auto; }
        .prop-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .prop-table th { text-align: left; padding: 10px 12px; color: #6b6863; font-weight: 500; font-size: 11px; border-bottom: 1px solid #e8e5e0; background: #f8f7f4; }
        .prop-table td { padding: 11px 12px; border-bottom: 1px solid #f0ede8; vertical-align: middle; }
        .prop-table tr:last-child td { border-bottom: none; }
        .prop-title { font-weight: 500; color: #1a1d26; }

        .pill { display: inline-block; font-size: 11px; padding: 3px 9px; border-radius: 20px; font-weight: 500; }
        .pill-available { background: #eaf3de; color: #27500a; }
        .pill-pending { background: #faeeda; color: #633806; }
        .pill-sold { background: #fcebeb; color: #791f1f; }
        .pill-approved { background: #e6f1fb; color: #0c447c; }
        .pill-waiting { background: #f1efe8; color: #5f5e5a; }

        .action-btns { display: flex; gap: 6px; }
        .btn-edit { font-size: 12px; padding: 4px 10px; border: 1px solid #d4d1c7; border-radius: 6px; color: #1a1d26; background: none; cursor: pointer; text-decoration: none; }
        .btn-edit:hover { background: #f8f7f4; }
        .btn-delete { font-size: 12px; padding: 4px 10px; border: 1px solid #f09595; border-radius: 6px; color: #791f1f; background: none; cursor: pointer; }
        .btn-delete:hover { background: #fcebeb; }

        .loading { text-align: center; padding: 40px; color: #6b6863; }
        .empty-state { text-align: center; padding: 48px; color: #6b6863; display: flex; flex-direction: column; align-items: center; gap: 14px; }

        @media (max-width: 768px) {
          .seller-layout { flex-direction: column; }
          .sidebar { width: 100%; height: auto; position: static; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .main-content { padding: 16px; }
        }
      `}</style>
    </div>
  );
}