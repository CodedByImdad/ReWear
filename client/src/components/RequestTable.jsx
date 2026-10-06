import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import StatusBadge from './StatusBadge';
import { formatDateTime, truncate } from '../utils/helpers';

const Thumb = ({ item }) => {
  const src = getImageUrl(item?.image);
  if (!src) {
    return (
      <div
        className="bg-light text-secondary d-flex align-items-center justify-content-center rounded"
        style={{ width: 46, height: 46 }}
      >
        <i className="bi bi-image" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={item?.title}
      style={{ width: 46, height: 46, objectFit: 'cover', borderRadius: 6 }}
    />
  );
};

// perspective is derived per row from currentUserId, so lists that mix
// outgoing and incoming requests (My Exchanges / My Donations) behave correctly.
const RequestTable = ({ requests, currentUserId, onAction, busyId, showActions = true }) => {
  if (!requests.length) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-inbox display-5" />
        <p className="mt-2 mb-0">No requests to show here yet.</p>
      </div>
    );
  }

  const perspectiveOf = (r) =>
    String(r.requester?._id || r.requester) === String(currentUserId) ? 'requester' : 'owner';

  const actions = (r) => {
    if (!showActions) return <span className="text-muted small">-</span>;
    const perspective = perspectiveOf(r);
    const busy = busyId === r._id;
    const btn = (label, action, cls, icon) => (
      <button
        key={action}
        className={`btn btn-sm ${cls} me-1 mb-1`}
        disabled={busy}
        onClick={() => onAction(r, action)}
      >
        <i className={`bi ${icon} me-1`} />
        {busy ? 'Working...' : label}
      </button>
    );

    if (perspective === 'owner') {
      if (r.status === 'Pending') {
        return (
          <>
            {btn('Accept', 'accept', 'btn-success', 'bi-check-lg')}
            {btn('Reject', 'reject', 'btn-outline-danger', 'bi-x-lg')}
          </>
        );
      }
      if (r.status === 'Accepted') {
        return btn('Mark Completed', 'complete', 'btn-primary', 'bi-check2-all');
      }
    } else {
      if (r.status === 'Pending' || r.status === 'Accepted') {
        return btn('Cancel', 'cancel', 'btn-outline-secondary', 'bi-x-circle');
      }
      if (r.status === 'Accepted') {
        return btn('Mark Completed', 'complete', 'btn-primary', 'bi-check2-all');
      }
    }
    return <span className="text-muted small">No actions</span>;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Item</th>
            <th>Type</th>
            <th>Other member</th>
            <th>Message</th>
            <th>Status</th>
            <th>Date</th>
            {showActions && <th className="text-end">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => {
            const perspective = perspectiveOf(r);
            const other = perspective === 'requester' ? r.owner : r.requester;
            return (
            <tr key={r._id}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Thumb item={r.item} />
                  <div>
                    {r.item?._id ? (
                      <Link to={`/item/${r.item._id}`} className="fw-semibold text-decoration-none">
                        {r.item.title}
                      </Link>
                    ) : (
                      <span className="text-muted">Item removed</span>
                    )}
                    <div className="small text-muted">
                      {r.offeredItem?.title ? (
                        <>
                          <i className="bi bi-arrow-left-right me-1" />
                          Offered: {r.offeredItem.title}
                        </>
                      ) : (
                        `${r.item?.category || ''}${r.item?.size ? ` · ${r.item.size}` : ''}`
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td><StatusBadge value={r.type} /></td>
              <td>
                <div className="fw-semibold small">{other?.name || '-'}</div>
                <div className="small text-muted">{other?.email || ''}</div>
              </td>
              <td className="small text-muted" style={{ maxWidth: 220 }}>
                {r.message ? truncate(r.message, 90) : <em className="text-muted-2">No message</em>}
              </td>
              <td><StatusBadge value={r.status} /></td>
              <td className="small text-muted">{formatDateTime(r.createdAt)}</td>
              {showActions && <td className="text-end">{actions(r)}</td>}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
