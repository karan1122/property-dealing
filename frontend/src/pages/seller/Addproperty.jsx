import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

const INITIAL = {
  title: "", description: "", price: "",
  address: { street: "", city: "", state: "", country: "India", pincode: "", coordinates: { latitude: "", longitude: "" } },
  propertyInfo: { propertyType: "Apartment", lotSize: "", squareArea: "", yearBuilt: "" },
  propertyDetails: { bedrooms: 0, bathrooms: 0, furnishing: "Unfurnished", kitchen: false, parkingSpaces: 0, outdoorSpace: "" },
};

// Moved outside to prevent re-renders losing focus
const Field = ({ label, error, children }) => (
  <div className="field">
    <label className="field-label">{label}</label>
    {children}
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default function AddProperty() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const updateField = (path, value) => {
    setForm((prev) => {
      const next = structuredClone(prev); 
      const keys = path.split(".");
      let obj = next;
      
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.title) e.title = "Title is required";
    if (!form.description) e.description = "Description is required";
    if (!form.price) e.price = "Price is required";
    if (!form.address.street) e.street = "Street is required";
    if (!form.address.city) e.city = "City is required";
    if (!form.address.state) e.state = "State is required";
    if (!form.address.pincode) e.pincode = "Pincode is required";
    if (!form.propertyInfo.yearBuilt) e.yearBuilt = "Year built is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setStep(1); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify(form));
      if (thumbnail) fd.append("thumbnail", thumbnail);
      images.forEach((img) => fd.append("images", img));
      await api.post("/properties", fd, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/seller/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">☰ NestFind</div>
        <nav className="sidebar-nav">
          <Link to="/seller/dashboard" className="nav-item">📊 Overview</Link>
          <Link to="/seller/properties" className="nav-item">🏠 My Properties</Link>
          <Link to="/seller/add-property" className="nav-item active">+ Add Property</Link>
          <Link to="/seller/inquiries" className="nav-item">✉️ Inquiries</Link>
          <Link to="/seller/profile" className="nav-item">👤 Profile</Link>
        </nav>
      </aside>

      <main className="form-main">
        <div className="form-header">
          <h1 className="form-title">Add New Property</h1>
          <p className="form-sub">Fill in the details below. Your listing will go live after admin approval.</p>
        </div>

        <div className="steps-bar">
          {["Basic Info", "Address", "Details", "Images"].map((s, i) => (
            <div key={s} className={`step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`} onClick={() => setStep(i + 1)}>
              <span className="step-num">{step > i + 1 ? "✓" : i + 1}</span>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="property-form">

          {step === 1 && (
            <div className="form-section">
              <h2 className="sec-title">Basic Information</h2>
              <Field label="Property title *" error={errors.title}>
                <input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g. Luxury 3 BHK Apartment in Vesu" />
              </Field>
              <Field label="Description *" error={errors.description}>
                <textarea rows={4} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Describe your property..." />
              </Field>
              <div className="two-col">
                <Field label="Price (₹) *" error={errors.price}>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="e.g. 6800000" />
                </Field>
                <Field label="Property type *">
                  <select value={form.propertyInfo.propertyType} onChange={(e) => updateField("propertyInfo.propertyType", e.target.value)}>
                    {["Residential", "Commercial", "Apartment", "Villa", "Plot"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-section">
              <h2 className="sec-title">Address</h2>
              <Field label="Street address *" error={errors.street}>
                <input value={form.address.street} onChange={(e) => updateField("address.street", e.target.value)} placeholder="Street / Area" />
              </Field>
              <div className="two-col">
                <Field label="City *" error={errors.city}>
                  <input value={form.address.city} onChange={(e) => updateField("address.city", e.target.value)} placeholder="Surat" />
                </Field>
                <Field label="State *" error={errors.state}>
                  <input value={form.address.state} onChange={(e) => updateField("address.state", e.target.value)} placeholder="Gujarat" />
                </Field>
              </div>
              <div className="two-col">
                <Field label="Country">
                  <input value={form.address.country} onChange={(e) => updateField("address.country", e.target.value)} />
                </Field>
                <Field label="Pincode *" error={errors.pincode}>
                  <input value={form.address.pincode} onChange={(e) => updateField("address.pincode", e.target.value)} placeholder="395007" />
                </Field>
              </div>
              <div className="two-col">
                <Field label="Latitude (optional)">
                  <input type="number" step="any" value={form.address.coordinates.latitude} onChange={(e) => updateField("address.coordinates.latitude", e.target.value)} placeholder="21.1702" />
                </Field>
                <Field label="Longitude (optional)">
                  <input type="number" step="any" value={form.address.coordinates.longitude} onChange={(e) => updateField("address.coordinates.longitude", e.target.value)} placeholder="72.8311" />
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-section">
              <h2 className="sec-title">Property Details</h2>
              <div className="three-col">
                <Field label="Lot size (sq.ft)">
                  <input type="number" value={form.propertyInfo.lotSize} onChange={(e) => updateField("propertyInfo.lotSize", e.target.value)} placeholder="2400" />
                </Field>
                <Field label="Built area (sq.ft)">
                  <input type="number" value={form.propertyInfo.squareArea} onChange={(e) => updateField("propertyInfo.squareArea", e.target.value)} placeholder="1240" />
                </Field>
                <Field label="Year built *" error={errors.yearBuilt}>
                  <input type="number" value={form.propertyInfo.yearBuilt} onChange={(e) => updateField("propertyInfo.yearBuilt", e.target.value)} placeholder="2020" />
                </Field>
              </div>
              <div className="three-col">
                <Field label="Bedrooms">
                  <input type="number" min="0" value={form.propertyDetails.bedrooms} onChange={(e) => updateField("propertyDetails.bedrooms", Number(e.target.value))} />
                </Field>
                <Field label="Bathrooms">
                  <input type="number" min="0" value={form.propertyDetails.bathrooms} onChange={(e) => updateField("propertyDetails.bathrooms", Number(e.target.value))} />
                </Field>
                <Field label="Parking spaces">
                  <input type="number" min="0" value={form.propertyDetails.parkingSpaces} onChange={(e) => updateField("propertyDetails.parkingSpaces", Number(e.target.value))} />
                </Field>
              </div>
              <div className="two-col">
                <Field label="Furnishing">
                  <select value={form.propertyDetails.furnishing} onChange={(e) => updateField("propertyDetails.furnishing", e.target.value)}>
                    {["Unfurnished", "Semi-Furnished", "Furnished"].map((f) => <option key={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Kitchen included">
                  <select value={form.propertyDetails.kitchen} onChange={(e) => updateField("propertyDetails.kitchen", e.target.value === "true")}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </Field>
              </div>
              <Field label="Outdoor space description">
                <input value={form.propertyDetails.outdoorSpace} onChange={(e) => updateField("propertyDetails.outdoorSpace", e.target.value)} placeholder="Garden, terrace, balcony..." maxLength={150} />
              </Field>
            </div>
          )}

          {step === 4 && (
            <div className="form-section">
              <h2 className="sec-title">Images</h2>
              <Field label="Thumbnail image (main photo)">
                <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
                {thumbnail && <img src={URL.createObjectURL(thumbnail)} alt="preview" className="img-preview" />}
              </Field>
              <Field label="Gallery images (select multiple)">
                <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files))} />
                {images.length > 0 && (
                  <div className="img-grid">
                    {images.map((img, i) => (
                      <img key={i} src={URL.createObjectURL(img)} alt={`gallery-${i}`} className="img-thumb" />
                    ))}
                  </div>
                )}
              </Field>
            </div>
          )}

          <div className="form-footer">
            {step > 1 && <button type="button" className="btn-back" onClick={() => setStep(step - 1)}>← Back</button>}
            {step < 4 && <button type="button" className="btn-next" onClick={() => setStep(step + 1)}>Next →</button>}
            {step === 4 && <button type="submit" className="btn-submit" disabled={loading}>{loading ? "Saving..." : "Submit Listing"}</button>}
          </div>
        </form>
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .add-layout { display: flex; min-height: 100vh; background: #f8f7f4; font-family: 'DM Sans', sans-serif; }
        .sidebar { width: 220px; background: #0f1117; color: #e8e6e1; display: flex; flex-direction: column; padding: 0; position: sticky; top: 0; height: 100vh; }
        .sidebar-logo { font-size: 17px; font-weight: 600; padding: 24px 20px; border-bottom: 1px solid #1e2028; color: #fff; }
        .sidebar-nav { flex: 1; padding: 16px 0; display: flex; flex-direction: column; gap: 2px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; font-size: 13px; color: #9e9c97; text-decoration: none; }
        .nav-item:hover, .nav-item.active { background: #1a1d26; color: #fff; border-left: 3px solid #d4a853; padding-left: 17px; }

        .form-main { flex: 1; padding: 32px 40px; max-width: 780px; }
        .form-header { margin-bottom: 24px; }
        .form-title { font-size: 22px; font-weight: 600; color: #1a1d26; }
        .form-sub { font-size: 13px; color: #6b6863; margin-top: 4px; }

        .steps-bar { display: flex; gap: 0; margin-bottom: 28px; background: #fff; border: 1px solid #e8e5e0; border-radius: 10px; overflow: hidden; }
        .step { flex: 1; display: flex; align-items: center; gap: 8px; padding: 12px 16px; cursor: pointer; font-size: 12px; color: #9e9c97; border-right: 1px solid #e8e5e0; transition: all 0.15s; }
        .step:last-child { border-right: none; }
        .step.active { background: #1a1d26; color: #fff; }
        .step.done { background: #eaf3de; color: #27500a; }
        .step-num { width: 22px; height: 22px; border-radius: 50%; background: #e8e5e0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0; }
        .step.active .step-num { background: #d4a853; color: #1a1d26; }
        .step.done .step-num { background: #27500a; color: #fff; }

        .property-form { background: #fff; border: 1px solid #e8e5e0; border-radius: 12px; padding: 24px; }
        .form-section { display: flex; flex-direction: column; gap: 16px; }
        .sec-title { font-size: 15px; font-weight: 600; color: #1a1d26; padding-bottom: 12px; border-bottom: 1px solid #e8e5e0; margin-bottom: 4px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-label { font-size: 11px; color: #6b6863; font-weight: 500; }
        .field-error { font-size: 11px; color: #a32d2d; }
        .field input, .field select, .field textarea { padding: 8px 10px; border: 1px solid #d4d1c7; border-radius: 7px; font-size: 13px; background: #fff; color: #1a1d26; width: 100%; outline: none; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: #1a1d26; }
        .field textarea { resize: vertical; font-family: inherit; }

        .img-preview { width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-top: 8px; border: 1px solid #e8e5e0; }
        .img-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
        .img-thumb { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; border: 1px solid #e8e5e0; }

        .form-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 20px; margin-top: 8px; border-top: 1px solid #e8e5e0; }
        .btn-back { background: none; border: 1px solid #d4d1c7; border-radius: 8px; padding: 9px 18px; font-size: 13px; color: #6b6863; cursor: pointer; }
        .btn-next { background: #f8f7f4; border: 1px solid #d4d1c7; border-radius: 8px; padding: 9px 20px; font-size: 13px; color: #1a1d26; cursor: pointer; font-weight: 500; }
        .btn-submit { background: #1a1d26; color: #fff; border: none; border-radius: 8px; padding: 9px 24px; font-size: 13px; cursor: pointer; font-weight: 500; }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 768px) {
          .add-layout { flex-direction: column; }
          .sidebar { width: 100%; height: auto; position: static; }
          .form-main { padding: 16px; }
          .two-col, .three-col { grid-template-columns: 1fr; }
          .steps-bar { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}