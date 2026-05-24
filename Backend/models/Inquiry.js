const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  sellerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
  agentId:    { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
  // Buyer details (not logged in — just form fields)
  buyerName:  { type: String, required: true },
  buyerEmail: { type: String, required: true },
  buyerPhone: { type: String, default: "" },
  message:    { type: String, required: true },
  status: {
    type: String,
    enum: ["new", "contacted", "visit_scheduled", "negotiating", "closed", "lost"],
    default: "new",
  },
  agentNote:  { type: String, default: "" },
  closedAt:   { type: Date },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Inquiry", inquirySchema);