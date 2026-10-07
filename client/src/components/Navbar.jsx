import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);

  useEffect(() => {
    if (!accountOpen) return undefined;

    const handleOutsideClick = (e) => {
      if (!e.target.closest('.account-dropdown')) setAccountOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setAccountOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [accountOpen]);

  const handleLogout = () => {
    logout();
    close();
    setAccountOpen(false);
    navigate('/');
  };

  const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  const handleItemClick = () => {
    close();
    setAccountOpen(false);
  };

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
      <li className="nav-item dropdown account-dropdown">
        <button
          type="button"
          className="nav-link dropdown-toggle border-0 bg-transparent text-start"
          role="button"
          aria-expanded={accountOpen}
          onClick={() => setAccountOpen((v) => !v)}
        >
          <i className="bi bi-person-circle me-1" />
          {user?.name?.split(' ')[0] || 'Account'}
        </button>
        <ul className={`dropdown-menu dropdown-menu-end${accountOpen ? ' show' : ''}`}>
          <li>
            <Link className="dropdown-item" to="/dashboard" onClick={handleItemClick}>
              <i className="bi bi-speedometer2 me-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/profile" onClick={handleItemClick}>
              <i className="bi bi-person me-2" />
              Profile
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/my-listings" onClick={handleItemClick}>
              <i className="bi bi-grid me-2" />
              My Listings
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/my-requests" onClick={handleItemClick}>
              <i className="bi bi-arrow-left-right me-2" />
              My Requests
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/incoming-requests" onClick={handleItemClick}>
              <i className="bi bi-inbox me-2" />
              Incoming Requests
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/my-exchanges" onClick={handleItemClick}>
              <i className="bi bi-arrow-repeat me-2" />
              My Exchanges
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" to="/my-donations" onClick={handleItemClick}>
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
                <Link className="dropdown-item text-danger" to="/admin" onClick={handleItemClick}>
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
