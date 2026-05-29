// models/PropertyDraft.js
// Temporary storage of property form data while seller completes payment.
// Once Razorpay payment is verified → real Property is created from this draft.
// Draft is deleted after Property creation, or auto-expired after 2 hours.

const mongoose = require("mongoose");

const propertyDraftSchema = new mongoose.Schema(
  {
    sellerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    // Full property form data — mirrors Property model fields
    formData: {
      type:     mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Cloudinary URLs uploaded before the Razorpay popup opens
    thumbnail: { type: String, default: "" },
    images:    [{ type: String }],

    // Razorpay Order ID — used in /verify to find this draft
    // Unique so duplicate webhooks / double-submits are rejected
    razorpayOrderId: { type: String, required: true, unique: true },

    // Amount charged in INR (e.g. 999)
    listingFee: { type: Number, required: true },

    // Auto-delete after 2 hours if seller never completes payment
    expiresAt: {
      type:    Date,
      default: () => new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
  },
  { timestamps: true, versionKey: false }
);

// TTL index — MongoDB removes expired drafts automatically
propertyDraftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PropertyDraft", propertyDraftSchema);