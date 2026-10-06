import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  const guestLinks = (
    <>
      <li className="nav-item">
        <NavLink className={navClass} to="/" end onClick={close}>
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={navClass} to="/about" onClick={close}>
          About
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={navClass} to="/how-it-works" onClick={close}>
          How It Works
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={navClass} to="/browse" onClick={close}>
          Browse
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={navClass} to="/impact" onClick={close}>
          Impact
        </NavLink>
      </li>
      <li className="nav-item ms-lg-2">
        <Link className="btn btn-outline-success btn-sm px-3 me-2" to="/login" onClick={close}>
          Login
        </Link>
        <Link className="btn btn-success btn-sm px-3" to="/register" onClick={close}>
          Register
        </Link>
      </li>
    </>
  );

  const userLinks = (
    <>
      <li className="nav-item">
        <NavLink className={navClass} to="/" end onClick={close}>
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={navClass} to="/browse" onClick={close}>
          Browse
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={navClass} to="/add-item" onClick={close}>
          Add Item
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={navClass} to="/impact" onClick={close}>
          Impact
        </NavLink>
      </li>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#dashboard"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={(e) => e.preventDefault()}
        >
          <i className="bi bi-person-circle me-1" />
          {user?.name?.split(' ')[0] || 'Account'}
        </a>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <Link className="dropdown-item" to="/dashboard" onClick={close}>
              <i className="bi bi-speedometer2 me-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/profile" onClick={close}>
              <i className="bi bi-person me-2" />
              Profile
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/my-listings" onClick={close}>
              <i className="bi bi-grid me-2" />
              My Listings
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/my-requests" onClick={close}>
              <i className="bi bi-arrow-left-right me-2" />
              My Requests
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/incoming-requests" onClick={close}>
              <i className="bi bi-inbox me-2" />
              Incoming Requests
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/my-exchanges" onClick={close}>
              <i className="bi bi-arrow-repeat me-2" />
              My Exchanges
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/my-donations" onClick={close}>
              <i className="bi bi-gift me-2" />
              My Donations
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item text-danger" to="/admin" onClick={close}>
                  <i className="bi bi-shield-lock me-2" />
                  Admin Dashboard
                </Link>
              </li>
            </>
          )}
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button className="dropdown-item text-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2" />
              Logout
            </button>
          </li>
        </ul>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm rewear-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/" onClick={close}>
          <span className="brand-mark">
            <i className="bi bi-recycle" />
          </span>
          Re<span className="text-success">Wear</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {isLoggedIn ? userLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
