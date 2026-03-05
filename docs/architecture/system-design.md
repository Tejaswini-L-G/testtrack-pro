# System Architecture

TestTrack Pro follows a monorepo architecture with separate frontend and backend applications.

## Architecture Overview

Frontend (React)
↓
REST API (Express.js)
↓
Prisma ORM
↓
PostgreSQL Database

## Components

### Frontend
- React application
- React Router for navigation
- Fetch API for backend communication
- CSS for styling

### Backend
- Node.js runtime
- Express.js API server
- Prisma ORM
- JWT authentication
- Swagger API documentation

### Database
- PostgreSQL
- Managed using Prisma migrations

## Integration Features

- Git integration (commit links in bugs)
- Webhook support for external systems
- REST API access with API keys