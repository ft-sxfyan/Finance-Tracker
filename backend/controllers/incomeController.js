import Income from '../models/Income.js';
import { getMonthRange, isPositiveAmount, isValidDate, validateMonth } from '../utils/month.js';

// @desc    Get income
// @route   GET /api/income
export const getIncome = async (req, res) => {
  try {
    const { date, month } = req.query;

    const filter = {};

    if (date) {
      if (!isValidDate(date)) {
        return res.status(400).json({ success: false, message: 'Date must use YYYY-MM-DD format.' });
      }
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);

      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    if (month) {
      if (!validateMonth(month)) {
        return res.status(400).json({ success: false, message: 'Month must use YYYY-MM format.' });
      }
      const { start: startOfMonth, end: startOfNextMonth } = getMonthRange(month);

      filter.date = {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      };
    }

    const income = await Income.find(filter).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: income.length,
      data: income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Add income
// @route   POST /api/income
export const addIncome = async (req, res) => {
  try {
    const { source, amount, date } = req.body;

    if (!source?.trim() || !isPositiveAmount(amount) || !isValidDate(date)) {
      return res.status(400).json({ success: false, message: 'Provide a source, valid date, and positive amount.' });
    }

    const income = await Income.create({
      source,
      amount,
      date,
    });

    res.status(201).json({
      success: true,
      data: income,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create income',
      error: error.message,
    });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Income deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete income',
      error: error.message,
    });
  }
};
