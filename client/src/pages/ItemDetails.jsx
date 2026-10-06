import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import AlertMessage from '../components/AlertMessage';
import StatusBadge from '../components/StatusBadge';
import RequestModal from '../components/RequestModal';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { formatDate } from '../utils/helpers';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get(`/items/${id}`)
      .then(({ data }) => {
        setItem(data.data);
        setError('');
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  useDocumentTitle(item ? item.title : 'Item Details');

  const isOwner = !!item && !!user && String(item.owner?._id || item.owner) === String(user._id);
  const image = getImageUrl(item?.image);

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    setDeleting(true);
    setActionError('');
    try {
      await api.delete(`/items/${id}`);
      navigate('/my-listings', { replace: true });
    } catch (e) {
      setActionError(getErrorMessage(e));
      setDeleting(false);
    }
  };

  if (loading) return <div className="container page-container"><Loader text="Loading item..." /></div>;

  if (error || !item) {
    return (
      <div className="container page-container">
        <AlertMessage type="danger" message={error || 'Item not found'} />
        <Link to="/browse" className="btn btn-outline-success">
          <i className="bi bi-arrow-left me-2" />
          Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/browse">Browse</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{item.title}</li>
        </ol>
      </nav>

      {actionError && <AlertMessage type="danger" message={actionError} onClose={() => setActionError('')} />}
      {actionSuccess && <AlertMessage type="success" message={actionSuccess} onClose={() => setActionSuccess('')} />}

      <div className="row g-4">
        <div className="col-lg-6">
          {image ? (
            <img src={image} alt={item.title} className="detail-image" />
          ) : (
            <div className="detail-image d-flex align-items-center justify-content-center text-secondary">
              <i className="bi bi-image display-3" />
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
            <h1 className="h3 mb-0">{item.title}</h1>
            <div className="d-flex gap-2">
              <StatusBadge value={item.type} />
              <StatusBadge value={item.status} />
            </div>
          </div>
          <p className="text-muted">
            Listed on {formatDate(item.createdAt)} by{' '}
            <strong>{item.owner?.name || 'Unknown user'}</strong>
            {item.owner?.email && <span className="text-muted-2"> ({item.owner.email})</span>}
          </p>

          <div className="row g-3 mb-4">
            {[
              ['bi-tag', 'Category', item.category],
              ['bi-rulers', 'Size', item.size],
              ['bi-stars', 'Condition', item.condition],
              ['bi-gender-ambiguous', 'Target', item.gender],
              ['bi-geo-alt', 'Location', item.location],
              ['bi-arrow-left-right', 'Type', item.type],
            ].map(([icon, label, value]) => (
              <div className="col-6" key={label}>
                <div className="bg-light rounded p-2 h-100">
                  <div className="small text-muted">
                    <i className={`bi ${icon} me-1`} />
                    {label}
                  </div>
                  <div className="fw-semibold">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <h5 className="fw-bold">Description</h5>
          <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
            {item.description}
          </p>

          <hr />

          {isOwner ? (
            <div className="d-flex flex-wrap gap-2">
              <Link to={`/edit-item/${item._id}`} className="btn btn-outline-primary">
                <i className="bi bi-pencil me-2" />
                Edit
              </Link>
              <button
                className="btn btn-outline-danger"
                onClick={handleDelete}
                disabled={deleting || item.status === 'Exchanged' || item.status === 'Donated'}
              >
                <i className="bi bi-trash me-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <span className="align-self-center small text-muted">
                This is your listing, so edit or delete controls are shown here.
              </span>
            </div>
          ) : item.status === 'Available' ? (
            isLoggedIn ? (
              <button className="btn btn-success btn-lg px-4" onClick={() => setShowModal(true)}>
                <i className={`bi ${item.type === 'Donation' ? 'bi-gift' : 'bi-arrow-repeat'} me-2`} />
                {item.type === 'Donation' ? 'Request Donation' : 'Request Exchange'}
              </button>
            ) : (
              <div className="alert alert-info mb-0">
                <Link to="/login">Login</Link> to request this item.
              </div>
            )
          ) : (
            <div className="alert alert-secondary mb-0">
              This item is currently <strong>{item.status.toLowerCase()}</strong> and cannot be
              requested.
            </div>
          )}
        </div>
      </div>

      <RequestModal
        item={item}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setActionSuccess('Request sent to the owner. Track it under My Requests.');
          load();
        }}
      />
    </div>
  );
};

export default ItemDetails;
