const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
  propertyId:     { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  agentId:        { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
  sellerId:       { type: mongoose.Schema.Types.ObjectId, ref: "User",     required: true },
  inquiryId:      { type: mongoose.Schema.Types.ObjectId, ref: "Inquiry"               },
  salePrice:      { type: Number, required: true },
  percentage:     { type: Number, default: 2 }, // 2% fixed
  amount:         { type: Number, required: true }, // salePrice * 2 / 100
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  paidAt: { type: Date },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Commission", commissionSchema);