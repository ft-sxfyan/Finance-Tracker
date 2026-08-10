import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{4}-\d{2}$/,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;