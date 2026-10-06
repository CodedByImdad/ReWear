const PageHeader = ({ title, subtitle, icon, children }) => (
  <div className="page-header mb-4">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
      <div>
        <h1 className="h3 mb-1 d-flex align-items-center gap-2">
          {icon && <i className={`bi ${icon} text-success`} />}
          {title}
        </h1>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
      {children}
    </div>
    <hr className="mt-3" />
  </div>
);

export default PageHeader;
