import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import StatusBadge from './StatusBadge';

const ItemCard = ({ item }) => {
  const image = getImageUrl(item.image);

  return (
    <div className="col-sm-6 col-lg-4 col-xl-3">
      <div className="card item-card h-100 shadow-sm border-0">
        <div className="item-card-img-wrapper">
          {image ? (
            <img src={image} className="card-img-top item-card-img" alt={item.title} />
          ) : (
            <div className="item-card-img placeholder-img d-flex align-items-center justify-content-center">
              <i className="bi bi-image text-secondary fs-1" />
            </div>
          )}
          <span className={`badge position-absolute top-0 end-0 m-2 ${item.type === 'Donation' ? 'bg-info text-dark' : 'bg-primary'}`}>
            {item.type}
          </span>
        </div>
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h6 className="card-title mb-0">{item.title}</h6>
            <StatusBadge value={item.status} />
          </div>
          <div className="mb-2 text-muted small">
            {item.category} &middot; Size {item.size} &middot; {item.condition}
          </div>
          <div className="small text-muted mb-2">
            <i className="bi bi-geo-alt me-1" />
            {item.location}
            {item.owner?.name && (
              <>
                {' '}&middot; <i className="bi bi-person me-1" />
                {item.owner.name}
              </>
            )}
          </div>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className={`badge rounded-pill ${item.status === 'Available' ? 'bg-success-subtle text-success border' : 'bg-secondary-subtle text-secondary border'}`}>
              {item.status}
            </span>
            <Link to={`/item/${item._id}`} className="btn btn-sm btn-outline-success">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
