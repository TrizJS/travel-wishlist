function SearchBar({ query, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search destinations..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {query && (
        <button className="search-clear" onClick={() => onChange('')}>
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
