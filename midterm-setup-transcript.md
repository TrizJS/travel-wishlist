# Midterm Project Setup — Session Transcript Summary

**Project:** Travel Wishlist
**Date:** 2026-03-09
**Course:** Web Development (Mid-term Project)

---

## Session Overview

This session covered the full initial setup of the Travel Wishlist web app — from project planning through a deployed GitHub repository with a live landing page.

---

## 1. Project Planning

Discussed and planned the Travel Wishlist app architecture before writing any code.

**Decisions made:**
- Framework: React + Vite (JavaScript)
- Data persistence: localStorage
- No UI framework — plain CSS only
- Responsive breakpoints: 480px mobile

**Planned component structure:**
| Component | Purpose |
|---|---|
| `App.jsx` | Root state and layout |
| `DestinationList` | Renders all destination cards |
| `DestinationCard` | Single card with edit/delete/rating |
| `DestinationForm` | Add/edit form (reused for both) |
| `SearchBar` | Filters the list |
| `StarRating` | 1–5 star input/display |

**Planned localStorage data structure:**
```js
[
  {
    id: "uuid-or-Date.now()",
    name: "Kyoto, Japan",
    country: "Japan",
    rating: 4,
    notes: "Cherry blossom season",
    visited: false,
    createdAt: "2026-03-09T..."
  }
]
```

---

## 2. Vite React Project Creation

User created the project via terminal:
```bash
npm create vite@latest travel-wishlist -- --template react
```

Project was initially created inside `cozy-corner-cafe/` (later moved — see step 6).

---

## 3. Git Initialization

Initialized git and made the first commit inside the project folder:
```bash
git init
git add .
git commit -m "Initial Vite React project setup."
```

---

## 4. Custom Landing Page

Replaced the default Vite React starter with a custom landing page.

**Files modified:**
- `src/App.jsx` — Custom layout with hero section, features list, and status banner
- `src/App.css` — Clean custom styles with blue accent colors, card layout, responsive design
- `src/index.css` — Stripped down base reset replacing Vite dark-mode defaults

**Landing page sections:**
- Hero: title, plane emoji icon, tagline
- Planned Features: rendered from array as styled list items
- Status banner: "under development" notice
- Footer: removed per user request after initial build

**Second commit:**
```bash
git add src/App.jsx src/App.css src/index.css
git commit -m "Add custom Travel Wishlist landing page"
```

---

## 5. GitHub Repository Setup

Created a new public GitHub repo under the TrizJS account and pushed:
```bash
gh auth switch --user TrizJS
gh repo create travel-wishlist --public --source=. --remote=origin --push
```

**Repo URL:** https://github.com/TrizJS/travel-wishlist

---

## 6. Project Folder Relocation

**Problem:** The project was accidentally created inside `cozy-corner-cafe/` instead of as a standalone folder.

**Solution:**
- Copied all project files (including `.git`) to `C:\Users\aweso\Travel Wishlist\`
- Ran `npm install` in the new location to restore `node_modules`
- Attempted to delete old folder — blocked by Windows file lock (dev server + VSCode)
- User stopped dev server and collapsed folder in VSCode; old folder deleted manually

**New project location:** `C:\Users\aweso\Travel Wishlist\`

---

## 7. README

Created `README.md` with full project documentation:
- Project description
- Planned features list
- Tech stack
- Future improvements note

```bash
git add README.md
git commit -m "Add project README with description, features, and tech stack"
git push
```

---

## Final Project State

| Item | Status |
|---|---|
| Vite + React project | Running on localhost:5173 |
| Custom landing page | Complete |
| Git repository | 3 commits on `master` |
| GitHub repo | https://github.com/TrizJS/travel-wishlist |
| Netlify deployment | Connected via dashboard (auto-deploys on push) |
| README | Written and pushed |

---

## 8. Project Plan Review

**Prompt:** Before I start building features, review my project plan. Do the planned features meet the requirements for a small CRUD application using localStorage? Is anything missing that would improve usability without adding unnecessary complexity?

**Review:**

### CRUD Coverage

| Operation | Feature | Status |
|---|---|---|
| **Create** | Add destinations | ✓ Covered |
| **Read** | Display destination list | ⚠️ Implied but never stated |
| **Update** | Edit saved destinations | ✓ Covered |
| **Delete** | Delete destinations | ✓ Covered |
| **Persist** | localStorage | ✓ Covered |

The only gap is that **Read is assumed but not defined** — explicitly plan a destination list view as a feature so it's clear how saved data is displayed.

### What's Good

- The data structure already includes `visited`, `rating`, and `notes` — well thought out for a small app
- Search covers the most common user need without over-engineering
- Scope is appropriate for a mid-term project

### Small Additions Worth Considering

1. **Mark as visited toggle** — a single boolean flip on a card; the data structure already has `visited: false`, so nearly free to implement
2. **Empty state message** — show "No destinations yet. Add one!" when the list is empty; one `if` condition, big UX difference
3. **Delete confirmation** — a simple `window.confirm()` before deleting prevents accidental data loss

### What to Leave Out

- Sorting/filtering beyond search — adds complexity for marginal gain
- Categories or tags — out of scope for mid-term
- Any backend or auth — localStorage is the right call here

**Bottom line:** Solid CRUD coverage. Add "display destination list" as an explicit feature, and consider the three small additions above — each under 10 lines of code but make the app feel complete.

---

## Notes & Lessons

- Always verify the working directory before running `npm create vite`
- On Windows, file locks can prevent folder deletion — stopping the dev server and closing VSCode Explorer resolves this
- GitHub CLI requires switching accounts explicitly (`gh auth switch --user`) when multiple accounts are configured
- Netlify deployment requires browser-based OAuth setup via the Netlify dashboard; CLI is an alternative for future deploys
