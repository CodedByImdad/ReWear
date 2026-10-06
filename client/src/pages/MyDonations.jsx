import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import AlertMessage from '../components/AlertMessage';
import PageHeader from '../components/PageHeader';
import RequestTable from '../components/RequestTable';
import StatCard from '../components/StatCard';
import useDocumentTitle from '../hooks/useDocumentTitle';

// All donation transactions the current user is involved in (either side).
const MyDonations = () => {
  useDocumentTitle('My Donations');
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/requests/my'), api.get('/requests/incoming')])
      .then(([mine, incoming]) => {
        const all = [...(mine.data.data || []), ...(incoming.data.data || [])];
        const donations = all
          .filter((r) => r.type === 'Donation')
          .filter((r, i, arr) => arr.findIndex((x) => x._id === r._id) === i)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(donations);
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const act = async (req, action) => {
    setError('');
    setSuccess('');
    setBusyId(req._id);
    try {
      const { data } = await api.put(`/requests/${req._id}/${action}`);
      setSuccess(data.message);
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const completed = requests.filter((r) => r.status === 'Completed').length;
  const given = requests.filter(
    (r) => r.status === 'Completed' && String(r.type) === 'Donation'
  ).length;

  return (
    <div className="container page-container">
      <PageHeader
        title="My Donations"
        icon="bi-gift"
        subtitle="Donations you have given or received"
      />

      <div className="row g-3 mb-4">
        <StatCard icon="bi-gift" label="Total Donations" value={requests.length} tone="info" />
        <StatCard icon="bi-check2-all" label="Completed" value={completed} tone="success" />
        <StatCard icon="bi-heart" label="Impact Points" value={given} tone="danger" />
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card content-card border-0 p-3">
        {loading ? (
          <Loader text="Loading donations..." />
        ) : requests.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-gift display-5" />
            <p className="mt-2">No donation transactions yet.</p>
            <Link to="/browse?type=Donation" className="btn btn-sm btn-success">
              Find items available for donation
            </Link>
          </div>
        ) : (
          <RequestTable
            requests={requests}
            currentUserId={user?._id}
            onAction={act}
            busyId={busyId}
          />
        )}
      </div>
    </div>
  );
};

export default MyDonations;
