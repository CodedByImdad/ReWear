import {
  CATEGORIES,
  SIZES,
  CONDITIONS,
  TYPES,
} from '../utils/constants';

export const emptyFilters = {
  search: '',
  category: '',
  size: '',
  condition: '',
  type: '',
  location: '',
  status: '',
};

const FilterBar = ({ filters, onChange, onClear, showStatus = false }) => {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-12 col-lg-3">
            <label className="form-label small text-muted mb-1">Search</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search title or description"
                value={filters.search}
                onChange={set('search')}
              />
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label small text-muted mb-1">Category</label>
            <select className="form-select" value={filters.category} onChange={set('category')}>
              <option value="">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label small text-muted mb-1">Size</label>
            <select className="form-select" value={filters.size} onChange={set('size')}>
              <option value="">All</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label small text-muted mb-1">Condition</label>
            <select className="form-select" value={filters.condition} onChange={set('condition')}>
              <option value="">All</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label small text-muted mb-1">Type</label>
            <select className="form-select" value={filters.type} onChange={set('type')}>
              <option value="">All</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <label className="form-label small text-muted mb-1">Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="Any location"
              value={filters.location}
              onChange={set('location')}
            />
          </div>
          {showStatus && (
            <div className="col-6 col-md-3 col-lg-2">
              <label className="form-label small text-muted mb-1">Status</label>
              <select className="form-select" value={filters.status} onChange={set('status')}>
                <option value="">All</option>
                <option>Available</option>
                <option>Requested</option>
                <option>Exchanged</option>
                <option>Donated</option>
                <option>Removed</option>
              </select>
            </div>
          )}
          <div className="col-12 d-flex justify-content-end">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClear}>
              <i className="bi bi-x-circle me-1" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
