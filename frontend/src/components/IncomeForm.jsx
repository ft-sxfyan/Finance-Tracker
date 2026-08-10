import { useState } from 'react';

function IncomeForm({ defaultDate, onAddIncome }) {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!source.trim() || !amount) {
      alert('Please enter the source and amount.');
      return;
    }

    if (!defaultDate) {
      alert('Please select a date first.');
      return;
    }

    try {
      setSubmitting(true);

      await onAddIncome({
        source: source.trim(),
        amount: Number(amount),
        date: defaultDate,
      });

      setSource('');
      setAmount('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="income-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="income-source">
            RECEIVED FROM
          </label>

          <input
            id="income-source"
            type="text"
            placeholder="e.g. Baba"
            value={source}
            onChange={(event) =>
              setSource(event.target.value)
            }
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="income-amount">
            AMOUNT
          </label>

          <input
            id="income-amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 2000"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            required
          />
        </div>
      </div>

      <div className="form-footer">
        <div>
          <span className="form-date-label">
            ACTIVE DATE
          </span>

          <strong>
            {defaultDate || 'No date selected'}
          </strong>
        </div>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? 'Saving...'
            : 'Receive Money'}
        </button>
      </div>
    </form>
  );
}

export default IncomeForm;