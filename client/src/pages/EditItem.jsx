import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import PageHeader from '../components/PageHeader';
import ItemForm from '../components/ItemForm';
import Loader from '../components/Loader';
import AlertMessage from '../components/AlertMessage';
import useDocumentTitle from '../hooks/useDocumentTitle';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useDocumentTitle('Edit Clothing');

  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/items/${id}`)
      .then(({ data }) => {
        const it = data.data;
        setInitial({
          title: it.title || '',
          description: it.description || '',
          category: it.category || '',
          size: it.size || '',
          condition: it.condition || '',
          gender: it.gender || '',
          location: it.location || '',
          type: it.type || '',
          image: it.image || '',
        });
      })
      .catch((e) => setLoadError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (form, file) => {
    setError('');
    setBusy(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append('image', file);

      await api.put(`/items/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/item/${id}`, { replace: true });
    } catch (e) {
      setError(getErrorMessage(e));
      setBusy(false);
    }
  };

  if (loading) return <div className="container page-container"><Loader text="Loading item..." /></div>;

  if (loadError || !initial) {
    return (
      <div className="container page-container">
        <AlertMessage type="danger" message={loadError || 'Item not found'} />
        <Link to="/my-listings" className="btn btn-outline-success">Back to My Listings</Link>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <PageHeader title="Edit Clothing" icon="bi-pencil" subtitle="Update your listing details" />
      <div className="form-card wide mx-auto">
        <ItemForm
          initial={initial}
          onSubmit={submit}
          submitLabel="Save Changes"
          busy={busy}
          error={error}
        />
      </div>
    </div>
  );
};

export default EditItem;
