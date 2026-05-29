import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

const INITIAL = {
  title: "",
  description: "",
  price: "",
  address: {
    street: "", city: "", state: "", country: "India", pincode: "",
    coordinates: { latitude: "", longitude: "" },
  },
  propertyInfo: { propertyType: "Apartment", lotSize: "", squareArea: "", yearBuilt: "" },
  propertyDetails: { bedrooms: 0, bathrooms: 0, furnishing: "Unfurnished", kitchen: false, parkingSpaces: 0, outdoorSpace: "" },
};

const STEPS = ["Basic Info", "Address", "Details", "Photos"];

// Keep Field outside component to prevent focus loss on re-render
const Field = ({ label, hint, error, children }) => (
  <div className="ap-field">
    <div className="ap-field-top">
      <label className="ap-label">{label}</label>
      {hint && <span className="ap-hint">{hint}</span>}
    </div>
    {children}
    {error && <span className="ap-error">⚠ {error}</span>}
  </div>
);

const Counter = ({ value, onChange }) => (
  <div className="ap-counter">
    <button type="button" className="ap-counter-btn" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
    <span className="ap-counter-val">{value}</span>
    <button type="button" className="ap-counter-btn" onClick={() => onChange(value + 1)}>+</button>
  </div>
);

const PillGroup = ({ options, value, onChange }) => (
  <div className="ap-pills">
    {options.map((opt) => {
      const v = typeof opt === "object" ? opt.value : opt;
      const l = typeof opt === "object" ? opt.label : opt;
      return (
        <button key={v} type="button"
          className={`ap-pill${String(value) === String(v) ? " sel" : ""}`}
          onClick={() => onChange(v)}>{l}</button>
      );
    })}
  </div>
);

export default function AddProperty() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imgPreviews, setImgPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

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

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImgPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImg = (i) => {
    setImages((p) => p.filter((_, idx) => idx !== i));
    setImgPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const getCoordinates = async () => {
    try {
      const fullAddress = `${form.address.street}, ${form.address.city}, ${form.address.state}, ${form.address.pincode}, ${form.address.country}`;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=jsonv2&limit=1`;
      const res = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": "Crestovia/1.0" },
      });
      const data = await res.json();
      if (data.length > 0) {
        return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      }
      return { latitude: null, longitude: null };
    } catch (err) {
      console.error("Coordinate Fetch Error:", err);
      return { latitude: null, longitude: null };
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price) e.price = "Price is required";
    if (!form.address.street.trim()) e.street = "Street is required";
    if (!form.address.city.trim()) e.city = "City is required";
    if (!form.address.state.trim()) e.state = "State is required";
    if (!form.address.pincode.trim()) e.pincode = "Pincode is required";
    if (!form.propertyInfo.yearBuilt) e.yearBuilt = "Year built is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Razorpay payment flow ───────────────────────────────────────────────
  // Step A  → POST /payments/create-order  (multipart: draft data + images)
  //           Backend saves PropertyDraft, creates Razorpay order
  //           Returns { orderId, amount, currency, keyId, draftId }
  //
  // Step B  → Razorpay popup opens in browser (no page redirect)
  //           Seller pays → Razorpay calls handler.onSuccess
  //
  // Step C  → POST /payments/verify  { razorpay_order_id, razorpay_payment_id,
  //                                    razorpay_signature, draftId }
  //           Backend verifies HMAC signature, promotes draft → Property
  //           (status = Pending), returns { propertyId }
  //
  // Step D  → navigate to dashboard
  // ─────────────────────────────────────────────────────────────────────────

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setStep(1);
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const sdkReady = await loadRazorpayScript();
      if (!sdkReady) throw new Error("Failed to load Razorpay SDK. Check your internet connection.");

      // 2. Resolve coordinates
      const coords = await getCoordinates();
      const updatedForm = {
        ...form,
        address: { ...form.address, coordinates: coords },
      };

      // 3. Upload draft + images, get Razorpay order details from backend
      const fd = new FormData();
      fd.append("data", JSON.stringify(updatedForm));
      if (thumbnail) fd.append("thumbnail", thumbnail);
      images.forEach((img) => fd.append("images", img));

      const { data: order } = await api.post("/payments/create-order", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // order = { orderId, amount, currency, keyId, draftId }

      // 4. Open Razorpay checkout popup
      await new Promise((resolve, reject) => {
        const options = {
          key: order.keyId,                  // RAZORPAY_KEY_ID from backend
          amount: order.amount,              // paise  e.g. 99900 for ₹999
          currency: order.currency || "INR",
          name: "Crestovia",
          description: "Property Listing Fee",
          order_id: order.orderId,           // Razorpay order id

          handler: async (response) => {
            // response = { razorpay_order_id, razorpay_payment_id, razorpay_signature }
            try {
              // 5. Verify payment + promote draft → Property on backend
              await api.post("/payments/verify", {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                draftId:             order.draftId,
              });
              resolve();
            } catch (err) {
              reject(err);
            }
          },

          prefill: {},                       // backend can inject seller name/email if needed
          theme: { color: "#C8973A" },

          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp) =>
          reject(new Error(resp.error?.description || "Payment failed"))
        );
        rzp.open();
      });

      // 6. Payment verified → go to dashboard
navigate("/payment/success");

    } catch (err) {
      if (err.message === "Payment cancelled") {
        // user closed popup — stay on page, no alert
        setLoading(false);
        return;
      }
      alert(err?.response?.data?.message || err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  const stepOk = () => {
    if (step === 1) return form.title && form.description && form.price;
    if (step === 2) return form.address.street && form.address.city && form.address.state && form.address.pincode;
    return true;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .ap-wrap{display:flex;min-height:100vh;background:#F5F3EE;font-family:'DM Sans',sans-serif;color:#1C1A17}
        /* sidebar */
        .ap-sb{width:240px;background:#1C1A17;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;flex-shrink:0}
        .ap-brand{padding:26px 24px 22px;border-bottom:1px solid #2E2B26;font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:#F5F3EE;letter-spacing:-0.5px}
        .ap-brand em{color:#C8973A;font-style:normal}
        .ap-nav{flex:1;padding:18px 12px;display:flex;flex-direction:column;gap:2px}
        .ap-nl{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;font-size:13.5px;color:#8A8479;text-decoration:none;transition:all .15s}
        .ap-nl:hover{background:#2E2B26;color:#F5F3EE}
        .ap-nl.on{background:#2E2B26;color:#F5F3EE}
        .ap-nl.on::before{content:'';width:3px;height:16px;background:#C8973A;border-radius:2px;margin-right:2px;flex-shrink:0}
        .ap-ni{font-size:15px;width:18px;text-align:center}
        /* main */
        .ap-main{flex:1;padding:36px 44px;max-width:820px}
        .ap-crumb{font-size:12px;color:#9A9488;margin-bottom:10px}
        .ap-crumb a{color:#9A9488;text-decoration:none}
        .ap-crumb a:hover{color:#C8973A}
        .ap-ptitle{font-family:'Fraunces',serif;font-size:28px;font-weight:700;color:#1C1A17;letter-spacing:-.5px;line-height:1.1;margin-bottom:6px}
        .ap-psub{font-size:13px;color:#6B6560;margin-bottom:28px}
        /* steps */
        .ap-steps{display:flex;background:#fff;border:1px solid #E5E1D9;border-radius:12px;overflow:hidden;margin-bottom:24px}
        .ap-step{flex:1;display:flex;align-items:center;gap:9px;padding:13px 16px;cursor:pointer;font-size:12.5px;color:#9A9488;border-right:1px solid #E5E1D9;transition:all .2s;user-select:none}
        .ap-step:last-child{border-right:none}
        .ap-step.on{background:#1C1A17;color:#F5F3EE}
        .ap-step.done{background:#EFF6E8;color:#3A6B1E}
        .ap-sn{width:23px;height:23px;border-radius:50%;background:#E5E1D9;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
        .ap-step.on .ap-sn{background:#C8973A;color:#1C1A17}
        .ap-step.done .ap-sn{background:#3A6B1E;color:#fff}
        /* card */
        .ap-card{background:#fff;border:1px solid #E5E1D9;border-radius:14px;padding:28px}
        .ap-sec-title{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:#1C1A17;margin-bottom:22px;padding-bottom:14px;border-bottom:1px solid #F0EDE6}
        .ap-rows{display:flex;flex-direction:column;gap:18px}
        .ap-g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .ap-g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
        /* field */
        .ap-field{display:flex;flex-direction:column;gap:5px}
        .ap-field-top{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
        .ap-label{font-size:11px;font-weight:600;color:#5A554E;letter-spacing:.4px;text-transform:uppercase}
        .ap-hint{font-size:11px;color:#9A9488}
        .ap-error{font-size:11.5px;color:#B84040;font-weight:500}
        .ap-field input,.ap-field select,.ap-field textarea{padding:10px 12px;border:1.5px solid #E0DCD5;border-radius:8px;font-size:13.5px;background:#FAFAF8;color:#1C1A17;width:100%;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s}
        .ap-field input:focus,.ap-field select:focus,.ap-field textarea:focus{border-color:#C8973A;box-shadow:0 0 0 3px rgba(200,151,58,.12);background:#fff}
        .ap-field input.err,.ap-field textarea.err{border-color:#B84040;box-shadow:0 0 0 3px rgba(184,64,64,.08)}
        .ap-field textarea{resize:vertical;min-height:96px;line-height:1.55}
        .ap-field select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239A9488' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
        /* counter */
        .ap-counter{display:flex;align-items:center;border:1.5px solid #E0DCD5;border-radius:8px;background:#FAFAF8;overflow:hidden;height:42px}
        .ap-counter-btn{width:38px;height:100%;border:none;background:none;font-size:20px;color:#6B6560;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;flex-shrink:0}
        .ap-counter-btn:hover{background:#F0EDE6;color:#1C1A17}
        .ap-counter-val{flex:1;text-align:center;font-size:15px;font-weight:600;color:#1C1A17}
        /* pills */
        .ap-pills{display:flex;gap:8px;flex-wrap:wrap}
        .ap-pill{padding:7px 16px;border-radius:20px;border:1.5px solid #E0DCD5;background:#FAFAF8;font-size:12.5px;font-weight:500;color:#6B6560;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
        .ap-pill:hover{border-color:#1C1A17;color:#1C1A17}
        .ap-pill.sel{background:#1C1A17;color:#F5F3EE;border-color:#1C1A17}
        /* upload */
        .ap-upload{border:2px dashed #D4CFCA;border-radius:10px;padding:28px 20px;text-align:center;background:#FAF9F6;cursor:pointer;transition:all .2s;position:relative}
        .ap-upload:hover{border-color:#C8973A;background:#FFF9F0}
        .ap-upload input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
        .ap-upload-ico{font-size:30px;margin-bottom:8px}
        .ap-upload-ttl{font-size:13.5px;font-weight:600;color:#1C1A17;margin-bottom:3px}
        .ap-upload-sub{font-size:12px;color:#9A9488}
        .ap-thumb-img{width:100%;max-height:220px;object-fit:cover;border-radius:10px;border:1.5px solid #E5E1D9;margin-top:12px;display:block}
        .ap-remove-btn{margin-top:8px;font-size:12px;color:#B84040;background:none;border:none;cursor:pointer;padding:0;font-family:'DM Sans',sans-serif}
        .ap-remove-btn:hover{text-decoration:underline}
        .ap-gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}
        .ap-gitem{position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;border:1.5px solid #E5E1D9}
        .ap-gitem img{width:100%;height:100%;object-fit:cover;display:block}
        .ap-gremove{position:absolute;top:5px;right:5px;width:22px;height:22px;border-radius:50%;background:rgba(28,26,23,.75);color:#fff;border:none;cursor:pointer;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center}
        .ap-gremove:hover{background:#B84040}
        /* footer */
        .ap-footer{display:flex;align-items:center;justify-content:space-between;padding-top:22px;margin-top:22px;border-top:1px solid #F0EDE6}
        .ap-foot-info{font-size:12px;color:#9A9488}
        .ap-foot-btns{display:flex;gap:10px}
        .ap-btn-back{padding:9px 20px;border-radius:8px;border:1.5px solid #D4CFCA;background:none;font-size:13px;font-weight:500;color:#6B6560;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .ap-btn-back:hover{border-color:#1C1A17;color:#1C1A17}
        .ap-btn-next{padding:9px 22px;border-radius:8px;border:none;background:#F0EDE6;font-size:13px;font-weight:600;color:#1C1A17;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .ap-btn-next:hover{background:#E5E1D9}
        .ap-btn-next:disabled{opacity:.4;cursor:not-allowed}
        .ap-btn-sub{padding:10px 26px;border-radius:8px;border:none;background:#C8973A;font-size:13px;font-weight:600;color:#1C1A17;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .ap-btn-sub:hover{background:#B5842E}
        .ap-btn-sub:disabled{opacity:.55;cursor:not-allowed}
        @media(max-width:768px){.ap-wrap{flex-direction:column}.ap-sb{width:100%;height:auto;position:static}.ap-main{padding:20px 16px}.ap-g2,.ap-g3{grid-template-columns:1fr}.ap-gallery{grid-template-columns:repeat(3,1fr)}.ap-step span.ap-sl{display:none}}
      `}</style>

      <div className="ap-wrap">
        <aside className="ap-sb">
          <div className="ap-brand">Nest<em>Find</em></div>
          <nav className="ap-nav">
            <Link to="/seller/dashboard" className="ap-nl"><span className="ap-ni">⊞</span> Overview</Link>
            <Link to="/seller/properties" className="ap-nl"><span className="ap-ni">⌂</span> My Properties</Link>
            <Link to="/seller/add-property" className="ap-nl on"><span className="ap-ni">＋</span> Add Property</Link>
            <Link to="/seller/inquiries" className="ap-nl"><span className="ap-ni">✉</span> Inquiries</Link>
            <Link to="/seller/profile" className="ap-nl"><span className="ap-ni">◎</span> Profile</Link>
          </nav>
        </aside>

        <main className="ap-main">
          <div className="ap-crumb"><Link to="/seller/dashboard">Dashboard</Link> › Add Property</div>
          <h1 className="ap-ptitle">List a new property</h1>
          <p className="ap-psub">Complete all 4 steps. Your listing goes live after payment and admin approval.</p>

          <div className="ap-steps">
            {STEPS.map((s, i) => (
              <div key={s} className={`ap-step${step === i+1 ? " on" : step > i+1 ? " done" : ""}`}
                onClick={() => step > i+1 && setStep(i+1)}>
                <span className="ap-sn">{step > i+1 ? "✓" : i+1}</span>
                <span className="ap-sl">{s}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="ap-card">

              {step === 1 && (
                <div className="ap-rows">
                  <h2 className="ap-sec-title">Basic Information</h2>
                  <Field label="Property title *" error={errors.title}>
                    <input className={errors.title?"err":""} value={form.title}
                      onChange={(e)=>set("title",e.target.value)}
                      placeholder="e.g. Spacious 3 BHK with garden view in Vesu" />
                  </Field>
                  <Field label="Description *" error={errors.description}>
                    <textarea className={errors.description?"err":""} rows={5} value={form.description}
                      onChange={(e)=>set("description",e.target.value)}
                      placeholder="Describe the property — highlights, nearby landmarks, unique features..." />
                  </Field>
                  <div className="ap-g2">
                    <Field label="Asking price (₹) *" error={errors.price}>
                      <input type="number" min="0" className={errors.price?"err":""} value={form.price}
                        onChange={(e)=>set("price",e.target.value)} placeholder="6800000" />
                    </Field>
                    <Field label="Property type *">
                      <select value={form.propertyInfo.propertyType}
                        onChange={(e)=>set("propertyInfo.propertyType",e.target.value)}>
                        {["Residential","Commercial","Apartment","Villa","Plot"].map(t=><option key={t}>{t}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="ap-rows">
                  <h2 className="ap-sec-title">Property Address</h2>
                  <Field label="Street address *" error={errors.street}>
                    <input className={errors.street?"err":""} value={form.address.street}
                      onChange={(e)=>set("address.street",e.target.value)}
                      placeholder="Plot no., building name, road, locality" />
                  </Field>
                  <div className="ap-g2">
                    <Field label="City *" error={errors.city}>
                      <input className={errors.city?"err":""} value={form.address.city}
                        onChange={(e)=>set("address.city",e.target.value)} placeholder="Surat" />
                    </Field>
                    <Field label="State *" error={errors.state}>
                      <input className={errors.state?"err":""} value={form.address.state}
                        onChange={(e)=>set("address.state",e.target.value)} placeholder="Gujarat" />
                    </Field>
                    <Field label="Pincode *" error={errors.pincode}>
                      <input className={errors.pincode?"err":""} value={form.address.pincode}
                        onChange={(e)=>set("address.pincode",e.target.value)} placeholder="395007" maxLength={6} />
                    </Field>
                    <Field label="Country">
                      <input value={form.address.country}
                        onChange={(e)=>set("address.country",e.target.value)} />
                    </Field>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="ap-rows">
                  <h2 className="ap-sec-title">Property Details</h2>
                  <div className="ap-g3">
                    <Field label="Built area (sq.ft)">
                      <input type="number" min="0" value={form.propertyInfo.squareArea}
                        onChange={(e)=>set("propertyInfo.squareArea",e.target.value)} placeholder="1240" />
                    </Field>
                    <Field label="Lot size (sq.ft)">
                      <input type="number" min="0" value={form.propertyInfo.lotSize}
                        onChange={(e)=>set("propertyInfo.lotSize",e.target.value)} placeholder="2400" />
                    </Field>
                    <Field label="Year built *" error={errors.yearBuilt}>
                      <input type="number" className={errors.yearBuilt?"err":""} value={form.propertyInfo.yearBuilt}
                        onChange={(e)=>set("propertyInfo.yearBuilt",e.target.value)}
                        placeholder="2020" min="1900" max={new Date().getFullYear()} />
                    </Field>
                  </div>
                  <div className="ap-g3">
                    <Field label="Bedrooms">
                      <Counter value={form.propertyDetails.bedrooms}
                        onChange={(v)=>set("propertyDetails.bedrooms",v)} />
                    </Field>
                    <Field label="Bathrooms">
                      <Counter value={form.propertyDetails.bathrooms}
                        onChange={(v)=>set("propertyDetails.bathrooms",v)} />
                    </Field>
                    <Field label="Parking spaces">
                      <Counter value={form.propertyDetails.parkingSpaces}
                        onChange={(v)=>set("propertyDetails.parkingSpaces",v)} />
                    </Field>
                  </div>
                  <Field label="Furnishing status">
                    <PillGroup options={["Unfurnished","Semi-Furnished","Furnished"]}
                      value={form.propertyDetails.furnishing}
                      onChange={(v)=>set("propertyDetails.furnishing",v)} />
                  </Field>
                  <div className="ap-g2">
                    <Field label="Kitchen">
                      <PillGroup options={[{value:"true",label:"Yes"},{value:"false",label:"No"}]}
                        value={String(form.propertyDetails.kitchen)}
                        onChange={(v)=>set("propertyDetails.kitchen",v==="true")} />
                    </Field>
                    <Field label="Outdoor space" hint="Max 150 chars">
                      <input value={form.propertyDetails.outdoorSpace}
                        onChange={(e)=>set("propertyDetails.outdoorSpace",e.target.value)}
                        placeholder="Garden, rooftop terrace, balcony..." maxLength={150} />
                    </Field>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="ap-rows">
                  <h2 className="ap-sec-title">Photos</h2>

                  <Field label="Thumbnail — main cover photo" hint="Shown in search results. Choose your best shot.">
                    <div className="ap-upload">
                      <input type="file" accept="image/*" onChange={handleThumbnail} />
                      {!thumbPreview ? (
                        <>
                          <div className="ap-upload-ico">🖼</div>
                          <div className="ap-upload-ttl">Click to upload thumbnail</div>
                          <div className="ap-upload-sub">JPG, PNG, WEBP · max 5 MB</div>
                        </>
                      ) : (
                        <img src={thumbPreview} alt="Thumbnail preview" className="ap-thumb-img" />
                      )}
                    </div>
                    {thumbPreview && (
                      <button type="button" className="ap-remove-btn"
                        onClick={()=>{setThumbnail(null);setThumbPreview(null)}}>✕ Remove thumbnail</button>
                    )}
                  </Field>

                  <Field label="Gallery images" hint="Up to 10 photos — buyers love seeing multiple angles">
                    <div className="ap-upload">
                      <input type="file" accept="image/*" multiple onChange={handleImages} />
                      <div className="ap-upload-ico">📸</div>
                      <div className="ap-upload-ttl">Click to select gallery photos</div>
                      <div className="ap-upload-sub">Multiple files · JPG, PNG, WEBP · max 5 MB each</div>
                    </div>
                    {imgPreviews.length > 0 && (
                      <div className="ap-gallery">
                        {imgPreviews.map((src,i)=>(
                          <div key={i} className="ap-gitem">
                            <img src={src} alt={`Gallery ${i+1}`} />
                            <button type="button" className="ap-gremove" onClick={()=>removeImg(i)}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Field>

                  {/* Payment notice */}
                  <div style={{background:"#FFF9F0",border:"1.5px solid #E8C87A",borderRadius:"10px",padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:"10px"}}>
                    <span style={{fontSize:"18px",lineHeight:1}}>💳</span>
                    <div>
                      <p style={{fontSize:"13px",fontWeight:600,color:"#7A5C1E",margin:"0 0 3px"}}>One-time listing fee: ₹999</p>
                      <p style={{fontSize:"12px",color:"#9A7A3A",margin:0}}>
                        Clicking "Submit &amp; Pay" saves your listing and opens Razorpay Checkout.
                        Your property will appear in your dashboard once payment is confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="ap-footer">
                <span className="ap-foot-info">Step {step} of {STEPS.length}</span>
                <div className="ap-foot-btns">
                  {step > 1 && <button type="button" className="ap-btn-back" onClick={()=>setStep(step-1)}>← Back</button>}
                  {step < 4 && <button type="button" className="ap-btn-next" onClick={()=>setStep(step+1)} disabled={!stepOk()}>Next →</button>}
                  {step === 4 && (
                    <button type="submit" className="ap-btn-sub" disabled={loading}>
                      {loading ? "Opening payment…" : "Submit & Pay ₹999"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}