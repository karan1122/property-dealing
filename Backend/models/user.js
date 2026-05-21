const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, "Name is required"],
      trim:      true,
      minlength: [2,  "Name must be at least 2 characters"],
      maxlength: [60, "Name too long"],
    },

    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    contact: {
      type:     String,
      required: [true, "Phone number is required"],
      match:    [/^[0-9]{10}$/, "Enter a valid 10-digit phone number"],
      trim:     true,
    },

    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select:    false,   // never returned in queries unless explicitly requested
    },

    role: {
      type:    String,
      enum:    ["buyer", "seller", "agent", "admin"],
      default: "buyer",
    },

    // ── Seller fields ──────────────────────────────────────────
    isApprovedByAdmin: {
      type:    Boolean,
      default: false,   // admin must approve seller before listings go live
    },
    agencyName: {
      type:    String,
      default: "",
    },

    // ── Agent fields ───────────────────────────────────────────
    specialization: {
      type:    String,
      enum:    ["Residential","Commercial","Luxury","Rental","Plots & Land","Industrial",""],
      default: "",
    },
    bio: {
      type:    String,
      default: "",
    },

    // ── Seller → Agent assignment ──────────────────────────────
    assignedAgent: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "User",
      default: null,
    },

    // ── Refresh tokens (array for multi-device) ────────────────
    refreshTokens: {
      type:    [String],
      default: [],
      select:  false,
    },

    // ── Account status ─────────────────────────────────────────
    isActive: {
      type:    Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);

/* ── Indexes ── */
userSchema.index({ role: 1 });
userSchema.index({ assignedAgent: 1 });

/* ── Hash password before save ──
   Skipped when password field was not modified (e.g. updating name/email)
*/
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt    = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/* ── Compare plaintext password with stored hash ── */
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

/* ── Safe public JSON (strips sensitive fields) ── */
userSchema.methods.toPublicJSON = function () {
  return {
    _id:               this._id,
    name:              this.name,
    email:             this.email,
    contact:           this.contact,
    role:              this.role,
    isApprovedByAdmin: this.isApprovedByAdmin,
    agencyName:        this.agencyName,
    specialization:    this.specialization,
    bio:               this.bio,
    assignedAgent:     this.assignedAgent,
    isActive:          this.isActive,
    lastLogin:         this.lastLogin,
    createdAt:         this.createdAt,
    updatedAt:         this.updatedAt,
  };
};

module.exports = mongoose.model("User", userSchema);