import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/users/Navbar";
import Footer from "../../components/users/Footer";
import PropertyCard from "../../components/PropertyCard";
import {
  Home, Users, GraduationCap, TreePine,
  ShoppingBag, MapPin, Phone, Mail, Calendar,
  Bed, Bath, Car, Maximize, ChevronLeft, ChevronRight,
  CheckCircle, Loader2, Send,
} from "lucide-react";
import api from "../../api/axios";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n ?? 0);

// ─── Sub-components ───────────────────────────────────────────────────────────
const InfoCard = ({ title, value }) => (
  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
    <p className="text-gray-400 text-sm">{title}</p>
    <p className="font-semibold text-gray-800 text-sm">{value ?? "—"}</p>
  </div>
);

// ─── Contact / Inquiry Modal ──────────────────────────────────────────────────
// Sends an inquiry that appears in the seller's dashboard
function ContactModal({ seller, property, onClose }) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // POST to backend — seller sees this in their dashboard under "Inquiries"
      await api.post("/inquiries", {
        propertyId: property._id,
        sellerId:   seller?._id,
        name,
        email,
        phone,
        message,
      });
      setSent(true);
    } catch (err) {
      console.error("inquiry error:", err);
      setError(err?.response?.data?.message || "Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle size={44} className="mx-auto text-green-500 mb-3" />
            <h3 className="font-bold text-lg">Inquiry Sent!</h3>
            <p className="text-gray-500 text-sm mt-2">
              {seller?.name || "The seller"} will receive your message and get back to you shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-5 bg-black text-white px-6 py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Seller info header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {seller?.name?.[0]?.toUpperCase() ?? "S"}
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Send Inquiry</h3>
                <p className="text-sm text-gray-400">to {seller?.name || "Seller"}</p>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
              />
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                type="email"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number (optional)"
                type="tel"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
              />
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi, I'm interested in "${property?.title}". Can you share more details?`}
                rows={3}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none"
              />

              {/* Direct contact shortcuts */}
              <div className="flex gap-2 mt-1">
                {seller?.contact && (
                  <a
                    href={`tel:${seller.contact}`}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-2 rounded-lg text-xs hover:bg-gray-50 transition"
                  >
                    <Phone size={13} /> Call
                  </a>
                )}
                {seller?.email && (
                  <a
                    href={`mailto:${seller.email}`}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-2 rounded-lg text-xs hover:bg-gray-50 transition"
                  >
                    <Mail size={13} /> Email
                  </a>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white py-3 rounded-lg font-medium mt-1 hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                {loading ? "Sending…" : "Send Inquiry"}
              </button>
            </form>
            <button
              onClick={onClose}
              className="mt-3 w-full text-sm text-gray-400 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Schedule Meeting Modal ───────────────────────────────────────────────────
// Sends a meeting request that appears in the seller's dashboard
function MeetingModal({ property, seller, onClose }) {
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [email,   setEmail]   = useState("");
  const [date,    setDate]    = useState("");
  const [note,    setNote]    = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // POST to backend — seller sees this in their dashboard under "Meeting Requests"
      await api.post("/meetings", {
        propertyId:  property._id,
        sellerId:    seller?._id ?? property.userId?._id,
        name,
        phone,
        email,
        scheduledAt: date,
        note,
      });
      setSent(true);
    } catch (err) {
      console.error("meeting error:", err);
      setError(err?.response?.data?.message || "Failed to schedule meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle size={44} className="mx-auto text-green-500 mb-3" />
            <h3 className="font-bold text-lg">Request Sent!</h3>
            <p className="text-gray-500 text-sm mt-2">
              The seller will review your request and confirm the meeting time.
            </p>
            <button
              onClick={onClose}
              className="mt-5 bg-black text-white px-6 py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg mb-1">Schedule a Meeting</h3>
            <p className="text-sm text-gray-400 mb-5 truncate">{property?.title}</p>

            {error && (
              <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
              />
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                type="tel"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                type="email"
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
              />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Preferred date & time</label>
                <input
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition"
                />
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any specific questions or notes for the seller? (optional)"
                rows={2}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white py-3 rounded-lg font-medium mt-1 hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Calendar size={15} />
                )}
                {loading ? "Sending…" : "Confirm Meeting Request"}
              </button>
            </form>
            <button
              onClick={onClose}
              className="mt-3 w-full text-sm text-gray-400 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
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
  const { id } = useParams();

  const [property,          setProperty]         = useState(null);
  const [loading,           setLoading]           = useState(true);
  const [selectedImage,     setSelectedImage]     = useState("");
  const [imgIdx,            setImgIdx]            = useState(0);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [showContact,       setShowContact]       = useState(false);
  const [showMeeting,       setShowMeeting]       = useState(false);

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
      const firstImg = p?.thumbnail || p?.images?.[0] || "";
      setSelectedImage(firstImg);
      setImgIdx(0);

      if (p?.propertyInfo?.propertyType) {
        fetchRelated(p.propertyInfo.propertyType, p._id);
      }
    } catch (err) {
      console.error("fetchProperty:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (propertyType, currentId) => {
    try {
      const res = await api.get(`/properties?type=${propertyType}&limit=4`);
      const filtered = (res.data.properties || [])
        .filter((item) => item._id !== currentId)
        .slice(0, 3);
      setRelatedProperties(filtered);
    } catch (err) {
      console.error("fetchRelated:", err);
    }
  };

  const allImages = property
    ? [property.thumbnail, ...(property.images || [])].filter(Boolean)
    : [];

  const goNext = () => {
    const next = (imgIdx + 1) % allImages.length;
    setImgIdx(next);
    setSelectedImage(allImages[next]);
  };
  const goPrev = () => {
    const prev = (imgIdx - 1 + allImages.length) % allImages.length;
    setImgIdx(prev);
    setSelectedImage(allImages[prev]);
  };

  if (loading) return <Spinner />;
  if (!property) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Property not found.</p>
    </div>
  );

  const propertyInfoRows = [
    { title: "Property Type", value: property.propertyInfo?.propertyType },
    { title: "Lot Size",      value: property.propertyInfo?.lotSize      },
    { title: "Square Area",   value: property.propertyInfo?.squareArea ? `${property.propertyInfo.squareArea} sq.ft` : null },
    { title: "Year Built",    value: property.propertyInfo?.yearBuilt    },
  ];

  const propertyDetailRows = [
    { title: "Bedrooms",       value: property.propertyDetails?.bedrooms      },
    { title: "Bathrooms",      value: property.propertyDetails?.bathrooms     },
    { title: "Furnishing",     value: property.propertyDetails?.furnishing    },
    { title: "Kitchen",        value: property.propertyDetails?.kitchen ? "Available" : "No" },
    { title: "Parking Spaces", value: property.propertyDetails?.parkingSpaces },
    { title: "Outdoor Space",  value: property.propertyDetails?.outdoorSpace  },
  ];

  const quickStats = [
    { icon: Bed,      label: `${property.propertyDetails?.bedrooms ?? 0} Beds`   },
    { icon: Bath,     label: `${property.propertyDetails?.bathrooms ?? 0} Baths`  },
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
            <span>Property Listing</span>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">{property.title}</span>
          </p>

          {/* ── Image Gallery ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1 flex lg:flex-col gap-3 overflow-auto">
              {allImages.map((img, i) => (
                <img
                  key={i} src={img} alt=""
                  onClick={() => { setSelectedImage(img); setImgIdx(i); }}
                  className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-2 transition flex-shrink-0 ${
                    selectedImage === img ? "border-black" : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              ))}
            </div>

            <div className="lg:col-span-4 relative group">
              <img
                src={selectedImage || property.thumbnail}
                alt={property.title}
                className="w-full h-[480px] object-cover rounded-2xl"
              />
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

          {/* ── Quick stats strip ── */}
          <div className="flex flex-wrap gap-4 mt-6 bg-gray-50 rounded-xl px-6 py-4">
            {quickStats.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
                <Icon size={15} className="text-gray-400" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
            <div className="ml-auto">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                property.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : property.status === "Sold"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {property.status}
              </span>
            </div>
          </div>

          {/* ── Main content grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">

            {/* LEFT: details */}
            <div className="md:col-span-2 space-y-10">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-gray-400 mt-2 text-sm">
                  <MapPin size={14} />
                  <span>
                    {property.address?.street}, {property.address?.city}, {property.address?.state} — {property.address?.pincode}
                  </span>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-4 text-gray-800">Property Info</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {propertyInfoRows.map((item, i) => (
                    <InfoCard key={i} title={item.title} value={item.value} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-bold text-lg mb-4 text-gray-800">Property Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {propertyDetailRows.map((item, i) => (
                    <InfoCard key={i} title={item.title} value={item.value} />
                  ))}
                </div>
              </div>

              {/* Map */}
              <div>
                <h2 className="font-bold text-lg mb-4 text-gray-800">Location Map</h2>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200">
                  <iframe
                    title="property-map"
                    loading="lazy"
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

            {/* RIGHT: price + seller */}
            <div className="space-y-5 md:sticky md:top-28 self-start">

              {/* Price card */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Total Price</p>
                <h2 className="text-3xl font-bold mt-1 text-gray-900">{fmtPrice(property.price)}</h2>
                {property.propertyInfo?.squareArea && (
                  <p className="text-sm text-gray-400 mt-1">
                    ≈ {fmtPrice(Math.round(property.price / property.propertyInfo.squareArea))} / sq.ft
                  </p>
                )}
                <button
                  onClick={() => setShowMeeting(true)}
                  className="w-full mt-5 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <Calendar size={15} /> Schedule Meeting
                </button>
              </div>

              {/* Seller card */}
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
                {/* Button now opens inquiry form, not raw contact */}
                <button
                  onClick={() => setShowContact(true)}
                  className="w-full mt-4 bg-white border border-gray-300 text-gray-800 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={14} /> Send Inquiry
                </button>
              </div>

              {/* Address card */}
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

          {/* ── Related properties ── */}
          {relatedProperties.length > 0 && (
            <section className="mt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Related Properties</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Similar {property.propertyInfo?.propertyType} listings you might like
                  </p>
                </div>
                <span className="text-sm text-gray-400">{relatedProperties.length} found</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProperties.map((item) => (
                  <PropertyCard key={item._id} data={item} />
                ))}
              </div>
            </section>
          )}

        </div>
      </section>

      <Footer />

      {/* Modals */}
      {showContact && (
        <ContactModal
          seller={property.userId}
          property={property}
          onClose={() => setShowContact(false)}
        />
      )}
      {showMeeting && (
        <MeetingModal
          property={property}
          seller={property.userId}
          onClose={() => setShowMeeting(false)}
        />
      )}
    </div>
  );
};

export default Property;