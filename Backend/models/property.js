const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
      },
    },

    propertyInfo: {
      propertyType: {
        type: String,
        enum: ["Residential", "Commercial", "Apartment", "Villa", "Plot"],
        required: true,
      },

      lotSize: {
        type: Number,
      },

      squareArea: {
        type: Number,
      },

      yearBuilt: {
        type: Number,
        required: true,
      },
    },

    propertyDetails: {
      bedrooms: {
        type: Number,
        default: 0,
        required: true,
      },

      bathrooms: {
        type: Number,
        default: 0,
      },

      furnishing: {
        type: String,
        enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
        default: "Unfurnished",
      },

      kitchen: {
        type: Boolean,
        default: false,
      },

      parkingSpaces: {
        type: Number,
        default: 0,
      },

      outdoorSpace: {
        type: String,
      },
    },

    images: [
      {
        type: String,
      },
    ],

    thumbnail: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Available", "Sold", "Pending"],
      default: "Available",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isApprovedByCompany: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Property", propertySchema);
