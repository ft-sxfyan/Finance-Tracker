import { useState } from 'react';

function BudgetForm({ month, budget = 0, onSaveBudget }) {
  const [amount, setAmount] = useState(String(budget || ''));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) { setMessage('Enter a positive allowance amount.'); return; }
    try { setSaving(true); setMessage(''); await onSaveBudget(value); setMessage('Allowance saved.'); } catch (error) { setMessage(error.message); } finally { setSaving(false); }
  };

  return <form className="budget-form" onSubmit={handleSubmit}><label className="form-field" htmlFor={`budget-${month}`}><span>MONTHLY ALLOWANCE</span><input id={`budget-${month}`} key={month} type="number" min="1" step="0.01" defaultValue={budget || ''} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 5000" /></label><button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save allowance'}</button>{message && <small className="form-message">{message}</small>}</form>;
}

export default BudgetForm;
