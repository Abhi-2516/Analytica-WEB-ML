import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get __dirname (current directory)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @route   POST /api/predict
// @desc    Run prediction models on a file
// @access  Private (TODO)
router.post('/', async (req, res) => {
  const { fileName, targetColumn } = req.body;

  if (!fileName || !targetColumn) {
    return res
      .status(400)
      .json({ msg: 'Missing file name or target column' });
  }

  try {
    // Re-create the absolute path to the file in the /uploads folder
    const absoluteFilePath = path.resolve(
      __dirname,
      '..',
      'uploads',
      fileName
    );

    console.log(`--- BACKEND CALLING /predict ---`);
    console.log(`File: ${absoluteFilePath}, Target: ${targetColumn}`);

    // Call Python API's /predict endpoint
    const predictResponse = await axios.post(
      'http://127.0.0.1:8000/predict',
      {
        file_path: absoluteFilePath,
        target_column: targetColumn,
      }
    );

    console.log(`--- PREDICTION RESPONSE RECEIVED ---`);
    // Send the results from Python back to React
    res.status(200).json(predictResponse.data);
    
  } catch (err) {
    console.error('--- PREDICT API CALL FAILED ---');
    console.error('Error Message:', err.message);
    
    const errorMsg = err.response?.data?.detail || err.message;
    res.status(500).json({ msg: 'Prediction service failed.', detail: errorMsg });
  }
});

export default router;