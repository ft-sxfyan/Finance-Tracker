function MonthPicker({ id, value, onChange, label = 'REPORTING MONTH' }) {
  return (
    <label className="control-label" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type="month" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default MonthPicker;
