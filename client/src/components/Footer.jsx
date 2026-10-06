import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-dark text-light mt-5">
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-4">
          <h5 className="fw-bold">
            Re<span className="text-success">Wear</span>
          </h5>
          <p className="small text-secondary-emphasis">
            A sustainable clothing reuse, exchange and donation platform built as a
            Web Application Development PBL project aligned with SDG 12 and SDG 13.
          </p>
        </div>
        <div className="col-6 col-md-2">
          <h6 className="text-uppercase small text-muted">Explore</h6>
          <ul className="list-unstyled small">
            <li className="mb-1"><Link className="link-light text-decoration-none" to="/">Home</Link></li>
            <li className="mb-1"><Link className="link-light text-decoration-none" to="/browse">Browse Clothing</Link></li>
            <li className="mb-1"><Link className="link-light text-decoration-none" to="/how-it-works">How It Works</Link></li>
            <li className="mb-1"><Link className="link-light text-decoration-none" to="/impact">SDG Impact</Link></li>
          </ul>
        </div>
        <div className="col-6 col-md-2">
          <h6 className="text-uppercase small text-muted">Account</h6>
          <ul className="list-unstyled small">
            <li className="mb-1"><Link className="link-light text-decoration-none" to="/login">Login</Link></li>
            <li className="mb-1"><Link className="link-light text-decoration-none" to="/register">Register</Link></li>
            <li className="mb-1"><Link className="link-light text-decoration-none" to="/add-item">List an Item</Link></li>
            <li className="mb-1"><Link className="link-light text-decoration-none" to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
        <div className="col-md-4">
          <h6 className="text-uppercase small text-muted">Our SDGs</h6>
          <div className="d-flex gap-2 mb-2">
            <span className="badge rounded-pill" style={{ background: '#bc5148' }}>SDG 12</span>
            <span className="badge rounded-pill" style={{ background: '#3f7e44' }}>SDG 13</span>
          </div>
          <p className="small text-secondary-emphasis mb-0">
            Responsible Consumption &amp; Production &middot; Climate Action
          </p>
        </div>
      </div>
      <hr className="border-secondary" />
      <div className="small text-muted d-flex flex-wrap justify-content-between gap-2">
        <span>&copy; {new Date().getFullYear()} ReWear - PBL Activity 3, Web Application Development.</span>
        <span>Impact figures are project-defined platform metrics.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
