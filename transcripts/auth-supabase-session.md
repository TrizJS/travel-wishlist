# Session Transcript — Supabase Auth Integration
**Date:** 2026-04-14  
**Project:** Travel Wishlist (Vite + React + Netlify)  
**Goal:** Add email/password authentication with per-user data isolation

---

## Overview

This session extended the existing Travel Wishlist app (previously using localStorage) with full Supabase authentication and per-user cloud storage. The app is deployed on Netlify.

---

## Step 1 — Evaluate & Choose Auth Provider

**Decision:** Supabase over Firebase.

**Reasons:**
- Supabase provides auth + database in one service
- Row Level Security (RLS) handles per-user data isolation at the database level
- PostgreSQL is more familiar than Firestore's NoSQL model
- The anon key is safe to expose in frontend code — RLS is the actual security layer

---

## Step 2 — Install & Configure Supabase

**Command:**
```bash
npm install @supabase/supabase-js
```

**Files created:**

`.env.local` (gitignored, never committed):
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

`src/lib/supabase.js` — exports a single configured Supabase client:
```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

The `VITE_` prefix is required — Vite only bundles env vars with this prefix into the client build.

---

## Step 3 — Auth Context

**File created:** `src/context/AuthContext.jsx`

- Uses `supabase.auth.getSession()` on mount to restore sessions from localStorage (handles page refresh persistence)
- Uses `supabase.auth.onAuthStateChange()` to keep React state in sync with auth events
- Exposes `user`, `loading`, `signUp()`, `signIn()`, `signOut()` via a `useAuth()` hook
- `loading` flag prevents a flash of the login screen on refresh for already-authenticated users

**Key pattern:**
```
Page refresh → loading = true → getSession() reads JWT from localStorage
→ setUser(session.user) → loading = false → render main app
```

**ESLint fix applied:**
```js
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
```
Required because the file exports both a component (`AuthProvider`) and a hook (`useAuth`).

---

## Step 4 — Wrap App with AuthProvider

**File modified:** `src/main.jsx`

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

Makes `useAuth()` available to every component in the tree.

---

## Step 5 — Login/Signup UI

**File created:** `src/components/AuthForm.jsx`

- Single form component that toggles between Sign In and Sign Up mode
- Reuses existing CSS classes: `.destination-form`, `.form-group`, `.form-error`
- Calls `signIn()` or `signUp()` from `useAuth()` — no direct Supabase imports
- Shows a success message after sign-up (Supabase sends a confirmation email)
- Disables the submit button while the request is in flight

---

## Step 6 — Protected Route Pattern

**File created:** `src/components/ProtectedRoute.jsx`

```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;       // wait for session check
  if (!user) return <AuthForm />; // not logged in
  return children;                // logged in — render content
}
```

No router library needed. Used in `main.jsx` to wrap `<App>`:

```jsx
<AuthProvider>
  <ProtectedRoute>
    <App />
  </ProtectedRoute>
</AuthProvider>
```

`App` is now guaranteed to only mount when a user is authenticated.

---

## Step 7 — Supabase Database Table & RLS

**SQL run in Supabase SQL Editor:**

```sql
create table destinations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  country     text,
  category    text,
  rating      integer check (rating >= 1 and rating <= 5),
  notes       text,
  visited     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table destinations enable row level security;

create policy "Users can view own destinations"
  on destinations for select
  using (user_id = auth.uid());

create policy "Users can insert own destinations"
  on destinations for insert
  with check (user_id = auth.uid());

create policy "Users can update own destinations"
  on destinations for update
  using (user_id = auth.uid());

create policy "Users can delete own destinations"
  on destinations for delete
  using (user_id = auth.uid());
```

**Key design decisions:**
- `gen_random_uuid()` replaces the old `Date.now()` string IDs
- `on delete cascade` cleans up destinations if a user account is deleted
- All four RLS policies required — enabling RLS with no policies defaults to deny-all
- `using` filters rows being read/targeted; `with check` validates rows being written

---

## Step 8 — Migrate storage.js to Supabase

**File rewritten:** `src/utils/storage.js`

All four functions became `async`:

- `getDestinations()` — `select('*')` ordered by `created_at`; RLS auto-scopes to the logged-in user
- `addDestination(destination, userId)` — destructures only DB-needed fields (ignores the locally-generated id); returns the created row with its Supabase UUID
- `updateDestination(destination)` — updates by `id`; RLS prevents editing others' rows
- `deleteDestination(id)` — deletes by `id`; RLS prevents deleting others' rows

**File modified:** `src/App.jsx`

- `useState([])` replaces `useState(() => getDestinations())` (sync → async)
- `useEffect` fetches destinations on mount
- All handlers updated to `async/await`
- State updated locally after mutations (no refetch needed)
- `user.id` passed to `addDestination` so RLS `with check` policy accepts the insert

---

## Step 9 — Netlify Deployment

**File created:** `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

**Security audit results:**
- No secrets found in any source file (`src/`)
- No `.env` files present in git history
- `service_role` key absent from compiled bundle
- Only the anon key appears in the bundle (expected and safe)

**Netlify environment variables to set manually:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Supabase URL Configuration (Authentication → URL Configuration):**
- Site URL: `https://your-app.netlify.app`
- Redirect URLs: `https://your-app.netlify.app` and `http://localhost:5174`

This is required so Supabase confirmation emails redirect to the correct domain in production.

---

## Files Changed Summary

| File | Action |
|---|---|
| `src/lib/supabase.js` | Created — Supabase client |
| `src/context/AuthContext.jsx` | Created — auth state, session persistence |
| `src/components/AuthForm.jsx` | Created — login/signup UI |
| `src/components/ProtectedRoute.jsx` | Created — auth gate component |
| `src/utils/storage.js` | Rewritten — localStorage → Supabase queries |
| `src/App.jsx` | Modified — async data, uses useAuth |
| `src/main.jsx` | Modified — AuthProvider + ProtectedRoute wrappers |
| `netlify.toml` | Created — Netlify build config |
| `.env.local` | Created locally — never committed |

---

## Key Concepts Covered

- **RLS (Row Level Security):** Database-level policy that filters queries server-side using `auth.uid()`. Protects data even if the anon key is exposed.
- **Session persistence:** Supabase SDK stores the JWT in localStorage automatically. `getSession()` restores it on refresh.
- **anon key vs service_role key:** anon key is safe to expose (RLS protects data); service_role bypasses RLS entirely and must never appear in frontend code.
- **VITE_ prefix:** Required for Vite to bundle env vars into the client build.
- **ProtectedRoute pattern:** Encapsulates auth gate logic in a reusable wrapper component — no router library needed for simple apps.
