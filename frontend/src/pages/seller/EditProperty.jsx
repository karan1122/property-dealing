import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/axios";

// ── Outside component to prevent focus loss on re-render ─────────────────────
const Field = ({ label, hint, error, children }) => (
  <div className="ep-field">
    <div className="ep-field-top">
      <label className="ep-label">{label}</label>
      {hint && <span className="ep-hint">{hint}</span>}
    </div>
    {children}
    {error && <span className="ep-error">⚠ {error}</span>}
  </div>
);

const Counter = ({ value, onChange }) => (
  <div className="ep-counter">
    <button type="button" className="ep-counter-btn" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
    <span className="ep-counter-val">{value}</span>
    <button type="button" className="ep-counter-btn" onClick={() => onChange(value + 1)}>+</button>
  </div>
);

const PillGroup = ({ options, value, onChange }) => (
  <div className="ep-pills">
    {options.map((opt) => {
      const v = typeof opt === "object" ? opt.value : opt;
      const l = typeof opt === "object" ? opt.label : opt;
      return (
        <button key={v} type="button"
          className={`ep-pill${String(value) === String(v) ? " sel" : ""}`}
          onClick={() => onChange(v)}>{l}
        </button>
      );
    })}
  </div>
);

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [errors, setErrors]       = useState({});
  const [activeTab, setActiveTab] = useState("basic");

  // Thumbnail state
  const [newThumbnail, setNewThumbnail]       = useState(null);
  const [newThumbPreview, setNewThumbPreview] = useState(null);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  // Gallery state
  const [newImages, setNewImages]           = useState([]);
  const [newImgPreviews, setNewImgPreviews] = useState([]);
  const [removedImages, setRemovedImages]   = useState([]);

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then((res) => { setForm(res.data.property); setLoading(false); })
      .catch(() => navigate("/seller/dashboard"));
  }, [id, navigate]);

  // ── Deep-set helper ───────────────────────────────────────────────────────
  const set = (path, value) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  // ── Thumbnail handlers ────────────────────────────────────────────────────
  const handleNewThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewThumbnail(file);
    setNewThumbPreview(URL.createObjectURL(file));
    setRemoveThumbnail(false);
  };

  const handleRemoveExistingThumb = () => {
    setRemoveThumbnail(true);
    setNewThumbnail(null);
    setNewThumbPreview(null);
  };

  // ── Gallery handlers ──────────────────────────────────────────────────────
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    setNewImgPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  // ── FIXED: inside component so it accesses state ──────────────────────────
  const removeNewImage = (i) => {
    setNewImages((p) => p.filter((_, idx) => idx !== i));
    setNewImgPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const toggleRemoveExisting = (url) => {
    setRemovedImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  // ── Validate ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title?.trim()) e.title = "Title is required";
    if (!form.price)         e.price = "Price is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setActiveTab("basic"); return; }
    setSaving(true);
    try {
      const fd = new FormData();

      // Strip old thumbnail/images from JSON (handled separately)
      const { thumbnail: _t, images: _i, ...rest } = form;
      fd.append("data", JSON.stringify(rest));

      // New thumbnail file
      if (newThumbnail) fd.append("thumbnail", newThumbnail);

      // Flag to remove existing thumbnail from Cloudinary
      if (removeThumbnail) fd.append("removeThumbnail", "true");

      // New gallery files
      newImages.forEach((img) => fd.append("images", img));

      // Existing Cloudinary URLs to delete
      if (removedImages.length > 0)
        fd.append("removedImages", JSON.stringify(removedImages));

      await api.put(`/properties/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/seller/dashboard");
    } catch (err) {
          const msg = err?.response?.data?.message || err?.message || "Failed to update property";
    alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "DM Sans,sans-serif", color: "#6B6560", fontSize: 15 }}>
      Loading property...
    </div>
  );

  const existingThumbnail = form.thumbnail;
  const existingImages    = form.images || [];

  const TABS = [
    { key: "basic",   label: "Basic Info" },
    { key: "address", label: "Address"    },
    { key: "details", label: "Details"    },
    { key: "images",  label: "Photos"     },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .ep-wrap{display:flex;min-height:100vh;background:#F5F3EE;font-family:'DM Sans',sans-serif;color:#1C1A17}
        .ep-sb{width:220px;background:#0f1117;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;flex-shrink:0}
        .ep-brand{padding:24px 20px;border-bottom:1px solid #1e2028;font-size:18px;font-weight:700;color:#fff}
        .ep-brand em{color:#d4a853;font-style:normal}
        .ep-brand small{display:block;font-size:11px;color:#d4a853;margin-top:3px;font-weight:600;letter-spacing:.05em}
        .ep-nav{flex:1;padding:12px 0;display:flex;flex-direction:column;gap:2px}
        .ep-nl{display:flex;align-items:center;gap:10px;padding:10px 20px;font-size:13px;color:#9e9c97;text-decoration:none;transition:all .15s;border-left:3px solid transparent}
        .ep-nl:hover,.ep-nl.on{background:#1a1d26;color:#fff;border-left-color:#d4a853;padding-left:17px}
        .ep-main{flex:1;padding:36px 44px;max-width:820px}
        .ep-back{font-size:12px;color:#9A9488;text-decoration:none;display:inline-flex;align-items:center;gap:5px;margin-bottom:12px}
        .ep-back:hover{color:#C8973A}
        .ep-ptitle{font-size:24px;font-weight:700;color:#1C1A17;margin-bottom:4px}
        .ep-psub{font-size:13px;color:#6B6560;margin-bottom:24px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .ep-pill-status{font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px}
        .ep-tabs{display:flex;border-bottom:2px solid #E5E1D9;margin-bottom:24px}
        .ep-tab{padding:10px 20px;font-size:13px;font-weight:500;color:#9A9488;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s}
        .ep-tab:hover{color:#1C1A17}
        .ep-tab.on{color:#C8973A;border-bottom-color:#C8973A;font-weight:600}
        .ep-card{background:#fff;border:1px solid #E5E1D9;border-radius:14px;padding:28px}
        .ep-sec-title{font-size:16px;font-weight:700;color:#1C1A17;margin-bottom:22px;padding-bottom:12px;border-bottom:1px solid #F0EDE6}
        .ep-rows{display:flex;flex-direction:column;gap:18px}
        .ep-g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .ep-g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
        .ep-field{display:flex;flex-direction:column;gap:5px}
        .ep-field-top{display:flex;align-items:baseline;justify-content:space-between}
        .ep-label{font-size:11px;font-weight:600;color:#5A554E;letter-spacing:.4px;text-transform:uppercase}
        .ep-hint{font-size:11px;color:#9A9488}
        .ep-error{font-size:11.5px;color:#B84040;font-weight:500}
        .ep-field input,.ep-field select,.ep-field textarea{padding:10px 12px;border:1.5px solid #E0DCD5;border-radius:8px;font-size:13px;background:#FAFAF8;color:#1C1A17;width:100%;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s}
        .ep-field input:focus,.ep-field select:focus,.ep-field textarea:focus{border-color:#C8973A;background:#fff}
        .ep-field input.err{border-color:#B84040}
        .ep-field textarea{resize:vertical;min-height:90px;line-height:1.55}
        .ep-counter{display:flex;align-items:center;border:1.5px solid #E0DCD5;border-radius:8px;background:#FAFAF8;overflow:hidden;height:42px}
        .ep-counter-btn{width:36px;height:100%;border:none;background:none;font-size:20px;color:#6B6560;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .ep-counter-btn:hover{background:#F0EDE6}
        .ep-counter-val{flex:1;text-align:center;font-size:15px;font-weight:600;color:#1C1A17}
        .ep-pills{display:flex;gap:8px;flex-wrap:wrap}
        .ep-pill{padding:7px 16px;border-radius:20px;border:1.5px solid #E0DCD5;background:#FAFAF8;font-size:12px;font-weight:500;color:#6B6560;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
        .ep-pill:hover{border-color:#1C1A17;color:#1C1A17}
        .ep-pill.sel{background:#1C1A17;color:#fff;border-color:#1C1A17}
        .ep-img-label{font-size:11px;font-weight:600;color:#5A554E;letter-spacing:.4px;text-transform:uppercase;margin-bottom:8px;display:flex;justify-content:space-between}
        .ep-img-count{font-size:11px;color:#9A9488;font-weight:normal}
        .ep-thumb-wrap{position:relative;max-width:320px}
        .ep-thumb-img{width:100%;height:170px;object-fit:cover;border-radius:10px;border:1.5px solid #E5E1D9;display:block}
        .ep-thumb-removed{opacity:.3;filter:grayscale(1)}
        .ep-thumb-overlay{position:absolute;inset:0;background:rgba(184,64,64,.55);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:600}
        .ep-img-btns{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
        .ep-btn-sm{padding:6px 14px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .ep-btn-sm-outline{border:1.5px solid #D4CFCA;background:#FAFAF8;color:#1C1A17}
        .ep-btn-sm-danger{border:1.5px solid #E5B0B0;background:#FDF0F0;color:#B84040}
        .ep-btn-sm-outline:hover{background:#F0EDE6}
        .ep-btn-sm-danger:hover{background:#FDECEA;border-color:#B84040}
        .ep-gallery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:6px}
        .ep-gitem{position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;border:1.5px solid #E5E1D9;cursor:pointer}
        .ep-gitem img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .2s}
        .ep-gitem.removed img{opacity:.25;filter:grayscale(1)}
        .ep-gitem-badge{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;background:rgba(184,64,64,.6);border-radius:8px}
        .ep-gitem-hover{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;background:rgba(0,0,0,.4);opacity:0;transition:opacity .2s;border-radius:8px}
        .ep-gitem:hover .ep-gitem-hover{opacity:1}
        .ep-upload{border:2px dashed #D4CFCA;border-radius:10px;padding:20px;text-align:center;background:#FAF9F6;position:relative;transition:all .2s;margin-top:12px}
        .ep-upload:hover{border-color:#C8973A;background:#FFF9F0}
        .ep-upload input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
        .ep-upload-ico{font-size:22px;margin-bottom:5px}
        .ep-upload-ttl{font-size:13px;font-weight:600;color:#1C1A17;margin-bottom:2px}
        .ep-upload-sub{font-size:11px;color:#9A9488}
        .ep-new-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:10px}
        .ep-nitem{position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;border:2px solid #C8973A}
        .ep-nitem img{width:100%;height:100%;object-fit:cover;display:block}
        .ep-nremove{position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;background:rgba(28,26,23,.8);color:#fff;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center}
        .ep-new-label{position:absolute;bottom:4px;left:4px;font-size:9px;font-weight:700;background:#C8973A;color:#1C1A17;padding:2px 6px;border-radius:4px}
        .ep-new-thumb{width:100%;max-width:320px;height:170px;object-fit:cover;border-radius:10px;border:2px solid #C8973A;display:block;margin-top:10px}
        .ep-cancel-link{font-size:12px;color:#B84040;background:none;border:none;cursor:pointer;padding:0;font-family:'DM Sans',sans-serif;margin-top:6px;display:inline-block}
        .ep-footer{display:flex;align-items:center;justify-content:space-between;padding-top:22px;margin-top:22px;border-top:1px solid #F0EDE6}
        .ep-btn-cancel-link{padding:9px 20px;border-radius:8px;border:1.5px solid #D4CFCA;background:none;font-size:13px;font-weight:500;color:#6B6560;text-decoration:none;display:inline-flex;align-items:center;transition:all .15s}
        .ep-btn-cancel-link:hover{border-color:#1C1A17;color:#1C1A17}
        .ep-btn-save{padding:10px 26px;border-radius:8px;border:none;background:#C8973A;font-size:13px;font-weight:600;color:#1C1A17;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .ep-btn-save:hover{background:#B5842E}
        .ep-btn-save:disabled{opacity:.55;cursor:not-allowed}
        .ep-divider{height:1px;background:#F0EDE6;margin:6px 0}
        @media(max-width:768px){.ep-wrap{flex-direction:column}.ep-sb{width:100%;height:auto;position:static}.ep-main{padding:20px 16px}.ep-g2,.ep-g3{grid-template-columns:1fr}.ep-gallery-grid,.ep-new-grid{grid-template-columns:repeat(3,1fr)}}
      `}</style>

      <div className="ep-wrap">

        {/* Sidebar */}
        <aside className="ep-sb">
          <div className="ep-brand">
            🏡 NestFind
            <small>SELLER PORTAL</small>
          </div>
          <nav className="ep-nav">
            <Link to="/seller/dashboard"    className="ep-nl">📊 Overview</Link>
            <Link to="/seller/properties"   className="ep-nl on">🏘 My Properties</Link>
            <Link to="/seller/add-property" className="ep-nl">➕ Add Property</Link>
            <Link to="/seller/inquiries"    className="ep-nl">✉️ Inquiries</Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="ep-main">
          <Link to="/seller/dashboard" className="ep-back">← Back to dashboard</Link>

          <h1 className="ep-ptitle">Edit Property</h1>
          <div className="ep-psub">
            <span>{form.title}</span>
            <span className="ep-pill-status" style={{
              background: form.status === "Available" ? "#EFF6E8" : form.status === "Sold" ? "#FDECEA" : "#FEF3CD",
              color:      form.status === "Available" ? "#3A6B1E" : form.status === "Sold" ? "#8B2020" : "#7A5C00",
            }}>{form.status}</span>
            {form.isApprovedByCompany
              ? <span style={{ fontSize: 11, color: "#3A6B1E", fontWeight: 500 }}>✓ Approved</span>
              : <span style={{ fontSize: 11, color: "#9A9488" }}>⏳ Pending approval</span>
            }
          </div>

          {/* Tabs */}
          <div className="ep-tabs">
            {TABS.map((t) => (
              <div key={t.key} className={`ep-tab${activeTab === t.key ? " on" : ""}`}
                onClick={() => setActiveTab(t.key)}>{t.label}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="ep-card">

              {/* ── Basic Info ─────────────────────────────────────────── */}
              {activeTab === "basic" && (
                <div className="ep-rows">
                  <h2 className="ep-sec-title">Basic Information</h2>
                  <Field label="Property Title *" error={errors.title}>
                    <input className={errors.title ? "err" : ""} value={form.title || ""}
                      onChange={(e) => set("title", e.target.value)} placeholder="e.g. Spacious 3BHK in Vesu" />
                  </Field>
                  <Field label="Description">
                    <textarea rows={4} value={form.description || ""}
                      onChange={(e) => set("description", e.target.value)} placeholder="Describe the property..." />
                  </Field>
                  <div className="ep-g2">
                    <Field label="Price (₹) *" error={errors.price}>
                      <input type="number" min="0" className={errors.price ? "err" : ""}
                        value={form.price || ""} onChange={(e) => set("price", e.target.value)} />
                    </Field>
                    <Field label="Property Type">
                      <select value={form.propertyInfo?.propertyType || "Apartment"}
                        onChange={(e) => set("propertyInfo.propertyType", e.target.value)}>
                        {["Residential", "Commercial", "Apartment", "Villa", "Plot"].map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="ep-g2">
                    <Field label="Status">
                      <select value={form.status || "Available"} onChange={(e) => set("status", e.target.value)}>
                        {["Available", "Pending", "Sold"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Year Built">
                      <input type="number" value={form.propertyInfo?.yearBuilt || ""}
                        onChange={(e) => set("propertyInfo.yearBuilt", e.target.value)}
                        placeholder="2020" min="1900" max={new Date().getFullYear()} />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Address ───────────────────────────────────────────── */}
              {activeTab === "address" && (
                <div className="ep-rows">
                  <h2 className="ep-sec-title">Property Address</h2>
                  <Field label="Street">
                    <input value={form.address?.street || ""} onChange={(e) => set("address.street", e.target.value)}
                      placeholder="Building, road, locality" />
                  </Field>
                  <div className="ep-g2">
                    <Field label="City">
                      <input value={form.address?.city || ""} onChange={(e) => set("address.city", e.target.value)} />
                    </Field>
                    <Field label="State">
                      <input value={form.address?.state || ""} onChange={(e) => set("address.state", e.target.value)} />
                    </Field>
                    <Field label="Pincode">
                      <input value={form.address?.pincode || ""} onChange={(e) => set("address.pincode", e.target.value)} maxLength={6} />
                    </Field>
                    <Field label="Country">
                      <input value={form.address?.country || ""} onChange={(e) => set("address.country", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Map Coordinates" hint="Optional">
                    <div className="ep-g2">
                      <input type="number" step="any" value={form.address?.coordinates?.latitude || ""}
                        onChange={(e) => set("address.coordinates.latitude", e.target.value)} placeholder="Latitude" />
                      <input type="number" step="any" value={form.address?.coordinates?.longitude || ""}
                        onChange={(e) => set("address.coordinates.longitude", e.target.value)} placeholder="Longitude" />
                    </div>
                  </Field>
                </div>
              )}

              {/* ── Details ───────────────────────────────────────────── */}
              {activeTab === "details" && (
                <div className="ep-rows">
                  <h2 className="ep-sec-title">Property Details</h2>
                  <div className="ep-g3">
                    <Field label="Built area (sq.ft)">
                      <input type="number" min="0" value={form.propertyInfo?.squareArea || ""}
                        onChange={(e) => set("propertyInfo.squareArea", e.target.value)} />
                    </Field>
                    <Field label="Lot size (sq.ft)">
                      <input type="number" min="0" value={form.propertyInfo?.lotSize || ""}
                        onChange={(e) => set("propertyInfo.lotSize", e.target.value)} />
                    </Field>
                    <Field label="Parking spaces">
                      <Counter value={form.propertyDetails?.parkingSpaces ?? 0}
                        onChange={(v) => set("propertyDetails.parkingSpaces", v)} />
                    </Field>
                  </div>
                  <div className="ep-g3">
                    <Field label="Bedrooms">
                      <Counter value={form.propertyDetails?.bedrooms ?? 0}
                        onChange={(v) => set("propertyDetails.bedrooms", v)} />
                    </Field>
                    <Field label="Bathrooms">
                      <Counter value={form.propertyDetails?.bathrooms ?? 0}
                        onChange={(v) => set("propertyDetails.bathrooms", v)} />
                    </Field>
                  </div>
                  <Field label="Furnishing">
                    <PillGroup options={["Unfurnished", "Semi-Furnished", "Furnished"]}
                      value={form.propertyDetails?.furnishing || "Unfurnished"}
                      onChange={(v) => set("propertyDetails.furnishing", v)} />
                  </Field>
                  <div className="ep-g2">
                    <Field label="Kitchen">
                      <PillGroup options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}
                        value={String(form.propertyDetails?.kitchen ?? false)}
                        onChange={(v) => set("propertyDetails.kitchen", v === "true")} />
                    </Field>
                    <Field label="Outdoor space" hint="Max 150 chars">
                      <input value={form.propertyDetails?.outdoorSpace || ""}
                        onChange={(e) => set("propertyDetails.outdoorSpace", e.target.value)}
                        placeholder="Garden, terrace, balcony..." maxLength={150} />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Photos ────────────────────────────────────────────── */}
              {activeTab === "images" && (
                <div className="ep-rows">
                  <h2 className="ep-sec-title">Photos</h2>

                  {/* Thumbnail */}
                  <div>
                    <div className="ep-img-label">
                      Cover Photo
                      <span className="ep-img-count">Shown in search results</span>
                    </div>

                    {existingThumbnail && !removeThumbnail && !newThumbPreview && (
                      <div className="ep-thumb-wrap">
                        <img src={existingThumbnail} alt="Thumbnail" className="ep-thumb-img" />
                        <div className="ep-img-btns">
                          <label className={`ep-btn-sm ep-btn-sm-outline`} style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}>
                            Replace
                            <input type="file" accept="image/*" onChange={handleNewThumbnail}
                              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                          </label>
                          <button type="button" className="ep-btn-sm ep-btn-sm-danger" onClick={handleRemoveExistingThumb}>Remove</button>
                        </div>
                      </div>
                    )}

                    {existingThumbnail && removeThumbnail && !newThumbPreview && (
                      <div className="ep-thumb-wrap">
                        <img src={existingThumbnail} alt="Will be removed" className="ep-thumb-img ep-thumb-removed" />
                        <div className="ep-thumb-overlay">Will be deleted</div>
                        <div className="ep-img-btns">
                          <button type="button" className="ep-btn-sm ep-btn-sm-outline" onClick={() => setRemoveThumbnail(false)}>Undo</button>
                          <label className="ep-btn-sm ep-btn-sm-outline" style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}>
                            Upload new
                            <input type="file" accept="image/*" onChange={handleNewThumbnail}
                              style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                          </label>
                        </div>
                      </div>
                    )}

                    {newThumbPreview && (
                      <div>
                        <img src={newThumbPreview} alt="New thumbnail" className="ep-new-thumb" />
                        <button type="button" className="ep-cancel-link"
                          onClick={() => { setNewThumbnail(null); setNewThumbPreview(null); }}>
                          ✕ Cancel replacement
                        </button>
                      </div>
                    )}

                    {!existingThumbnail && !newThumbPreview && (
                      <div className="ep-upload">
                        <input type="file" accept="image/*" onChange={handleNewThumbnail} />
                        <div className="ep-upload-ico">🖼</div>
                        <div className="ep-upload-ttl">Upload thumbnail</div>
                        <div className="ep-upload-sub">JPG, PNG, WEBP · max 5 MB</div>
                      </div>
                    )}
                  </div>

                  <div className="ep-divider" />

                  {/* Gallery */}
                  <div>
                    <div className="ep-img-label">
                      Gallery Images
                      <span className="ep-img-count">
                        {existingImages.length - removedImages.length} current
                        {newImages.length > 0 && ` + ${newImages.length} new`}
                      </span>
                    </div>

                    {existingImages.length > 0 && (
                      <>
                        <p style={{ fontSize: 11, color: "#9A9488", marginBottom: 8 }}>Click a photo to mark for deletion. Click again to keep.</p>
                        <div className="ep-gallery-grid">
                          {existingImages.map((url, i) => {
                            const isRemoved = removedImages.includes(url);
                            return (
                              <div key={i} className={`ep-gitem${isRemoved ? " removed" : ""}`}
                                onClick={() => toggleRemoveExisting(url)}>
                                <img src={url} alt={`Gallery ${i + 1}`} />
                                {isRemoved
                                  ? <div className="ep-gitem-badge">✕ Delete</div>
                                  : <div className="ep-gitem-hover">✕ Remove</div>
                                }
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <div className="ep-upload">
                      <input type="file" accept="image/*" multiple onChange={handleNewImages} />
                      <div className="ep-upload-ico">📸</div>
                      <div className="ep-upload-ttl">{existingImages.length > 0 ? "Add more photos" : "Upload gallery photos"}</div>
                      <div className="ep-upload-sub">Multiple files · JPG, PNG, WEBP · max 5 MB each</div>
                    </div>

                    {newImgPreviews.length > 0 && (
                      <div className="ep-new-grid">
                        {newImgPreviews.map((src, i) => (
                          <div key={i} className="ep-nitem">
                            <img src={src} alt={`New ${i + 1}`} />
                            <div className="ep-new-label">NEW</div>
                            <button type="button" className="ep-nremove" onClick={() => removeNewImage(i)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="ep-footer">
                <Link to="/seller/dashboard" className="ep-btn-cancel-link">Cancel</Link>
                <button type="submit" className="ep-btn-save" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}