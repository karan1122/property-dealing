import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/users/Navbar";
import Footer from "../../components/users/Footer";
import PropertyCard from "../../components/PropertyCard";
import { useAuth } from "../../context/AuthContext";
import {
  Home, Users, GraduationCap, TreePine,
  ShoppingBag, MapPin, Phone, Mail, Calendar,
  Bed, Bath, Car, Maximize, ChevronLeft, ChevronRight,
  CheckCircle, Loader2, Send, Lock,
} from "lucide-react";
import api from "../../api/axios";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n ?? 0);

const InfoCard = ({ title, value }) => (
  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
    <p className="text-gray-400 text-sm">{title}</p>
    <p className="font-semibold text-gray-800 text-sm">{value ?? "—"}</p>
  </div>
);

const features = [
  { icon: Home,          title: "Residential Property", value: "Verified premium property listing."       },
  { icon: Users,         title: "Neighbourhood",        value: "Safe and well-connected locality."        },
  { icon: GraduationCap, title: "Schools",              value: "Nearby educational facilities available." },
  { icon: TreePine,      title: "Recreation",           value: "Parks and recreation areas nearby."       },
  { icon: ShoppingBag,   title: "Shopping",             value: "Shopping malls and markets nearby."       },
  { icon: MapPin,        title: "Accessibility",        value: "Easy access to roads and transport."      },
];

// ─── Login Required Gate ───────────────────────────────────────────────────────
// Shows when buyer tries to contact/schedule without being logged in
function LoginRequiredModal({ action, onClose }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-gray-400" />
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">Login Required</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          You need to be logged in as a <strong>buyer</strong> to{" "}
          {action === "inquiry" ? "send an inquiry" : "schedule a meeting"}.
          Please log in or create an account to continue.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/auth/login")}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition text-sm"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/auth/register")}
            className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
          >
            Create Account
          </button>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 mt-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Wrong Role Gate ───────────────────────────────────────────────────────────
// Shows when a seller/agent/admin tries to send inquiry (only buyers can)
function WrongRoleModal({ role, action, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🚫</span>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">Not Available for {role}s</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Only <strong>buyers</strong> can {action === "inquiry" ? "send inquiries" : "schedule meetings"}.
          You are logged in as a <strong>{role}</strong>.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition text-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// ─── Contact / Inquiry Modal ───────────────────────────────────────────────────
function ContactModal({ seller, property, user, onClose }) {
  const [form, setForm]     = useState({ name: user?.name || "", email: user?.email || "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/inquiries", {
        propertyId: property._id,
        sellerId:   seller?._id || property.userId?._id,
        name:       form.name,
        email:      form.email,
        phone:      form.phone,
        message:    form.message,
      });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle size={44} className="mx-auto text-green-500 mb-3" />
            <h3 className="font-bold text-lg">Inquiry Sent!</h3>
            <p className="text-gray-500 text-sm mt-2">
              The assigned agent will contact you shortly regarding this property.
            </p>
            <button onClick={onClose} className="mt-5 bg-black text-white px-6 py-2 rounded-lg text-sm">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {seller?.name?.[0]?.toUpperCase() ?? "S"}
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Send Inquiry</h3>
                <p className="text-sm text-gray-400">about {property?.title}</p>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input required value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="Your name"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition" />
              <input required type="email" value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="Your email"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition" />
              <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="Phone number (optional)"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition" />
              <textarea required rows={3} value={form.message} onChange={e => set("message", e.target.value)}
                placeholder={`Hi, I'm interested in "${property?.title}". Can you share more details?`}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />

              {/* Direct contact shortcuts */}
              {(seller?.contact || seller?.email) && (
                <div className="flex gap-2">
                  {seller?.contact && (
                    <a href={`tel:${seller.contact}`}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2 rounded-lg text-xs hover:bg-gray-50 transition">
                      <Phone size={12} /> {seller.contact}
                    </a>
                  )}
                  {seller?.email && (
                    <a href={`mailto:${seller.email}`}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2 rounded-lg text-xs hover:bg-gray-50 transition">
                      <Mail size={12} /> Email
                    </a>
                  )}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="bg-black text-white py-3 rounded-lg font-medium mt-1 hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {loading ? "Sending…" : "Send Inquiry"}
              </button>
            </form>
            <button onClick={onClose} className="mt-3 w-full text-sm text-gray-400 hover:text-gray-700 transition">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Schedule Meeting Modal ────────────────────────────────────────────────────
function MeetingModal({ property, seller, user, onClose }) {
  const [form, setForm]       = useState({ name: user?.name || "", phone: "", email: user?.email || "", date: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Send as an inquiry with visit details in message
      await api.post("/inquiries", {
        propertyId: property._id,
        sellerId:   seller?._id || property.userId?._id,
        name:       form.name,
        email:      form.email,
        phone:      form.phone,
        message:    `Visit request for: ${new Date(form.date).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}${form.note ? `. Note: ${form.note}` : ""}`,
      });
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to schedule meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle size={44} className="mx-auto text-green-500 mb-3" />
            <h3 className="font-bold text-lg">Visit Requested!</h3>
            <p className="text-gray-500 text-sm mt-2">The agent will confirm your visit timing shortly.</p>
            <button onClick={onClose} className="mt-5 bg-black text-white px-6 py-2 rounded-lg text-sm">Close</button>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg mb-1">Schedule a Visit</h3>
            <p className="text-sm text-gray-400 mb-5 truncate">{property?.title}</p>

            {error && (
              <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input required value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="Your name"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition" />
              <input required type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="Phone number"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition" />
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="Email (optional)"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition" />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Preferred date & time *</label>
                <input required type="datetime-local" value={form.date} onChange={e => set("date", e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition" />
              </div>
              <textarea rows={2} value={form.note} onChange={e => set("note", e.target.value)}
                placeholder="Any specific questions or notes? (optional)"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none" />

              <button type="submit" disabled={loading}
                className="bg-black text-white py-3 rounded-lg font-medium mt-1 hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Calendar size={15} />}
                {loading ? "Sending…" : "Confirm Visit Request"}
              </button>
            </form>
            <button onClick={onClose} className="mt-3 w-full text-sm text-gray-400 hover:text-gray-700 transition">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Loading property…</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Property = () => {
  const { id }       = useParams();
  const { user }     = useAuth(); // ← get logged in user

  const [property,          setProperty]         = useState(null);
  const [loading,           setLoading]           = useState(true);
  const [selectedImage,     setSelectedImage]     = useState("");
  const [imgIdx,            setImgIdx]            = useState(0);
  const [relatedProperties, setRelatedProperties] = useState([]);

  // Modal state
  const [modalState, setModalState] = useState(null);
  // null | "contact" | "meeting" | "login_required_contact" | "login_required_meeting" | "wrong_role_contact" | "wrong_role_meeting"

  useEffect(() => {
    fetchProperty();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/properties/${id}`);
      const p   = res.data.property;
      setProperty(p);
      setSelectedImage(p?.thumbnail || p?.images?.[0] || "");
      setImgIdx(0);
      if (p?.propertyInfo?.propertyType) fetchRelated(p.propertyInfo.propertyType, p._id);
    } catch (err) {
      console.error("fetchProperty:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (propertyType, currentId) => {
    try {
      const res      = await api.get(`/properties?type=${propertyType}&limit=4`);
      const filtered = (res.data.properties || []).filter(item => item._id !== currentId).slice(0, 3);
      setRelatedProperties(filtered);
    } catch (err) {
      console.error("fetchRelated:", err);
    }
  };

  // ── Auth guard before opening any modal ────────────────────────────────────
  const openModal = (action) => {
    // Not logged in at all
    if (!user) {
      setModalState(action === "contact" ? "login_required_contact" : "login_required_meeting");
      return;
    }
    // Logged in but wrong role — only buyers can inquire/schedule
    if (user.role !== "buyer") {
      setModalState(action === "contact" ? "wrong_role_contact" : "wrong_role_meeting");
      return;
    }
    // All good — open the actual modal
    setModalState(action);
  };

  const allImages = property
    ? [property.thumbnail, ...(property.images || [])].filter(Boolean)
    : [];

  const goNext = () => { const n = (imgIdx + 1) % allImages.length; setImgIdx(n); setSelectedImage(allImages[n]); };
  const goPrev = () => { const p = (imgIdx - 1 + allImages.length) % allImages.length; setImgIdx(p); setSelectedImage(allImages[p]); };

  if (loading)   return <Spinner />;
  if (!property) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Property not found.</p>
    </div>
  );

  const propertyInfoRows = [
    { title: "Property Type", value: property.propertyInfo?.propertyType },
    { title: "Lot Size",      value: property.propertyInfo?.lotSize },
    { title: "Square Area",   value: property.propertyInfo?.squareArea ? `${property.propertyInfo.squareArea} sq.ft` : null },
    { title: "Year Built",    value: property.propertyInfo?.yearBuilt },
  ];

  const propertyDetailRows = [
    { title: "Bedrooms",       value: property.propertyDetails?.bedrooms },
    { title: "Bathrooms",      value: property.propertyDetails?.bathrooms },
    { title: "Furnishing",     value: property.propertyDetails?.furnishing },
    { title: "Kitchen",        value: property.propertyDetails?.kitchen ? "Available" : "No" },
    { title: "Parking Spaces", value: property.propertyDetails?.parkingSpaces },
    { title: "Outdoor Space",  value: property.propertyDetails?.outdoorSpace },
  ];

  const quickStats = [
    { icon: Bed,      label: `${property.propertyDetails?.bedrooms ?? 0} Beds` },
    { icon: Bath,     label: `${property.propertyDetails?.bathrooms ?? 0} Baths` },
    { icon: Car,      label: `${property.propertyDetails?.parkingSpaces ?? 0} Parking` },
    { icon: Maximize, label: property.propertyInfo?.squareArea ? `${property.propertyInfo.squareArea} sq.ft` : "—" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <p className="text-sm text-gray-400 mb-6">
            Property Listing <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">{property.title}</span>
          </p>

          {/* Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1 flex lg:flex-col gap-3 overflow-auto">
              {allImages.map((img, i) => (
                <img key={i} src={img} alt=""
                  onClick={() => { setSelectedImage(img); setImgIdx(i); }}
                  className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-2 transition flex-shrink-0 ${
                    selectedImage === img ? "border-black" : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              ))}
            </div>
            <div className="lg:col-span-4 relative group">
              <img src={selectedImage || property.thumbnail} alt={property.title}
                className="w-full h-[480px] object-cover rounded-2xl" />
              {allImages.length > 1 && (
                <>
                  <button onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition">
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                    {imgIdx + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-6 bg-gray-50 rounded-xl px-6 py-4">
            {quickStats.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
                <Icon size={15} className="text-gray-400" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
            <div className="ml-auto">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                property.status === "Available" ? "bg-green-100 text-green-700"
                : property.status === "Sold"    ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"}`}>
                {property.status}
              </span>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">

            {/* LEFT */}
            <div className="md:col-span-2 space-y-10">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-gray-400 mt-2 text-sm">
                  <MapPin size={14} />
                  <span>{property.address?.street}, {property.address?.city}, {property.address?.state} — {property.address?.pincode}</span>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-4 text-gray-800">Property Info</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {propertyInfoRows.map((item, i) => <InfoCard key={i} title={item.title} value={item.value} />)}
                </div>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-4 text-gray-800">Property Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {propertyDetailRows.map((item, i) => <InfoCard key={i} title={item.title} value={item.value} />)}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="font-bold text-lg mb-4 text-gray-800">Features & Surroundings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map(({ icon: Icon, title, value }) => (
                    <div key={title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div>
                <h2 className="font-bold text-lg mb-4 text-gray-800">Location Map</h2>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200">
                  <iframe
                    title="property-map" loading="lazy"
                    className="absolute inset-0 w-full h-full border-0"
                    src={
                      property.address?.coordinates?.latitude && property.address?.coordinates?.longitude
                        ? `https://www.google.com/maps?q=${property.address.coordinates.latitude},${property.address.coordinates.longitude}&output=embed`
                        : `https://www.google.com/maps?q=${encodeURIComponent(
                            `${property.address?.street}, ${property.address?.city}, ${property.address?.state}, ${property.address?.pincode}, ${property.address?.country}`
                          )}&output=embed`
                    }
                  />
                </div>
                <a
                  href={
                    property.address?.coordinates?.latitude && property.address?.coordinates?.longitude
                      ? `https://www.google.com/maps?q=${property.address.coordinates.latitude},${property.address.coordinates.longitude}`
                      : `https://www.google.com/maps/search/${encodeURIComponent(
                          `${property.address?.street}, ${property.address?.city}, ${property.address?.state}, ${property.address?.pincode}`
                        )}`
                  }
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-600 hover:underline"
                >
                  <MapPin size={13} /> Open in Google Maps
                </a>
              </div>
            </div>

            {/* RIGHT — sticky sidebar */}
            <div className="space-y-5 md:sticky md:top-28 self-start">

              {/* Price */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Total Price</p>
                <h2 className="text-3xl font-bold mt-1 text-gray-900">{fmtPrice(property.price)}</h2>
                {property.propertyInfo?.squareArea && (
                  <p className="text-sm text-gray-400 mt-1">
                    ≈ {fmtPrice(Math.round(property.price / property.propertyInfo.squareArea))} / sq.ft
                  </p>
                )}
                <button
                  onClick={() => openModal("meeting")}
                  className="w-full mt-5 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <Calendar size={15} /> Schedule Visit
                </button>
                {/* Hint for non-buyers */}
                {!user && (
                  <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                    <Lock size={10} /> Login as buyer to schedule
                  </p>
                )}
              </div>

              {/* Seller */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-4">Listed by Seller</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                    {property.userId?.name?.[0]?.toUpperCase() ?? "S"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{property.userId?.name || "Seller"}</p>
                    <p className="text-xs text-gray-400">{property.userId?.email || "—"}</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal("contact")}
                  className="w-full mt-4 bg-white border border-gray-300 text-gray-800 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={14} /> Send Inquiry
                </button>
                {/* Hint for non-buyers */}
                {!user && (
                  <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                    <Lock size={10} /> Login as buyer to inquire
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">Address</p>
                <div className="text-sm text-gray-700 leading-relaxed space-y-1">
                  <p>{property.address?.street}</p>
                  <p>{property.address?.city}, {property.address?.state}</p>
                  <p>PIN: {property.address?.pincode}</p>
                  <p>{property.address?.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related */}
          {relatedProperties.length > 0 && (
            <section className="mt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Related Properties</h2>
                  <p className="text-gray-400 text-sm mt-1">Similar {property.propertyInfo?.propertyType} listings</p>
                </div>
                <span className="text-sm text-gray-400">{relatedProperties.length} found</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProperties.map(item => <PropertyCard key={item._id} data={item} />)}
              </div>
            </section>
          )}

        </div>
      </section>

      <Footer />

      {/* ── Modals — all guarded by auth ── */}

      {/* Not logged in */}
      {(modalState === "login_required_contact" || modalState === "login_required_meeting") && (
        <LoginRequiredModal
          action={modalState === "login_required_contact" ? "inquiry" : "meeting"}
          onClose={() => setModalState(null)}
        />
      )}

      {/* Wrong role */}
      {(modalState === "wrong_role_contact" || modalState === "wrong_role_meeting") && (
        <WrongRoleModal
          role={user?.role}
          action={modalState === "wrong_role_contact" ? "inquiry" : "meeting"}
          onClose={() => setModalState(null)}
        />
      )}

      {/* Actual modals — only shown when user is a buyer */}
      {modalState === "contact" && (
        <ContactModal
          seller={property.userId}
          property={property}
          user={user}
          onClose={() => setModalState(null)}
        />
      )}
      {modalState === "meeting" && (
        <MeetingModal
          property={property}
          seller={property.userId}
          user={user}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
};

export default Property;