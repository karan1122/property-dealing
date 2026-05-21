const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  protect: authMiddleware,
  authorizeRoles: roleGuard,
} = require("../middleware/authMiddleware");

const ctrl = require("../controllers/propertyController");

/* ─────────────────────────────────────────────────────────────
   UPLOADS
───────────────────────────────────────────────────────────── */

const uploadDir = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {
      cb(null, uploadDir);
    },

    filename: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        Date.now() +
          path.extname(
            file.originalname
          )
      );
    },
  });

const upload = multer({
  storage,
  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
});

const imgFields =
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
  ]);

/* ─────────────────────────────────────────────────────────────
   PUBLIC
───────────────────────────────────────────────────────────── */

router.get(
  "/",
  ctrl.getAllProperties
);

/* ─────────────────────────────────────────────────────────────
   SELLER
───────────────────────────────────────────────────────────── */

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

router.get(
  "/my/all",
  authMiddleware,
  roleGuard(
    "seller",
    "admin"
  ),
  ctrl.getMyAllProperties
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
  imgFields,
  ctrl.updateProperty
);

router.delete(
  "/:id",
  authMiddleware,
  roleGuard("seller"),
  ctrl.deleteProperty
);

/* ─────────────────────────────────────────────────────────────
   ADMIN
───────────────────────────────────────────────────────────── */

router.patch(
  "/:id/approve",
  authMiddleware,
  roleGuard("admin"),
  ctrl.adminApproveProperty
);

/* ─────────────────────────────────────────────────────────────
   AGENT VERIFY PROPERTY
───────────────────────────────────────────────────────────── */

router.patch(
  "/:id/verify",
  authMiddleware,
  roleGuard("agent"),
  ctrl.verifyProperty
);

router.patch(
  "/:id/agent-verdict",
  authMiddleware,
  roleGuard("agent"),
  ctrl.submitAgentVerdict
);

/* ─────────────────────────────────────────────────────────────
   KEEP LAST
───────────────────────────────────────────────────────────── */

router.get(
  "/:id",
  ctrl.getPropertyById
);

module.exports = router;