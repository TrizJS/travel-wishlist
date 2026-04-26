import { useState, useEffect, useMemo } from 'react';
import DestinationForm from './components/DestinationForm';
import DestinationCard from './components/DestinationCard';
import SearchBar from './components/SearchBar';
import { useAuth } from './context/AuthContext';
import { getDestinations, addDestination, updateDestination, deleteDestination, toggleVisited } from './utils/storage';
import './App.css';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line wide" />
      <div className="skeleton-line narrow" />
      <div className="skeleton-line full" />
      <div className="skeleton-line full" />
    </div>
  );
}

function App() {
  const { user, signOut } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [editingDestination, setEditingDestination] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => setError('Failed to load destinations. Please refresh the page.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredDestinations = useMemo(
    () => destinations.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [destinations, searchQuery]
  );

  const handleAdd = async (destination) => {
    const duplicate = destinations.some(
      (d) =>
        d.name.trim().toLowerCase() === destination.name.toLowerCase() &&
        d.country.trim().toLowerCase() === destination.country.toLowerCase()
    );
    if (duplicate) {
      setError(`"${destination.name}" in ${destination.country} is already on your list.`);
      return false;
    }
    try {
      const created = await addDestination(destination, user.id);
      setDestinations((prev) => [created, ...prev]);
      setError('');
      return true;
    } catch {
      setError('Failed to add destination. Please try again.');
      return false;
    }
  };

  const handleUpdate = async (destination) => {
    try {
      await updateDestination(destination);
      setDestinations((prev) => prev.map((d) => (d.id === destination.id ? destination : d)));
      setEditingDestination(null);
      setError('');
      return true;
    } catch {
      setError('Failed to update destination. Please try again.');
      return false;
    }
  };

  const handleToggleVisited = async (id, visited) => {
    try {
      await toggleVisited(id, visited);
      setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, visited } : d)));
    } catch {
      setError('Failed to update destination. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDestination(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      setError('');
    } catch {
      setError('Failed to delete destination. Please try again.');
    }
  };

  const handleFormSubmit = (destination) => {
    return editingDestination ? handleUpdate(destination) : handleAdd(destination);
  };

  const renderList = () => {
    if (loading) return (
      <div className="cards-grid">
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    );
    if (error && destinations.length === 0) return null;
    if (destinations.length === 0) return <p className="empty-state">No destinations yet. Add one above!</p>;
    if (filteredDestinations.length === 0) return <p className="empty-state">No destinations match "{searchQuery}".</p>;
    return (
      <div className="cards-grid">
        {filteredDestinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            onEdit={setEditingDestination}
            onToggleVisited={handleToggleVisited}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>✈️ Travel Wishlist</h1>
            <p>Save and organize the destinations you want to explore.</p>
          </div>
          <button className="btn-signout" onClick={signOut}>Sign Out</button>
        </div>
      </header>

      <main>
        <DestinationForm
          onSubmit={handleFormSubmit}
          editingDestination={editingDestination}
          onCancelEdit={() => setEditingDestination(null)}
        />

        <SearchBar query={searchQuery} onChange={setSearchQuery} />

        <section className="destination-list">
          <div className="destination-list-header">
            <h2>Your Destinations</h2>
            {!loading && <span className="destination-count">{filteredDestinations.length}</span>}
          </div>

          {error && (
            <div className="list-error">
              <span>{error}</span>
              <button onClick={() => setError('')}>✕</button>
            </div>
          )}

          {renderList()}
        </section>
      </main>
    </div>
  );
}

export default App;
