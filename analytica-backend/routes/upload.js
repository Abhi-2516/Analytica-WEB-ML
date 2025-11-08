import express from 'express';
import multer from 'multer';
import path from 'path';
import axios from 'axios'; // Import axios
import { fileURLToPath } from 'url'; // To get __dirname in ES modules

const router = express.Router();

// Get __dirname (current directory)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    // Create a unique filename: fieldname-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// --- Multer Upload Middleware ---
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /csv|xlsx|json/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Note: We are just checking the extension, not the true mimetype
    if (extname) {
      return cb(null, true);
    } else {
      cb('Error: Only .csv, .xlsx, and .json files are allowed!');
    }
  },
}).single('dataFile'); // 'dataFile' must match the frontend FormData key

// --- The Upload Route ---
router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    // Make this callback async
    if (err) {
      // A Multer error occurred (e.g., wrong file type)
      return res.status(400).json({ msg: err });
    }

    if (req.file == undefined) {
      // No file was selected
      return res.status(400).json({ msg: 'Error: No file selected!' });
    }

    // --- New Code: Call Python API ---
    try {
      // 1. Get the full, absolute path of the uploaded file
      const absoluteFilePath = path.resolve(__dirname, '..', req.file.path);

      // --- THIS IS THE DEBUGGING LOG ---
      console.log('--- BACKEND DEBUG ---');
      console.log('File uploaded:', req.file.filename);
      console.log('Sending this path to Python:', absoluteFilePath);
      console.log('Calling Python API at: http://127.0.0.1:8000/analyze');
      // --- END DEBUGGING LOG ---

      // 2. Send this path to the Python API
      const analysisResponse = await axios.post(
        'http://127.0.0.1:8000/analyze', // Your Python server
        {
          file_path: absoluteFilePath,
        }
      );
      
      console.log('--- PYTHON RESPONSE RECEIVED ---'); // Good sign!

      // 3. Send the successful analysis from Python back to the React frontend
      res.status(200).json({
        msg: 'File uploaded and analyzed successfully!',
        fileName: req.file.filename,
        filePath: `/uploads/${req.file.filename}`,
        analysis: analysisResponse.data, // This is the JSON from Python!
      });
    } catch (analysisError) {
      // --- THIS IS THE CRITICAL ERROR LOG ---
      console.error('--- PYTHON API CALL FAILED ---');
      console.error('Error Message:', analysisError.message);
      
      // Check if the Python server is even running
      if (analysisError.code === 'ECONNREFUSED') {
          console.error('Error Detail: Connection refused. Is your Python server (main.py) running on port 8000?');
      } 
      // Log the detailed error from Python (e.g., "File not found")
      else if (analysisError.response && analysisError.response.data) {
          console.error('Error Detail from Python:', analysisError.response.data.detail);
      }
      // --- END ERROR LOG ---

      if (analysisError.response && analysisError.response.data) {
        return res.status(500).json({
          msg: 'File uploaded, but analysis failed.',
          detail: analysisError.response.data.detail,
        });
      }

      res.status(500).json({
        msg: 'File uploaded, but analysis service could not be reached. Is the Python server running?',
      });
    }
    // --- End of New Code ---
  });
});

export default router;