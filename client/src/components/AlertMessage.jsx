const AlertMessage = ({ type = 'info', message, onClose }) => {
  if (!message) return null;
  const variants = {
    success: 'alert-success',
    danger: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info',
  };
  return (
    <div className={`alert ${variants[type] || 'alert-info'} alert-dismissible fade show`} role="alert">
      {message}
      {onClose && (
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
      )}
    </div>
  );
};

export default AlertMessage;
