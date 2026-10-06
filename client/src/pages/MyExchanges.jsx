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

// All exchange transactions the current user is involved in (either side).
const MyExchanges = () => {
  useDocumentTitle('My Exchanges');
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
        const exchanges = all
          .filter((r) => r.type === 'Exchange')
          .filter((r, i, arr) => arr.findIndex((x) => x._id === r._id) === i)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(exchanges);
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
  const pending = requests.filter((r) => r.status === 'Pending' || r.status === 'Accepted').length;

  return (
    <div className="container page-container">
      <PageHeader
        title="My Exchanges"
        icon="bi-arrow-repeat"
        subtitle="Item-for-item swaps you are part of"
      />

      <div className="row g-3 mb-4">
        <StatCard icon="bi-arrow-repeat" label="Total Exchanges" value={requests.length} tone="primary" />
        <StatCard icon="bi-check2-all" label="Completed" value={completed} tone="success" />
        <StatCard icon="bi-hourglass-split" label="In Progress" value={pending} tone="warning" />
      </div>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card content-card border-0 p-3">
        {loading ? (
          <Loader text="Loading exchanges..." />
        ) : requests.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-arrow-repeat display-5" />
            <p className="mt-2">No exchange transactions yet.</p>
            <Link to="/browse" className="btn btn-sm btn-success">Find something to exchange</Link>
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

export default MyExchanges;
