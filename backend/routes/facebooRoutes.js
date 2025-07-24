const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const facebookController = require("../controllers/facebookController");
const authenticateUserToken = require('../middleware/authMiddleware');

// Configure storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Smart middleware to handle both single and multiple file uploads
const smartUpload = (req, res, next) => {
  const uploadHandler = upload.any();

  uploadHandler(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: "File upload error",
        details: err.message,
      });
    }

    // Organize files based on field name
    if (req.files && req.files.length > 0) {
      // Group files by fieldname
      const imageFiles = req.files.filter(
        (file) => file.fieldname === "image" || file.fieldname === "images"
      );

      if (imageFiles.length === 0) {
        return res.status(400).json({
          error: "No valid image files",
          details: "Use 'image' or 'images' as the field name",
        });
      }

      req.files = imageFiles;
    }

    next();
  });
};

// Smart middleware for video uploads
const videoSmartUpload = (req, res, next) => {
  const uploadHandler = upload.any();

  uploadHandler(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: "File upload error",
        details: err.message,
      });
    }

    // Organize files based on field name
    if (req.files && req.files.length > 0) {
      // Group files by fieldname
      const videoFiles = req.files.filter(
        (file) => file.fieldname === "video" || file.fieldname === "videos"
      );

      if (videoFiles.length === 0) {
        return res.status(400).json({
          error: "No valid video files",
          details: "Use 'video' or 'videos' as the field name",
        });
      }

      req.files = videoFiles;
    }

    next();
  });
};

// Text post route
router.post("/post-text", authenticateUserToken, facebookController.postTextOnFacebook);

// Image routes
router.post("/post-image-url", authenticateUserToken, facebookController.postImagesByURLOnFacebook);

// New unified image posting endpoint
router.post(
  "/post-images", authenticateUserToken,
  smartUpload,
  facebookController.postImagesOnFacebook
);

// Video route
router.post(
  "/post-video", authenticateUserToken,
  upload.single("video"),
  facebookController.postVideoOnFacebook
);

// Unified video posting endpoint
router.post(
  "/post-videos", authenticateUserToken,
  videoSmartUpload,
  facebookController.postVideosOnFacebook
);

module.exports = router;
