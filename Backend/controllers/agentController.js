const User     = require("../models/User");
const Property = require("../models/Property");
const bcrypt   = require("bcryptjs");

/* ── Helper: enrich one agent with counts ── */
const enrichAgent = async (agent) => {
  const sellers    = await User.find({ role:"seller", assignedAgent: agent._id }).select("-password");
  const sellerIds  = sellers.map(s => s._id);
  const totalListings = await Property.countDocuments({ userId: { $in: sellerIds }, isActive: true });
  const sellersWithCount = await Promise.all(
    sellers.map(async s => ({
      ...s.toObject(),
      propertyCount: await Property.countDocuments({ userId: s._id, isActive: true }),
    }))
  );
  return { ...agent.toObject(), sellerCount: sellers.length, totalListings, assignedSellers: sellersWithCount };
};

/* POST /api/admin/agents  — create new agent */
exports.createAgent = async (req, res) => {
  try {
    const { name, email, password, contact, specialization, bio } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim())
      return res.status(400).json({ success:false, message:"Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ success:false, message:"Password must be at least 6 characters" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ success:false, message:"Email already registered" });

    const agent = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      // password: await bcrypt.hash(password, 12),
      password,
      contact: contact || "",
      specialization: specialization || "",
      bio: bio || "",
      role: "agent",
      isActive: true,
    });

    const { password:_, ...safe } = agent.toObject();
    res.status(201).json({ success:true, agent:safe, message:`Agent ${agent.name} created` });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};


exports.getMyAgent = async (req, res) => {
  try {
    const seller = await User.findById(req.user.sub).select("assignedAgent");
    if (!seller?.assignedAgent)
      return res.status(404).json({ success: false, message: "No agent assigned" });

    const agent = await User.findById(seller.assignedAgent)
      .select("name email contact specialization bio isActive");

    if (!agent)
      return res.status(404).json({ success: false, message: "Agent not found" });

    res.json({ success: true, agent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET /api/admin/agents  — all agents enriched */
exports.getAllAgents = async (req, res) => {
  try {
    const { search, active } = req.query;
    const filter = { role:"agent" };
    if (search) filter.$or = [
      { name:    { $regex:search, $options:"i" } },
      { email:   { $regex:search, $options:"i" } },
      { contact: { $regex:search, $options:"i" } },
    ];
    if (active === "true")  filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const agents   = await User.find(filter).select("-password").sort({ createdAt:-1 });
    const enriched = await Promise.all(agents.map(enrichAgent));
    res.json({ success:true, agents:enriched });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

/* GET /api/admin/agents/:id  — single agent */
exports.getAgentById = async (req, res) => {
  try {
    const agent = await User.findOne({ _id:req.params.id, role:"agent" }).select("-password");
    if (!agent) return res.status(404).json({ success:false, message:"Agent not found" });
    res.json({ success:true, agent: await enrichAgent(agent) });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

/* PATCH /api/admin/agents/:id  — edit agent profile */
exports.updateAgent = async (req, res) => {
  try {
    const agent = await User.findOne({ _id:req.params.id, role:"agent" });
    if (!agent) return res.status(404).json({ success:false, message:"Agent not found" });

    const { name, email, password, contact, specialization, bio } = req.body;
    if (name?.trim())  agent.name = name.trim();
    if (contact !== undefined) agent.contact = contact;
    if (specialization !== undefined) agent.specialization = specialization;
    if (bio !== undefined) agent.bio = bio;

    if (email?.trim() && email.toLowerCase() !== agent.email) {
      const exists = await User.findOne({ email:email.toLowerCase(), _id:{ $ne:agent._id } });
      if (exists) return res.status(409).json({ success:false, message:"Email already in use" });
      agent.email = email.toLowerCase().trim();
    }
    if (password?.trim()) {
      if (password.length < 6) return res.status(400).json({ success:false, message:"Min 6 characters" });
      // agent.password = await bcrypt.hash(password, 12);
      agent.password = password;
    }

    await agent.save();
    const { password:_, ...safe } = agent.toObject();
    res.json({ success:true, agent:safe, message:"Agent updated" });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

/* PATCH /api/admin/agents/:agentId/assign-seller  — assign a seller */
exports.assignSeller = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { sellerId } = req.body;
    if (!sellerId) return res.status(400).json({ success:false, message:"sellerId required" });

    const [agent, seller] = await Promise.all([
      User.findOne({ _id:agentId, role:"agent" }),
      User.findOne({ _id:sellerId, role:"seller" }),
    ]);
    if (!agent)  return res.status(404).json({ success:false, message:"Agent not found" });
    if (!seller) return res.status(404).json({ success:false, message:"Seller not found" });
    if (!agent.isActive) return res.status(400).json({ success:false, message:"Agent is inactive" });
    if (seller.assignedAgent?.toString() === agentId)
      return res.status(409).json({ success:false, message:"Already assigned to this agent" });

    seller.assignedAgent = agentId;
    await seller.save();
    res.json({ success:true, message:`${seller.name} assigned to ${agent.name}` });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

/* PATCH /api/admin/agents/:agentId/unassign-seller  — remove a seller */
exports.unassignSeller = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { sellerId } = req.body;
    const seller = await User.findOne({ _id:sellerId, role:"seller", assignedAgent:agentId });
    if (!seller) return res.status(404).json({ success:false, message:"Seller not found or not assigned here" });
    seller.assignedAgent = undefined;
    await seller.save();
    res.json({ success:true, message:`${seller.name} unassigned` });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

/* GET /api/admin/agents/:id/sellers */
exports.getAgentSellers = async (req, res) => {
  try {
    const agent = await User.findOne({ _id:req.params.id, role:"agent" });
    if (!agent) return res.status(404).json({ success:false, message:"Agent not found" });
    const sellers = await User.find({ role:"seller", assignedAgent:req.params.id }).select("-password");
    const withCounts = await Promise.all(sellers.map(async s => ({
      ...s.toObject(),
      propertyCount: await Property.countDocuments({ userId:s._id, isActive:true }),
    })));
    res.json({ success:true, sellers:withCounts });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

/* GET /api/admin/agents/:id/properties */
exports.getAgentProperties = async (req, res) => {
  try {
    const sellers   = await User.find({ role:"seller", assignedAgent:req.params.id }).select("_id");
    const sellerIds = sellers.map(s => s._id);
    const filter = { userId:{ $in:sellerIds }, isActive:true };
    if (req.query.approved === "true")  filter.isApprovedByCompany = true;
    if (req.query.approved === "false") filter.isApprovedByCompany = false;
    const properties = await Property.find(filter).populate("userId","name email").sort({ createdAt:-1 });
    res.json({ success:true, properties });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};

/* DELETE /api/admin/agents/:id  — delete agent, unassign all sellers */
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await User.findOne({ _id:req.params.id, role:"agent" });
    if (!agent) return res.status(404).json({ success:false, message:"Agent not found" });
    const { modifiedCount } = await User.updateMany({ assignedAgent:agent._id }, { $unset:{ assignedAgent:"" } });
    await agent.deleteOne();
    res.json({ success:true, message:`Agent deleted. ${modifiedCount} seller(s) unassigned.` });
  } catch (err) { res.status(500).json({ success:false, message:err.message }); }
};