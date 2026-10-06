const StatCard = ({ icon, label, value, tone = 'success', sub }) => (
  <div className="col-6 col-md-4 col-xl-2">
    <div className={`card stat-card h-100 border-0 shadow-sm text-center`}>
      <div className="card-body py-4">
        <i className={`bi ${icon} fs-2 text-${tone}`} />
        <div className={`display-6 fw-bold text-${tone} mt-2`}>{value}</div>
        <div className="small text-muted">{label}</div>
        {sub && <div className="small text-muted fst-italic">{sub}</div>}
      </div>
    </div>
  </div>
);

export default StatCard;
