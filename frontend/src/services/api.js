const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000';

async function handleResponse(response, defaultMessage) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.message || defaultMessage
    );
  }

  return response.json();
}

// --------------------
// EXPENSES
// --------------------

export async function fetchExpenses(filters = {}) {
  const params = new URLSearchParams();

  if (filters.date) {
    params.set('date', filters.date);
  }

  if (filters.month) {
    params.set('month', filters.month);
  }

  const query = params.toString();

  const url = query
    ? `${API_BASE_URL}/api/expenses?${query}`
    : `${API_BASE_URL}/api/expenses`;

  const response = await fetch(url);

  const result = await handleResponse(
    response,
    'Failed to load expenses'
  );

  return result.data;
}

export async function fetchMonthlyReport(month) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${month}`);
  const result = await handleResponse(response, 'Failed to load monthly report');
  return result.data;
}

export async function downloadMonthlyReport(month) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${month}/export`);
  if (!response.ok) throw new Error('Failed to export report');
  return response.blob();
}

export async function createExpense(expense) {
  const response = await fetch(
    `${API_BASE_URL}/api/expenses`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    }
  );

  const result = await handleResponse(
    response,
    'Failed to create expense'
  );

  return result.data;
}

export async function updateExpense(id, expense) {
  const response = await fetch(
    `${API_BASE_URL}/api/expenses/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    }
  );

  const result = await handleResponse(
    response,
    'Failed to update expense'
  );

  return result.data;
}

export async function deleteExpenseById(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/expenses/${id}`,
    {
      method: 'DELETE',
    }
  );

  await handleResponse(
    response,
    'Failed to delete expense'
  );

  return true;
}

// --------------------
// INCOME
// --------------------

export async function fetchIncome(filters = {}) {
  const params = new URLSearchParams();

  if (filters.date) {
    params.set('date', filters.date);
  }

  if (filters.month) {
    params.set('month', filters.month);
  }

  const query = params.toString();

  const url = query
    ? `${API_BASE_URL}/api/income?${query}`
    : `${API_BASE_URL}/api/income`;

  const response = await fetch(url);

  const result = await handleResponse(
    response,
    'Failed to load income'
  );

  return result.data;
}

export async function createIncome(income) {
  const response = await fetch(
    `${API_BASE_URL}/api/income`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(income),
    }
  );

  const result = await handleResponse(
    response,
    'Failed to create income'
  );

  return result.data;
}

export async function deleteIncomeById(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/income/${id}`,
    {
      method: 'DELETE',
    }
  );

  await handleResponse(
    response,
    'Failed to delete income'
  );

  return true;
}

// --------------------
// BUDGET
// --------------------

export async function fetchBudget(month) {
  const response = await fetch(
    `${API_BASE_URL}/api/budget/${month}`
  );

  const result = await handleResponse(
    response,
    'Failed to load budget'
  );

  return result.data;
}

export async function saveBudget(month, amount) {
  const response = await fetch(
    `${API_BASE_URL}/api/budget/${month}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    }
  );

  const result = await handleResponse(
    response,
    'Failed to save budget'
  );

  return result.data;
}
