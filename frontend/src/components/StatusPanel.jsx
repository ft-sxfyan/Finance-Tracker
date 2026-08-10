function StatusPanel({ type = 'info', title, children }) {
  return (
    <section className={`status-panel status-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {title && <strong>{title}</strong>}
      <p>{children}</p>
    </section>
  );
}

export default StatusPanel;
