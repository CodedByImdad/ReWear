import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import AlertMessage from '../components/AlertMessage';
import PageHeader from '../components/PageHeader';
import RequestTable from '../components/RequestTable';
import useDocumentTitle from '../hooks/useDocumentTitle';

const IncomingRequests = () => {
  useDocumentTitle('Incoming Requests');
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get('/requests/incoming')
      .then(({ data }) => setRequests(data.data || []))
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

  const pending = requests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="container page-container">
      <PageHeader
        title="Incoming Requests"
        icon="bi-inbox"
        subtitle={`${pending} pending request${pending === 1 ? '' : 's'} for your listings`}
      >
        <Link to="/my-listings" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-grid me-1" /> My Listings
        </Link>
      </PageHeader>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card content-card border-0 p-3">
        {loading ? (
          <Loader text="Loading incoming requests..." />
        ) : (
          <RequestTable
            requests={requests}
            currentUserId={user?._id}
            onAction={act}
            busyId={busyId}
          />
        )}
      </div>

      <div className="alert alert-light border small mt-3">
        <i className="bi bi-lightbulb me-1 text-warning" />
        <strong>How it works:</strong> Accept a pending request to agree to the exchange or
        donation. Reject returns the item to &quot;Available&quot;. After accepting, either side
        can mark the request as completed once the handover is done.
      </div>
    </div>
  );
};

export default IncomingRequests;
