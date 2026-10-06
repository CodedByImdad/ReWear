import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

const HowItWorks = () => {
  useDocumentTitle('How It Works');

  const steps = [
    {
      n: 1,
      icon: 'bi-person-plus',
      title: 'Create an account',
      text: 'Register with your name, email and a password. Logging in takes you to your personal dashboard.',
      cta: { to: '/register', label: 'Register' },
    },
    {
      n: 2,
      icon: 'bi-camera',
      title: 'List your unused clothes',
      text: 'Add a photo, title, description, category, size, condition and location. Choose whether the item is for Exchange or Donation.',
      cta: { to: '/add-item', label: 'Add an item' },
    },
    {
      n: 3,
      icon: 'bi-search',
      title: 'Browse available clothes',
      text: 'Search the catalogue by keyword and filter by category, size, condition, type and location to find something useful.',
      cta: { to: '/browse', label: 'Browse' },
    },
    {
      n: 4,
      icon: 'bi-send',
      title: 'Request exchange or donation',
      text: 'For a donation, send a message to the owner. For an exchange, also select one of your own available items to offer in return.',
    },
    {
      n: 5,
      icon: 'bi-check2-all',
      title: 'Complete the reuse transaction',
      text: 'The owner accepts or rejects your request. Once both sides agree, either side marks the request as completed and the item status updates automatically.',
      cta: { to: '/incoming-requests', label: 'Incoming requests' },
    },
    {
      n: 6,
      icon: 'bi-graph-up-arrow',
      title: 'Track your impact',
      text: 'Your dashboard and the SDG Impact page show your listings, completed exchanges, completed donations and your ReWear Impact Score.',
      cta: { to: '/impact', label: 'View impact' },
    },
  ];

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1 className="h3 mb-1">
          <i className="bi bi-diagram-3 text-success me-2" />
          How ReWear Works
        </h1>
        <p className="text-muted mb-0">
          Six steps from an unused garment in your wardrobe to a completed reuse transaction.
        </p>
        <hr className="mt-3" />
      </div>

      <div className="row g-4">
        {steps.map((s) => (
          <div className="col-md-6 col-lg-4" key={s.n}>
            <div className="card step-card h-100 shadow-sm border-0 p-3">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="how-step-num">{s.n}</span>
                  <i className={`bi ${s.icon} fs-4 text-success`} />
                </div>
                <h5 className="fw-bold">{s.title}</h5>
                <p className="text-muted small flex-grow-1">{s.text}</p>
                {s.cta && (
                  <Link to={s.cta.to} className="btn btn-sm btn-outline-success align-self-start">
                    {s.cta.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card content-card border-0 p-4 mt-4 bg-light">
        <div className="row align-items-center g-3">
          <div className="col-md-8">
            <h5 className="fw-bold mb-1">Understand the request lifecycle</h5>
            <p className="small text-muted mb-0">
              Pending &rarr; Accepted &rarr; Completed. Owners can Reject a pending request, and
              requesters can Cancel one. Rejecting or cancelling returns the item to
              &quot;Available&quot;. Completing a donation marks the item &quot;Donated&quot;;
              completing an exchange marks both items &quot;Exchanged&quot;.
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <Link to="/browse" className="btn btn-success">
              Start browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
