import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import PageHeader from '../components/PageHeader';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Impact = () => {
  useDocumentTitle('SDG Impact');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/impact')
      .then(({ data }) => setStats(data.data))
      .catch((e) => setError(e.response?.data?.message || 'Could not load impact metrics'))
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    ['bi-box-seam', 'Items listed for reuse', stats?.totalItems, 'Listings created on the platform'],
    ['bi-check2-circle', 'ReWear Impact Score', stats?.impactScore, 'Completed exchanges + completed donations'],
    ['bi-arrow-repeat', 'Exchanges completed', stats?.completedExchanges, 'Item-for-item swaps finished'],
    ['bi-gift', 'Donations completed', stats?.completedDonations, 'Free transfers finished'],
    ['bi-arrow-counterclockwise', 'Items kept in circulation', stats?.itemsKeptInCirculation, 'Items now exchanged or donated'],
    ['bi-people', 'Registered users', stats?.totalUsers, 'People on the platform'],
    ['bi-check-circle', 'Active users', stats?.activeUsers, 'Accounts not deactivated'],
    ['bi-hourglass-split', 'Pending requests', stats?.pendingRequests, 'Waiting for an owner decision'],
  ];

  return (
    <div className="container page-container">
      <PageHeader
        title="SDG Impact"
        icon="bi-graph-up-arrow"
        subtitle="How ReWear contributes to Responsible Consumption and Climate Action"
      />

      <div className="impact-hero p-4 p-md-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <h2 className="fw-bold mb-2">ReWear Impact Score: {stats?.impactScore ?? '-'}</h2>
            <p className="mb-2 opacity-75">
              Every successful reuse transaction represents one more clothing item kept in
              circulation instead of being discarded.
            </p>
            <p className="small mb-0 opacity-75">
              <strong>Formula:</strong> Impact Score = completed exchanges + completed donations.
              This is a project-defined metric for this application. It is not a scientifically
              verified measure of carbon, water or waste savings.
            </p>
          </div>
          <div className="col-lg-5 text-lg-end">
            <div className="d-inline-block bg-white text-success rounded-4 p-4 shadow">
              <div className="display-4 fw-bold">{stats?.itemsKeptInCirculation ?? '-'}</div>
              <div className="small text-muted">items already reused</div>
            </div>
          </div>
        </div>
      </div>

      {loading && <Loader text="Loading impact metrics..." />}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <div className="row g-3 mb-4">
            {metrics.map(([icon, label, value, note]) => (
              <div className="col-6 col-md-4 col-xl-3" key={label}>
                <div className="card metric-tile p-3 text-center">
                  <div className="card-body">
                    <i className={`bi ${icon} fs-4 text-success`} />
                    <div className="metric-value">{value ?? '-'}</div>
                    <div className="fw-semibold small">{label}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{note}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="sdg-card sdg-12 text-white p-4 h-100 shadow-sm">
                <div className="sdg-number">12</div>
                <h4 className="mt-2">Responsible Consumption and Production</h4>
                <p className="small mb-2 opacity-75">Primary SDG of this project</p>
                <ul className="small mb-0">
                  <li>Extends the useful life of clothing already in existence</li>
                  <li>Exchange removes the need to buy a replacement garment</li>
                  <li>Donation provides clothing without new production</li>
                  <li>Encourages mindful disposal instead of discarding wearable clothes</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="sdg-card sdg-13 text-white p-4 h-100 shadow-sm">
                <div className="sdg-number">13</div>
                <h4 className="mt-2">Climate Action</h4>
                <p className="small mb-2 opacity-75">Secondary SDG of this project</p>
                <ul className="small mb-0">
                  <li>Keeping garments in use avoids the impact of making replacements</li>
                  <li>Diverts wearable clothing from landfill disposal</li>
                  <li>Community-level action that students can take immediately</li>
                  <li>Transparent counts of reuse transactions on this platform</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="alert alert-light border mt-4">
            <h6 className="fw-bold">
              <i className="bi bi-shield-check text-success me-2" />
              About these numbers
            </h6>
            <p className="small text-muted mb-2">
              All figures on this page are counted directly from the ReWear database and describe
              activity on this platform only. No external research data, carbon-equivalence
              factors or environmental statistics are used or claimed.
            </p>
            <p className="small text-muted mb-0">
              The ReWear Impact Score is intentionally simple and explainable:
              <strong> one point per completed reuse transaction.</strong>
            </p>
          </div>

          <div className="text-center mt-4">
            <Link to="/register" className="btn btn-success me-2">
              Contribute to the impact
            </Link>
            <Link to="/browse" className="btn btn-outline-success">
              Browse clothing
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Impact;
