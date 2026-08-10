import { NavLink } from 'react-router-dom';

function Navbar() {
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Income', path: '/income' },
    { label: 'Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">◈</div>

        <div>
          <h1>FINANCE CORE</h1>
          <span>PERSONAL SYSTEM</span>
        </div>
      </div>

      <div className="sidebar-status">
        <span className="status-dot"></span>
        <span>SYSTEM ONLINE</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-indicator"></span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>FINANCE CORE</span>
        <span>v1.0.0</span>
      </div>
    </aside>
  );
}

export default Navbar;