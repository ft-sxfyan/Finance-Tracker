import Expense from '../models/Expense.js';
import { getMonthRange, isPositiveAmount, isValidDate, validateMonth } from '../utils/month.js';

// @desc    Get expenses
// @route   GET /api/expenses
export const getExpenses = async (req, res) => {
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

    const expenses = await Expense.find(filter).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid expense ID',
      error: error.message,
    });
  }
};

// @desc    Add new expense
// @route   POST /api/expenses
export const addExpense = async (req, res) => {
  try {
    const {
      item,
      amount,
      category,
      date,
      paymentMethod,
    } = req.body;

    if (!item?.trim() || !category?.trim() || !isPositiveAmount(amount) || !isValidDate(date)) {
      return res.status(400).json({ success: false, message: 'Provide an item, category, valid date, and positive amount.' });
    }

    const expense = await Expense.create({
      item,
      amount,
      category,
      date,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message,
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
export const updateExpense = async (req, res) => {
  try {
    if (req.body.amount !== undefined && !isPositiveAmount(req.body.amount)) {
      return res.status(400).json({ success: false, message: 'Amount must be positive.' });
    }
    if (req.body.date !== undefined && !isValidDate(req.body.date)) {
      return res.status(400).json({ success: false, message: 'Date must use YYYY-MM-DD format.' });
    }
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message,
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message,
    });
  }
};
