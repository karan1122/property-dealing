// controllers/inquiryMeetingController.js
const Inquiry = require("../models/Inquiry");
const Meeting = require("../models/Meeting");
const User = require("../models/User");
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

// GET /api/meetings/agent/my — agent sees pending meetings
exports.getAgentMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ agentId: req.user.sub })
      .populate("propertyId", "title thumbnail address")
      .populate("sellerId", "name email contact")
      .sort({ scheduledAt: 1 });
    res.json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// PATCH /api/meetings/agent/:id/status — agent confirms or cancels

exports.agentUpdateMeeting = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["confirmed", "cancelled"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, agentId: req.user.sub },
      { status },
      { new: true }
    ).populate("propertyId", "title").populate("sellerId", "name email");

    if (!meeting)
      return res.status(404).json({ success: false, message: "Meeting not found" });

    res.json({ success: true, meeting });
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
// POST /api/meetings — buyer submits
exports.createMeeting = async (req, res) => {
  try {
    const { propertyId, sellerId, name, phone, email, scheduledAt, note } = req.body;
    if (!propertyId || !sellerId || !name || !phone || !scheduledAt)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    // Find assigned agent of this seller
    const seller = await User.findById(sellerId).select("assignedAgent");
    if (!seller?.assignedAgent)
      return res.status(400).json({ success: false, message: "No agent assigned to this seller" });

    const meeting = await Meeting.create({
      propertyId, sellerId,
      agentId: seller.assignedAgent, // ← goes to agent first
      name, phone, email, scheduledAt, note,
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
    const meetings = await Meeting.find({
      sellerId: req.user.sub,
      status: { $in: ["confirmed", "completed", "cancelled"] }, // ← only after agent acts
    })
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
    if (status !== "completed")
      return res.status(400).json({ success: false, message: "Sellers can only mark meetings as completed" });

    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.sub, status: "confirmed" },
      { status },
      { new: true }
    ).populate("propertyId", "title thumbnail address");

    if (!meeting)
      return res.status(404).json({ success: false, message: "Meeting not found or not confirmed yet" });

    res.json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};