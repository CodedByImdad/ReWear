import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Login = () => {
  useDocumentTitle('Login');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setBusy(true);
    const result = await login(form.email, form.password);
    setBusy(false);
    if (result.ok) {
      navigate(location.state?.from || (result.user.role === 'admin' ? '/admin' : '/dashboard'), {
        replace: true,
      });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container page-container">
      <div className="card content-card form-card border-0 p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="feature-icon mx-auto bg-success-subtle text-success mb-3">
            <i className="bi bi-box-arrow-in-right" />
          </div>
          <h1 className="h4 fw-bold">Welcome back</h1>
          <p className="text-muted small mb-0">Log in to continue reusing clothes with ReWear.</p>
        </div>

        <AlertMessage type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 py-2 fw-semibold" disabled={busy}>
            {busy ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center small text-muted mt-4 mb-0">
          New to ReWear? <Link to="/register">Create an account</Link>
        </p>
        <div className="alert alert-light border small mt-3 mb-0">
          <strong>Demo credentials (seeded database):</strong>
          <br />
          Admin: <code>admin@rewear.test / Admin@123</code>
          <br />
          User: <code>aarav@rewear.test / Password@123</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
