// models/Fee.js
// Tracks every listing fee charged to a seller.
//
// Two creation paths:
//   AUTO  — verifyPayment() creates this after Razorpay payment succeeds.
//           status is immediately "paid", razorpayPaymentId is populated.
//   MANUAL — admin creates via POST /admin/fees (for edge cases / retro charges).
//           status starts as "unpaid".

const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    // ── Who & what ─────────────────────────────────────────────────────────
    sellerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      index:    true,
    },

    propertyId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref:   "Property",
      default: null,   // null until property is created (auto path sets it immediately)
    },

    // ── Fee metadata ────────────────────────────────────────────────────────
    feeType: {
      type:    String,
      enum:    ["Listing Fee", "Renewal Fee", "Premium Upgrade", "Penalty", "Other"],
      default: "Listing Fee",
    },

    amount: {
      type:     Number,
      required: true,
      min:      0,
    },

    // ── Status ──────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ["unpaid", "paid", "waived"],
      default: "unpaid",
      index:   true,
    },

    paidAt: {
      type:    Date,
      default: null,   // set when status → "paid"
    },

    dueDate: {
      type:    Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },

    // ── Razorpay refs (populated on auto-created fees) ──────────────────────
    razorpayOrderId: {
      type:    String,
      default: "",
      index:   true,  // allows fast lookup from admin panel
    },

    razorpayPaymentId: {
      type:    String,
      default: "",
    },

    // ── Admin notes (manual fees / waive reason) ────────────────────────────
    notes: {
      type:    String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true, versionKey: false }
);

// Compound index: fast per-seller fee history queries
feeSchema.index({ sellerId: 1, createdAt: -1 });
feeSchema.index({ status: 1, dueDate: 1 });       // overdue query: status=unpaid, dueDate < now

module.exports = mongoose.model("Fee", feeSchema);