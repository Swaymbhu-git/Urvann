import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import connectDB from './config/database.js'; 
import  errorHandler  from './middleware/errorHandler.js';
import plantRoutes from './routes/plants.js';

config();

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

app.use(cors());
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));

app.use('/api/plants', plantRoutes); 

app.get('/', (req, res) => {
  res.json({ 
    message: 'Urvann Mini Plant Store API',
    version: '1.0.0',
    status: 'active'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
