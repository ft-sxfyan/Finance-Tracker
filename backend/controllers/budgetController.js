import Budget from '../models/Budget.js';
import { isPositiveAmount, validateMonth } from '../utils/month.js';

// @desc    Get budget for a month
// @route   GET /api/budget/:month
export const getBudget = async (req, res) => {
  try {
    const { month } = req.params;

    if (!validateMonth(month)) {
      return res.status(400).json({ success: false, message: 'Month must use YYYY-MM format.' });
    }

    const budget = await Budget.findOne({ month });

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get budget',
      error: error.message,
    });
  }
};

// @desc    Create or update monthly budget
// @route   PUT /api/budget/:month
export const setBudget = async (req, res) => {
  try {
    const { month } = req.params;
    const { amount } = req.body;

    if (!validateMonth(month) || !isPositiveAmount(amount)) {
      return res.status(400).json({ success: false, message: 'Provide a valid month and positive budget amount.' });
    }

    const budget = await Budget.findOneAndUpdate(
      { month },
      { month, amount },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to save budget',
      error: error.message,
    });
  }
};
