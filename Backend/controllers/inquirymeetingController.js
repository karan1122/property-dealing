// controllers/inquiryMeetingController.js
const Inquiry = require("../models/Inquiry");
const Meeting = require("../models/Meeting");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/inquiries   (public — buyer sends inquiry to seller)
// ─────────────────────────────────────────────────────────────────────────────
exports.createInquiry = async (req, res) => {
  try {
    const { propertyId, sellerId, name, email, phone, message } = req.body;
    if (!propertyId || !sellerId || !name || !email || !message)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const inquiry = await Inquiry.create({
      propertyId, sellerId, name, email, phone: phone || "", message,
      status: "unread",
    });
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/inquiries/my   (seller — see all inquiries for their properties)
// ─────────────────────────────────────────────────────────────────────────────
exports.getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ sellerId: req.user.sub })
      .populate("propertyId", "title thumbnail address")
      .sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/inquiries/:id/read   (seller — mark inquiry as read)
// ─────────────────────────────────────────────────────────────────────────────
exports.markInquiryRead = async (req, res) => {
  try {
    const inquiry = await Inquiry.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.sub },
      { status: "read" },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/meetings   (public — buyer requests a meeting)
// ─────────────────────────────────────────────────────────────────────────────
exports.createMeeting = async (req, res) => {
  try {
    const { propertyId, sellerId, name, phone, email, scheduledAt, note } = req.body;
    if (!propertyId || !sellerId || !name || !phone || !scheduledAt)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const meeting = await Meeting.create({
      propertyId, sellerId, name, phone, email: email || "", scheduledAt, note: note || "",
      status: "pending",
    });
    res.status(201).json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/meetings/my   (seller — see all meeting requests)
// ─────────────────────────────────────────────────────────────────────────────
exports.getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ sellerId: req.user.sub })
      .populate("propertyId", "title thumbnail address")
      .sort({ scheduledAt: 1 });
    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/meetings/:id/status   (seller — confirm / cancel meeting)
// body: { status: "confirmed" | "cancelled" | "completed" }
// ─────────────────────────────────────────────────────────────────────────────
exports.updateMeetingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["confirmed", "cancelled", "completed"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.sub },
      { status },
      { new: true }
    ).populate("propertyId", "title thumbnail address");

    if (!meeting) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};