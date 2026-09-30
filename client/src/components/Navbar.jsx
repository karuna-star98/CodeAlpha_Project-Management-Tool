import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark">TF</span>
          <span>TaskFlow</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <div className="nav-user">
          <div className="avatar">{initial}</div>
          <div className="nav-user-copy"><strong>{user?.name}</strong><span>{user?.email}</span></div>
          <button className="icon-button" title="Logout" onClick={() => { logout(); navigate('/login'); }}>↪</button>
        </div>
      </div>
    </header>
  );
}
