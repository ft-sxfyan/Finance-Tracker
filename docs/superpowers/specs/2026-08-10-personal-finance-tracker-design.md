# Personal Finance Tracker Finalization Design

## Goal

Deliver a responsive personal finance tracker with persistent MongoDB data and a coherent JARVIS-inspired interface. The application must support monthly allowance, additional income, expenses, transaction history, monthly reports, and Excel export.

## Financial Rule

For a selected calendar month, the available balance is:

`saved monthly allowance + income received in the month - expenses in the month`

The allowance is stored once per `YYYY-MM` month. Income and expenses are stored as dated records. All summary views calculate from these saved records.

## Existing System to Preserve

- Express and MongoDB endpoints for expenses, income, and monthly budget.
- React/Vite frontend and React Router application shell.
- Existing expense and income MongoDB schemas and create/delete flows.

The unused `MonthlyBudget` model is removed from the active architecture; `Budget` is the only monthly-allowance model.

## Application Pages

### Dashboard

- Month selector and selected-day control.
- Saved monthly allowance, income, expense, and remaining-balance summary cards.
- Monthly allowance editor saved through the budget API.
- Expense entry for the selected date.
- Selected-day activity list with deletion.

### Transactions

- Complete expense history for the selected month.
- Search by item, plus category and month filters.
- Edit and delete an expense using the existing expense API.

### Income

- Date-based entry with source and amount.
- Monthly history, with optional date filter, and deletion.
- Monthly income total.

### Reports

- Monthly allowance, income, spending, and remaining balance.
- Spending totals grouped by category.
- Downloadable Excel workbook for the selected month.

### Settings

- Single-purpose monthly allowance configuration, using the same persisted budget data rather than a duplicate setting.

## Backend Additions

- Register `/api/reports` in the Express server.
- Implement a monthly report endpoint that returns budget, income total, expense total, balance, category totals, and records for the selected month.
- Implement an Excel export endpoint for the selected month.
- Validate `YYYY-MM` and monetary input at API boundaries. Preserve the existing expense, income, and budget route contracts where practical.

## Frontend Architecture

- Centralize API calls in `src/services/api.js`.
- Use shared date, currency, table, summary-card, and form patterns rather than duplicated calculations on each page.
- Resolve the erroneous `SummaryCards.jsx` implementation so it renders summary cards rather than a budget form.
- Load records by month instead of fetching all time for monthly dashboard calculations.
- Provide clear loading, empty, and recoverable error states.

## UX and Responsive Design

- Maintain the dark cyan JARVIS-inspired visual system, enhanced with a glassmorphism treatment: translucent blurred panels, subtle layered gradients, restrained highlights, soft shadows, and responsive micro-interactions. The visual direction is inspired by contemporary frosted-glass interfaces, without using Apple branding or copied assets.
- Use semantic controls and keyboard-accessible dialogs/forms.
- Convert fixed sidebar navigation into a compact mobile-friendly navigation at narrow widths.
- Make forms and table data usable on phone, tablet, and desktop widths.

## Verification

- Frontend lint and production build complete successfully.
- Server loads routes without import/runtime errors.
- Test the API contract for budget save/read, expense CRUD, income create/delete, monthly report, and Excel export.
- Manually verify the primary UI workflows with the financial rule above.

## Non-goals

- Authentication, multi-user accounts, bank integrations, and cloud deployment are outside this finalization pass.
