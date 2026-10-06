import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import AlertMessage from '../components/AlertMessage';
import PageHeader from '../components/PageHeader';
import RequestTable from '../components/RequestTable';
import useDocumentTitle from '../hooks/useDocumentTitle';

const MyRequests = () => {
  useDocumentTitle('My Requests');
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get('/requests/my')
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

  return (
    <div className="container page-container">
      <PageHeader
        title="My Requests"
        icon="bi-arrow-left-right"
        subtitle="Requests you have sent to other members"
      >
        <Link to="/browse" className="btn btn-outline-success btn-sm">
          <i className="bi bi-search me-1" /> Browse more
        </Link>
      </PageHeader>

      {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="card content-card border-0 p-3">
        {loading ? (
          <Loader text="Loading your requests..." />
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

export default MyRequests;
