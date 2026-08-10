# Personal Finance Tracker Finalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the personal finance tracker as a persistent, responsive JARVIS-glassmorphism application with transaction history, reports, and Excel export.

**Architecture:** Keep the existing Express/Mongoose CRUD system as the source of truth. Add a single monthly-report API that composes saved allowance, income, and expenses, then make all frontend monthly summaries consume the same API/data contract. Build the frontend from small shared controls and page-specific orchestration, with all styling in the existing global stylesheet.

**Tech Stack:** React 19, Vite 8, React Router 7, Node.js, Express 5, Mongoose, MongoDB, ExcelJS, CSS.

## Global Constraints

- Monthly balance is exactly `saved monthly allowance + income received in the month - expenses in the month`.
- Preserve existing expense, income, and budget endpoint paths and MongoDB documents.
- Use `Budget` as the sole persisted monthly-allowance model; do not activate `MonthlyBudget`.
- Keep the dark cyan JARVIS identity, enhanced with translucent glassmorphism; do not use Apple branding or copied assets.
- All pages must provide loading, empty, and error states and work on phone, tablet, and desktop.
- Validate monetary values as finite positive numbers and validate month values as `YYYY-MM`.

---

## Planned File Structure

| File | Responsibility |
| --- | --- |
| `backend/utils/month.js` | Validate months and build local month date ranges. |
| `backend/utils/reportMath.js` | Pure, tested monthly financial aggregation. |
| `backend/controllers/reportController.js` | Compose report data and stream export. |
| `backend/routes/reportRoutes.js` | Expose report summary and export endpoints. |
| `backend/utils/excelGenerator.js` | Create a report workbook from report data. |
| `frontend/src/services/api.js` | API client, including reports and export download. |
| `frontend/src/components/SummaryCards.jsx` | Four financial summary cards. |
| `frontend/src/components/BudgetForm.jsx` | Persisted monthly-allowance form. |
| `frontend/src/components/ExpenseForm.jsx` | Validated expense form with optional edit mode. |
| `frontend/src/components/ExpenseTable.jsx` | Responsive expense list/table with edit and delete actions. |
| `frontend/src/components/MonthPicker.jsx` | Reusable selected-month control. |
| `frontend/src/pages/*.jsx` | Page-level data loading and user workflows. |
| `frontend/src/index.css` | App shell, glass UI system, responsive layouts and dialogs. |

### Task 1: Add a tested report domain and report/export API

**Files:**
- Create: `backend/utils/month.js`, `backend/utils/reportMath.js`, `backend/tests/reportMath.test.js`
- Modify: `backend/controllers/reportController.js`, `backend/routes/reportRoutes.js`, `backend/utils/excelGenerator.js`, `backend/server.js`, `backend/package.json`

**Interfaces:**
- Produces `validateMonth(month)`, `getMonthRange(month)`, `buildMonthlyReport({ month, budget, income, expenses })`.
- Produces `GET /api/reports/:month` and `GET /api/reports/:month/export`.

- [ ] **Step 1: Write failing report-math tests.**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMonthlyReport } from '../utils/reportMath.js';

test('buildMonthlyReport includes allowance and income in remaining balance', () => {
  const report = buildMonthlyReport({ month: '2026-08', budget: { amount: 5000 }, income: [{ amount: 2000 }], expenses: [{ amount: 750, category: 'Food' }, { amount: 250, category: 'Food' }] });
  assert.equal(report.remaining, 6000);
  assert.deepEqual(report.categories, [{ category: 'Food', amount: 1000 }]);
});
```

- [ ] **Step 2: Run `npm test` in `backend`; confirm it fails because the module/script does not exist.**

- [ ] **Step 3: Implement strict month utilities and pure aggregation.**

```js
export const buildMonthlyReport = ({ month, budget, income, expenses }) => {
  const allowance = Number(budget?.amount || 0);
  const totalIncome = income.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const categories = Object.entries(expenses.reduce((map, entry) => ({ ...map, [entry.category]: (map[entry.category] || 0) + Number(entry.amount || 0) }), {})).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount);
  return { month, allowance, totalIncome, totalExpenses, remaining: allowance + totalIncome - totalExpenses, categories, income, expenses };
};
```

- [ ] **Step 4: Implement the report controller by querying `Budget`, `Income`, and `Expense` with `getMonthRange(month)`; return `{ success: true, data: report }`. Implement the export action using the same report and `res.attachment(`finance-report-${month}.xlsx`)`.**

- [ ] **Step 5: Implement the routes and registration.**

```js
router.get('/:month', getMonthlyReport);
router.get('/:month/export', exportMonthlyReport);
// server.js
app.use('/api/reports', reportRoutes);
```

- [ ] **Step 6: Build an Excel workbook with Summary, Expenses, and Income worksheets, including headers, currency-formatted amount columns, and the selected month.**

- [ ] **Step 7: Run `npm test` and `node --check server.js`; expect passing report math and no syntax errors.**

### Task 2: Normalize existing API validation and budget persistence

**Files:**
- Modify: `backend/controllers/budgetController.js`, `backend/controllers/expenseController.js`, `backend/controllers/incomeController.js`, `frontend/src/services/api.js`

**Interfaces:**
- Consumes `validateMonth` from Task 1.
- Produces `fetchMonthlyReport(month)` and `downloadMonthlyReport(month)` in the frontend API client.

- [ ] **Step 1: Add backend tests for invalid month strings and zero/negative money values; confirm the current endpoints accept or misreport invalid input.**
- [ ] **Step 2: Add one validator that rejects non-finite or non-positive transaction amounts and invalid `YYYY-MM` parameters with status 400.**
- [ ] **Step 3: Make budget reads return `null` when no month is saved and budget writes return the saved `Budget` document. Do not introduce a default budget document.**
- [ ] **Step 4: Add report client calls.**

```js
export async function fetchMonthlyReport(month) {
  const result = await handleResponse(await fetch(`${API_BASE_URL}/api/reports/${month}`), 'Failed to load monthly report');
  return result.data;
}

export async function downloadMonthlyReport(month) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${month}/export`);
  if (!response.ok) throw new Error('Failed to export report');
  return response.blob();
}
```

- [ ] **Step 5: Run backend tests and inspect an HTTP request for each invalid case, valid budget save/read, report JSON, and `.xlsx` response.**

### Task 3: Build shared financial UI primitives

**Files:**
- Create: `frontend/src/components/MonthPicker.jsx`, `frontend/src/components/StatusPanel.jsx`
- Modify: `frontend/src/components/SummaryCards.jsx`, `frontend/src/components/BudgetForm.jsx`, `frontend/src/components/ExpenseForm.jsx`, `frontend/src/components/ExpenseTable.jsx`, `frontend/src/components/IncomeTable.jsx`, `frontend/src/utils/formatters.js`

**Interfaces:**
- `MonthPicker({ id, value, onChange, label = 'REPORTING MONTH' })`
- `SummaryCards({ allowance, totalIncome, totalExpenses, remaining })`
- `BudgetForm({ month, budget, onSaveBudget })`
- `ExpenseTable({ expenses, onEditExpense, onDeleteExpense, emptyMessage })`

- [ ] **Step 1: Replace the incorrect `SummaryCards.jsx` budget-form content with four cards using `formatCurrency`.**
- [ ] **Step 2: Refactor `BudgetForm` to show the selected month, validate a positive finite amount, await save, and report errors through its page rather than `alert`.**
- [ ] **Step 3: Extend `ExpenseForm` with `initialExpense` and `onCancelEdit`; reset fields when the edit target or date changes. Ensure saving sends item, amount, category, date, and payment method only.**
- [ ] **Step 4: Make transaction and income lists reusable responsive tables with action labels, accessible buttons, and explicit empty copy.**
- [ ] **Step 5: Add `formatCurrency`, local-calendar `formatDate`, and `toMonthInputValue` helpers; use them everywhere rather than manual `Rs.` strings.**
- [ ] **Step 6: Run `npm run lint` in `frontend`; expect no ESLint errors.**

### Task 4: Complete the dashboard and settings around real monthly data

**Files:**
- Create: `frontend/src/pages/Settings.jsx`
- Modify: `frontend/src/pages/Dashboard.jsx`, `frontend/src/App.jsx`

**Interfaces:**
- Consumes `fetchMonthlyReport`, `fetchBudget`, `saveBudget`, and shared components from Tasks 2–3.
- Dashboard state: `{ selectedMonth, selectedDate, report, loading, error }`.

- [ ] **Step 1: Replace dashboard all-time expense loading and temporary `allowance = 5000` with a selected-month report request and saved budget read.**
- [ ] **Step 2: Render summary cards from `report.allowance`, `report.totalIncome`, `report.totalExpenses`, and `report.remaining`.**
- [ ] **Step 3: Save the selected month’s budget through `BudgetForm`; after save, refresh report data so no value is locally invented.**
- [ ] **Step 4: Keep the selected-day expense workflow; after create/delete, reload the selected month and derive the selected-day list from `report.expenses`.**
- [ ] **Step 5: Build Settings as the same persisted allowance control with a month picker and explanatory financial rule. Route `/settings` to it, removing `PlaceholderPage`.**
- [ ] **Step 6: Run lint and production build; manually verify allowance Rs.5,000 + income Rs.2,000 − expense Rs.1,000 displays Rs.6,000.**

### Task 5: Finish Transactions and Income workflows

**Files:**
- Modify: `frontend/src/pages/Transactions.jsx`, `frontend/src/pages/Income.jsx`, `frontend/src/services/api.js`

**Interfaces:**
- Transactions consumes `fetchExpenses({ month })`, `updateExpense(id, payload)`, and `deleteExpenseById(id)`.
- Income consumes `fetchIncome({ month, date? })`, `createIncome(payload)`, and `deleteIncomeById(id)`.

- [ ] **Step 1: Implement Transactions with month picker, category select derived from loaded records, case-insensitive item search, edit state, and delete confirmation.**
- [ ] **Step 2: Ensure edit saves with `updateExpense(id, payload)`, closes edit mode, and reloads the month; delete reloads the same filtered result.**
- [ ] **Step 3: Change Income from selected-day-only loading to selected-month history; keep an optional day filter and use the active date when saving a new income record.**
- [ ] **Step 4: Add loading, empty, and inline error states to both pages.**
- [ ] **Step 5: Run frontend lint/build, then manually test search, category filter, edit, delete, saving two income records on the same day, and month switching.**

### Task 6: Implement reports, export download, and the glassmorphism responsive UI

**Files:**
- Modify: `frontend/src/pages/Reports.jsx`, `frontend/src/components/Navbar.jsx`, `frontend/src/index.css`

**Interfaces:**
- Reports consumes `fetchMonthlyReport(month)` and `downloadMonthlyReport(month)`.
- Navbar produces a keyboard-accessible mobile menu toggle with `aria-expanded` and a close action on navigation.

- [ ] **Step 1: Implement Reports with month picker, four summary cards, category breakdown, and a disabled/exporting download button.**
- [ ] **Step 2: Download the Blob with a temporary object URL, filename `finance-report-${month}.xlsx`, then revoke the URL.**

```js
const blob = await downloadMonthlyReport(selectedMonth);
const url = URL.createObjectURL(blob);
Object.assign(document.createElement('a'), { href: url, download: `finance-report-${selectedMonth}.xlsx` }).click();
URL.revokeObjectURL(url);
```

- [ ] **Step 3: Add a mobile navigation toggle; preserve desktop sidebar behavior and close the menu when a route is selected.**
- [ ] **Step 4: Replace generic CSS with a coherent glass layer: low-opacity panel backgrounds, `backdrop-filter: blur(...) saturate(...)`, fine cyan borders, layered background gradients, clear contrast, reduced-motion support, and no text-overflow on small screens.**
- [ ] **Step 5: Add responsive breakpoints for desktop sidebar, tablet compact navigation, phone slide-out menu, stacked forms/cards, and horizontally scrollable data tables.**
- [ ] **Step 6: Run lint/build and visually inspect Dashboard, Transactions, Income, Reports, and Settings at 375px, 768px, and 1440px widths.**

### Task 7: End-to-end verification and delivery archive

**Files:**
- Modify only if verification finds a failing implementation issue.
- Create: `README.md` at project root if one does not already exist.

- [ ] **Step 1: Run backend `npm test` and startup syntax check; record output.**
- [ ] **Step 2: Run frontend `npm run lint` and `npm run build`; record output.**
- [ ] **Step 3: With MongoDB configured locally, exercise: budget save/read; expense create/read/update/delete; income create/delete; report JSON; and Excel export.**
- [ ] **Step 4: Add concise root README setup instructions for backend `.env` (`MONGO_URI`, optional `PORT`), frontend API URL, development commands, and the financial formula. Do not include secrets.**
- [ ] **Step 5: Package the completed source without `node_modules` or `.env` into an output ZIP for delivery.**
