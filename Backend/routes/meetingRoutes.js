const express = require("express");
const router  = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/inquiryMeetingController");

router.post(  "/",           ctrl.createMeeting);
router.get(   "/my",         protect, authorizeRoles("seller"), ctrl.getMyMeetings);
router.patch( "/:id/status", protect, authorizeRoles("seller"), ctrl.updateMeetingStatus);

module.exports = router;