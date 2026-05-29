const express = require("express");
const router  = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/inquiryMeetingController");

// Public — buyer submits
router.post("/", ctrl.createMeeting);

// Agent — sees and approves meetings
router.get(  "/agent/my",          protect, authorizeRoles("agent"),  ctrl.getAgentMeetings);
router.patch("/agent/:id/status",  protect, authorizeRoles("agent"),  ctrl.agentUpdateMeeting);

router.post(  "/",           ctrl.createMeeting);
router.get(   "/my",         protect, authorizeRoles("seller"), ctrl.getMyMeetings);
router.patch( "/:id/status", protect, authorizeRoles("seller"), ctrl.updateMeetingStatus);

module.exports = router;