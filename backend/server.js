
import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import commentsRouter from './routes/commentRoutes.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', process.env.FRONTEND_URL || '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(json());

// API routes with correct mapping
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/comments', commentsRouter);

// Status route for health checks
app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running' });
});

// Connect to MongoDB with better logging
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
console.log('Attempting to connect to MongoDB at:', mongoURI);

connect(mongoURI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB. Error details:', err);
    console.error('Please ensure MongoDB is running and the connection string is correct');
  });

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
