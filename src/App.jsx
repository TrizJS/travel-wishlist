import { useState } from 'react';
import DestinationForm from './components/DestinationForm';
import DestinationCard from './components/DestinationCard';
import SearchBar from './components/SearchBar';
import { getDestinations, addDestination, updateDestination, deleteDestination } from './utils/storage';
import './App.css';

function App() {
  const [destinations, setDestinations] = useState(() => getDestinations());
  const [editingDestination, setEditingDestination] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (destination) => {
    addDestination(destination);
    setDestinations(getDestinations());
  };

  const handleUpdate = (destination) => {
    updateDestination(destination);
    setDestinations(getDestinations());
    setEditingDestination(null);
  };

  const handleDelete = (id) => {
    deleteDestination(id);
    setDestinations(getDestinations());
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
