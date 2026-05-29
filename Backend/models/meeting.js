// models/Meeting.js

const mongoose =
  require("mongoose");

const meetingSchema =
  new mongoose.Schema(
    {
      propertyId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
      },
agentId: 
{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      sellerId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
      },

      scheduledAt: {
        type: Date,
        required: true,
      },

      note: {
        type: String,
        default: "",
        trim: true,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "confirmed",
          "cancelled",
          "completed",
        ],
        default: "pending",
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

// Indexes
meetingSchema.index({
  sellerId: 1,
  status: 1,
});

meetingSchema.index({
  propertyId: 1,
});

module.exports =
  mongoose.model(
    "Meeting",
    meetingSchema
  );