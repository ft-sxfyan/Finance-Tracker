import mongoose from 'mongoose';

const monthlyBudgetSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    allowance: {
      type: Number,
      required: true,
      min: 0,
      default: 5000,
    },
  },
  {
    timestamps: true,
  }
);

monthlyBudgetSchema.index(
  { month: 1, year: 1 },
  { unique: true }
);

export default mongoose.model('MonthlyBudget', monthlyBudgetSchema);