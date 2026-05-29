import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function SellerInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/inquiries/seller").then((res) => {
      setInquiries(res.data.inquiries || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status });
      setInquiries((prev) => prev.map((i) => i._id === id ? { ...i, status } : i));
    } catch { alert("Failed to update status"); }
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  const statusBadge = (s) => {
    const map = { pending: "badge-pending", replied: "badge-replied", confirmed: "badge-confirmed", declined: "badge-declined" };
    return <span className={`badge ${map[s] || "badge-pending"}`}>{s}</span>;
  };

  return (
    <div className="page-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">&#8962; Crestovia</div>
        <nav className="sidebar-nav">
          <Link to="/seller/dashboard" className="nav-item">&#9783; Overview</Link>
          <Link to="/seller/properties" className="nav-item">&#127968; My Properties</Link>
          <Link to="/seller/add-property" className="nav-item">&#43; Add Property</Link>
          <Link to="/seller/inquiries" className="nav-item active">&#9993; Inquiries</Link>
          <Link to="/seller/profile" className="nav-item">&#9664; Profile</Link>
        </nav>
      </aside>

      <main className="page-main">
        <div className="page-header">
          <h1 className="page-title">Inquiries</h1>
          <p className="page-sub">{inquiries.length} total inquiries from buyers</p>
        </div>

        <div className="filter-bar">
          {["all", "pending", "replied", "confirmed", "declined"].map((f) => (
            <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "all" && <span className="filter-count">{inquiries.length}</span>}
              {f !== "all" && <span className="filter-count">{inquiries.filter((i) => i.status === f).length}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading inquiries...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No inquiries found.</div>
        ) : (
          <div className="inq-list">
            {filtered.map((inq) => (
              <div key={inq._id} className="inq-card">
                <div className="inq-top">
                  <div className="inq-buyer">
                    <div className="buyer-avatar">{(inq.buyerId?.name || "B")[0].toUpperCase()}</div>
                    <div>
                      <div className="buyer-name">{inq.buyerId?.name || "Unknown Buyer"}</div>
                      <div className="buyer-email">{inq.buyerId?.email}</div>
                    </div>
                  </div>
                  <div className="inq-right">
                    {statusBadge(inq.status)}
                    <div className="inq-date">{new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                </div>

                <div className="inq-property">
                  <span className="prop-label">Property:</span>
                  <span className="prop-name">{inq.propertyId?.title || "—"}</span>
                  <span className="prop-loc">{inq.propertyId?.address?.city}</span>
                </div>

                <div className="inq-message">{inq.message}</div>

                {inq.status === "pending" && (
                  <div className="inq-actions">
                    <button className="btn-reply" onClick={() => updateStatus(inq._id, "replied")}>&#10003; Mark Replied</button>
                    <button className="btn-confirm" onClick={() => updateStatus(inq._id, "confirmed")}>&#128197; Confirm Visit</button>
                    <button className="btn-decline" onClick={() => updateStatus(inq._id, "declined")}>&#10007; Decline</button>
                  </div>
                )}
                {inq.status === "replied" && (
                  <div className="inq-actions">
                    <button className="btn-confirm" onClick={() => updateStatus(inq._id, "confirmed")}>&#128197; Confirm Visit</button>
                    <button className="btn-decline" onClick={() => updateStatus(inq._id, "declined")}>&#10007; Decline</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .page-layout { display: flex; min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; }
        .sidebar { width: 220px; background: #0f1117; color: #e8e6e1; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { font-size: 17px; font-weight: 600; padding: 24px 20px; border-bottom: 1px solid #1e2028; color: #fff; }
        .sidebar-nav { flex: 1; padding: 16px 0; display: flex; flex-direction: column; gap: 2px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; font-size: 13px; color: #9e9c97; text-decoration: none; }
        .nav-item:hover, .nav-item.active { background: #1a1d26; color: #fff; border-left: 3px solid #d4a853; padding-left: 17px; }
        .page-main { flex: 1; padding: 32px; }
        .page-header { margin-bottom: 20px; }
        .page-title { font-size: 22px; font-weight: 600; color: #1a1d26; }
        .page-sub { font-size: 13px; color: #6b6863; margin-top: 3px; }
        .filter-bar { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
        .filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid #d4d1c7; background: #fff; font-size: 12px; color: #6b6863; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .filter-btn.active { background: #1a1d26; color: #fff; border-color: #1a1d26; }
        .filter-count { background: rgba(255,255,255,0.15); padding: 1px 6px; border-radius: 10px; font-size: 11px; }
        .filter-btn:not(.active) .filter-count { background: #f1efe8; color: #5f5e5a; }
        .inq-list { display: flex; flex-direction: column; gap: 12px; }
        .inq-card { background: #fff; border: 1px solid #e8e5e0; border-radius: 12px; padding: 18px; }
        .inq-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
        .inq-buyer { display: flex; align-items: center; gap: 10px; }
        .buyer-avatar { width: 38px; height: 38px; border-radius: 50%; background: #e6f1fb; color: #0c447c; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 15px; flex-shrink: 0; }
        .buyer-name { font-size: 14px; font-weight: 500; color: #1a1d26; }
        .buyer-email { font-size: 12px; color: #6b6863; }
        .inq-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .inq-date { font-size: 11px; color: #9e9c97; }
        .badge { font-size: 11px; padding: 3px 9px; border-radius: 20px; font-weight: 500; }
        .badge-pending { background: #faeeda; color: #633806; }
        .badge-replied { background: #e6f1fb; color: #0c447c; }
        .badge-confirmed { background: #eaf3de; color: #27500a; }
        .badge-declined { background: #fcebeb; color: #791f1f; }
        .inq-property { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 10px; padding: 8px 12px; background: #f8f7f4; border-radius: 8px; }
        .prop-label { color: #9e9c97; }
        .prop-name { font-weight: 500; color: #1a1d26; }
        .prop-loc { color: #6b6863; }
        .inq-message { font-size: 13px; color: #3a3835; line-height: 1.6; margin-bottom: 14px; }
        .inq-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-reply, .btn-confirm, .btn-decline { padding: 6px 14px; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: 500; border: 1px solid; }
        .btn-reply { background: #e6f1fb; color: #0c447c; border-color: #85b7eb; }
        .btn-confirm { background: #eaf3de; color: #27500a; border-color: #97c459; }
        .btn-decline { background: #fcebeb; color: #791f1f; border-color: #f09595; }
        .loading, .empty { text-align: center; padding: 48px; color: #6b6863; font-size: 14px; }
        @media (max-width: 768px) { .page-layout { flex-direction: column; } .sidebar { width: 100%; height: auto; position: static; } .page-main { padding: 16px; } }
      `}</style>
    </div>
  );
}