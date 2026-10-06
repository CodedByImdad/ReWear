import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

const NotFound = () => {
  useDocumentTitle('Page Not Found');

  return (
    <div className="container center-screen text-center">
      <div>
        <div className="display-1 text-success fw-bold">404</div>
        <h1 className="h3 mb-2">Page not found</h1>
        <p className="text-muted mb-4">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/" className="btn btn-success">
            <i className="bi bi-house me-2" />
            Back to Home
          </Link>
          <Link to="/browse" className="btn btn-outline-success">
            <i className="bi bi-search me-2" />
            Browse Clothing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
