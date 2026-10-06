import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage, getImageUrl } from '../../services/api';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/helpers';
import { ITEM_STATUSES } from '../../utils/constants';

const AdminItems = () => {
  useDocumentTitle('Manage Listings');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (search.trim()) params.search = search.trim();
    api
      .get('/admin/items', { params })
      .then(({ data }) => setItems(data.data || []))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  const remove = async (item) => {
    if (!window.confirm(`Remove "${item.title}" from the platform?`)) return;
    setError('');
    setSuccess('');
    setBusyId(item._id);
    try {
      const { data } = await api.delete(`/admin/items/${item._id}`);
      setSuccess(data.message);
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="container page-container">
      <PageHeader
        title="Manage Listings"
        icon="bi-grid"
        subtitle={`${items.length} listing${items.length === 1 ? '' : 's'} shown`}
      >
        <Link to="/admin" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-speedometer2 me-1" /> Admin Home
        </Link>
      </PageHeader>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card content-card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small text-muted mb-1">Filter by status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {ITEM_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label small text-muted mb-1">Search title/description</label>
            <form onSubmit={searchSubmit} className="d-flex gap-2">
              <input
                className="form-control"
                placeholder="Search listings"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-outline-success" type="submit">
                <i className="bi bi-search" />
              </button>
            </form>
          </div>
          <div className="col-md-3 text-md-end">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => { setStatus(''); setSearch(''); }}
            >
              <i className="bi bi-x-circle me-1" /> Clear
            </button>
          </div>
        </div>
      </div>

      <div className="card content-card border-0 p-3">
        {loading ? (
          <Loader text="Loading listings..." />
        ) : items.length === 0 ? (
          <div className="text-center py-5 text-muted">No listings match these filters.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Owner</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Listed</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const img = getImageUrl(item.image);
                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {img ? (
                            <img
                              src={img}
                              alt={item.title}
                              style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 6 }}
                            />
                          ) : (
                            <div
                              className="bg-light text-secondary d-flex align-items-center justify-content-center rounded"
                              style={{ width: 42, height: 42 }}
                            >
                              <i className="bi bi-image" />
                            </div>
                          )}
                          <div>
                            <Link to={`/item/${item._id}`} className="fw-semibold text-decoration-none small">
                              {item.title}
                            </Link>
                            <div className="small text-muted">
                              {item.category} · {item.size} · {item.condition}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="small">
                        {item.owner?.name}
                        <div className="text-muted">{item.owner?.email}</div>
                      </td>
                      <td><StatusBadge value={item.type} /></td>
                      <td><StatusBadge value={item.status} /></td>
                      <td className="small text-muted">{formatDate(item.createdAt)}</td>
                      <td className="text-end text-nowrap">
                        <Link to={`/item/${item._id}`} className="btn btn-sm btn-outline-secondary me-1">
                          <i className="bi bi-eye" /> View
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(item)}
                          disabled={busyId === item._id || item.status === 'Removed'}
                        >
                          <i className="bi bi-slash-circle me-1" />
                          {busyId === item._id ? '...' : item.status === 'Removed' ? 'Removed' : 'Remove'}
                        </button>
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

export default AdminItems;
