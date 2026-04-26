# Travel Wishlist

A personal travel wishlist app built with React and Supabase. Save destinations, track what you want to visit, and mark places as visited — all synced to the cloud with per-user accounts.

## Features

- **Auth** — email/password sign up and sign in via Supabase Auth; session persists across page refreshes
- **Per-user data** — each account sees only its own destinations, enforced by Supabase Row Level Security
- **Add / Edit / Delete** — full CRUD with inline validation on required fields
- **Mark as Visited** — toggle visited state per destination, reflected instantly in the UI
- **Duplicate detection** — prevents adding the same destination (name + country) twice
- **Search** — live filter by destination name
- **Loading skeletons** — shimmer placeholder cards while fetching from Supabase
- **Error handling** — dismissible error banners for failed network requests
- **Inline delete confirmation** — replaces browser `confirm()` with a Yes/No in-card prompt
- **Responsive** — 3-column grid on desktop, 2-column on tablet, single column on mobile

## Tech Stack

- [React 19](https://react.dev) + [Vite 7](https://vitejs.dev)
- [Supabase](https://supabase.com) — Auth + PostgreSQL database
- CSS (no UI framework)
- Deployed on [Netlify](https://netlify.com)

## Project Structure

```
src/
├── components/
│   ├── AuthForm.jsx          # Sign in / sign up form
│   ├── DestinationCard.jsx   # Card with visited toggle, inline delete confirm
│   ├── DestinationForm.jsx   # Add/edit form with validation and scroll-into-view
│   ├── ProtectedRoute.jsx    # Auth gate — shows AuthForm if no session
│   └── SearchBar.jsx         # Live search input with clear button
├── context/
│   └── AuthContext.jsx       # Auth state, session persistence, signIn/signOut
├── lib/
│   └── supabase.js           # Supabase client (reads from env vars)
├── utils/
│   └── storage.js            # Supabase CRUD — getDestinations, add, update, delete, toggleVisited
├── App.jsx                   # Root component, state management, handlers
├── App.css                   # All app styles
├── index.css                 # Base reset and typography
└── main.jsx                  # Entry point — AuthProvider + ProtectedRoute wrappers
```

## Database Schema

```sql
create table destinations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  country    text not null,
  category   text,
  rating     integer check (rating >= 1 and rating <= 5),
  notes      text,
  visited    boolean not null default false,
  created_at timestamptz not null default now()
);
```

Row Level Security is enabled with policies scoped to `auth.uid()` on all four operations (SELECT, INSERT, UPDATE, DELETE).

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Create a Supabase project

- Go to [supabase.com](https://supabase.com) and create a project
- Run the SQL above in the SQL editor
- Enable Row Level Security and add the four policies (see `transcripts/`)

### 3. Set environment variables

Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Both values are in your Supabase dashboard under **Project Settings → API**.

### 4. Run

```bash
npm run dev
```

App runs at `http://localhost:5173`

## Deployment (Netlify)

1. Push the repo to GitHub
2. Connect the repo in Netlify
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in **Site configuration → Environment variables**
4. In Supabase → **Authentication → URL Configuration**, set your Netlify domain as Site URL and add it to Redirect URLs

The `netlify.toml` in the repo root handles build config automatically.

## Security Notes

- The Supabase `anon` key is safe to include in frontend code — it is designed to be public
- Data security is enforced server-side by Row Level Security, not by key secrecy
- Never use or expose the `service_role` key in frontend code — it bypasses all RLS policies
- `.env.local` is gitignored and must be set separately in Netlify's environment variables
