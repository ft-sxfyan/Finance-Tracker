import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import connectDatabase from './config/database.js';

import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Database Connection Middleware (Ensures DB connects before handling requests on Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Personal Finance Tracker API is running.',
  });
});

// API routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/reports', reportRoutes);

// 2. Only listen locally during development (Vercel handles ports automatically)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// 3. Export express app for Vercel Serverless Function
export default app;