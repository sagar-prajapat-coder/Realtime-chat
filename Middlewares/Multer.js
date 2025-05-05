import multer from "multer";
import path from "path";

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, JPG images and MP4 videos are allowed"), false);
    
  }
};

// Raw multer instance
const rawUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("filename");

// ✅ Wrapped middleware with error handling
const upload = (req, res, next) => {
  rawUpload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File size must be under 5MB" });
      }

      return res.status(400).json({ message: err.message });
    }

    next(); // pass to controller if no errors
  });
};

export default upload;
