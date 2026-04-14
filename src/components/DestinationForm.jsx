import { useState, useEffect } from 'react';

const EMPTY_FORM = {
  name: '',
  country: '',
  category: '',
  rating: '',
  notes: '',
};

function DestinationForm({ onSubmit, editingDestination, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const isEditing = Boolean(editingDestination);

  useEffect(() => {
    if (editingDestination) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: editingDestination.name,
        country: editingDestination.country,
        category: editingDestination.category,
        rating: editingDestination.rating ?? '',
        notes: editingDestination.notes,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [editingDestination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError('Destination name is required.');
      return;
    }

    const base = isEditing
      ? editingDestination
      : { id: Date.now().toString(), visited: false, createdAt: new Date().toISOString() };

    const destination = {
      ...base,
      name: form.name.trim(),
      country: form.country.trim(),
      category: form.category.trim(),
      rating: form.rating ? Number(form.rating) : null,
      notes: form.notes.trim(),
    };

    onSubmit(destination);
    setForm(EMPTY_FORM);
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="destination-form">
      <h2>{isEditing ? 'Edit Destination' : 'Add Destination'}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="name">Destination Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Kyoto"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="country">Region / Country</label>
        <input
          id="country"
          name="country"
          type="text"
          placeholder="e.g. Japan"
          value={form.country}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          <option value="">Select a category</option>
          <option value="Beach">Beach</option>
          <option value="City">City</option>
          <option value="Nature">Nature</option>
          <option value="Culture">Culture</option>
          <option value="Adventure">Adventure</option>
          <option value="Food">Food</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="rating">Rating</label>
        <select id="rating" name="rating" value={form.rating} onChange={handleChange}>
          <option value="">No rating</option>
          <option value="1">1 — Low interest</option>
          <option value="2">2 — Some interest</option>
          <option value="3">3 — Interested</option>
          <option value="4">4 — Really want to go</option>
          <option value="5">5 — Dream destination</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Any details, best time to visit, things to do..."
          value={form.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="submit">{isEditing ? 'Save Changes' : 'Add Destination'}</button>
        {isEditing && (
          <button type="button" className="btn-cancel" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default DestinationForm;
