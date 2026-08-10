import { useState } from 'react';

const empty = { item: '', amount: '', category: 'Food', paymentMethod: 'Cash' };

function ExpenseForm({ defaultDate, initialExpense, onSaveExpense, onCancelEdit }) {
  const [form, setForm] = useState(initialExpense ? { ...initialExpense, amount: String(initialExpense.amount) } : empty);
  const [saving, setSaving] = useState(false);
  const editing = Boolean(initialExpense?._id || initialExpense?.id);
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.item.trim() || !form.category.trim() || Number(form.amount) <= 0) return;
    try { setSaving(true); await onSaveExpense({ ...form, item: form.item.trim(), category: form.category.trim(), amount: Number(form.amount), date: defaultDate }); if (!editing) setForm(empty); } finally { setSaving(false); }
  };
  return <form className="expense-form" onSubmit={submit}><div className="form-grid"><label className="form-field"><span>WHAT DID YOU BUY?</span><input name="item" value={form.item} onChange={change} placeholder="e.g. Lunch" required /></label><label className="form-field"><span>AMOUNT</span><input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={change} placeholder="e.g. 250" required /></label><label className="form-field"><span>CATEGORY</span><input name="category" value={form.category} onChange={change} required /></label><label className="form-field"><span>PAYMENT METHOD</span><select name="paymentMethod" value={form.paymentMethod} onChange={change}><option>Cash</option><option>Card</option><option>Bank Transfer</option><option>Other</option></select></label></div><div className="form-footer"><span>Active date: <strong>{defaultDate}</strong></span><div className="button-row">{editing && <button type="button" className="button-quiet" onClick={onCancelEdit}>Cancel</button>}<button type="submit" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add expense'}</button></div></div></form>;
}

export default ExpenseForm;
