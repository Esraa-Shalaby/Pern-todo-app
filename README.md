# To_Do_App (React, Node, Express, PostgreSQL, Docker)

A full-stack to-do app built with the **PERN stack** (PostgreSQL, Express, React, Node.js) and fully containerized with **Docker Compose**.

<!-- Add a screenshot after you run the app: save it as docs/screenshot.png and uncomment the line below -->
<!-- ![App screenshot](docs/screenshot.png) -->

## Features

- **Create, complete and delete tasks** with automatic list refresh
- **RESTful API** built with Express, with data stored in PostgreSQL
- **Responsive UI** with a header, footer and card layout, built with Chakra UI
- **Server state management** with React Query
- **One-command setup**: PostgreSQL, API and frontend all start with `docker compose up`
- **Automatic migrations**: the database schema is created when the backend starts

## Tech Stack

| Layer     | Technologies                                                   |
| --------- | -------------------------------------------------------------- |
| Frontend  | React, TypeScript, Chakra UI, React Query, React Router, Axios |
| Backend   | Node.js, Express, TypeScript, Objection.js, Knex               |
| Database  | PostgreSQL 16                                                  |
| DevOps    | Docker, Docker Compose, Nginx (serves the production frontend) |
| Testing   | Jest, React Testing Library                                    |

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── db/            # knex config, migrations, Objection models
│   │   ├── routes/        # /todos routes
│   │   └── index.ts
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # Header, Footer, Layout, Todos, NewTodo, ...
│   │   └── utils/         # API client
│   ├── nginx.conf
│   └── Dockerfile
├── docker/postgres/       # database init script
├── docker-compose.yml
└── .env.example
```

## Getting Started (Docker)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose

### Run

```bash
git clone https://github.com/<your-username>/To_Do_App-React-Node-Express-PostgreSQL-Docker.git
cd To_Do_App-React-Node-Express-PostgreSQL-Docker
cp .env.example .env      # optional: every variable has a default
docker compose up --build
```

| Service    | URL                               |
| ---------- | --------------------------------- |
| Frontend   | http://localhost:3000             |
| API        | http://localhost:4000             |
| PostgreSQL | `127.0.0.1:5432` (localhost only) |

After changing any source file, run `docker compose up --build` again so the images are rebuilt.

## Environment Variables

| Variable        | Description                | Default     |
| --------------- | -------------------------- | ----------- |
| `PG_DATABASE`   | Database name              | `todo_db`   |
| `PG_USER`       | Database user              | `todo_user` |
| `PG_PASSWORD`   | Database password          | `change-me` |
| `FRONTEND_PORT` | Host port for the frontend | `3000`      |
| `BACKEND_PORT`  | Host port for the API      | `4000`      |
| `DB_HOST_PORT`  | Host port for PostgreSQL   | `5432`      |

> Change `PG_PASSWORD` before deploying anywhere public, and keep your `.env` file out of Git.

## Running Without Docker

You need Node.js 20 and a running PostgreSQL database with the `uuid-ossp` extension
(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`).

**Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=todo_db
PG_USER=your-user
PG_PASSWORD=your-password
```

```bash
npm run knex migrate:latest
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm start
```

Then open http://localhost:3000.

## API Reference

| Method | Route        | Description    |
| :----: | ------------ | -------------- |
| GET    | `/todos`     | List all todos |
| GET    | `/todos/:id` | Get a todo     |
| POST   | `/todos`     | Create a todo  |
| PATCH  | `/todos/:id` | Update a todo  |
| DELETE | `/todos/:id` | Delete a todo  |

Request bodies are wrapped in a `todo` object, for example:

```json
{ "todo": { "description": "Buy milk" } }
```

## Tests

```bash
cd frontend
npm test
```

## Roadmap

- [ ] Edit existing tasks
- [ ] Priorities and due dates
- [ ] Search, filter and sort
- [ ] Dark mode
- [ ] Animations

## Author

**Esraa Shalaby**: [GitHub](https://github.com/Esraa-Shalaby) · [LinkedIn](https://linkedin.com/in/esraa-mohamed-shalaby)
