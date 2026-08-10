import { formatCurrency } from '../utils/formatters';

function SummaryCards({ allowance = 0, totalIncome = 0, totalExpenses = 0, remaining = 0 }) {
  const cards = [
    ['Monthly Allowance', allowance, 'allowance'],
    ['Income Received', totalIncome, 'income'],
    ['Total Spent', totalExpenses, 'spent'],
    ['Remaining Balance', remaining, remaining < 0 ? 'negative' : 'remaining'],
  ];

  return <div className="summary-cards">{cards.map(([label, value, tone]) => <article className={`summary-card ${tone}`} key={label}><span>{label}</span><strong>{formatCurrency(value)}</strong></article>)}</div>;
}

export default SummaryCards;
