import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import AlertMessage from '../components/AlertMessage';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ItemCard from '../components/ItemCard';
import StatusBadge from '../components/StatusBadge';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { formatDate, truncate } from '../utils/helpers';

const Dashboard = () => {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/users/impact'),
      api.get('/items', { params: { mine: '1' } }),
      api.get('/requests/my'),
      api.get('/requests/incoming'),
    ])
      .then(([s, i, r, inc]) => {
        setStats(s.data.data);
        setItems(i.data.data || []);
        setRequests(r.data.data || []);
        setIncoming(inc.data.data || []);
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container page-container"><Loader text="Loading your dashboard..." /></div>;

  const recentItems = items.slice(0, 3);
  const recentRequests = [...requests, ...incoming]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="container page-container">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'there'}`}
        icon="bi-speedometer2"
        subtitle="Your reuse activity at a glance"
      >
        <Link to="/profile" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-person me-1" />
          Edit Profile
        </Link>
      </PageHeader>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

      <div className="row g-3 mb-4">
        <StatCard icon="bi-grid" label="My Listings" value={stats?.myListings ?? 0} tone="success" />
        <StatCard icon="bi-hourglass-split" label="Pending Requests" value={stats?.myPendingRequests ?? 0} tone="warning" />
        <StatCard icon="bi-inbox" label="Incoming Pending" value={stats?.incomingPendingRequests ?? 0} tone="info" />
        <StatCard icon="bi-arrow-repeat" label="Completed Exchanges" value={stats?.completedExchanges ?? 0} tone="primary" />
        <StatCard icon="bi-gift" label="Completed Donations" value={stats?.completedDonations ?? 0} tone="danger" />
        <StatCard icon="bi-star" label="My Impact Score" value={stats?.impactScore ?? 0} tone="success" />
      </div>

      <div className="row g-3 mb-4">
        {[
          ['/add-item', 'bi-plus-circle', 'Add Clothing', 'btn-success'],
          ['/browse', 'bi-search', 'Browse Clothes', 'btn-outline-success'],
          ['/my-requests', 'bi-arrow-left-right', 'My Requests', 'btn-outline-primary'],
          ['/incoming-requests', 'bi-inbox', 'Incoming Requests', 'btn-outline-info'],
        ].map(([to, icon, label, cls]) => (
            <div className="col-6 col-md-3" key={label}>
              <Link to={to} className={`quick-action card border-0 shadow-sm ${cls}`}>
                <i className={`bi ${icon} fs-3 mb-2`} />
                <span className="fw-semibold small">{label}</span>
              </Link>
            </div>
          )
        )}
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card content-card border-0 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
              <h5 className="mb-0 fw-bold">Recent Listings</h5>
              <Link to="/my-listings" className="small">View all</Link>
            </div>
            {recentItems.length === 0 ? (
              <div className="text-center text-muted py-4">
                <p>You have not listed anything yet.</p>
                <Link to="/add-item" className="btn btn-sm btn-success">Add your first item</Link>
              </div>
            ) : (
              <div className="row g-3">
                {recentItems.map((i) => <ItemCard key={i._id} item={i} />)}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card content-card border-0 p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
              <h5 className="mb-0 fw-bold">Recent Requests</h5>
              <Link to="/my-requests" className="small">View all</Link>
            </div>
            {recentRequests.length === 0 ? (
              <div className="text-center text-muted py-4">
                <p>No request activity yet.</p>
                <Link to="/browse" className="btn btn-sm btn-outline-success">Browse clothing</Link>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {recentRequests.map((r) => (
                  <div key={r._id} className="list-group-item px-1">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <div className="fw-semibold small">
                          {r.item?._id ? (
                            <Link to={`/item/${r.item._id}`} className="text-decoration-none">
                              {r.item.title}
                            </Link>
                          ) : (
                            'Item removed'
                          )}
                        </div>
                        <div className="small text-muted">
                          {r.type} &middot;{' '}
                          {String(r.requester) === String(user?._id)
                            ? `To ${r.owner?.name}`
                            : `From ${r.requester?.name}`}
                          {' '}&middot; {formatDate(r.createdAt)}
                        </div>
                        {r.message && (
                          <div className="small text-muted fst-italic">
                            &ldquo;{truncate(r.message, 70)}&rdquo;
                          </div>
                        )}
                      </div>
                      <StatusBadge value={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
