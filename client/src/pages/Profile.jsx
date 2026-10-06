import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import AlertMessage from '../components/AlertMessage';
import PageHeader from '../components/PageHeader';
import Loader from '../components/Loader';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { formatDate } from '../utils/helpers';

const Profile = () => {
  useDocumentTitle('My Profile');
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/users/profile')
      .then(({ data }) => {
        setForm({ name: data.data.name || '', email: data.data.email || '', password: '' });
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage(null);
    if (!form.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    if (form.password && form.password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      const body = { name: form.name.trim(), email: form.email.trim() };
      if (form.password) body.password = form.password;
      const { data } = await api.put('/users/profile', body);
      setForm({ ...form, password: '' });
      setMessage(data.message || 'Profile updated successfully');
      await refreshUser();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container page-container"><Loader /></div>;

  return (
    <div className="container page-container">
      <PageHeader title="My Profile" icon="bi-person" subtitle="Manage your account details" />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card content-card p-4 text-center">
            <div
              className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 84, height: 84, fontSize: '2rem' }}
            >
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <h5 className="fw-bold mb-0">{user?.name}</h5>
            <div className="text-muted small">{user?.email}</div>
            <div className="mt-2">
              <span className={`badge rounded-pill ${user?.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                {user?.role === 'admin' ? 'Administrator' : 'Member'}
              </span>
            </div>
            <hr />
            <div className="text-start small">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Joined</span>
                <span className="fw-semibold">{formatDate(user?.createdAt)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Account status</span>
                <span className={`fw-semibold ${user?.isActive ? 'text-success' : 'text-danger'}`}>
                  {user?.isActive ? 'Active' : 'Deactivated'}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Role</span>
                <span className="fw-semibold">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card content-card p-4">
            <h5 className="fw-bold mb-3">Edit information</h5>

            {message && <AlertMessage type="success" message={message} onClose={() => setMessage(null)} />}
            {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Full name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">
                  New password <span className="text-muted small">(leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="alert alert-light border small">
                <i className="bi bi-info-circle me-1" />
                For security, your role cannot be changed from this page. Role changes are handled
                by administrators.
              </div>

              <button className="btn btn-success px-4" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
