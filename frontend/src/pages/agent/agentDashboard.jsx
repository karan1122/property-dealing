import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IC = {
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  Building: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="22" x2="9" y2="2" /><line x1="15" y1="22" x2="15" y2="2" /><line x1="4" y1="7" x2="9" y2="7" /><line x1="4" y1="12" x2="9" y2="12" /><line x1="4" y1="17" x2="9" y2="17" /><line x1="15" y1="7" x2="20" y2="7" /><line x1="15" y1="12" x2="20" y2="12" /><line x1="15" y1="17" x2="20" y2="17" /></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  Check: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  Shield: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  X: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Phone: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.14 1.22 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.46-.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>,
  Search: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  Note: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  Refresh: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  MapPin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  Home2: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  Bed: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9V4a1 1 0 011-1h18a1 1 0 011 1v5" /><path d="M2 20v-5a2 2 0 012-2h16a2 2 0 012 2v5" /><path d="M2 12h20" /></svg>,
  Bath: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l2 2-2 2" /><path d="M3 20a5 5 0 005-5H3v5z" /><path d="M3 13V6a2 2 0 012-2h4l2 2h9a1 1 0 011 1v4" /><line x1="3" y1="20" x2="21" y2="20" /></svg>,
  Ruler: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h20v12H2z" /><line x1="6" y1="6" x2="6" y2="18" /><line x1="12" y1="6" x2="12" y2="18" /><line x1="18" y1="6" x2="18" y2="18" /></svg>,
  Mail: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
  Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
};

const fmtPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const avatarBg = (name = "") => {
  const c = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#be185d", "#065f46"];
  return c[(name.charCodeAt(0) || 0) % c.length];
};

const VERDICT_CFG = {
  approved: { bg: "#d1fae5", color: "#065f46", dot: "#16a34a", label: "Approved" },
  rejected: { bg: "#fee2e2", color: "#991b1b", dot: "#dc2626", label: "Rejected" },
  needs_changes: { bg: "#fef3c7", color: "#92400e", dot: "#d97706", label: "Needs Changes" },
  pending: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8", label: "Pending Review" },
};

// ─── Flow Banner ──────────────────────────────────────────────────────────────
const FlowBanner = () => (
  <div className="flow-banner">
    {[
      { n: "1", label: "Seller Submits", color: "#64748b" },
      { n: "2", label: "You Verify", color: "#d97706", active: true },
      { n: "3", label: "Admin Reviews", color: "#7c3aed" },
      { n: "4", label: "Property Live", color: "#16a34a" },
    ].map(({ n, label, color, active }, i, arr) => (
      <div key={n} className="flow-item">
        <div className="flow-step" style={{ background: color + "18", color, border: `1.5px solid ${color}40`, fontWeight: active ? 800 : 600 }}>
          <span style={{ fontSize: 10, opacity: .7 }}>{n}</span> {label}
          {active && <span className="flow-you">← You</span>}
        </div>
        {i < arr.length - 1 && <span className="flow-arr">→</span>}
      </div>
    ))}
  </div>
);

// ─── Property Detail Drawer ───────────────────────────────────────────────────
function PropertyDrawer({ property: p, onClose, onVerdict }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = [p.thumbnail, ...(p.images || [])].filter(Boolean);

  return (
    <div className="drw-backdrop" onClick={onClose}>
      <div className="drw" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drw-head">
          <div>
            <h3 className="drw-title">{p.title}</h3>
            <div className="drw-subtitle">{p.propertyInfo?.propertyType} · {fmtPrice(p.price)}</div>
          </div>
          <button className="drw-close" onClick={onClose}><IC.Close /></button>
        </div>

        <div className="drw-body">
          {/* Images */}
          {images.length > 0 && (
            <div className="drw-gallery">
              <img className="drw-main-img" src={images[imgIdx]} alt="" />
              {images.length > 1 && (
                <div className="drw-thumbs">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className={`drw-thumb${imgIdx === i ? " active" : ""}`}
                      onClick={() => setImgIdx(i)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Address — most important for agent to verify on-site */}
          {/* Address — most important for agent to verify on-site */}
          <div className="drw-section">

            <div className="drw-section-title">
              <IC.MapPin /> Full Address
            </div>

            <div className="drw-address-box">

              <div className="drw-address-line">
                {p.address?.street}
              </div>

              <div className="drw-address-line">
                {p.address?.city}, {p.address?.state} — {p.address?.pincode}
              </div>

              <div className="drw-address-line">
                {p.address?.country}
              </div>

              <a
                className="drw-maps-link"
                href={
                  p.address?.coordinates?.latitude
                    ? `https://www.google.com/maps?q=${p.address.coordinates.latitude},${p.address.coordinates.longitude}`
                    : `https://www.google.com/maps/search/${encodeURIComponent(
                      `${p.address?.street}, ${p.address?.city}, ${p.address?.state}, ${p.address?.pincode}, ${p.address?.country}`
                    )}`
                }
                target="_blank"
                rel="noreferrer"
              >
                📍 Open in Google Maps
              </a>

              <iframe
                style={{
                  width: "100%",
                  height: 200,
                  border: "none",
                  borderRadius: 9,
                  marginTop: 10,
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={
                  p.address?.coordinates?.latitude
                    ? `https://www.google.com/maps?q=${p.address.coordinates.latitude},${p.address.coordinates.longitude}&output=embed`
                    : `https://www.google.com/maps?q=${encodeURIComponent(
                      `${p.address?.street}, ${p.address?.city}, ${p.address?.state}, ${p.address?.pincode}`
                    )}&output=embed`
                }
              />

            </div>

          </div>

          {/* Seller info */}
          <div className="drw-section">
            <div className="drw-section-title"><IC.Users /> Seller Details</div>
            <div className="drw-info-grid">
              <div className="drw-info-row">
                <span className="drw-info-label">Name</span>
                <span className="drw-info-val">{p.userId?.name || "—"}</span>
              </div>
              <div className="drw-info-row">
                <span className="drw-info-label">Email</span>
                <span className="drw-info-val">
                  <a href={`mailto:${p.userId?.email}`}>{p.userId?.email || "—"}</a>
                </span>
              </div>
              <div className="drw-info-row">
                <span className="drw-info-label">Contact</span>
                <span className="drw-info-val">
                  {p.userId?.contact
                    ? <a href={`tel:${p.userId.contact}`}>{p.userId.contact}</a>
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Property details */}
          <div className="drw-section">
            <div className="drw-section-title"><IC.Home2 /> Property Details</div>
            <div className="drw-chips">
              {p.propertyInfo?.propertyType && (
                <div className="drw-chip"><IC.Building /> {p.propertyInfo.propertyType}</div>
              )}
              {p.propertyDetails?.bedrooms > 0 && (
                <div className="drw-chip"><IC.Bed /> {p.propertyDetails.bedrooms} Beds</div>
              )}
              {p.propertyDetails?.bathrooms > 0 && (
                <div className="drw-chip"><IC.Bath /> {p.propertyDetails.bathrooms} Baths</div>
              )}
              {p.propertyInfo?.squareArea && (
                <div className="drw-chip"><IC.Ruler /> {p.propertyInfo.squareArea} sq.ft</div>
              )}
              {p.propertyDetails?.furnishing && (
                <div className="drw-chip">🛋 {p.propertyDetails.furnishing}</div>
              )}
              {p.propertyDetails?.parkingSpaces > 0 && (
                <div className="drw-chip">🚗 {p.propertyDetails.parkingSpaces} Parking</div>
              )}
              {p.propertyInfo?.yearBuilt && (
                <div className="drw-chip">📅 Built {p.propertyInfo.yearBuilt}</div>
              )}
            </div>
          </div>

          {/* Description */}
          {p.description && (
            <div className="drw-section">
              <div className="drw-section-title"><IC.Note /> Description</div>
              <p className="drw-desc">{p.description}</p>
            </div>
          )}

          {/* Previous agent note */}
          {p.agentVerificationNote && (
            <div className="drw-section">
              <div className="drw-section-title">📋 Previous Verification Note</div>
              <div className="drw-prev-note">{p.agentVerificationNote}</div>
            </div>
          )}
        </div>

        {/* Verdict buttons */}
        <div className="drw-foot">
          <div className="drw-foot-label">Submit your verdict:</div>
          <div className="drw-verdict-row">
            <button className="drw-vbtn drw-vbtn-green" onClick={() => onVerdict(p, "approved")}><IC.Check /> Approve</button>
            <button className="drw-vbtn drw-vbtn-orange" onClick={() => onVerdict(p, "needs_changes")}><IC.Edit /> Needs Changes</button>
            <button className="drw-vbtn drw-vbtn-red" onClick={() => onVerdict(p, "rejected")}><IC.X /> Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Verdict Modal ────────────────────────────────────────────────────────────
function VerdictModal({ property, action, onClose, onDone }) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const CFG = {
    approved: { label: "Approve Property", btnCls: "vm-btn-green", icon: <IC.Check /> },
    rejected: { label: "Reject Property", btnCls: "vm-btn-red", icon: <IC.X /> },
    needs_changes: { label: "Request Changes", btnCls: "vm-btn-orange", icon: <IC.Edit /> },
  };
  const cfg = CFG[action];

  const handleSubmit = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      // POST to /properties/:id/agent-verdict
      await api.patch(`/properties/${property._id}/agent-verdict`, {
        agentVerdict: action,
        agentNote: note,
      });
      onDone();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit verdict");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vm-backdrop" onClick={onClose}>
      <div className="vm-box" onClick={e => e.stopPropagation()}>
        <div className="vm-head">
          <div>
            <h3 className="vm-title">{cfg.label}</h3>
            <p className="vm-sub">{property.title}</p>
          </div>
          <button className="vm-close" onClick={onClose}><IC.X /></button>
        </div>
        <div className="vm-flow-note">
          {action === "approved" && "✅ Approving moves this property to the admin queue for final approval."}
          {action === "rejected" && "🚫 Rejecting blocks this property from going live."}
          {action === "needs_changes" && "✏️ Seller will be notified to fix the issues before re-review."}
        </div>
        <div className="vm-body">
          <label className="vm-label">Verification Note <span style={{ color: "#dc2626" }}>*</span></label>
          <textarea
            className="vm-textarea"
            rows={4}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={
              action === "approved" ? "e.g. Visited the site, documents verified, all details accurate…" :
                action === "rejected" ? "e.g. Address doesn't exist, photos are fake, seller unresponsive…" :
                  "e.g. Price seems wrong, photos missing, address needs correction…"
            }
            autoFocus
          />
          <p className="vm-hint">This note is saved and visible to admin and the seller.</p>
        </div>
        <div className="vm-foot">
          <button className="vm-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className={`vm-btn-submit ${cfg.btnCls}`}
            onClick={handleSubmit}
            disabled={!note.trim() || saving}
          >
            {saving ? <><div className="vm-spinner" /> Saving…</> : <>{cfg.icon} {cfg.label}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
// ─── Drop-in replacement for the CRM tab in AgentDashboard.jsx ───────────────
// Replace: {tab === "crm" && ( ... )} with this component render
// Add this component above AgentDashboard export

function CRMTab({ inquiries, onStatusUpdate }) {
  const [expandedId, setExpandedId] = useState(null);
  const [noteTarget, setNoteTarget] = useState(null);
  const [noteText, setNoteText]     = useState("");
  const [savingId,  setSavingId]    = useState(null);
  const [filterStatus, setFilter]   = useState("all");

  const PIPELINE = [
    { key: "new",             label: "New",             color: "#2563eb", bg: "#dbeafe" },
    { key: "contacted",       label: "Contacted",       color: "#7c3aed", bg: "#ede9fe" },
    { key: "visit_scheduled", label: "Visit Scheduled", color: "#0891b2", bg: "#cffafe" },
    { key: "negotiating",     label: "Negotiating",     color: "#d97706", bg: "#fef3c7" },
    { key: "closed",          label: "Closed",          color: "#16a34a", bg: "#dcfce7" },
    { key: "lost",            label: "Lost",            color: "#dc2626", bg: "#fee2e2" },
  ];
  const P_MAP = Object.fromEntries(PIPELINE.map(s => [s.key, s]));

  const filtered = filterStatus === "all"
    ? inquiries
    : inquiries.filter(i => i.status === filterStatus);

  const counts = { all: inquiries.length };
  PIPELINE.forEach(s => { counts[s.key] = inquiries.filter(i => i.status === s.key).length; });

  const changeStatus = async (id, status) => {
    setSavingId(id + status);
    await onStatusUpdate(id, status);
    setSavingId(null);
  };

  const saveNote = async (inq) => {
    setSavingId(inq._id + "note");
    await onStatusUpdate(inq._id, inq.status, noteText);
    setSavingId(null);
    setNoteTarget(null);
    setNoteText("");
  };

  return (
    <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Pipeline summary bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
        {PIPELINE.map(s => (
          <div
            key={s.key}
            onClick={() => setFilter(f => f === s.key ? "all" : s.key)}
            style={{
              background: filterStatus === s.key ? s.bg : "#fff",
              border: `1.5px solid ${filterStatus === s.key ? s.color + "60" : "#e2e8f0"}`,
              borderTop: `3px solid ${s.color}`,
              borderRadius: 10,
              padding: "12px 14px",
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-1px" }}>
              {counts[s.key] || 0}
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "#0f172a", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button
          onClick={() => setFilter("all")}
          style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", fontFamily: "inherit", transition: "all .12s", background: filterStatus === "all" ? "#0f172a" : "none", color: filterStatus === "all" ? "#fff" : "#64748b", borderColor: filterStatus === "all" ? "#0f172a" : "#e2e8f0" }}
        >
          All <span style={{ fontSize: 10.5, background: filterStatus === "all" ? "rgba(255,255,255,.2)" : "#f3f4f6", padding: "1px 6px", borderRadius: 10, color: filterStatus === "all" ? "inherit" : "#94a3b8", marginLeft: 4 }}>{counts.all}</span>
        </button>
        {PIPELINE.map(s => (
          <button key={s.key} onClick={() => setFilter(f => f === s.key ? "all" : s.key)}
            style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .12s", border: `1px solid ${filterStatus === s.key ? s.color + "50" : "transparent"}`, background: filterStatus === s.key ? s.bg : "transparent", color: filterStatus === s.key ? s.color : "#64748b" }}>
            {s.label}
            <span style={{ fontSize: 10.5, background: "rgba(0,0,0,.08)", padding: "1px 6px", borderRadius: 10, marginLeft: 4 }}>{counts[s.key] || 0}</span>
          </button>
        ))}
      </div>

      {/* Inquiry cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "52px", color: "#94a3b8", fontSize: 13.5, fontWeight: 500, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10 }}>
            No inquiries in this stage
          </div>
        ) : filtered.map(inq => {
          const scfg = P_MAP[inq.status] || P_MAP.new;
          const isExp = expandedId === inq._id;
          return (
            <div key={inq._id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderLeft: `3px solid ${scfg.color}`, borderRadius: 10, overflow: "hidden", transition: "box-shadow .15s" }}>
              {/* Card header */}
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "flex-start", padding: "14px 16px", cursor: "pointer" }}
                onClick={() => setExpandedId(id => id === inq._id ? null : inq._id)}>
                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#e0e7ff", color: "#4338ca", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {inq.buyerName?.[0]?.toUpperCase()}
                </div>
                {/* Info */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{inq.buyerName}</span>
                    <span style={{ background: scfg.bg, color: scfg.color, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>{scfg.label}</span>
                    {inq.status === "closed" && <span style={{ background: "#dcfce7", color: "#166534", fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>🏆 Sale Closed</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 3, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {inq.buyerEmail && <span style={{ display: "flex", alignItems: "center", gap: 3 }}>✉ {inq.buyerEmail}</span>}
                    {inq.buyerPhone && <span style={{ display: "flex", alignItems: "center", gap: 3 }}>📞 {inq.buyerPhone}</span>}
                  </div>
                  {inq.propertyId && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: "#334155" }}>
                      🏠 {inq.propertyId.title} {inq.propertyId.price && <span style={{ color: "#64748b", fontWeight: 400 }}>· ₹{Number(inq.propertyId.price).toLocaleString("en-IN")}</span>}
                    </div>
                  )}
                  {inq.sellerId && (
                    <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 4 }}>
                      Seller: <span style={{ fontWeight: 600, color: "#64748b" }}>{inq.sellerId.name}</span>
                    </div>
                  )}
                </div>
                {/* Right: date + chevron */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
                    {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                  <span style={{ fontSize: 11, color: "#94a3b8", transform: isExp ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▼</span>
                </div>
              </div>

              {/* Message preview (collapsed) */}
              {!isExp && (
                <div style={{ padding: "0 16px 12px 68px", fontSize: 13, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {inq.message}
                </div>
              )}

              {/* Expanded body */}
              {isExp && (
                <div style={{ padding: "0 16px 16px 16px", borderTop: "1px solid #f1f5f9" }}>
                  {/* Full message */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 14px", fontSize: 13.5, color: "#334155", lineHeight: 1.65, marginTop: 12, whiteSpace: "pre-wrap" }}>
                    {inq.message}
                  </div>

                  {/* Agent note */}
                  {inq.agentNote && noteTarget?._id !== inq._id && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 10, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "8px 12px" }}>
                      <span style={{ fontSize: 13 }}>📝</span>
                      <span style={{ fontSize: 12.5, color: "#78350f", lineHeight: 1.5 }}>{inq.agentNote}</span>
                    </div>
                  )}

                  {/* Note editor */}
                  {noteTarget?._id === inq._id && (
                    <div style={{ marginTop: 10 }}>
                      <textarea
                        autoFocus
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Add a note about this inquiry…"
                        rows={3}
                        style={{ width: "100%", border: "1.5px solid #3b82f6", borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical" }}
                      />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button disabled={savingId === inq._id + "note"} onClick={() => saveNote(inq)}
                          style={{ padding: "7px 16px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          {savingId === inq._id + "note" ? "Saving…" : "Save Note"}
                        </button>
                        <button onClick={() => { setNoteTarget(null); setNoteText(""); }}
                          style={{ padding: "7px 12px", background: "none", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions row */}
                  <div style={{ marginTop: 14, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#94a3b8", marginBottom: 8 }}>Move to stage</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {PIPELINE.filter(s => s.key !== inq.status).map(s => (
                        <button key={s.key} disabled={!!savingId} onClick={() => changeStatus(inq._id, s.key)}
                          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", background: s.bg, color: s.color, border: `1px solid ${s.color}30`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: savingId === inq._id + s.key ? 0.6 : 1 }}>
                          {savingId === inq._id + s.key ? "…" : s.label}
                        </button>
                      ))}
                    </div>

                    {/* Contact + Note buttons */}
                    <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      {inq.buyerEmail && (
                        <a href={`mailto:${inq.buyerEmail}?subject=Re: ${inq.propertyId?.title || "Property Inquiry"}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1px solid #bfdbfe", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: "#eff6ff", color: "#1d4ed8", textDecoration: "none" }}>
                          ✉ Reply
                        </a>
                      )}
                      {inq.buyerPhone && (
                        <a href={`tel:${inq.buyerPhone}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: "#f0fdf4", color: "#15803d", textDecoration: "none" }}>
                          📞 Call
                        </a>
                      )}
                      <button
                        onClick={() => { setNoteTarget(inq); setNoteText(inq.agentNote || ""); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: "#fff", color: "#334155", cursor: "pointer", fontFamily: "inherit" }}>
                        📝 {inq.agentNote ? "Edit Note" : "Add Note"}
                      </button>
                    </div>
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
// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [propFilter, setPropFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState(null); // property for detail view
  const [modal, setModal] = useState(null); // { property, action }
  const [inquiries, setInquiries] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [meetings, setMeetings] = useState([]);


  const stats = {
    sellers: sellers.length,
    properties: properties.length,

    approved: properties.filter(
      (p) => p.agentVerdict === "approved"
    ).length,

    pending: properties.filter(
      (p) =>
        !p.agentVerdict ||
        p.agentVerdict === "pending"
    ).length,

    rejected: properties.filter(
      (p) => p.agentVerdict === "rejected"
    ).length,

    changes: properties.filter(
      (p) => p.agentVerdict === "needs_changes"
    ).length,

    totalInquiries:
      inquiries?.length || 0,

    newInquiries:
      inquiries?.filter(
        (i) => i.status === "new"
      ).length || 0,

    closedDeals:
      inquiries?.filter(
        (i) => i.status === "closed"
      ).length || 0,

    commissionsEarned:
      commissions
        ?.filter(
          (c) => c.status === "paid"
        )
        .reduce(
          (s, c) => s + c.amount,
          0
        ) || 0,
  };

const fetchData = useCallback(

  async (silent = false) => {

    if (!silent)
      setLoading(true);
    else
      setRefreshing(true);

    try {

      const meRes =
        await api.get(
          "/auth/me"
        );

      const agentId =
        meRes.data.user._id;

        const meetingRes = await api.get("/meetings/agent/my");
      const [
        sellerRes,
        propRes,
        inquiryRes,
        commRes,
      ] = await Promise.all([

        api.get(
          `/admin/agents/${agentId}/sellers`
        ),

        api.get(
          `/admin/agents/${agentId}/properties`
        ),

        api.get(
          "/inquiries/my"
        ),

        api.get(
          "/inquiries/commissions"
        ),

      ]);

      setSellers(
        sellerRes.data
          .sellers || []
      );
      setMeetings(meetingRes.data.meetings || []);
      setProperties(
        propRes.data
          .properties || []
      );

      setInquiries(
        inquiryRes.data
          .inquiries || []
      );

      setCommissions(
        commRes.data
          .commissions || []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

      setRefreshing(false);
    }
  },

  []
);

useEffect(() => {

  fetchData();

}, [fetchData]);

  // When agent clicks a verdict button inside the drawer
  const handleDrawerVerdict = (property, action) => {
    setDrawer(null);
    setModal({ property, action });
  };
const handleInquiryStatus = async (id, status, agentNote) => {
  try {
    const res = await api.patch(`/inquiries/${id}/status`, { status, agentNote });
    setInquiries(prev => prev.map(i => i._id === id ? res.data.inquiry : i));
    if (status === "closed") fetchData(true); // refresh commissions
  } catch (err) {
    alert(err?.response?.data?.message || "Failed");
  }
};
  const filteredProps = properties.filter(p => {
    const vs = p.agentVerdict || "pending";

    const matchF =
      propFilter === "all" ? true :
        propFilter === "pending" ? vs === "pending" :
          propFilter === "approved" ? vs === "approved" :
            propFilter === "rejected" ? vs === "rejected" :
              propFilter === "needs_changes" ? vs === "needs_changes" : true;
    const matchS = !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.city?.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const TABS = [
    { id: "overview", label: "Overview", Icon: IC.Home },
    { id: "properties", label: "Properties", Icon: IC.Building },
    { id: "crm", label: "CRM", Icon: IC.Users },
    { id: "meetings", label: "Meetings", Icon: IC.Clock },
    { id: "sellers", label: "Sellers", Icon: IC.Users },

  ];

  return (
    <div className="ag-layout">

      {/* Sidebar */}
      <aside className="ag-sidebar">
        <div className="ag-sb-logo">
          <div className="ag-sb-logo-icon"><IC.Shield /></div>
          <div>
            <div className="ag-sb-logo-name">Crestovia</div>
            <div className="ag-sb-logo-sub">Agent Portal</div>
          </div>
        </div>
        <div className="ag-sb-profile">
          <div className="ag-sb-av" style={{ background: avatarBg(user?.name || "") }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="ag-sb-name">{user?.name}</div>
            <div className="ag-sb-role">Field Agent</div>
          </div>
        </div>
        <nav className="ag-sb-nav">
          <p className="ag-sb-nav-label">Navigation</p>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={`ag-sb-item${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
              <Icon /><span>{label}</span>
              {id === "properties" && stats.pending > 0 && <span className="ag-sb-badge">{stats.pending}</span>}
            </button>
          ))}
        </nav>
        <button className="ag-sb-logout" onClick={() => { logout(); navigate("/auth/login"); }}>
          <IC.Logout /> Sign out
        </button>
      </aside>

      {/* Main */}
      <main className="ag-main">
        <div className="ag-topbar">
          <div>
            <h1 className="ag-topbar-title">
              {tab === "overview" && "Dashboard Overview"}
              {tab === "properties" && "Property Verification"}
              {tab === "sellers" && "Assigned Sellers"}
            </h1>
            <p className="ag-topbar-sub">
              {tab === "overview" && "Your verification activity at a glance"}
              {tab === "properties" && "Click any property to see full details before submitting your verdict"}
              {tab === "sellers" && "Sellers assigned to you by admin"}
            </p>
          </div>
          <div className="ag-topbar-right">
            <div className="ag-topbar-email">{user?.email}</div>
            <button className={`ag-refresh-btn${refreshing ? " spinning" : ""}`} onClick={() => fetchData(true)} title="Refresh">
              <IC.Refresh />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="ag-full-load"><div className="ag-spinner-lg" /><span>Loading dashboard…</span></div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
          {/* ── OVERVIEW ── */}
{tab === "overview" && (
  <div className="ag-tab-body">
    <FlowBanner />
    {/* stats, pending queue, sellers preview */}
  </div>
)}

{/* ── CRM ── (separate, not inside overview!) */}
{tab === "crm" && (
  <CRMTab inquiries={inquiries} onStatusUpdate={handleInquiryStatus} />
)}


            {/* ── PROPERTIES ── */}
            {tab === "properties" && (
              <div className="ag-tab-body">
                <FlowBanner />
                <div className="ag-toolbar">
                  <div className="ag-search-box">
                    <IC.Search />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, seller, city…" />
                  </div>
                  <div className="ag-filter-pills">
                    {[
                      { key: "all", label: "All", count: stats.properties },
                      { key: "pending", label: "Pending", count: stats.pending },
                      { key: "approved", label: "Approved", count: stats.approved },
                      { key: "needs_changes", label: "Needs Changes", count: stats.changes },
                      { key: "rejected", label: "Rejected", count: stats.rejected },
                    ].map(f => (
                      <button key={f.key} className={`ag-fpill${propFilter === f.key ? " on" : ""}`} onClick={() => setPropFilter(f.key)}>
                        {f.label} <span className="ag-fpill-cnt">{f.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ag-card no-pad">
                  {filteredProps.length === 0 ? (
                    <div className="ag-empty" style={{ padding: 56 }}><IC.Search /><span>No properties match</span></div>
                  ) : (
                    <div className="ag-table-scroll">
                      <table className="ag-table">
                        <thead>
                          <tr>
                            <th>Property</th>
                            <th>Address</th>
                            <th>Seller</th>
                            <th>Price</th>
                            <th>Type</th>
                            <th>Admin Status</th>
                            <th>Your Verdict</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProps.map(p => {
                            const vs = p.agentVerdict || "pending";

                            const cfg = VERDICT_CFG[vs] || VERDICT_CFG.pending;
                            return (
                              <tr key={p._id} style={{ cursor: "pointer" }} onClick={() => setDrawer(p)}>
                                <td>
                                  <div className="ag-prop-cell">
                                    <div className="ag-prop-thumb">
                                      {p.thumbnail ? <img src={p.thumbnail} alt="" /> : <IC.Building />}
                                    </div>
                                    <div>
                                      <div className="ag-prop-title">{p.title}</div>
                                      <div className="ag-prop-date"><IC.Clock /> {fmtDate(p.createdAt)}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                                    <div>{p.address?.street}</div>
                                    <div>{p.address?.city}, {p.address?.state}</div>
                                    <div style={{ color: "#94a3b8" }}>{p.address?.pincode}</div>
                                  </div>
                                </td>
                                <td>
                                  <div className="ag-seller-cell">
                                    <div className="ag-seller-av" style={{ background: avatarBg(p.userId?.name || "") }}>
                                      {p.userId?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="ag-cell-name">{p.userId?.name || "—"}</div>
                                      <div className="ag-cell-sub">{p.userId?.contact}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="ag-price">{fmtPrice(p.price)}</td>
                                <td style={{ fontSize: 12 }}>{p.propertyInfo?.propertyType || "—"}</td>
                                <td>
                                  {p.isApprovedByCompany
                                    ? <span className="ag-status-pill" style={{ background: "#d1fae5", color: "#065f46" }}>● Live</span>
                                    : vs === "approved"
                                      ? <span className="ag-status-pill" style={{ background: "#ede9fe", color: "#4c1d95" }}>● Admin Review</span>
                                      : <span className="ag-status-pill" style={{ background: "#fef3c7", color: "#92400e" }}>● Pending</span>
                                  }
                                </td>
                                <td>
                                  <span className="ag-status-pill" style={{ background: cfg.bg, color: cfg.color }}>
                                    <span style={{ color: cfg.dot, fontSize: 8 }}>●</span> {cfg.label}
                                  </span>
                                </td>
                                <td onClick={e => e.stopPropagation()}>
                                  <div className="ag-action-row">
                                    <button className="ag-vbtn ag-vbtn-eye sm" onClick={() => setDrawer(p)}><IC.Eye /></button>
                                    <button className="ag-vbtn ag-vbtn-green  sm" onClick={() => setModal({ property: p, action: "approved" })}><IC.Check /></button>
                                    <button className="ag-vbtn ag-vbtn-orange sm" onClick={() => setModal({ property: p, action: "needs_changes" })}><IC.Edit /></button>
                                    <button className="ag-vbtn ag-vbtn-red    sm" onClick={() => setModal({ property: p, action: "rejected" })}><IC.X /></button>
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
              </div>
            )}

            {/* ── SELLERS ── */}
            {tab === "sellers" && (
              <div className="ag-tab-body">
                <div className="ag-sellers-grid">
                  {sellers.length === 0 ? (
                    <div className="ag-empty" style={{ gridColumn: "1/-1", padding: 64 }}><IC.Users /><span>No sellers assigned yet</span></div>
                  ) : sellers.map(s => {
                    const sp = properties.filter(p => (p.userId?._id || p.userId)?.toString() === s._id?.toString());
                    const approved = sp.filter(p => p.agentVerdict === "approved").length;
                    const pending = sp.filter(p => !p.agentVerdict || p.agentVerdict === "pending").length;
                    return (
                      <div key={s._id} className="ag-seller-card">
                        <div className="ag-seller-card-head">
                          <div className="ag-seller-card-av" style={{ background: avatarBg(s.name) }}>{s.name?.charAt(0).toUpperCase()}</div>
                          <div>
                            <div className="ag-seller-card-name">{s.name}</div>
                            <div className="ag-seller-card-email">{s.email}</div>
                          </div>
                        </div>
                        {s.contact && <div className="ag-seller-card-contact"><IC.Phone /> {s.contact}</div>}
                        <div className="ag-seller-card-stats">
                          <div className="ag-sc-stat"><div className="ag-sc-val">{s.propertyCount ?? sp.length}</div><div className="ag-sc-label">Properties</div></div>
                          <div className="ag-sc-div" />
                          <div className="ag-sc-stat"><div className="ag-sc-val" style={{ color: "#16a34a" }}>{approved}</div><div className="ag-sc-label">Approved</div></div>
                          <div className="ag-sc-div" />
                          <div className="ag-sc-stat"><div className="ag-sc-val" style={{ color: "#d97706" }}>{pending}</div><div className="ag-sc-label">Pending</div></div>
                        </div>
                        <div className="ag-seller-card-joined">Joined {fmtDate(s.createdAt)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {tab === "meetings" && (
  <div className="ag-tab-body">
    <div className="ag-card">
      <div className="ag-card-head">
        <h2 className="ag-card-title">📅 Meeting Requests</h2>
        <span style={{ fontSize:12,color:"#94a3b8" }}>{meetings.filter(m=>m.status==="pending").length} pending</span>
      </div>
      {meetings.length === 0 ? (
        <div className="ag-empty"><IC.Clock /><span>No meeting requests yet</span></div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column" }}>
          {meetings.map(m => (
            <div key={m._id} style={{ padding:"16px 18px", borderBottom:"1px solid #f1f5f9", display:"grid", gridTemplateColumns:"auto 1fr auto", gap:14, alignItems:"flex-start" }}>
              {/* Date block */}
              <div style={{ width:52,textAlign:"center",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"8px 4px",flexShrink:0 }}>
                <div style={{ fontSize:18,fontWeight:800,color:"#0f172a",lineHeight:1 }}>{new Date(m.scheduledAt).getDate()}</div>
                <div style={{ fontSize:10,fontWeight:600,color:"#64748b",textTransform:"uppercase",marginTop:2 }}>{new Date(m.scheduledAt).toLocaleString("en-IN",{month:"short"})}</div>
                <div style={{ fontSize:10,color:"#94a3b8",marginTop:2 }}>{new Date(m.scheduledAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</div>
              </div>
              {/* Info */}
              <div>
                <div style={{ fontWeight:700,fontSize:14,color:"#0f172a" }}>{m.name}</div>
                <div style={{ fontSize:12,color:"#64748b",marginTop:2 }}>{m.propertyId?.title} · Seller: {m.sellerId?.name}</div>
                <div style={{ display:"flex",gap:10,marginTop:5,flexWrap:"wrap" }}>
                  <a href={`tel:${m.phone}`} style={{ fontSize:12,color:"#059669",textDecoration:"none",fontWeight:500 }}>📞 {m.phone}</a>
                  {m.email && <a href={`mailto:${m.email}`} style={{ fontSize:12,color:"#2563eb",textDecoration:"none",fontWeight:500 }}>✉ {m.email}</a>}
                </div>
                {m.note && <div style={{ marginTop:6,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:7,padding:"6px 10px",fontSize:12.5,color:"#334155" }}>{m.note}</div>}
                <div style={{ marginTop:4,fontSize:11,color:"#94a3b8" }}>
                  Address: {m.propertyId?.address?.street}, {m.propertyId?.address?.city}
                </div>
              </div>
              {/* Actions */}
              {m.status === "pending" && (
                <div style={{ display:"flex",flexDirection:"column",gap:6,minWidth:110 }}>
                  <button onClick={async()=>{
                    await api.patch(`/meetings/agent/${m._id}/status`,{status:"confirmed"});
                    fetchData(true);
                  }} style={{ padding:"7px 12px",background:"#dcfce7",color:"#15803d",border:"1px solid #86efac",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>
                    ✓ Confirm
                  </button>
                  <button onClick={async()=>{
                    await api.patch(`/meetings/agent/${m._id}/status`,{status:"cancelled"});
                    fetchData(true);
                  }} style={{ padding:"7px 12px",background:"#fee2e2",color:"#dc2626",border:"1px solid #fca5a5",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>
                    ✗ Cancel
                  </button>
                </div>
              )}
              {m.status !== "pending" && (
                <span style={{ fontSize:11.5,fontWeight:700,padding:"4px 10px",borderRadius:20,background:m.status==="confirmed"?"#dcfce7":"#fee2e2",color:m.status==="confirmed"?"#15803d":"#dc2626",alignSelf:"flex-start" }}>
                  {m.status.charAt(0).toUpperCase()+m.status.slice(1)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
          </>
        )}
      </main>

      {/* Property Detail Drawer */}
      {drawer && (
        <PropertyDrawer
          property={drawer}
          onClose={() => setDrawer(null)}
          onVerdict={handleDrawerVerdict}
        />
      )}

      {/* Verdict Modal */}
      {modal && (
        <VerdictModal
          property={modal.property}
          action={modal.action}
          onClose={() => setModal(null)}
          onDone={() => fetchData(true)}
        />
      )}

      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}
          :root{
            --bg:#f1f5f9;--surf:#fff;--bdr:#e2e8f0;
            --t1:#0f172a;--t2:#475569;--t3:#94a3b8;
            --sb:#0d1117;--sb2:#161b22;--sb-bdr:#21262d;--sb-m:#8b949e;
            --blue:#2563eb;--green:#16a34a;--red:#dc2626;--orange:#ea580c;--amber:#d97706;
            --r:10px;--shadow:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);--shadow-md:0 4px 12px rgba(0,0,0,.08);
            font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--t1);
          }
          .ag-layout{display:flex;min-height:100vh;background:var(--bg)}
          /* Sidebar */
          .ag-sidebar{width:240px;min-width:240px;background:var(--sb);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;border-right:1px solid var(--sb-bdr)}
          .ag-sb-logo{display:flex;align-items:center;gap:10px;padding:20px 18px 16px;border-bottom:1px solid var(--sb-bdr)}
          .ag-sb-logo-icon{width:38px;height:38px;border-radius:10px;background:var(--blue);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
          .ag-sb-logo-name{font-size:16px;font-weight:800;color:#fff;letter-spacing:-.3px}
          .ag-sb-logo-sub{font-size:10px;font-weight:700;color:#f59e0b;letter-spacing:.08em;text-transform:uppercase}
          .ag-sb-profile{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--sb-bdr)}
          .ag-sb-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0}
          .ag-sb-name{font-size:13px;font-weight:600;color:#e2e8f0}.ag-sb-role{font-size:11px;color:var(--sb-m);margin-top:1px}
          .ag-sb-nav{flex:1;padding:14px 10px;display:flex;flex-direction:column;gap:2px}
          .ag-sb-nav-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--sb-m);padding:4px 8px 6px}
          .ag-sb-item{display:flex;align-items:center;gap:9px;padding:9px 10px;font-size:13px;font-weight:500;color:var(--sb-m);background:none;border:none;border-radius:7px;cursor:pointer;width:100%;text-align:left;font-family:inherit;transition:background .12s,color .12s}
          .ag-sb-item span{flex:1}.ag-sb-item:hover{background:var(--sb2);color:#c9d1d9}.ag-sb-item.active{background:var(--sb2);color:#fff;border:1px solid var(--sb-bdr)}
          .ag-sb-badge{background:#7f1d1d;color:#fca5a5;font-size:10.5px;font-weight:700;padding:1px 7px;border-radius:20px}
          .ag-sb-logout{margin:12px;padding:10px 14px;background:transparent;color:var(--sb-m);border:1px solid var(--sb-bdr);border-radius:8px;cursor:pointer;font-size:13px;font-family:inherit;font-weight:500;display:flex;align-items:center;gap:8px;transition:background .12s,color .12s}
          .ag-sb-logout:hover{background:#1c1c1c;color:#e2e8f0}
          /* Main */
          .ag-main{flex:1;overflow-y:auto;min-width:0;display:flex;flex-direction:column}
          .ag-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:22px 28px 18px;background:var(--surf);border-bottom:1px solid var(--bdr)}
          .ag-topbar-title{font-size:20px;font-weight:800;color:var(--t1);letter-spacing:-.4px}
          .ag-topbar-sub{font-size:13px;color:var(--t2);margin-top:2px}
          .ag-topbar-right{display:flex;align-items:center;gap:10px}
          .ag-topbar-email{font-size:12.5px;color:var(--t3);background:#f8fafc;border:1px solid var(--bdr);padding:6px 12px;border-radius:8px}
          .ag-refresh-btn{width:34px;height:34px;border:1px solid var(--bdr);background:var(--surf);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t3);transition:background .12s,color .12s}
          .ag-refresh-btn:hover{background:var(--bg);color:var(--t1)}.ag-refresh-btn.spinning svg{animation:ag-spin .8s linear infinite}
          @keyframes ag-spin{to{transform:rotate(360deg)}}
          .ag-tab-body{padding:24px 28px;display:flex;flex-direction:column;gap:20px}
          /* Flow Banner */
          .flow-banner{display:flex;align-items:center;gap:6px;flex-wrap:wrap;background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);padding:12px 18px}
          .flow-item{display:flex;align-items:center;gap:6px}
          .flow-step{display:inline-flex;align-items:center;gap:7px;padding:5px 13px;border-radius:20px;font-size:12px}
          .flow-you{font-size:10px;font-weight:700;background:rgba(217,119,6,.18);color:#92400e;padding:2px 7px;border-radius:10px;margin-left:4px}
          .flow-arr{font-size:14px;color:var(--t3);font-weight:700}
          /* Stats */
          .ag-stats-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
          .ag-stat-card{background:var(--surf);border:1px solid var(--bdr);border-top:3px solid;border-radius:var(--r);padding:16px 14px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:3px}
          .ag-stat-emoji{font-size:22px;margin-bottom:6px}.ag-stat-val{font-size:28px;font-weight:800;letter-spacing:-1px;line-height:1}
          .ag-stat-label{font-size:12.5px;font-weight:600;color:var(--t1);margin-top:4px}.ag-stat-sub{font-size:11px;color:var(--t3)}
          /* Card */
          .ag-card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow)}.ag-card.no-pad{padding:0}
          .ag-card-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--bdr)}
          .ag-card-title{font-size:14.5px;font-weight:700;color:var(--t1)}
          .ag-view-all{font-size:12.5px;color:var(--blue);font-weight:600;background:none;border:none;cursor:pointer;font-family:inherit}.ag-view-all:hover{opacity:.7}
          /* Pending */
          .ag-pending-list{display:flex;flex-direction:column;gap:8px;padding:12px}
          .ag-pending-row{display:flex;align-items:flex-start;gap:12px;padding:12px;background:#fafbfd;border:1px solid var(--bdr);border-radius:9px;transition:background .12s}.ag-pending-row:hover{background:#f1f5f9}
          .ag-pending-thumb{width:52px;height:52px;border-radius:9px;background:var(--bg);border:1px solid var(--bdr);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--t3)}.ag-pending-thumb img{width:100%;height:100%;object-fit:cover}
          .ag-pending-info{flex:1;min-width:0}.ag-pending-title{font-size:13px;font-weight:600;color:var(--t1)}
          .ag-pending-meta{display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--t3);margin-top:3px}.ag-pending-meta strong{color:var(--t2)}
          .ag-pending-actions{display:flex;gap:5px;flex-shrink:0;align-items:flex-start}
          /* Seller chips */
          .ag-seller-chips{display:flex;flex-wrap:wrap;gap:10px;padding:14px}
          .ag-seller-chip{display:flex;align-items:center;gap:10px;background:#fafbfd;border:1px solid var(--bdr);border-radius:9px;padding:10px 14px}
          .ag-seller-chip-av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
          .ag-seller-chip-name{font-size:13px;font-weight:600;color:var(--t1)}.ag-seller-chip-count{font-size:11px;color:var(--t3);margin-top:1px}
          /* Toolbar */
          .ag-toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
          .ag-search-box{display:flex;align-items:center;gap:8px;border:1.5px solid var(--bdr);border-radius:9px;padding:8px 12px;background:var(--surf);color:var(--t3);min-width:240px}
          .ag-search-box input{border:none;outline:none;font-size:13px;font-family:inherit;color:var(--t1);background:transparent;flex:1}
          .ag-filter-pills{display:flex;gap:5px;flex-wrap:wrap}
          .ag-fpill{padding:6px 13px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid var(--bdr);background:none;color:var(--t2);cursor:pointer;font-family:inherit;transition:background .12s;display:flex;align-items:center;gap:5px}
          .ag-fpill:hover{background:#f8fafc}.ag-fpill.on{background:var(--t1);color:#fff;border-color:var(--t1)}
          .ag-fpill-cnt{font-size:10.5px;background:rgba(255,255,255,.25);padding:1px 6px;border-radius:10px}.ag-fpill:not(.on) .ag-fpill-cnt{background:#f3f4f6;color:var(--t3)}
          /* Table */
          .ag-table-scroll{overflow-x:auto}.ag-table{width:100%;border-collapse:collapse;font-size:13px}
          .ag-table th{text-align:left;padding:10px 14px;font-size:10.5px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;background:#fafbfd;border-bottom:1px solid var(--bdr)}
          .ag-table td{padding:11px 14px;border-bottom:1px solid #f1f5f9;vertical-align:middle;color:var(--t2)}
          .ag-table tr:last-child td{border-bottom:none}.ag-table tr:hover td{background:#f8fafc}
          .ag-prop-cell{display:flex;align-items:center;gap:10px}
          .ag-prop-thumb{width:38px;height:38px;border-radius:7px;background:var(--bg);border:1px solid var(--bdr);overflow:hidden;display:flex;align-items:center;justify-content:center;color:var(--t3);flex-shrink:0}.ag-prop-thumb img{width:100%;height:100%;object-fit:cover}
          .ag-prop-title{font-size:13px;font-weight:600;color:var(--t1)}.ag-prop-date{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--t3);margin-top:2px}
          .ag-seller-cell{display:flex;align-items:center;gap:8px}
          .ag-seller-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
          .ag-cell-name{font-size:12.5px;font-weight:600;color:var(--t1)}.ag-cell-sub{font-size:11px;color:var(--t3);margin-top:1px}
          .ag-price{font-weight:700;color:var(--t1)!important}
          .ag-status-pill{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap}
          .ag-na{color:var(--t3);font-size:12px}.ag-action-row{display:flex;gap:4px}
          /* Buttons */
          .ag-vbtn{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;padding:6px 11px;border-radius:7px;border:none;cursor:pointer;font-family:inherit;transition:opacity .15s,transform .1s;white-space:nowrap}
          .ag-vbtn.sm{padding:5px 8px;font-size:12px}.ag-vbtn:active:not(:disabled){transform:scale(.97)}
          .ag-vbtn-green{background:#d1fae5;color:#065f46}.ag-vbtn-green:hover{background:#a7f3d0}
          .ag-vbtn-red{background:#fee2e2;color:#991b1b}.ag-vbtn-red:hover{background:#fecaca}
          .ag-vbtn-orange{background:#ffedd5;color:#7c2d12}.ag-vbtn-orange:hover{background:#fed7aa}
          .ag-vbtn-eye{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe}.ag-vbtn-eye:hover{background:#dbeafe}
          /* Sellers grid */
          .ag-sellers-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
          .ag-seller-card{background:var(--surf);border:1px solid var(--bdr);border-radius:12px;padding:18px;box-shadow:var(--shadow);transition:box-shadow .2s,transform .2s}.ag-seller-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
          .ag-seller-card-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
          .ag-seller-card-av{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0}
          .ag-seller-card-name{font-size:14px;font-weight:700;color:var(--t1)}.ag-seller-card-email{font-size:11.5px;color:var(--t3);margin-top:1px}
          .ag-seller-card-contact{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--t2);margin-bottom:12px}
          .ag-seller-card-stats{display:flex;align-items:center;background:#fafbfd;border:1px solid var(--bdr);border-radius:9px;overflow:hidden;margin-bottom:10px}
          .ag-sc-stat{flex:1;text-align:center;padding:10px 8px}.ag-sc-val{font-size:18px;font-weight:800;color:var(--t1);letter-spacing:-.5px}
          .ag-sc-label{font-size:10px;color:var(--t3);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-top:2px}
          .ag-sc-div{width:1px;background:var(--bdr);align-self:stretch}.ag-seller-card-joined{font-size:11px;color:var(--t3)}
          /* Loading */
          .ag-full-load{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;flex:1;padding:80px;color:var(--t3);font-size:13.5px}
          .ag-spinner-lg{width:36px;height:36px;border:3px solid var(--bdr);border-top-color:var(--blue);border-radius:50%;animation:ag-spin .7s linear infinite}
          .ag-empty{display:flex;align-items:center;justify-content:center;gap:10px;padding:40px;color:var(--t3);font-size:13.5px;font-weight:500}

          /* ══ Property Detail Drawer ══ */
          .drw-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(3px);z-index:1000;display:flex;justify-content:flex-end}
          .drw{width:100%;max-width:520px;background:#fff;height:100vh;display:flex;flex-direction:column;box-shadow:-8px 0 40px rgba(0,0,0,.15);animation:drw-in .25s cubic-bezier(.16,1,.3,1)}
          @keyframes drw-in{from{transform:translateX(100%)}to{transform:translateX(0)}}
          .drw-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid var(--bdr);background:linear-gradient(135deg,#f8fafc,#f1f5f9)}
          .drw-title{font-size:16px;font-weight:800;color:var(--t1);letter-spacing:-.3px}
          .drw-subtitle{font-size:12.5px;color:var(--t2);margin-top:3px}
          .drw-close{width:32px;height:32px;border-radius:8px;border:1px solid var(--bdr);background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t3);transition:background .12s;flex-shrink:0}.drw-close:hover{background:#f1f5f9;color:var(--t1)}
          .drw-body{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:18px}
          /* Gallery */
          .drw-gallery{display:flex;flex-direction:column;gap:8px}
          .drw-main-img{width:100%;height:220px;object-fit:cover;border-radius:10px;border:1px solid var(--bdr)}
          .drw-thumbs{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}
          .drw-thumb{width:60px;height:48px;object-fit:cover;border-radius:7px;border:2px solid transparent;cursor:pointer;flex-shrink:0;transition:border-color .12s}
          .drw-thumb.active{border-color:var(--blue)}
          /* Sections */
          .drw-section{display:flex;flex-direction:column;gap:8px}
          .drw-section-title{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--t3);padding-bottom:6px;border-bottom:1px solid #f1f5f9}
          .drw-address-box{background:#f8fafc;border:1px solid var(--bdr);border-radius:9px;padding:12px 14px;display:flex;flex-direction:column;gap:3px}
          .drw-address-line{font-size:13.5px;color:var(--t1);font-weight:500}
          .drw-maps-link{display:inline-flex;align-items:center;gap:5px;margin-top:6px;font-size:12px;color:var(--blue);font-weight:600;text-decoration:none}.drw-maps-link:hover{text-decoration:underline}
          .drw-info-grid{display:flex;flex-direction:column;gap:6px}
          .drw-info-row{display:flex;align-items:center;justify-content:space-between;padding:7px 12px;background:#fafbfd;border-radius:8px;border:1px solid #f1f5f9}
          .drw-info-label{font-size:11.5px;color:var(--t3);font-weight:600}
          .drw-info-val{font-size:13px;color:var(--t1);font-weight:600}.drw-info-val a{color:var(--blue);text-decoration:none}.drw-info-val a:hover{text-decoration:underline}
          .drw-chips{display:flex;flex-wrap:wrap;gap:6px}
          .drw-chip{display:inline-flex;align-items:center;gap:5px;background:#f1f5f9;border:1px solid var(--bdr);border-radius:20px;padding:4px 11px;font-size:12px;font-weight:600;color:var(--t2)}
          .drw-desc{font-size:13px;color:var(--t2);line-height:1.6;background:#fafbfd;border:1px solid var(--bdr);border-radius:9px;padding:10px 14px}
          .drw-prev-note{font-size:13px;color:#92400e;background:#fef3c7;border:1px solid #fcd34d;border-radius:9px;padding:10px 14px;line-height:1.5}
          /* Drawer footer */
          .drw-foot{padding:14px 20px;border-top:1px solid var(--bdr);background:#fafbfd;display:flex;flex-direction:column;gap:10px}
          .drw-foot-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--t3)}
          .drw-verdict-row{display:flex;gap:8px}
          .drw-vbtn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:13px;font-weight:700;padding:10px 14px;border-radius:9px;border:none;cursor:pointer;font-family:inherit;transition:opacity .15s,transform .1s}
          .drw-vbtn:active{transform:scale(.97)}
          .drw-vbtn-green{background:#16a34a;color:#fff}.drw-vbtn-green:hover{background:#15803d}
          .drw-vbtn-orange{background:#ea580c;color:#fff}.drw-vbtn-orange:hover{background:#c2410c}
          .drw-vbtn-red{background:#dc2626;color:#fff}.drw-vbtn-red:hover{background:#b91c1c}

          /* ══ Verdict Modal ══ */
          .vm-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1100;padding:20px}
          .vm-box{background:#fff;border-radius:14px;width:100%;max-width:460px;box-shadow:0 20px 60px rgba(0,0,0,.22);display:flex;flex-direction:column;animation:vm-in .2s cubic-bezier(.16,1,.3,1)}
          @keyframes vm-in{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
          .vm-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:20px 20px 16px;border-bottom:1px solid var(--bdr)}
          .vm-title{font-size:15px;font-weight:700;color:var(--t1)}.vm-sub{font-size:12.5px;color:var(--t3);margin-top:2px}
          .vm-close{width:30px;height:30px;border-radius:7px;border:1px solid var(--bdr);background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t3);font-family:inherit}.vm-close:hover{background:#f8fafc;color:var(--t1)}
          .vm-flow-note{margin:12px 20px 0;padding:10px 14px;border-radius:8px;font-size:12.5px;font-weight:500;background:#f8fafc;border:1px solid var(--bdr);color:var(--t2)}
          .vm-body{padding:14px 20px 18px;display:flex;flex-direction:column;gap:8px}
          .vm-label{font-size:12px;font-weight:600;color:var(--t2)}
          .vm-textarea{padding:10px 12px;border:1.5px solid var(--bdr);border-radius:9px;font-size:13px;font-family:inherit;color:var(--t1);resize:vertical;outline:none;transition:border-color .15s}
          .vm-textarea:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
          .vm-hint{font-size:11px;color:var(--t3)}
          .vm-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--bdr)}
          .vm-btn-ghost{padding:8px 16px;border-radius:8px;border:1.5px solid var(--bdr);background:none;font-size:13px;font-weight:600;color:var(--t2);cursor:pointer;font-family:inherit}.vm-btn-ghost:hover{background:#f8fafc}
          .vm-btn-submit{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:8px;border:none;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:opacity .15s}
          .vm-btn-submit:disabled{opacity:.5;cursor:not-allowed}
          .vm-btn-green{background:#16a34a;color:#fff}.vm-btn-green:hover:not(:disabled){background:#15803d}
          .vm-btn-red{background:#dc2626;color:#fff}.vm-btn-red:hover:not(:disabled){background:#b91c1c}
          .vm-btn-orange{background:#ea580c;color:#fff}.vm-btn-orange:hover:not(:disabled){background:#c2410c}
          .vm-spinner{width:13px;height:13px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:ag-spin .6s linear infinite}

          @media(max-width:1100px){.ag-stats-grid{grid-template-columns:repeat(3,1fr)}}
          @media(max-width:768px){
            .ag-layout{flex-direction:column}.ag-sidebar{width:100%;height:auto;position:static}
            .ag-tab-body{padding:16px}.ag-stats-grid{grid-template-columns:repeat(2,1fr)}
            .ag-sellers-grid{grid-template-columns:1fr}.ag-toolbar{flex-direction:column;align-items:flex-start}
            .ag-search-box{min-width:unset;width:100%}.drw{max-width:100%}
          }
        `}</style>
    </div>
  );
}