const Loader = ({ text = 'Loading...' }) => (
  <div className="d-flex flex-column justify-content-center align-items-center py-5" role="status">
    <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }} />
    <span className="mt-3 text-muted small">{text}</span>
  </div>
);

export default Loader;
