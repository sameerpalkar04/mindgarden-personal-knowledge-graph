<div align="center">

# 🌿 Mindgarden

### Your thoughts, connected.

Capture what matters, grow ideas with thoughtful connections, and explore your personal knowledge graph.

![React](https://img.shields.io/badge/React-19-315d48?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-315d48?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-Node.js-315d48?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-315d48?style=flat-square&logo=postgresql&logoColor=white)

</div>

---

Mindgarden is a calm, private space for building a personal library of ideas. Each account has its own notes and graph. Add tags, connect related notes, and watch your knowledge take shape over time.

## 🌱 What you can do

| ✍️ Capture | 🧭 Connect | 🌿 Grow |
|:--|:--|:--|
| Write in Markdown, start from a template, and let drafts save as you type. | Add tags, named relationships, backlinks, and related-note suggestions. | Explore your notes in a searchable graph, grouped and colored by tag. |

### Your notes, your way

- **Stay organized** with search, related-term matching, tag filters, sorting, pins, archive, and trash.
- **Pick up where you left off** with daily notes, reminders, and version history you can restore.
- **Keep your ideas portable** with Markdown, CSV, and JSON import and export, plus file attachments.
- **Take your notes offline** with local drafts that sync when you reconnect.
- **Share selectively** with read-only access for other Mindgarden accounts; revoke access whenever you like.
- **Get a little perspective** from quick summaries and related-idea suggestions, generated locally without an external AI service.

## 🍃 Built with

| Area | Tools |
|:--|:--|
| Frontend | React, TypeScript, Vite, React Router, React Flow |
| Backend | Node.js, Express, Prisma |
| Database | PostgreSQL |
| Authentication | Hashed passwords and JWT |

## 🌼 Run Mindgarden locally

### 1. Prepare the database

Create a PostgreSQL database. Copy `backend/.env.example` to `backend/.env`, then set `DATABASE_URL` and a private `JWT_SECRET`.

### 2. Start the backend

```sh
cd backend
npm install
npx prisma migrate deploy
npm run dev
```

### 3. Start the frontend

In another terminal, copy `frontend/.env.example` to `frontend/.env`, then run:

```sh
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal. By default, the frontend runs at `http://localhost:5173` and the API at `http://localhost:3000`. If your ports differ, set `VITE_API_URL` and `FRONTEND_ORIGIN` in the relevant environment files.

## 🌳 Project layout

```text
backend/   Express API, Prisma schema and migrations, authentication, and data services
frontend/  React app, dashboard, note editor, and graph explorer
```

## 🔎 Checks

From `frontend/`, run:

```sh
npm run build
npm run lint
```

---

<div align="center">

Made for curious minds. 🌿

</div>
