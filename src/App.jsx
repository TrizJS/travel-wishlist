import './App.css'

function App() {
  const features = [
    'Add destinations with a name and country',
    'Edit or delete saved destinations',
    'Rate destinations from 1 to 5 stars',
    'Add personal notes to each destination',
    'Search and filter your wishlist',
  ]

  return (
    <div className="container">
      <header className="hero">
        <div className="hero-icon">✈️</div>
        <h1>Travel Wishlist</h1>
        <p className="tagline">
          Save, organize, and dream about the destinations you want to explore.
        </p>
      </header>

      <main>
        <section className="features">
          <h2>Planned Features</h2>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="status">
          <p>🚧 This app is currently under development.</p>
        </section>
      </main>
    </div>
  )
}

export default App
