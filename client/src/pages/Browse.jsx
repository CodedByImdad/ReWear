import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import ItemCard from '../components/ItemCard';
import FilterBar, { emptyFilters } from '../components/FilterBar';
import Loader from '../components/Loader';
import AlertMessage from '../components/AlertMessage';
import PageHeader from '../components/PageHeader';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Browse = () => {
  useDocumentTitle('Browse Clothing');
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    search: searchParams.get('search') || '',
  }));

  const params = useMemo(() => {
    const p = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v && String(v).trim() !== '') p[k] = String(v).trim();
    });
    return p;
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .get('/items', { params })
        .then(({ data }) => {
          if (!cancelled) {
            setItems(data.data || []);
            setError('');
          }
        })
        .catch((e) => {
          if (!cancelled) setError(getErrorMessage(e));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250); // debounce typing in the search box
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [params]);

  const clear = () => setFilters({ ...emptyFilters });

  return (
    <div className="container page-container">
      <PageHeader
        title="Browse Clothing"
        icon="bi-search"
        subtitle={`${items.length} item${items.length === 1 ? '' : 's'} available for reuse, exchange or donation`}
      />

      <FilterBar filters={filters} onChange={setFilters} onClear={clear} />

      {error && (
        <AlertMessage type="danger" message={error} onClose={() => setError('')} />
      )}

      {loading ? (
        <Loader text="Loading listings..." />
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown display-4 text-muted" />
          <h5 className="mt-3">No items match your filters</h5>
          <p className="text-muted">Try clearing filters or check back later.</p>
          <button className="btn btn-outline-success" onClick={clear}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Browse;
