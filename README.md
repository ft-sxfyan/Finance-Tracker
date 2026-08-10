# Personal Finance Tracker

`Remaining balance = monthly allowance + monthly income - monthly expenses`.

## Run locally

1. In `backend`, create `.env` with `MONGO_URI` and optionally `PORT=5000`, then run `npm start`.
2. In `frontend`, run `npm run dev`. Set `VITE_API_BASE_URL` only when the API is not at `http://localhost:5000`.

The Reports page provides a monthly Excel export.
