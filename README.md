# Event Management Project

A full-stack event management app with a Vue 3 frontend and a Laravel backend. The project lets admins create and manage events, track attendee interest, limit registrations by capacity, and browse schedules in both card and calendar views.

## Tech Stack

- Frontend: Vue 3, Vite, Pinia, Vue Router, Tailwind CSS, Vitest, Playwright
- Backend: Laravel 13, PHP 8.3, Sanctum, PHPUnit
- Data model: `events` and `interests`

## Features

- Create, edit, and delete events
- Mark events as active/inactive
- Set event start date, end date, and registration capacity
- View all events, upcoming events, and a calendar summary
- Register attendee interest for upcoming events
- Prevent duplicate attendee registration by email for the same event
- Prevent registrations after capacity is reached

## Project Structure

```text
.
├── frontend/   # Vue application
└── backend/    # Laravel API
```

## Local Setup

### Frontend

Requirements:

- Node.js `^20.19.0 || >=22.12.0`

Commands:

```bash
cd frontend
npm install
npm run dev
```

Default dev server: `http://localhost:5173`

### Backend

Requirements:

- PHP 8.3+
- Composer
- A database supported by Laravel

Commands:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Default API server: `http://127.0.0.1:8000`

## Running Tests

Frontend unit tests:

```bash
cd frontend
npm test
```

Backend feature tests:

```bash
cd backend
php artisan test
```

Note: the backend test suite currently expects SQLite support in PHP. If `pdo_sqlite` or the SQLite driver is missing locally, the test run will fail before application assertions execute.

## Main API Endpoints

- `GET /api/all` - list all events
- `POST /api/add` - create an event
- `POST /api/edit/{id}` - update an event
- `DELETE /api/delete/{id}` - delete an event
- `GET /api/active` - list active events
- `GET /api/events/{eventId}/interests` - list attendee interest for one event
- `POST /api/events/{eventId}/interests` - register attendee interest


