import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Register = () => {
  useDocumentTitle('Register');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    const result = await register(form.name.trim(), form.email.trim(), form.password);
    setBusy(false);
    if (result.ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container page-container">
      <div className="card content-card form-card border-0 p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="feature-icon mx-auto bg-success-subtle text-success mb-3">
            <i className="bi bi-person-plus" />
          </div>
          <h1 className="h4 fw-bold">Create your account</h1>
          <p className="text-muted small mb-0">
            Join ReWear and start reusing, exchanging and donating clothing.
          </p>
        </div>

        <AlertMessage type="danger" message={error} onClose={() => setError('')} />

        <form onSubmit={submit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full name</label>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="Your name"
              value={form.name}
              onChange={set('name')}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={set('password')}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm" className="form-label">Confirm password</label>
            <input
              id="confirm"
              type="password"
              className="form-control"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={set('confirm')}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 py-2 fw-semibold" disabled={busy}>
            {busy ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center small text-muted mt-4 mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
