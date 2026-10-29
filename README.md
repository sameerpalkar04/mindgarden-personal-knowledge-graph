# Mindgarden — Personal Knowledge Graph

Mindgarden is a private space for capturing notes and connecting related ideas. Each account has its own notes and graph. Notes can be organized with tags, linked to other notes, searched, and explored as a visual network.

## Features

- Account registration and sign-in with hashed passwords and JWT authentication
- Create, edit, search, and delete notes
- Add tags to notes and connect notes to each other
- View note relationships in an interactive graph
- Responsive dashboard with note, tag, and connection counts

## Stack

- Frontend: React, TypeScript, Vite, React Router, React Flow
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL

## Run locally

1. Create a PostgreSQL database, then copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and a private `JWT_SECRET`.
2. Install and initialize the backend:

   ```sh
   cd backend
   npm install
   npx prisma migrate deploy
   npm run dev
   ```

3. In another terminal, copy `frontend/.env.example` to `frontend/.env`, then start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

Open the Vite URL shown in the terminal (by default `http://localhost:5173`). The API defaults to `http://localhost:3000`; set `VITE_API_URL` and `FRONTEND_ORIGIN` if your local ports differ.

## Project layout

```text
backend/   Express API, Prisma schema, migrations, authentication and data services
frontend/  React application, dashboard, note editor, and graph explorer
```

## Checks

From `frontend/`, run `npm run build` for a production build and `npm run lint` for static checks.
