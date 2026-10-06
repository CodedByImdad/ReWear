import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import AlertMessage from '../components/AlertMessage';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { formatDate } from '../utils/helpers';

const MyListings = () => {
  useDocumentTitle('My Listings');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get('/items', { params: { mine: '1' } })
      .then(({ data }) => setItems(data.data || []))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setBusyId(item._id);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.delete(`/items/${item._id}`);
      setSuccess(data.message || 'Item deleted');
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
        title="My Clothing Listings"
        icon="bi-grid"
        subtitle={`${items.length} listing${items.length === 1 ? '' : 's'} you have created`}
      >
        <Link to="/add-item" className="btn btn-success">
          <i className="bi bi-plus-circle me-2" />
          Add Item
        </Link>
      </PageHeader>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-grid display-4 text-muted" />
          <h5 className="mt-3">You have not listed any clothing yet</h5>
          <p className="text-muted">List an unused garment to start the reuse cycle.</p>
          <Link to="/add-item" className="btn btn-success">Add your first item</Link>
        </div>
      ) : (
        <div className="card content-card border-0 p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Size</th>
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
                              style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }}
                            />
                          ) : (
                            <div
                              className="bg-light text-secondary d-flex align-items-center justify-content-center rounded"
                              style={{ width: 44, height: 44 }}
                            >
                              <i className="bi bi-image" />
                            </div>
                          )}
                          <div>
                            <Link to={`/item/${item._id}`} className="fw-semibold text-decoration-none">
                              {item.title}
                            </Link>
                            <div className="small text-muted">{item.condition} &middot; {item.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="small">{item.category}</td>
                      <td className="small">{item.size}</td>
                      <td><StatusBadge value={item.type} /></td>
                      <td><StatusBadge value={item.status} /></td>
                      <td className="small text-muted">{formatDate(item.createdAt)}</td>
                      <td className="text-end text-nowrap">
                        <Link to={`/item/${item._id}`} className="btn btn-sm btn-outline-secondary me-1">
                          <i className="bi bi-eye" /> View
                        </Link>
                        <Link
                          to={`/edit-item/${item._id}`}
                          className="btn btn-sm btn-outline-primary me-1"
                          disabled={item.status === 'Exchanged' || item.status === 'Donated' || item.status === 'Removed'}
                        >
                          <i className="bi bi-pencil" /> Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(item)}
                          disabled={busyId === item._id || item.status === 'Exchanged' || item.status === 'Donated'}
                        >
                          <i className="bi bi-trash" /> {busyId === item._id ? '...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
