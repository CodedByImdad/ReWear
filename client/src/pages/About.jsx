import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

const About = () => {
  useDocumentTitle('About');

  return (
    <div className="container page-container">
      <div className="page-header">
        <h1 className="h3 mb-1">
          <i className="bi bi-info-circle text-success me-2" />
          About ReWear
        </h1>
        <p className="text-muted mb-0">
          A sustainable clothing reuse, exchange and donation platform.
        </p>
        <hr className="mt-3" />
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card content-card border-0 p-4 mb-4">
            <h4 className="fw-bold">The Problem</h4>
            <p className="text-muted">
              People regularly discard clothing that is still wearable. Wardrobes fill up with
              items that are never used, while students, families and others often cannot afford
              new clothes. The result is avoidable waste on one side and unmet need on the other.
            </p>
            <h4 className="fw-bold">Our Solution</h4>
            <p className="text-muted">
              ReWear is not an e-commerce website. It is a community platform built around three
              actions: <strong>reuse</strong>, <strong>exchange</strong> and{' '}
              <strong>donation</strong>. Users list clothing they no longer need, browse listings
              from others, and complete a request - either swapping one garment for another or
              receiving an item as a donation.
            </p>
            <h4 className="fw-bold">Objectives</h4>
            <ul className="text-muted">
              <li>Provide a simple way to list and discover reusable clothing</li>
              <li>Enable peer-to-peer exchange without any money involved</li>
              <li>Allow donors to give clothing to people who need it</li>
              <li>Track participation with transparent, project-defined metrics</li>
              <li>Raise awareness of responsible consumption (SDG 12) and climate action (SDG 13)</li>
            </ul>
          </div>

          <div className="card content-card border-0 p-4">
            <h4 className="fw-bold">Expected Benefits</h4>
            <div className="row g-3 mt-1">
              {[
                ['bi-people', 'For users', 'Affordable access to clothing and a place to pass on unused items.'],
                ['bi-globe', 'For the environment', 'Longer garment lifetimes and less discarded clothing.'],
                ['bi-mortarboard', 'For communities', 'A practical, local way to share resources.'],
              ].map(([icon, t, d]) => (
                <div className="col-md-4" key={t}>
                  <div className="bg-light rounded p-3 h-100">
                    <i className={`bi ${icon} fs-4 text-success`} />
                    <h6 className="mt-2 mb-1">{t}</h6>
                    <p className="small text-muted mb-0">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card content-card border-0 p-4 mb-4">
            <h5 className="fw-bold">SDG Alignment</h5>
            <div className="sdg-card sdg-12 text-white p-3 rounded mb-3">
              <div className="fw-bold">SDG 12 - Responsible Consumption &amp; Production</div>
              <small className="opacity-75">Primary goal of the platform</small>
            </div>
            <div className="sdg-card sdg-13 text-white p-3 rounded mb-3">
              <div className="fw-bold">SDG 13 - Climate Action</div>
              <small className="opacity-75">Secondary goal of the platform</small>
            </div>
            <p className="small text-muted mb-0">
              All environmental statements on this site are conservative and qualitative.
              Numbers shown on the Impact page are project-defined platform metrics only.
            </p>
          </div>

          <div className="card content-card border-0 p-4">
            <h5 className="fw-bold">Target Users</h5>
            <ul className="small text-muted ps-3 mb-3">
              <li>Students looking for affordable clothing</li>
              <li>Anyone with wearable clothes they no longer use</li>
              <li>Donors who want to give clothing directly</li>
              <li>Community groups and campus clubs</li>
            </ul>
            <Link to="/how-it-works" className="btn btn-success w-100">
              See How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
