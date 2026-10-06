import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../services/api';

const Home = () => {
  useDocumentTitle('Give Clothes a Second Life');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get('/impact')
      .then(({ data }) => setStats(data.data))
      .catch(() => setStats(null));
  }, []);

  const steps = [
    { n: 1, t: 'Create an account', d: 'Sign up in under a minute with your email.' },
    { n: 2, t: 'List unused clothes', d: 'Photograph and describe clothing you no longer wear.' },
    { n: 3, t: 'Browse & request', d: 'Find something useful and request a swap or donation.' },
    { n: 4, t: 'Complete the reuse', d: 'Owner accepts, both sides mark it complete.' },
  ];

  const pillars = [
    {
      icon: 'bi-arrow-repeat',
      tone: 'primary',
      title: 'Reuse',
      text: 'Keep wearable clothing in circulation instead of sending it to landfill.',
    },
    {
      icon: 'bi-arrow-left-right',
      tone: 'info',
      title: 'Exchange',
      text: 'Swap what you do not wear for something you will actually use.',
    },
    {
      icon: 'bi-gift',
      tone: 'warning',
      title: 'Donate',
      text: 'Give clothes free of cost to people who genuinely need them.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero text-center">
        <div className="container">
          <span className="badge hero-badge rounded-pill px-3 py-2 mb-3">
            <i className="bi bi-recycle me-1" />
            SDG 12 &amp; SDG 13 Aligned Platform
          </span>
          <h1 className="display-4 mb-3">Give Clothes a Second Life</h1>
          <p className="lead mx-auto mb-4" style={{ maxWidth: 720 }}>
            ReWear is a sustainable clothing reuse, exchange and donation platform. It connects
            people who have usable clothes they no longer need with people who can use them -
            reducing waste and making clothing affordable for everyone.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/browse" className="btn btn-light btn-lg px-4 fw-semibold">
              <i className="bi bi-search me-2" />
              Browse Clothes
            </Link>
            <Link
              to="/add-item"
              className="btn btn-outline-light btn-lg px-4 fw-semibold"
            >
              <i className="bi bi-plus-circle me-2" />
              List an Item
            </Link>
          </div>
        </div>
      </section>

      {/* Why ReWear */}
      <section className="container page-container">
        <div className="text-center mb-4">
          <h2 className="section-title">Why ReWear?</h2>
          <p className="text-muted" style={{ maxWidth: 680, margin: '0 auto' }}>
            Usable clothes are discarded every day while many people struggle to afford basic
            clothing. ReWear closes that gap.
          </p>
        </div>
        <div className="row g-4">
          {[
            ['bi-trash3', 'danger', 'Clothing waste', 'Tons of wearable clothing are thrown away each year instead of being reused.'],
            ['bi-people', 'primary', 'People in need', 'Students and families often need affordable or free clothing.'],
            ['bi-emoji-smile', 'success', 'Easy to help', 'Listing an item takes two minutes and directly helps someone.'],
          ].map(([icon, tone, title, text]) => (
            <div className="col-md-4" key={title}>
              <div className="card feature-card h-100 shadow-sm border-0 text-center p-3">
                <div className="card-body">
                  <div className={`feature-icon mx-auto bg-${tone}-subtle text-${tone} mb-3`}>
                    <i className={`bi ${icon}`} />
                  </div>
                  <h5>{title}</h5>
                  <p className="text-muted small mb-0">{text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">How It Works</h2>
            <p className="text-muted">Four simple steps from unused clothes to a completed reuse.</p>
          </div>
          <div className="row g-4">
            {steps.map((s) => (
              <div className="col-md-6 col-lg-3" key={s.n}>
                <div className="card step-card h-100 shadow-sm border-0 p-3 text-center">
                  <div className="card-body">
                    <div className="how-step-num mx-auto mb-3">{s.n}</div>
                    <h6 className="fw-bold">{s.t}</h6>
                    <p className="small text-muted mb-0">{s.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/how-it-works" className="btn btn-outline-success">
              See the full guide
              <i className="bi bi-arrow-right ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reuse / Exchange / Donate */}
      <section className="container page-container">
        <div className="text-center mb-4">
          <h2 className="section-title">Reuse. Exchange. Donate.</h2>
          <p className="text-muted">Three real ways to keep clothing in circulation.</p>
        </div>
        <div className="row g-4">
          {pillars.map((p) => (
            <div className="col-md-4" key={p.title}>
              <div className="card feature-card h-100 shadow-sm border-0 p-3">
                <div className="card-body">
                  <div className={`feature-icon bg-${p.tone}-subtle text-${p.tone} mb-3`}>
                    <i className={`bi ${p.icon}`} />
                  </div>
                  <h5>{p.title}</h5>
                  <p className="text-muted small mb-0">{p.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SDG 12 */}
      <section className="bg-white py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-5">
              <div className="sdg-card sdg-12 text-white p-4 shadow-sm h-100">
                <div className="sdg-number">12</div>
                <h3 className="mt-2 mb-1">Responsible Consumption &amp; Production</h3>
                <p className="mb-0 small opacity-75">United Nations Sustainable Development Goal</p>
              </div>
            </div>
            <div className="col-lg-7">
              <h3 className="section-title mb-3">
                <i className="bi bi-bag-check text-success me-2" />
                How ReWear supports SDG 12
              </h3>
              <p className="text-muted">
                ReWear encourages people to extend the life of products they already own instead
                of buying new ones. Every exchange or donation is a purchase that does not have to
                be made, and a garment that does not have to be discarded.
              </p>
              <ul className="text-muted">
                <li>Reuse of wearable clothing instead of disposal</li>
                <li>Exchange reduces the need for new purchases</li>
                <li>Donation makes clothing accessible without new production</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SDG 13 */}
      <section className="container page-container">
        <div className="row align-items-center g-4 flex-row-reverse">
          <div className="col-lg-5">
            <div className="sdg-card sdg-13 text-white p-4 shadow-sm h-100">
              <div className="sdg-number">13</div>
              <h3 className="mt-2 mb-1">Climate Action</h3>
              <p className="mb-0 small opacity-75">United Nations Sustainable Development Goal</p>
            </div>
          </div>
          <div className="col-lg-7">
            <h3 className="section-title mb-3">
              <i className="bi bi-cloud-sun text-success me-2" />
              How ReWear supports SDG 13
            </h3>
            <p className="text-muted">
              Manufacturing, transporting and disposing of clothing all carry an environmental
              cost. By keeping garments in use for longer, ReWear avoids the impact linked to
              producing replacements and prevents discarded clothing from ending up in landfill.
            </p>
            <ul className="text-muted">
              <li>Longer product lifetimes mean less replacement demand</li>
              <li>Fewer discarded garments in landfill</li>
              <li>Platform metrics track how many items stay in circulation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Platform statistics */}
      <section className="bg-white py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">Platform Statistics</h2>
            <p className="text-muted small">
              Project-defined platform metrics, updated live from the ReWear database.
            </p>
          </div>
          <div className="row g-3 justify-content-center">
            {[
              ['bi-box-seam', stats?.totalItems ?? '-', 'Items listed'],
              ['bi-check2-circle', stats?.impactScore ?? '-', 'ReWear Impact Score'],
              ['bi-arrow-repeat', stats?.completedExchanges ?? '-', 'Exchanges completed'],
              ['bi-gift', stats?.completedDonations ?? '-', 'Donations completed'],
              ['bi-people', stats?.totalUsers ?? '-', 'Registered users'],
            ].map(([icon, value, label]) => (
              <div className="col-6 col-md-4 col-lg" key={label}>
                <div className="card metric-tile text-center p-3">
                  <div className="card-body">
                    <i className={`bi ${icon} fs-3 text-success`} />
                    <div className="metric-value">{value}</div>
                    <div className="small text-muted">{label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center small text-muted mt-3 mb-0">
            Metrics count transactions on this platform only and are not scientifically verified
            environmental savings.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container my-5">
        <div className="impact-hero p-5 text-center">
          <h2 className="fw-bold mb-2">Ready to give your clothes a second life?</h2>
          <p className="mb-4 opacity-75">
            Join ReWear today - list what you do not need and find what you do.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-light btn-lg px-4 fw-semibold">
              Get Started Free
            </Link>
            <Link to="/browse" className="btn btn-outline-light btn-lg px-4">
              Browse Clothing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
