# Pharma-Care System Architecture

## Overview
Pharma-Care is structured as an enterprise AI-assisted healthcare & telemedicine monorepo:
- **`backend/`**: Node.js + Express + TypeScript + Prisma ORM (PostgreSQL) + BullMQ + Google GenAI.
- **`frontend/`**: React + Vite UI client handling patient consultations, admin dashboards, and prescription uploads.
- **`nginx/`**: Reverse proxy routing API requests and serving static builds in production.
- **`docker-compose.yml`**: Multi-container orchestration for Redis, PostgreSQL, Backend, and Nginx.
