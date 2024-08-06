import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get __filename in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../media'); // Adjust path to reach the media folder
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory at:', uploadDir);
} else {
  console.log('Uploads directory exists at:', uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    console.log('Saving file as:', uniqueFilename);
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage });

// Configure the fields for different types of uploads
export const uploadMiddleware = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'image', maxCount: 4 },
  { name: 'images', maxCount: 20 }
]);
