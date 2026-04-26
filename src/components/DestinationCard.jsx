import { useState } from 'react';

function DestinationCard({ destination, onEdit, onToggleVisited, onDelete }) {
  const { name, country, category, rating, notes, visited } = destination;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : null;

  return (
    <div className={`destination-card ${visited ? 'visited' : ''}`}>
      <div className="card-header">
        <div className="card-title">
          <h3 className="card-name">{name}</h3>
          {country && <p className="card-country">{country}</p>}
        </div>
        {category && <span className="card-category">{category}</span>}
      </div>

      <div className="card-body">
        {stars && <p className="card-rating">{stars}</p>}
        {notes && <p className="card-notes">{notes}</p>}
      </div>

      <div className="card-actions">
        <button
          className={`btn-visited ${visited ? 'btn-visited--active' : ''}`}
          onClick={() => onToggleVisited(destination.id, !visited)}
        >
          {visited ? '✓ Visited' : 'Mark Visited'}
        </button>
        {confirmDelete ? (
          <>
            <span className="delete-confirm-label">Remove this destination?</span>
            <button className="btn-confirm-delete" onClick={() => onDelete(destination.id)}>Yes</button>
            <button className="btn-cancel-delete" onClick={() => setConfirmDelete(false)}>No</button>
          </>
        ) : (
          <>
            <button className="btn-edit" onClick={() => onEdit(destination)}>Edit</button>
            <button className="btn-delete" onClick={() => setConfirmDelete(true)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

export default DestinationCard;
