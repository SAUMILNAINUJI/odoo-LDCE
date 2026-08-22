# GlobeTrotter — Personalized Travel Planning Platform

A full-stack travel planning application built for the Odoo Hackathon.

**Stack:** React (Vite) frontend + Node.js/Express backend, **MySQL** database
(via Sequelize ORM), following an **MVC architecture**. UI theme is inspired by
the Material Tailwind Dashboard (blue/navy sidebar, card-based layout, premium
color palette).

## Features (mapped to the problem statement)

| # | Screen | Route |
|---|--------|-------|
| 1 | Login / Signup | `/login`, `/register` |
| 2 | Dashboard / Home | `/dashboard` |
| 3 | Create Trip | `/trips/new` |
| 4 | My Trips (list) | `/trips` |
| 5 | Itinerary Builder (sections, dates, budget, activities) | `/trips/:id/build` |
| 6 | Itinerary View (day-wise, with cost) | `/trips/:id` |
| 7 | City Search | `/cities` |
| 8 | Activity Search | `/activities` |
| 9 | Trip Budget & Cost Breakdown (charts) | `/trips/:id/budget` |
| 10 | Trip Calendar / Timeline | `/calendar` |
| 11 | Shared / Public Itinerary | `/share/:token` |
| 12 | User Profile / Settings | `/profile` |
| 13 | Admin / Analytics Dashboard | `/admin` |
| — | Community feed | `/community` |

## Project structure (MVC)

```
GlobeTrotter/
├── backend/
│   ├── config/db.js          # Sequelize + MySQL connection
│   ├── models/                # M — Sequelize models & associations
│   ├── controllers/           # C — business logic per resource
│   ├── routes/                # route → controller wiring
│   ├── middleware/            # JWT auth, error handling
│   ├── seed/seedData.js       # demo cities, activities, admin/demo users
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/              # V — one file per screen
│   │   ├── components/layout/  # Sidebar, Navbar, DashboardLayout
│   │   ├── components/common/  # TripCard, CityCard, ActivityCard, StatCard...
│   │   ├── context/AuthContext.jsx
│   │   └── api/axios.js
│   └── ...
└── database/schema.sql        # raw MySQL schema (optional, sequelize.sync() also works)
```

## Setup

### 1. Database
Install MySQL locally, then either:
- Run `database/schema.sql` in your MySQL client, **or**
- Just start the backend — `sequelize.sync()` auto-creates all tables on first run.

Create a database named `globetrotter` (or update `.env`).

### 2. Backend
```bash
cd backend
cp .env.example .env      # fill in your MySQL credentials + a JWT secret
npm install
npm run seed               # optional: creates demo cities/activities + admin/demo users
npm run dev                 # starts API on http://localhost:5000
```

Demo accounts created by the seed script:
- **Admin:** admin@globetrotter.com / Admin@123
- **Demo user:** demo@globetrotter.com / Demo@123

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                 # starts app on http://localhost:5173
```

The frontend expects the API at `http://localhost:5000/api` by default. To
override, create `frontend/.env` with:
```
VITE_API_URL=http://localhost:5000/api
```

## Notes
- Auth uses JWT (7-day expiry), stored client-side in `localStorage`.
- Passwords are hashed with bcrypt.
- Trips can be shared publicly via a UUID `share_token` — no login required
  to view a shared itinerary.
- Budget breakdown aggregates activity costs by category (sightseeing, food,
  adventure, transport, stay, other) plus per-section allocated budgets.
- `node_modules` are **not** included — run `npm install` in both `backend/`
  and `frontend/` after unzipping.
