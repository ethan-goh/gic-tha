# Cafe Employee Management System

## Live Demo

https://empowering-contentment-production-f55c.up.railway.app/

## Tech Stack

**Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
**Frontend:** React 19, Vite, TanStack Query, AG Grid, Ant Design
**Infrastructure:** Docker, Docker Compose, nginx, Railway

## Prerequisites

- Docker and Docker Compose

## Running with Docker

```bash
git clone https://github.com/ethan-goh/gic-tha.git
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
# Create frontend/.env with:
# VITE_API_BASE_URL=http://localhost:3000
npm run dev
```

## Running Tests

```bash
cd backend
npm run test
```

37 unit tests covering controllers and command/query handlers.

---

## Design Decisions

### CQRS + Mediator Pattern
The backend uses the Command Query Responsibility Segregation pattern via `@nestjs/cqrs`. Write operations (create, update, delete) are dispatched as commands; reads are dispatched as queries. Both go through a mediator (CommandBus / QueryBus) that routes them to the correct handler. This decouples the controller from the handler logic — the controller only knows how to dispatch, not how to execute. It also makes unit testing straightforward since each handler has a single responsibility.

### Dependency Injection
NestJS has a built-in DI container (comparable to Autofac in .NET). Repositories, handlers, and services are all registered as providers and injected where needed. No manual instantiation — the framework resolves the dependency graph at startup. This keeps constructors declarative and makes swapping implementations (e.g. in tests) trivial.

### RESTful API Design
The API follows REST conventions: resources are nouns (`/cafes`, `/employees`), HTTP verbs map to operations (GET/POST/PUT/DELETE), and filtering is done via query parameters (`GET /cafes?location=...`). There are no endpoints for individual record fetch (`GET /cafes/:id`) — the frontend reads from its query cache on edit instead of making an extra round trip.

### Test-Driven Development (Backend)
The backend was developed test-first. Tests were written before or alongside the implementation for all controllers and command/query handlers. Mocks are used for the CommandBus, QueryBus, and repositories to keep tests fast and isolated from the database. This approach caught integration issues early and kept each handler focused on a single responsibility.

### Testing Strategy
The backend follows TDD with 37 unit tests. The frontend has no unit tests — the pages are standard CRUD UI that fetch, display, and mutate data. The two scenarios that justify frontend tests are reusable components with complex internal state, or components that respond in multiple ways to server actions. Neither applies here. The backend's test coverage at the data and business logic layer provides sufficient confidence for this scope.

### Deployment on Railway
Railway was chosen because it supports Dockerfile-based deployments natively, which keeps the production environment identical to the local Docker Compose setup. It also offers a managed PostgreSQL add-on in the same project, so the backend and database are co-located with internal networking and no additional configuration needed.
