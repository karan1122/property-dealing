const Property  = require("../models/Property");
const cloudinary = require("cloudinary").v2;
const fs         = require("fs");

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Upload a local file to Cloudinary, then delete temp file ─────────────────
const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, { folder: "realestate" });
  
  // ── Safely delete temp file after upload ──────────────────────────────
  try {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  } catch (unlinkErr) {
    console.warn("Could not delete temp file:", file.path, unlinkErr.message);
    // Non-fatal — file will be cleaned up eventually, don't crash
  }

  return result.secure_url;
};

// ── Extract Cloudinary public_id from a secure URL ────────────────────────────
// e.g. https://res.cloudinary.com/xxx/image/upload/v123/realestate/abc.jpg
//   → realestate/abc
const getPublicId = (url) => {
  try {
    // Extract everything after /upload/
    // e.g. https://res.cloudinary.com/xxx/image/upload/v123456/realestate/abc.jpg
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let afterUpload = url.substring(uploadIndex + 8); // skip "/upload/"

    // Remove version prefix like "v1234567890/"
    afterUpload = afterUpload.replace(/^v\d+\//, "");

    // Remove file extension (.jpg, .png, .webp, .jfif etc)
    const publicId = afterUpload.replace(/\.[^/.]+$/, "");

    console.log("Deleting from Cloudinary:", publicId); // ← log to verify
    return publicId;
  } catch {
    return null;
  }
};

// ── Delete a Cloudinary image by its URL ──────────────────────────────────────
const deleteFromCloudinary = async (url) => {
  if (!url || !url.includes("cloudinary.com")) return; // skip non-cloudinary URLs
  
  const publicId = getPublicId(url);
  if (!publicId) {
    console.warn("Could not extract public_id from:", url);
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", publicId, result); // ← shows "ok" or "not found"
  } catch (err) {
    console.error("Cloudinary delete failed:", publicId, err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/properties   (seller — create)
// ─────────────────────────────────────────────────────────────────────────────
exports.createProperty = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || "{}");
    data.userId             = req.user.sub;
    data.isApprovedByCompany = false;
    data.isActive           = true;
    data.status             = "Pending";

    if (req.files?.thumbnail?.[0]) {
      data.thumbnail = await uploadToCloudinary(req.files.thumbnail[0]);
    }
    if (req.files?.images?.length) {
      data.images = await Promise.all(req.files.images.map(uploadToCloudinary));
    }

    const property = await Property.create(data);
    res.status(201).json({ success: true, property });
  } catch (err) {
    console.error("createProperty:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/properties/:id   (seller — update with image management)
// FormData fields:
//   data            — JSON string of property fields
//   thumbnail       — new thumbnail File (optional)
//   removeThumbnail — "true" if seller wants existing thumbnail deleted
//   images          — new gallery image Files (optional, multiple)
//   removedImages   — JSON array of existing Cloudinary URLs to delete
// ─────────────────────────────────────────────────────────────────────────────
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id:    req.params.id,
      userId: req.user.sub,
    });
    if (!property)
      return res.status(404).json({ success: false, message: "Property not found or not yours" });

    // ── Parse JSON form data ──────────────────────────────────────────────
    let formData = {};
    if (req.body.data) {
      try { formData = JSON.parse(req.body.data); } catch {}
    }

    // ── Thumbnail ─────────────────────────────────────────────────────────
    if (req.body.removeThumbnail === "true" && property.thumbnail) {
      await deleteFromCloudinary(property.thumbnail);
      formData.thumbnail = "";
    }

    if (req.files?.thumbnail?.[0]) {
      if (property.thumbnail) await deleteFromCloudinary(property.thumbnail);
      formData.thumbnail = await uploadToCloudinary(req.files.thumbnail[0]);
    }

    // ── Gallery images ────────────────────────────────────────────────────
    let removedImageUrls = [];
    if (req.body.removedImages) {
      try { removedImageUrls = JSON.parse(req.body.removedImages); } catch {}
    }

    if (removedImageUrls.length > 0)
      await Promise.all(removedImageUrls.map(deleteFromCloudinary));

    const keptImages = (property.images || []).filter(
      (url) => !removedImageUrls.includes(url)
    );

    let newImageUrls = [];
    if (req.files?.images?.length)
      newImageUrls = await Promise.all(req.files.images.map(uploadToCloudinary));

    formData.images = [...keptImages, ...newImageUrls];

    // ── Update DB — single findByIdAndUpdate, no double response ─────────
    const updateObj = { isApprovedByCompany: false, status: "Pending" };

    ["title", "description", "price", "address", "propertyInfo",
     "propertyDetails", "thumbnail", "images"].forEach((key) => {
      if (formData[key] !== undefined) updateObj[key] = formData[key];
    });

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updateObj },
      { new: true }
    );

    return res.json({ success: true, message: "Property updated", property: updated }); // ← only ONE res.json

  } catch (err) {
    console.error("updateProperty:", err.message);
    // Only send error if headers not already sent
    if (!res.headersSent)
      return res.status(400).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/properties/my   (seller)
// ─────────────────────────────────────────────────────────────────────────────
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user.sub, isActive: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/properties/my/stats   (seller)
// ─────────────────────────────────────────────────────────────────────────────
exports.getMyStats = async (req, res) => {
  try {
    const userId = req.user.sub;
    const [total, available, sold, pending] = await Promise.all([
      Property.countDocuments({ userId, isActive: true }),
      Property.countDocuments({ userId, status: "Available", isActive: true }),
      Property.countDocuments({ userId, status: "Sold" }),
      Property.countDocuments({ userId, status: "Pending", isActive: true }),
    ]);
    res.json({ success: true, total, available, sold, pending, inquiries: 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/properties/:id   (public)
// ─────────────────────────────────────────────────────────────────────────────
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, isActive: true })
      .populate("userId", "name email contact");
    if (!property)
      return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/properties/:id   (seller — soft delete + Cloudinary cleanup)
// ─────────────────────────────────────────────────────────────────────────────
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, userId: req.user.sub });
    if (!property)
      return res.status(404).json({ success: false, message: "Not found" });

    // Delete images from Cloudinary
    const toDelete = [];
    if (property.thumbnail) toDelete.push(property.thumbnail);
    if (property.images?.length) toDelete.push(...property.images);
    await Promise.all(toDelete.map(deleteFromCloudinary));

    property.isActive = false;
    await property.save();
    res.json({ success: true, message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/properties   (public — approved listings with filters)
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllProperties = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms, furnishing, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true, isApprovedByCompany: true, status: "Available" };

    if (city)       filter["address.city"]               = { $regex: city, $options: "i" };
    if (type)       filter["propertyInfo.propertyType"]  = type;
    if (bedrooms)   filter["propertyDetails.bedrooms"]   = Number(bedrooms);
    if (furnishing) filter["propertyDetails.furnishing"] = furnishing;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("userId", "name email contact")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    res.json({
      success: true, properties, total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/properties/:id/approve   (admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.adminApproveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isApprovedByCompany: true, status: "Available" },
      { new: true }
    );
    if (!property)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};