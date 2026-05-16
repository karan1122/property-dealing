const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect: authMiddleware, authorizeRoles: roleGuard } = require("../middleware/authMiddleware");
const ctrl = require("../controllers/propertyController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const imgFields = upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images", maxCount: 10 }]);

router.get("/", ctrl.getAllProperties);

router.get(
  "/my",
  authMiddleware,
  roleGuard("seller"),
  ctrl.getMyProperties
);

router.get(
  "/my/stats",
  authMiddleware,
  roleGuard("seller"),
  ctrl.getMyStats
);

router.post(
  "/",
  authMiddleware,
  roleGuard("seller"),
  imgFields,
  ctrl.createProperty
);

router.put(
  "/:id",
  authMiddleware,
  roleGuard("seller"),
  ctrl.updateProperty
);

router.delete(
  "/:id",
  authMiddleware,
  roleGuard("seller"),
  ctrl.deleteProperty
);

router.patch(
  "/:id/approve",
  authMiddleware,
  roleGuard("admin"),
  ctrl.adminApproveProperty
);

/* KEEP LAST */
router.get(
  "/:id",
  ctrl.getPropertyById
);

module.exports = router;
