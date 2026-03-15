# Café Employee Management System

## Live Demo

> URL will be added after deployment

## Prerequisites

- Docker and Docker Compose

## Running with Docker

```bash
git clone <repo-url>
cd GIC-THA

cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:3000

## Running Locally (without Docker)

**Backend**

```bash
cd backend
cp .env.example .env
npm install
npm run migration:run
npm run seed           # optional: seed sample data
npm run start:dev
```

**Frontend**

```bash
cd frontend
npm install
# Create frontend/.env:
# VITE_API_BASE_URL=http://localhost:3000
npm run dev
```

## Running Tests

```bash
cd backend
npm run test
```
