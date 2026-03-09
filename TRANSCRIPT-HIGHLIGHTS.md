# Travel Wishlist — Development Highlights Transcript

**Project:** Travel Wishlist
**Date:** 2026-03-09
**Phase:** Feature Build (Mid-term)

---

## Architecture Decision — No Redux

State management was evaluated before building. Decision: keep all state in `App.jsx` using `useState`.

**Reasoning:**
- App has one data type (destinations) and one source of truth (localStorage)
- Redux/Zustand adds config overhead with no benefit at this scale
- `App.jsx` as the single state owner keeps the data flow simple and readable

---

## 1. Architecture Review

Reviewed planned features against CRUD requirements before writing code.

**CRUD coverage confirmed:**
| Operation | Feature |
|---|---|
| Create | Add destinations |
| Read | Display destination list (added as explicit component) |
| Update | Edit saved destinations |
| Delete | Delete destinations |
| Persist | localStorage |

**Additions incorporated from review:**
- `DestinationList` made explicit as a named component responsibility
- Empty state message added for better UX
- Delete confirmation via `window.confirm()` added to prevent accidental loss
- Visited toggle planned (data structure already included `visited: false`)

---

## 2. localStorage Helper (`src/utils/storage.js`)

Created a dedicated utility file to keep all localStorage logic out of components.

**Functions:**
- `getDestinations()` — reads and parses the stored array
- `addDestination(destination)` — appends to the array
- `updateDestination(updated)` — replaces matching item by `id`
- `deleteDestination(id)` — filters out matching item by `id`

Storage key: `"travelWishlist"`

---

## 3. DestinationForm Component

Built a controlled form component supporting both **add** and **edit** modes using a single component.

**Key decisions:**
- All fields tracked in one `form` state object via a shared `handleChange` handler
- `useEffect` watches `editingDestination` prop — pre-fills or resets form accordingly
- `isEditing` boolean switches title, button label, and whether Cancel appears
- `base` object pattern used for clean spread of new vs. existing destination fields
- Validation: name field required; inline error shown, cleared on next valid submit
- Form resets itself after successful submit

**Fields:** name, region/country, category (dropdown), rating (dropdown, 1–5), notes

---

## 4. DestinationCard Component

Stateless display component that receives a destination object and two callbacks.

**Displays:** name, country, category pill, star rating, notes, visited label
**Actions:** Edit (passes full object to parent), Delete (confirms with `window.confirm` first)

Star rendering: `'★'.repeat(rating) + '☆'.repeat(5 - rating)` — no library needed.

---

## 5. App.jsx — Main Logic

Wired all components together with three pieces of state:

| State | Purpose |
|---|---|
| `destinations` | Array loaded from localStorage on mount |
| `editingDestination` | `null` or the destination being edited |
| `searchQuery` | Current search input value |

**Handler pattern:** each handler writes to localStorage via a storage helper, then calls `getDestinations()` to sync React state. Single `handleFormSubmit` routes to add or update based on `editingDestination`.

---

## 6. SearchBar Component

Stateless controlled input. Filters `destinations` array in `App.jsx` via derived `filteredDestinations` — no extra state or `useEffect` needed.

Features a clear (`✕`) button that appears only when a query is active.

Two empty states handled:
- No destinations at all → "No destinations yet. Add one above!"
- Query returns no matches → `No destinations match "..."`

---

## 7. Responsive Styling (`src/App.css`)

Replaced the old landing page CSS with full app styles.

**Desktop:** destination cards render in a responsive CSS Grid (`auto-fill`, min 280px columns)
**Mobile (≤ 600px):** grid collapses to single column, form buttons stack full width

Notable style details:
- Visited cards dimmed with green tint
- Category displayed as a pill badge
- Rating stars colored amber
- Edit/Delete buttons visually distinct (neutral vs. red tint)
- Empty state uses dashed border

---

## 8. Bug Fix — localStorage Crash on Empty State

**Error:** `Cannot read property 'map' of undefined`

**Root cause:** `JSON.parse(null) ?? []` — the `??` guard works for `null`/`undefined` but doesn't protect against corrupted or non-array stored data.

**Fix applied to `getDestinations()`:**
```js
export const getDestinations = () => {
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
```

Three defensive layers: missing key → empty JSON → non-array value.

---

## 9. Code Review & Minor Fixes

Full review of all files after feature build.

**Issue 1 — `rating: 1` edge case (`DestinationCard`)**
```jsx
// Before — hides stars if rating is 0
{rating && <p className="card-rating">{stars}</p>}

// After — correctly checks for null
{rating !== null && <p className="card-rating">{stars}</p>}
```

**Issue 2 — Readability (`DestinationForm`)**
```jsx
// Before — long inline spread, hard to read
const destination = {
  ...(isEditing ? editingDestination : { id: Date.now().toString(), ... }),

// After — extracted to named variable
const base = isEditing
  ? editingDestination
  : { id: Date.now().toString(), visited: false, createdAt: new Date().toISOString() };
const destination = { ...base, ... };
```

---

## Final File Structure

```
src/
├── components/
│   ├── DestinationCard.jsx
│   ├── DestinationForm.jsx
│   └── SearchBar.jsx
├── utils/
│   └── storage.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## Current Feature Status

| Feature | Status |
|---|---|
| Add destinations | Complete |
| Display destination list | Complete |
| Edit destinations | Complete |
| Delete with confirmation | Complete |
| Search by name | Complete |
| localStorage persistence | Complete |
| Responsive layout | Complete |
| Empty state messages | Complete |
| Visited toggle | Planned (data structure ready) |
