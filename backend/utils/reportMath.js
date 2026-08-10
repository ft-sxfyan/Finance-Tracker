function total(entries) {
  return entries.reduce(
    (sum, entry) => sum + Number(entry.amount || 0),
    0
  );
}

export function buildMonthlyReport({
  month,
  budget,
  income = [],
  expenses = [],
}) {
  const allowance = Number(budget?.amount || 0);
  const totalIncome = total(income);
  const totalExpenses = total(expenses);
  const categoryAmounts = expenses.reduce((categories, expense) => {
    const category = expense.category || 'Other';
    categories[category] =
      (categories[category] || 0) + Number(expense.amount || 0);
    return categories;
  }, {});

  const categories = Object.entries(categoryAmounts)
    .map(([category, amount]) => ({ category, amount }))
    .sort((first, second) => second.amount - first.amount);

  return {
    month,
    allowance,
    totalIncome,
    totalExpenses,
    remaining: allowance + totalIncome - totalExpenses,
    categories,
    income,
    expenses,
  };
}
