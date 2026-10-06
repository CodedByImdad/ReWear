import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../services/api';
import Loader from '../../components/Loader';
import AlertMessage from '../../components/AlertMessage';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const AdminDashboard = () => {
  useDocumentTitle('Admin Dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page-container">
      <PageHeader
        title="Admin Dashboard"
        icon="bi-shield-lock"
        subtitle="Platform statistics and management"
      >
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/admin/users" className="btn btn-sm btn-outline-danger">
            <i className="bi bi-people me-1" /> Users
          </Link>
          <Link to="/admin/items" className="btn btn-sm btn-outline-primary">
            <i className="bi bi-grid me-1" /> Listings
          </Link>
          <Link to="/admin/requests" className="btn btn-sm btn-outline-info">
            <i className="bi bi-arrow-left-right me-1" /> Requests
          </Link>
        </div>
      </PageHeader>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {loading && <Loader text="Loading statistics..." />}

      {stats && (
        <>
          <div className="row g-3 mb-4">
            <StatCard icon="bi-people" label="Total Users" value={stats.totalUsers} tone="danger" />
            <StatCard icon="bi-box-seam" label="Total Items" value={stats.totalItems} tone="success" />
            <StatCard icon="bi-check-circle" label="Available Items" value={stats.availableItems} tone="success" />
            <StatCard icon="bi-hourglass-split" label="Pending Requests" value={stats.pendingRequests} tone="warning" />
            <StatCard icon="bi-arrow-repeat" label="Completed Exchanges" value={stats.completedExchanges} tone="primary" />
            <StatCard icon="bi-gift" label="Completed Donations" value={stats.completedDonations} tone="info" />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card content-card p-4 text-center">
                <div className="metric-value">{stats.impactScore}</div>
                <div className="fw-semibold">ReWear Impact Score</div>
                <div className="small text-muted">completed exchanges + completed donations</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card content-card p-4 text-center">
                <div className="metric-value">{stats.itemsKeptInCirculation}</div>
                <div className="fw-semibold">Items kept in circulation</div>
                <div className="small text-muted">items now exchanged or donated</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card content-card p-4 text-center">
                <div className="metric-value">{stats.activeUsers} / {stats.totalUsers}</div>
                <div className="fw-semibold">Active accounts</div>
                <div className="small text-muted">users not deactivated</div>
              </div>
            </div>
          </div>

          <div className="card content-card p-4">
            <h6 className="fw-bold mb-3">Request pipeline</h6>
            <div className="row g-3 text-center">
              {[
                ['Pending', stats.pendingRequests, 'warning'],
                ['Accepted', stats.acceptedRequests, 'success'],
                ['Total ever', stats.totalRequests, 'secondary'],
                ['Exchanged', stats.exchangedItems, 'primary'],
                ['Donated', stats.donatedItems, 'info'],
                ['Requested now', stats.requestedItems, 'warning'],
              ].map(([label, value, tone]) => (
                <div className="col-6 col-md-2" key={label}>
                  <div className={`bg-${tone}-subtle rounded p-3 h-100`}>
                    <div className="fs-4 fw-bold">{value}</div>
                    <div className="small text-muted">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
