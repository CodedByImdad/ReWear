import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../services/api';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDateTime, truncate } from '../../utils/helpers';
import { REQUEST_STATUSES, TYPES } from '../../utils/constants';

const AdminRequests = () => {
  useDocumentTitle('Manage Requests');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (type) params.type = type;
    api
      .get('/admin/requests', { params })
      .then(({ data }) => setRequests(data.data || []))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [status, type]);

  return (
    <div className="container page-container">
      <PageHeader
        title="Manage Requests"
        icon="bi-arrow-left-right"
        subtitle={`${requests.length} request${requests.length === 1 ? '' : 's'} shown`}
      >
        <Link to="/admin" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-speedometer2 me-1" /> Admin Home
        </Link>
      </PageHeader>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

      <div className="card content-card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label small text-muted mb-1">Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {REQUEST_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small text-muted mb-1">Type</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All types</option>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-md-4 text-md-end">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => { setStatus(''); setType(''); }}
            >
              <i className="bi bi-x-circle me-1" /> Clear
            </button>
          </div>
        </div>
      </div>

      <div className="card content-card border-0 p-3">
        {loading ? (
          <Loader text="Loading requests..." />
        ) : requests.length === 0 ? (
          <div className="text-center py-5 text-muted">No requests match these filters.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Requester</th>
                  <th>Owner</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td className="small">
                      {r.item?._id ? (
                        <Link to={`/item/${r.item._id}`} className="fw-semibold text-decoration-none">
                          {r.item.title}
                        </Link>
                      ) : (
                        <span className="text-muted">Item removed</span>
                      )}
                      {r.offeredItem?.title && (
                        <div className="small text-muted">
                          <i className="bi bi-arrow-left-right me-1" />
                          Offered: {r.offeredItem.title}
                        </div>
                      )}
                    </td>
                    <td><StatusBadge value={r.type} /></td>
                    <td className="small">
                      {r.requester?.name}
                      <div className="text-muted">{r.requester?.email}</div>
                    </td>
                    <td className="small">
                      {r.owner?.name}
                      <div className="text-muted">{r.owner?.email}</div>
                    </td>
                    <td className="small text-muted" style={{ maxWidth: 200 }}>
                      {r.message ? truncate(r.message, 80) : <em>-</em>}
                    </td>
                    <td><StatusBadge value={r.status} /></td>
                    <td className="small text-muted">{formatDateTime(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequests;
