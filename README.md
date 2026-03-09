# Travel Wishlist

## Project Description

Travel Wishlist is a React web application that allows users to save and organize travel destinations they want to visit. Users can add destinations, rate them, include notes, edit or delete entries, and search their list — all stored locally in the browser using localStorage.

## Features

- Add destinations with name, region/country, category, rating, and notes
- Edit saved destinations with a pre-filled form
- Delete destinations with a confirmation prompt
- Search destinations by name (live filtering)
- Persistent storage using localStorage — data survives page reloads
- Responsive layout — grid on desktop, stacked on mobile
- Empty state messages for no data and no search matches

## Tech Stack

- React
- Vite
- JavaScript
- CSS (no UI framework)
- localStorage (for data persistence)

## Project Structure

```
src/
├── components/
│   ├── DestinationCard.jsx   # Displays a single destination with edit/delete
│   ├── DestinationForm.jsx   # Add and edit form (dual mode)
│   └── SearchBar.jsx         # Live search input
├── utils/
│   └── storage.js            # localStorage CRUD helpers
├── App.jsx                   # Root component, state management
├── App.css                   # App styles and responsive layout
├── index.css                 # Base reset and typography
└── main.jsx                  # React entry point
```

## Data Structure

Each destination is stored as an object in a JSON array under the key `travelWishlist`:

```js
{
  id: "1234567890",
  name: "Kyoto",
  country: "Japan",
  category: "Culture",
  rating: 4,             // 1–5 or null if unrated
  notes: "Cherry blossom season",
  visited: false,
  createdAt: "2026-03-09T..."
}
```

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Future Improvements

- Mark destinations as visited with a toggle
- Sort destinations by rating or date added
- Filter by category
