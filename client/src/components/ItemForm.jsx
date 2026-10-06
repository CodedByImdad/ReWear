import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import AlertMessage from '../components/AlertMessage';
import PageHeader from '../components/PageHeader';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { CATEGORIES, SIZES, CONDITIONS, GENDERS, TYPES } from '../utils/constants';

// Shared form used by AddItem and EditItem.
const ItemForm = ({ initial, onSubmit, submitLabel, busy, error }) => {
  const [form, setForm] = useState(initial);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onFile = (e) => {
    const chosen = e.target.files?.[0];
    if (!chosen) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(chosen.type)) {
      alert('Only JPG, PNG or WEBP images are allowed.');
      e.target.value = '';
      return;
    }
    if (chosen.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2 MB.');
      e.target.value = '';
      return;
    }
    setFile(chosen);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(chosen);
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form, file);
  };

  return (
    <form onSubmit={submit} className="card content-card border-0 p-4">
      {error && <AlertMessage type="danger" message={error} />}

      <div className="mb-3">
        <label className="form-label">
          Title <span className="text-danger">*</span>
        </label>
        <input
          className="form-control"
          placeholder="e.g. Blue Denim Jacket"
          value={form.title}
          onChange={set('title')}
          minLength={3}
          maxLength={100}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Description <span className="text-danger">*</span>
        </label>
        <textarea
          className="form-control"
          rows={4}
          maxLength={1000}
          placeholder="Describe the item: fabric, fit, wear, any flaws, why you are passing it on..."
          value={form.description}
          onChange={set('description')}
          required
        />
        <div className="form-text">{form.description.length}/1000 characters</div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label">
            Category <span className="text-danger">*</span>
          </label>
          <select className="form-select" value={form.category} onChange={set('category')} required>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">
            Size <span className="text-danger">*</span>
          </label>
          <select className="form-select" value={form.size} onChange={set('size')} required>
            <option value="">Select size</option>
            {SIZES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">
            Condition <span className="text-danger">*</span>
          </label>
          <select className="form-select" value={form.condition} onChange={set('condition')} required>
            <option value="">Select condition</option>
            {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label">
            Gender / Target <span className="text-danger">*</span>
          </label>
          <select className="form-select" value={form.gender} onChange={set('gender')} required>
            <option value="">Select target</option>
            {GENDERS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">
            Location <span className="text-danger">*</span>
          </label>
          <input
            className="form-control"
            placeholder="e.g. Pune, Maharashtra"
            value={form.location}
            onChange={set('location')}
            maxLength={80}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">
            Type <span className="text-danger">*</span>
          </label>
          <select className="form-select" value={form.type} onChange={set('type')} required>
            <option value="">Exchange or Donation?</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <div className="form-text">
            Exchange = swap with another member. Donation = give away free.
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Photo (JPG, PNG or WEBP, max 2 MB)</label>
        <input type="file" className="form-control" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
        <div className="mt-3">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: 220, maxHeight: 220, objectFit: 'cover', borderRadius: 10, border: '1px solid #dee2e6' }}
            />
          ) : form.image ? (
            <div className="small text-muted">
              <i className="bi bi-image me-1" />
              Current image saved with this listing. Upload a new file to replace it.
            </div>
          ) : (
            <div className="small text-muted">No image selected - a placeholder will be shown.</div>
          )}
        </div>
      </div>

      <button className="btn btn-success px-4 py-2" disabled={busy}>
        {busy ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ItemForm;
