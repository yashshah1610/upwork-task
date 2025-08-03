# TypeORM CRUD API (Express + TypeScript)

A simple CRUD backend using Express, TypeScript, TypeORM, and SQLite.

## Features

- Create, read, update, delete resources
- List with filters (by title)
- Simple SQLite database

## Setup

```bash
npm install
npm run dev
```

## API Endpoints

| Method | Route            | Description           |
|--------|------------------|-----------------------|
| GET    | /resources        | List all resources    |
| GET    | /resources/:id    | Get one resource      |
| POST   | /resources        | Create new resource   |
| PUT    | /resources/:id    | Update resource       |
| DELETE | /resources/:id    | Delete resource       |