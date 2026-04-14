import { useState, useEffect } from 'react';
import DestinationForm from './components/DestinationForm';
import DestinationCard from './components/DestinationCard';
import SearchBar from './components/SearchBar';
import { useAuth } from './context/AuthContext';
import { getDestinations, addDestination, updateDestination, deleteDestination } from './utils/storage';
import './App.css';

function App() {
  const { user, signOut } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [editingDestination, setEditingDestination] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getDestinations().then(setDestinations);
  }, []);

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async (destination) => {
    const created = await addDestination(destination, user.id);
    setDestinations((prev) => [created, ...prev]);
  };

  const handleUpdate = async (destination) => {
    await updateDestination(destination);
    setDestinations((prev) => prev.map((d) => (d.id === destination.id ? destination : d)));
    setEditingDestination(null);
  };

  const handleDelete = async (id) => {
    await deleteDestination(id);
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  const handleFormSubmit = (destination) => {
    if (editingDestination) {
      handleUpdate(destination);
    } else {
      handleAdd(destination);
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>✈️ Travel Wishlist</h1>
        <p>Save and organize the destinations you want to explore.</p>
        <button className="btn-cancel" onClick={signOut} style={{ marginTop: '0.75rem' }}>
          Sign Out
        </button>
      </header>

      <main>
        <DestinationForm
          onSubmit={handleFormSubmit}
          editingDestination={editingDestination}
          onCancelEdit={() => setEditingDestination(null)}
        />

        <SearchBar query={searchQuery} onChange={setSearchQuery} />

        <section className="destination-list">
          <h2>Your Destinations ({filteredDestinations.length})</h2>

          {destinations.length === 0 ? (
            <p className="empty-state">No destinations yet. Add one above!</p>
          ) : filteredDestinations.length === 0 ? (
            <p className="empty-state">No destinations match "{searchQuery}".</p>
          ) : (
            <div className="cards-grid">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onEdit={setEditingDestination}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
