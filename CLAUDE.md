# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Calendar-inspired web application built with React, TypeScript, Vite, and shadcn/ui. The application provides month, week, and day views for calendar management with an interface similar to Google Calendar.

Originally created through Lovable.dev (https://lovable.dev/projects/a02aa3a8-8bfa-42f6-a7a7-a0bd0a575ca0).

## Development Commands

```bash
# Install root dependencies (concurrently)
npm install

# Install frontend dependencies
npm run install:all
# OR: cd frontend && npm install

# Install backend dependencies
cd backend && pip install -r requirements.txt

# Start both frontend and backend (RECOMMENDED)
npm run dev
# This starts:
# - Frontend on http://localhost:8080
# - Backend API on http://localhost:8000

# Start only frontend
npm run dev:frontend
# OR: cd frontend && npm run dev

# Start only backend
npm run dev:backend
# OR: cd backend && python run.py

# Build frontend for production
npm run build

# Lint the frontend codebase
npm run lint
```

## Architecture

### Full Stack Structure

The application consists of:
- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI (Python)
- **Database**: SQLite

### Frontend Architecture

The app uses a single-page architecture with minimal routing:
- **Main entry**: `src/main.tsx` → `src/App.tsx` → `src/pages/Index.tsx`
- **Routing**: Uses React Router with only two routes: `/` (Index) and `*` (NotFound)
- **State management**: Component-level state (useState) with TanStack Query for server state
- **Data fetching**: TanStack Query (React Query) manages all API calls and caching

### Backend Architecture

Located in the `backend/` directory:
- **`app/main.py`**: FastAPI application with CRUD endpoints
- **`app/database.py`**: SQLAlchemy database configuration
- **`app/models.py`**: Event database model
- **`app/schemas.py`**: Pydantic schemas for request/response validation
- **`calendar.db`**: SQLite database file (auto-created)

### Key Layout Pattern

The Index page (`src/pages/Index.tsx`) implements a three-column layout:
1. **Left Sidebar** (`Sidebar.tsx`): Collapsible sidebar with mini-calendar and calendar list
2. **Center Content**: Calendar views (Month/Week/Day) with header
3. **Right Sidebar** (`RightSidebar.tsx`): Additional controls/information

### Component Organization

- **`src/components/ui/`**: shadcn/ui components (auto-generated, don't manually edit)
- **`src/components/Calendar/`**: Custom calendar components
  - `CalendarHeader.tsx`: Navigation, view switcher, search
  - `MonthView.tsx`, `WeekView.tsx`, `DayView.tsx`: Calendar view implementations
  - `Sidebar.tsx`: Left sidebar with mini-calendar
  - `RightSidebar.tsx`: Right sidebar
  - `MiniCalendar.tsx`: Small calendar for navigation
  - `EventModal.tsx`: Dialog for creating/editing events
- **`src/lib/api.ts`**: API client for backend communication
- **`src/types/event.ts`**: TypeScript types for events

### State Flow

Calendar state is managed in `Index.tsx`:
- `currentDate`: The date being displayed
- `view`: Current view type (month/week/day)
- `isEventModalOpen`: Event modal visibility
- `selectedDate`: Date selected for event creation
- `isLeftSidebarCollapsed`: Sidebar collapse state

View switching logic:
- Mini-calendar click toggles between day view and previous view
- Previous view is tracked to enable reverting from day view

### Styling System

- **Tailwind CSS** with custom configuration in `tailwind.config.ts`
- **CSS Variables** for theming defined via HSL values
- **Custom colors**: Google Calendar-inspired colors (`google-blue`, `calendar-border`, `calendar-gray`, etc.)
- **Path alias**: `@/` resolves to `src/` directory

### Adding shadcn/ui Components

This project uses shadcn/ui components configured in `components.json`:
- Style: default
- Base color: slate
- CSS variables: enabled
- TypeScript: enabled

To add new shadcn components, use the shadcn CLI (if available) or manually add component files to `src/components/ui/`.

## Important Patterns

### Date Handling

Use native JavaScript Date objects throughout the application. The `date-fns` library is available in dependencies for date manipulation if needed.

### Event Creation Flow

1. User clicks date/time slot → `handleDateClick()` in Index.tsx
2. `selectedDate` state updated and `EventModal` opened
3. Event saved via `handleSaveEvent()` callback (currently only console logs and shows toast)

### Responsive Sidebar

The left sidebar can be collapsed/expanded, showing only icons when collapsed. The state affects the entire layout width distribution.

### Animations

Custom animations use Tailwind's `animate-fade-in` class for view transitions (defined in global CSS).

## Development Notes

- **Port**: Development server runs on port 8080 (configured in vite.config.ts)
- **Path aliases**: Use `@/` prefix for imports (resolves to `src/`)
- **Component tagging**: lovable-tagger plugin runs in development mode only
- **No git**: This directory is not currently a git repository

## API Integration

### Backend API Endpoints

- `GET /api/events` - Get all events (optional date range filtering)
- `GET /api/events/{id}` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `GET /docs` - Swagger API documentation
- `GET /health` - Health check endpoint

### API Client Usage

The frontend uses `src/lib/api.ts` for all backend communication:

```typescript
import { eventApi } from "@/lib/api";

// Fetch events
const events = await eventApi.getEvents();

// Create event
const newEvent = await eventApi.createEvent({
  title: "Meeting",
  start_time: "2025-10-26T14:00:00",
  end_time: "2025-10-26T15:00:00",
  description: "Team sync"
});
```

### Data Flow

1. User action triggers React Query mutation/query
2. API client makes HTTP request to FastAPI backend
3. Backend validates with Pydantic, processes with SQLAlchemy
4. Response sent back to frontend
5. React Query updates cache and triggers re-render

## Current Limitations

- No authentication or user management
- No event recurrence/repeat functionality
- Single user system (no multi-tenancy)
- Basic event model (no attendees, attachments, reminders)
