const Inquiry    = require("../models/Inquiry");
const Property   = require("../models/Property");
const User       = require("../models/User");
const Commission = require("../models/commisiion");

// POST /api/inquiries — buyer submits (public)
exports.createInquiry = async (req, res) => {
  try {
    const { propertyId, sellerId, name, email, phone, message } = req.body;

    if (!propertyId || !sellerId || !name || !email || !message)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    // Find assigned agent of this seller
    const seller = await User.findById(sellerId).select("assignedAgent");
    if (!seller?.assignedAgent)
      return res.status(400).json({ success: false, message: "No agent assigned to this seller yet" });

    const inquiry = await Inquiry.create({
      propertyId,
      sellerId,
      agentId:    seller.assignedAgent,
      buyerName:  name,
      buyerEmail: email,
      buyerPhone: phone || "",
      message,
    });

    res.status(201).json({ success: true, inquiry, message: "Inquiry sent to agent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/inquiries/my — agent sees their inquiries
exports.getMyInquiries =
  async (req, res) => {

    try {

      let query = {};

      // Seller dashboard
      if (
        req.user.role === "seller"
      ) {

        query.sellerId =
          req.user.sub;
      }

      // Agent dashboard
      if (
        req.user.role === "agent"
      ) {

        query.agentId =
          req.user.sub;
      }

      //console.log(query);

      const inquiries =
        await Inquiry.find(query)

          .populate(
            "propertyId",
            "title thumbnail address"
          )

          .sort({
            createdAt: -1,
          });

      console.log(inquiries);

      res.json({
        success: true,
        inquiries,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });

    }
  };

// PATCH /api/inquiries/:id/status — agent updates inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status, agentNote } = req.body;
    const allowed = ["new","contacted","visit_scheduled","negotiating","closed","lost"];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const inquiry = await Inquiry.findOne({ _id: req.params.id, agentId: req.user.sub })
      .populate("propertyId", "title price");
    if (!inquiry)
      return res.status(404).json({ success: false, message: "Inquiry not found" });

    inquiry.status    = status;
    inquiry.agentNote = agentNote || inquiry.agentNote;

    // If closed → mark property Sold + create commission
    if (status === "closed") {
      inquiry.closedAt = new Date();

      await Property.findByIdAndUpdate(inquiry.propertyId._id, {
        status: "Sold",
        isApprovedByCompany: false, // take off market
      });

      const salePrice  = inquiry.propertyId.price;
      const percentage = 2;
      const amount     = Math.round(salePrice * percentage / 100);

      // Avoid duplicate commissions
      const existing = await Commission.findOne({ inquiryId: inquiry._id });
      if (!existing) {
        await Commission.create({
          propertyId: inquiry.propertyId._id,
          agentId:    inquiry.agentId,
          sellerId:   inquiry.sellerId,
          inquiryId:  inquiry._id,
          salePrice,
          percentage,
          amount,
        });
      }
    }

    await inquiry.save();
    res.json({ success: true, inquiry, message: `Status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/inquiries/stats — agent stats
exports.getInquiryStats = async (req, res) => {
  try {
    const agentId = req.user.sub;
    const [total, newCount, contacted, visiting, negotiating, closed, lost] = await Promise.all([
      Inquiry.countDocuments({ agentId }),
      Inquiry.countDocuments({ agentId, status: "new" }),
      Inquiry.countDocuments({ agentId, status: "contacted" }),
      Inquiry.countDocuments({ agentId, status: "visit_scheduled" }),
      Inquiry.countDocuments({ agentId, status: "negotiating" }),
      Inquiry.countDocuments({ agentId, status: "closed" }),
      Inquiry.countDocuments({ agentId, status: "lost" }),
    ]);
    res.json({ success: true, total, new: newCount, contacted, visiting, negotiating, closed, lost });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/inquiries/commissions — agent sees their commissions
exports.getMyCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ agentId: req.user.sub })
      .populate("propertyId", "title address price")
      .populate("sellerId",   "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, commissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/inquiries/admin/commissions — admin sees all commissions
exports.getAllCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find()
      .populate("propertyId", "title address price")
      .populate("agentId",    "name email contact")
      .populate("sellerId",   "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, commissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/inquiries/admin/commissions/:id/pay — admin marks commission paid
exports.markCommissionPaid = async (req, res) => {
  try {
    const commission = await Commission.findByIdAndUpdate(
      req.params.id,
      { status: "paid", paidAt: new Date() },
      { new: true }
    ).populate("agentId", "name").populate("propertyId", "title");

    if (!commission)
      return res.status(404).json({ success: false, message: "Commission not found" });

    res.json({ success: true, commission, message: "Commission marked as paid" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};