const Property = require("../models/Property");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, { folder: "realestate" });
  fs.unlinkSync(filePath);
  return result.secure_url;
};

exports.createProperty = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || "{}");
    data.userId = req.user.sub;
    data.isApprovedByCompany = false;
    data.isActive = true;

    if (req.files?.thumbnail?.[0]) {
      data.thumbnail = await uploadToCloudinary(req.files.thumbnail[0].path);
    }
    if (req.files?.images) {
      data.images = await Promise.all(req.files.images.map((f) => uploadToCloudinary(f.path)));
    }

    const property = await Property.create(data);
    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user.sub, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, isActive: true }).populate("userId", "name email");
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, userId: req.user.sub });
    if (!property) return res.status(404).json({ success: false, message: "Property not found or not yours" });

    const allowed = ["title", "description", "price", "address", "propertyInfo", "propertyDetails", "status"];
    allowed.forEach((key) => { if (req.body[key] !== undefined) property[key] = req.body[key]; });

    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, userId: req.user.sub });
    if (!property) return res.status(404).json({ success: false, message: "Not found" });
    property.isActive = false;
    await property.save();
    res.json({ success: true, message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms, furnishing, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true, isApprovedByCompany: true, status: "Available" };

    if (city) filter["address.city"] = { $regex: city, $options: "i" };
    if (type) filter["propertyInfo.propertyType"] = type;
    if (bedrooms) filter["propertyDetails.bedrooms"] = Number(bedrooms);
    if (furnishing) filter["propertyDetails.furnishing"] = furnishing;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [properties, total] = await Promise.all([
      Property.find(filter).populate("userId", "name email").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    res.json({ success: true, properties, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminApproveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { isApprovedByCompany: true }, { new: true });
    if (!property) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
