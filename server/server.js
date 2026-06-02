import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import scoreRoutes from './src/routes/scoreRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/scores', scoreRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rifqialfareza_db_user:567GMlU8ZoteORxw@cluster0.nqnd7uq.mongodb.net/quiz-app?appName=Cluster0';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
