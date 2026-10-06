import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import PageHeader from '../components/PageHeader';
import ItemForm from '../components/ItemForm';
import useDocumentTitle from '../hooks/useDocumentTitle';

const EMPTY = {
  title: '',
  description: '',
  category: '',
  size: '',
  condition: '',
  gender: '',
  location: '',
  type: '',
  image: '',
};

const AddItem = () => {
  useDocumentTitle('Add Clothing');
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (form, file) => {
    setError('');
    setBusy(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) data.append(k, v);
      });
      if (file) data.append('image', file);

      const res = await api.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/item/${res.data.data._id}`, { replace: true });
    } catch (e) {
      setError(getErrorMessage(e));
      setBusy(false);
    }
  };

  return (
    <div className="container page-container">
      <PageHeader
        title="Add Clothing"
        icon="bi-plus-circle"
        subtitle="List an unused garment for exchange or donation"
      />
      <div className="form-card wide mx-auto">
        <ItemForm
          initial={EMPTY}
          onSubmit={submit}
          submitLabel="Publish Listing"
          busy={busy}
          error={error}
        />
      </div>
    </div>
  );
};

export default AddItem;
