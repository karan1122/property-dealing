import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/axios";

// Moved outside to prevent inputs from losing focus on every keystroke
const Field = ({ label, error, children }) => (
  <div className="field">
    <label className="field-label">{label}</label>
    {children}
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => {
      setForm(res.data.property);
      setLoading(false);
    }).catch(() => navigate("/seller/dashboard"));
  }, [id, navigate]);

  const set = (path, value) => {
    setForm((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) { setErrors({ title: !form.title ? "Required" : "", price: !form.price ? "Required" : "" }); return; }
    setSaving(true);
    try {
      await api.put(`/properties/${id}`, form);
      navigate("/seller/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading property...</div>;

  return (
    <div className="edit-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">&#8962; NestFind</div>
        <nav className="sidebar-nav">
          <Link to="/seller/dashboard" className="nav-item">&#9783; Overview</Link>
          <Link to="/seller/properties" className="nav-item active">&#127968; My Properties</Link>
          <Link to="/seller/add-property" className="nav-item">&#43; Add Property</Link>
          <Link to="/seller/inquiries" className="nav-item">&#9993; Inquiries</Link>
        </nav>
      </aside>

      <main className="form-main">
        <div className="form-header">
          <Link to="/seller/dashboard" className="back-link">&#8592; Back to dashboard</Link>
          <h1 className="form-title">Edit Property</h1>
          <p className="form-sub">{form.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-block">
            <h2 className="block-title">Basic Info</h2>
            <Field label="Title *" error={errors.title}>
              <input value={form.title || ""} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field label="Description *">
              <textarea rows={4} value={form.description || ""} onChange={(e) => set("description", e.target.value)} />
            </Field>
            <div className="two-col">
              <Field label="Price (₹) *" error={errors.price}>
                <input type="number" value={form.price || ""} onChange={(e) => set("price", e.target.value)} />
              </Field>
              <Field label="Property type">
                <select value={form.propertyInfo?.propertyType || "Apartment"} onChange={(e) => set("propertyInfo.propertyType", e.target.value)}>
                  {["Residential", "Commercial", "Apartment", "Villa", "Plot"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <div className="two-col">
              <Field label="Status">
                <select value={form.status || "Available"} onChange={(e) => set("status", e.target.value)}>
                  {["Available", "Pending", "Sold"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Year built">
                <input type="number" value={form.propertyInfo?.yearBuilt || ""} onChange={(e) => set("propertyInfo.yearBuilt", e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="form-block">
            <h2 className="block-title">Address</h2>
            <Field label="Street">
              <input value={form.address?.street || ""} onChange={(e) => set("address.street", e.target.value)} />
            </Field>
            <div className="two-col">
              <Field label="City">
                <input value={form.address?.city || ""} onChange={(e) => set("address.city", e.target.value)} />
              </Field>
              <Field label="State">
                <input value={form.address?.state || ""} onChange={(e) => set("address.state", e.target.value)} />
              </Field>
            </div>
            <div className="two-col">
              <Field label="Pincode">
                <input value={form.address?.pincode || ""} onChange={(e) => set("address.pincode", e.target.value)} />
              </Field>
              <Field label="Country">
                <input value={form.address?.country || ""} onChange={(e) => set("address.country", e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="form-block">
            <h2 className="block-title">Property Details</h2>
            <div className="three-col">
              <Field label="Bedrooms">
                <input type="number" min="0" value={form.propertyDetails?.bedrooms ?? 0} onChange={(e) => set("propertyDetails.bedrooms", Number(e.target.value))} />
              </Field>
              <Field label="Bathrooms">
                <input type="number" min="0" value={form.propertyDetails?.bathrooms ?? 0} onChange={(e) => set("propertyDetails.bathrooms", Number(e.target.value))} />
              </Field>
              <Field label="Parking spaces">
                <input type="number" min="0" value={form.propertyDetails?.parkingSpaces ?? 0} onChange={(e) => set("propertyDetails.parkingSpaces", Number(e.target.value))} />
              </Field>
            </div>
            <div className="two-col">
              <Field label="Furnishing">
                <select value={form.propertyDetails?.furnishing || "Unfurnished"} onChange={(e) => set("propertyDetails.furnishing", e.target.value)}>
                  {["Unfurnished", "Semi-Furnished", "Furnished"].map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Kitchen">
                <select value={String(form.propertyDetails?.kitchen || false)} onChange={(e) => set("propertyDetails.kitchen", e.target.value === "true")}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </Field>
            </div>
            <Field label="Outdoor space">
              <input value={form.propertyDetails?.outdoorSpace || ""} onChange={(e) => set("propertyDetails.outdoorSpace", e.target.value)} placeholder="Garden, terrace..." maxLength={150} />
            </Field>
          </div>

          <div className="form-footer">
            <Link to="/seller/dashboard" className="btn-cancel">Cancel</Link>
            <button type="submit" className="btn-save" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .edit-layout { display: flex; min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; }
        .sidebar { width: 220px; background: #0f1117; color: #e8e6e1; display: flex; flex-direction: column; padding: 0; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { font-size: 17px; font-weight: 600; padding: 24px 20px; border-bottom: 1px solid #1e2028; color: #fff; }
        .sidebar-nav { flex: 1; padding: 16px 0; display: flex; flex-direction: column; gap: 2px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; font-size: 13px; color: #9e9c97; text-decoration: none; }
        .nav-item:hover, .nav-item.active { background: #1a1d26; color: #fff; border-left: 3px solid #d4a853; padding-left: 17px; }
        .form-main { flex: 1; padding: 32px 40px; max-width: 760px; }
        .back-link { font-size: 12px; color: #6b6863; text-decoration: none; display: inline-block; margin-bottom: 12px; }
        .back-link:hover { color: #1a1d26; }
        .form-title { font-size: 22px; font-weight: 600; color: #1a1d26; }
        .form-sub { font-size: 13px; color: #6b6863; margin-top: 3px; margin-bottom: 24px; }
        .edit-form { display: flex; flex-direction: column; gap: 20px; }
        .form-block { background: #fff; border: 1px solid #e8e5e0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .block-title { font-size: 14px; font-weight: 600; color: #1a1d26; padding-bottom: 12px; border-bottom: 1px solid #e8e5e0; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-label { font-size: 11px; color: #6b6863; font-weight: 500; }
        .field-error { font-size: 11px; color: #a32d2d; }
        .field input, .field select, .field textarea { padding: 8px 10px; border: 1px solid #d4d1c7; border-radius: 7px; font-size: 13px; background: #fff; color: #1a1d26; width: 100%; outline: none; font-family: inherit; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: #1a1d26; }
        .field textarea { resize: vertical; }
        .form-footer { display: flex; justify-content: flex-end; gap: 10px; }
        .btn-cancel { background: none; border: 1px solid #d4d1c7; border-radius: 8px; padding: 9px 18px; font-size: 13px; color: #6b6863; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-save { background: #1a1d26; color: #fff; border: none; border-radius: 8px; padding: 9px 24px; font-size: 13px; cursor: pointer; font-weight: 500; }
        .btn-save:disabled { opacity: 0.6; }
        .loading-screen { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 15px; color: #6b6863; font-family: 'DM Sans', sans-serif; }
        @media (max-width: 768px) {
          .edit-layout { flex-direction: column; }
          .sidebar { width: 100%; height: auto; position: static; }
          .form-main { padding: 16px; }
          .two-col, .three-col { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}