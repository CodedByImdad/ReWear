import { useEffect, useState } from 'react';
import api, { getErrorMessage, getImageUrl } from '../services/api';
import AlertMessage from './AlertMessage';

// Modal used for both donation requests and exchange requests.
const RequestModal = ({ item, show, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [offeredItemId, setOfferedItemId] = useState('');
  const [myItems, setMyItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isExchange = item?.type === 'Exchange';

  useEffect(() => {
    if (!show) {
      setMessage('');
      setOfferedItemId('');
      setError('');
      return;
    }
    if (isExchange) {
      setLoadingItems(true);
      api
        .get('/items', { params: { mine: '1', status: 'Available' } })
        .then(({ data }) => setMyItems(data.data || []))
        .catch((e) => setError(getErrorMessage(e)))
        .finally(() => setLoadingItems(false));
    }
  }, [show, isExchange]);

  if (!show || !item) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (isExchange && !offeredItemId) {
      setError('Please select one of your available items to offer in exchange.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/requests', {
        itemId: item._id,
        message,
        offeredItemId: isExchange ? offeredItemId : undefined,
      });
      onSuccess?.(data.data);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const image = getImageUrl(item.image);

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isExchange ? (
                <>
                  <i className="bi bi-arrow-repeat me-2 text-primary" />
                  Request Exchange
                </>
              ) : (
                <>
                  <i className="bi bi-gift me-2 text-info" />
                  Request Donation
                </>
              )}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <form onSubmit={submit}>
            <div className="modal-body">
              {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

              <div className="d-flex align-items-center gap-3 mb-3 p-2 bg-light rounded">
                {image ? (
                  <img
                    src={image}
                    alt={item.title}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-white text-secondary"
                    style={{ width: 64, height: 64, borderRadius: 8 }}
                  >
                    <i className="bi bi-image" />
                  </div>
                )}
                <div>
                  <strong>{item.title}</strong>
                  <div className="small text-muted">
                    {item.category} &middot; {item.size} &middot; {item.condition} &middot;{' '}
                    {item.location}
                  </div>
                </div>
              </div>

              <label className="form-label">Message to owner (optional)</label>
              <textarea
                className="form-control"
                rows={3}
                maxLength={500}
                placeholder={
                  isExchange
                    ? 'Introduce yourself and explain why you would like to exchange...'
                    : 'Introduce yourself and explain why you would like this donation...'
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              {isExchange && (
                <div className="mt-3">
                  <label className="form-label">
                    Your item to offer <span className="text-danger">*</span>
                  </label>
                  {loadingItems ? (
                    <div className="text-muted small">Loading your available items...</div>
                  ) : myItems.length === 0 ? (
                    <div className="alert alert-warning py-2 small mb-0">
                      You have no available items to offer.{' '}
                      <a href="/add-item">List an item</a> first, then request an exchange.
                    </div>
                  ) : (
                    <select
                      className="form-select"
                      value={offeredItemId}
                      onChange={(e) => setOfferedItemId(e.target.value)}
                      required
                    >
                      <option value="">-- Select one of your items --</option>
                      {myItems.map((it) => (
                        <option key={it._id} value={it._id}>
                          {it.title} ({it.category}, {it.size}, {it.condition})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting || (isExchange && myItems.length === 0)}
              >
                {submitting ? 'Sending...' : `Send ${item.type} Request`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
