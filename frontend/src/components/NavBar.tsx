import { NavLink } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">Café Manager</span>
        <div className="navbar-links">
          <NavLink
            to="/cafes"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Cafes
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Employees
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
