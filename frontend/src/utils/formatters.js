export function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString('en-PK', {
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  });
}

export function toDateInputValue(value = new Date()) {
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

export function toMonthInputValue(value = new Date()) {
  const date = new Date(value);
  return date.toISOString().slice(0, 7);
}
