import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js'; // 1. Import upload routes
import predictRoutes from './routes/predict.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.get('/', (req, res) => {
  res.send('Analytica Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes); // 2. Use the upload routes
app.use('/api/predict', predictRoutes); // 3. Use the predict routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});