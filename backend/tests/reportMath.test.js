import assert from 'node:assert/strict';
import test from 'node:test';

import { buildMonthlyReport } from '../utils/reportMath.js';

test('buildMonthlyReport adds allowance and income before subtracting expenses', () => {
  const report = buildMonthlyReport({
    month: '2026-08',
    budget: { amount: 5000 },
    income: [{ amount: 2000 }],
    expenses: [
      { amount: 750, category: 'Food' },
      { amount: 250, category: 'Food' },
    ],
  });

  assert.equal(report.allowance, 5000);
  assert.equal(report.totalIncome, 2000);
  assert.equal(report.totalExpenses, 1000);
  assert.equal(report.remaining, 6000);
  assert.deepEqual(report.categories, [
    { category: 'Food', amount: 1000 },
  ]);
});

test('buildMonthlyReport handles a month with no budget or activity', () => {
  const report = buildMonthlyReport({
    month: '2026-08',
    budget: null,
    income: [],
    expenses: [],
  });

  assert.equal(report.remaining, 0);
  assert.deepEqual(report.categories, []);
});
