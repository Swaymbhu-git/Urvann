import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './config/database.js'; 
import  errorHandler  from './middleware/errorHandler.js';
import plantRoutes from './routes/plants.js';

// Load environment variables
config();

// Connect to MongoDB (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Middleware
app.use(cors());
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));

// Routes
// Use the imported route module directly
app.use('/api/plants', plantRoutes); 

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Urvann Mini Plant Store API',
    version: '1.0.0',
    status: 'active'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
