import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/helpers';

const AdminUsers = () => {
  useDocumentTitle('Manage Users');
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get('/admin/users')
      .then(({ data }) => setUsers(data.data.users || []))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggle = async (u) => {
    setError('');
    setSuccess('');
    setBusyId(u._id);
    try {
      const { data } = await api.put(`/admin/users/${u._id}/toggle-status`);
      setSuccess(data.message);
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name} (${u.email})? Their listings and requests will also be removed.`)) {
      return;
    }
    setError('');
    setSuccess('');
    setBusyId(u._id);
    try {
      const { data } = await api.delete(`/admin/users/${u._id}`);
      setSuccess(data.message);
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container page-container">
      <PageHeader
        title="Manage Users"
        icon="bi-people"
        subtitle={`${users.length} registered account${users.length === 1 ? '' : 's'}`}
      >
        <Link to="/admin" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-speedometer2 me-1" /> Admin Home
        </Link>
      </PageHeader>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card content-card border-0 p-3">
        {loading ? (
          <Loader text="Loading users..." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Listings</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = String(u._id) === String(me?._id);
                  return (
                    <tr key={u._id}>
                      <td className="fw-semibold">
                        {u.name}
                        {isSelf && <span className="badge bg-dark ms-2">You</span>}
                      </td>
                      <td className="small">{u.email}</td>
                      <td><StatusBadge value={u.role} /></td>
                      <td>{u.listingCount}</td>
                      <td>
                        <StatusBadge value={u.isActive ? 'active' : 'inactive'} />
                      </td>
                      <td className="small text-muted">{formatDate(u.createdAt)}</td>
                      <td className="text-end text-nowrap">
                        {u.role === 'admin' || isSelf ? (
                          <span className="small text-muted">Protected</span>
                        ) : (
                          <>
                            <button
                              className={`btn btn-sm me-1 ${u.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              disabled={busyId === u._id}
                              onClick={() => toggle(u)}
                            >
                              <i className={`bi ${u.isActive ? 'bi-slash-circle' : 'bi-check-circle'} me-1`} />
                              {busyId === u._id ? '...' : u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              disabled={busyId === u._id}
                              onClick={() => remove(u)}
                            >
                              <i className="bi bi-trash me-1" />
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
