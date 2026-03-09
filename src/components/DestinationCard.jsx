function DestinationCard({ destination, onEdit, onDelete }) {
  const { name, country, category, rating, notes, visited } = destination;

  const handleDelete = () => {
    if (window.confirm(`Remove "${name}" from your wishlist?`)) {
      onDelete(destination.id);
    }
  };

  const stars = rating
    ? '★'.repeat(rating) + '☆'.repeat(5 - rating)
    : 'No rating';

  return (
    <div className={`destination-card ${visited ? 'visited' : ''}`}>
      <div className="card-header">
        <div>
          <h3 className="card-name">{name}</h3>
          {country && <p className="card-country">{country}</p>}
        </div>
        {category && <span className="card-category">{category}</span>}
      </div>

      {rating !== null && <p className="card-rating">{stars}</p>}

      {notes && <p className="card-notes">{notes}</p>}

      {visited && <p className="card-visited-label">Visited</p>}

      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(destination)}>
          Edit
        </button>
        <button className="btn-delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default DestinationCard;
