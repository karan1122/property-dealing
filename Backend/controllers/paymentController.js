// controllers/paymentController.js
const Razorpay      = require("razorpay");
const crypto        = require("crypto");
const cloudinary    = require("cloudinary").v2;
const fs            = require("fs");
const PropertyDraft = require("../models/PropertyDraft");
const Property      = require("../models/Property");
const User          = require("../models/User");
const Fee           = require("../models/Fee");          // ← NEW

// ── Razorpay client ───────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Listing fee in INR — set in .env or default ₹999
const LISTING_FEE = Number(process.env.LISTING_FEE_INR) || 999;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, { folder: "realestate" });
  try { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); } catch {}
  return result.secure_url;
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/create-order
// Called when seller clicks "Submit & Pay" on the Add Property form.
// Accepts multipart/form-data.
// Uploads images to Cloudinary, saves PropertyDraft, creates Razorpay order.
// Returns { orderId, amount, currency, keyId, draftId }
// Frontend opens the Razorpay popup — NO page redirect.
// ─────────────────────────────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    
    const seller = await User.findById(req.user.sub).select("name email phone");
    if (!seller)
      return res.status(404).json({ success: false, message: "Seller not found" });

    // ── Parse form data ──────────────────────────────────────────────────────
    let formData = {};
    if (req.body.data) {
      try { formData = JSON.parse(req.body.data); } catch {}
    }

    // ── Upload images to Cloudinary (safe even if payment is abandoned) ──────
    let thumbnail = "";
    let images    = [];

    if (req.files?.thumbnail?.[0]) {
      thumbnail = await uploadToCloudinary(req.files.thumbnail[0]);
    }
    if (req.files?.images?.length) {
      images = await Promise.all(req.files.images.map(uploadToCloudinary));
    }

    // ── Create Razorpay order ────────────────────────────────────────────────
    const order = await razorpay.orders.create({
      amount:   LISTING_FEE * 100,          // paise — ₹999 → 99900
      currency: "INR",
      receipt:  `listing_${Date.now()}`,
      notes: {
        sellerId: String(req.user.sub),
        title:    formData.title || "",
      },
    });

    // ── Save PropertyDraft with Razorpay order ID ────────────────────────────
    const draft = await PropertyDraft.create({
      sellerId:        req.user.sub,
      formData,
      thumbnail,
      images,
      razorpayOrderId: order.id,
      listingFee:      LISTING_FEE,
    });

    res.json({
      success:  true,
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
      draftId:  draft._id,
    });
  } catch (err) {
    console.error("createOrder:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/verify
// Called by frontend after Razorpay popup reports success.
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, draftId }
//
// Flow:
//   1. Verify HMAC signature
//   2. Find PropertyDraft
//   3. Idempotency check (property already created?)
//   4. Create Property  (status = Pending)
//   5. Create Fee       (status = paid, linked to seller + property + Razorpay)  ← NEW
//   6. Delete draft
// ─────────────────────────────────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      draftId,
    } = req.body;

    // ── 1. Verify HMAC signature ─────────────────────────────────────────────
    const body     = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed — invalid signature",
      });
    }

    // ── 2. Find draft ────────────────────────────────────────────────────────
    const draft = await PropertyDraft.findById(draftId);
    if (!draft) {
      return res.status(404).json({
        success: false,
        message: "Draft not found — may have already been processed",
      });
    }

    // ── 3. Guard: same seller ────────────────────────────────────────────────
    if (String(draft.sellerId) !== String(req.user.sub)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // ── 4. Idempotency: property already created for this order? ────────────
    const existing = await Property.findOne({ razorpayOrderId: razorpay_order_id });
    if (existing) {
      return res.json({ success: true, propertyId: existing._id, alreadyCreated: true });
    }

    // ── 5. Promote draft → real Property ────────────────────────────────────
    const property = await Property.create({
      ...draft.formData,
      userId:              draft.sellerId,
      thumbnail:           draft.thumbnail,
      images:              draft.images,
      status:              "Pending",
      isApprovedByCompany: false,
      isActive:            true,
      listingFeePaid:      true,
      razorpayOrderId:     razorpay_order_id,
      razorpayPaymentId:   razorpay_payment_id,
    });

    console.log(`✅ Property created: ${property._id} (seller: ${draft.sellerId})`);

    // ── 6. Auto-create Fee record (status = paid immediately) ────────────────
    //    This is what shows up in the Admin → Seller Fees tab.
    await Fee.create({
      sellerId:          draft.sellerId,
      propertyId:        property._id,          // linked to the new property
      feeType:           "Listing Fee",
      amount:            draft.listingFee,       // ₹999 (or whatever was set)
      status:            "paid",                 // already paid via Razorpay
      paidAt:            new Date(),
      dueDate:           new Date(),             // was due now, already settled
      razorpayOrderId:   razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      notes:             `Auto-created after Razorpay payment for "${draft.formData?.title || "property"}"`,
    });

    console.log(`💰 Fee record created for seller: ${draft.sellerId}, property: ${property._id}`);

    // ── 7. Delete draft ──────────────────────────────────────────────────────
    await PropertyDraft.deleteOne({ _id: draft._id });

    res.json({ success: true, propertyId: property._id });

  } catch (err) {
    console.error("verifyPayment:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments/fee-amount  (public)
// ─────────────────────────────────────────────────────────────────────────────
exports.getFeeAmount = async (req, res) => {
  res.json({ success: true, amount: LISTING_FEE, currency: "INR" });
};