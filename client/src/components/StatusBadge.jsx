const STATUS_STYLES = {
  Available: 'bg-success',
  Requested: 'bg-warning text-dark',
  Exchanged: 'bg-primary',
  Donated: 'bg-info text-dark',
  Removed: 'bg-secondary',
  Pending: 'bg-warning text-dark',
  Accepted: 'bg-success',
  Rejected: 'bg-danger',
  Cancelled: 'bg-secondary',
  Completed: 'bg-primary',
  Exchange: 'bg-primary',
  Donation: 'bg-info text-dark',
  admin: 'bg-danger',
  user: 'bg-secondary',
  active: 'bg-success',
  inactive: 'bg-secondary',
};

const StatusBadge = ({ value, pill = true }) => {
  if (!value) return null;
  const cls = STATUS_STYLES[value] || 'bg-secondary';
  return <span className={`badge ${pill ? 'rounded-pill' : ''} ${cls}`}>{value}</span>;
};

export default StatusBadge;
