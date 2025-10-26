# Calendar Application Setup Guide

This application consists of a React frontend and a FastAPI backend with SQLite database.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

## Installation Steps

### 1. Install Root Dependencies

```bash
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

Or using the root script:
```bash
npm run install:all
```

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

Alternatively, you can use a virtual environment:

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cd ..
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)

```bash
npm run dev
```

This will start:
- Frontend on http://localhost:8080
- Backend API on http://localhost:8000

### Option 2: Run Frontend and Backend Separately

**Terminal 1 - Frontend:**
```bash
npm run dev:frontend
# OR: cd frontend && npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
# OR: cd backend && python run.py
```

## API Documentation

Once the backend is running, you can access:
- API Documentation (Swagger UI): http://localhost:8000/docs
- Alternative API Documentation (ReDoc): http://localhost:8000/redoc

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # Database configuration
│   │   ├── models.py        # SQLAlchemy models
│   │   └── schemas.py       # Pydantic schemas
│   ├── requirements.txt
│   └── run.py              # Backend runner script
├── src/
│   ├── components/
│   ├── lib/
│   │   └── api.ts          # API client
│   ├── types/
│   │   └── event.ts        # TypeScript types
│   └── pages/
├── calendar.db             # SQLite database (created automatically)
└── package.json
```

## Features

- **Month, Week, and Day Views**: Switch between different calendar views
- **Event Management**: Create, edit, and delete events
- **Persistent Storage**: Events are stored in SQLite database
- **Real-time Updates**: UI updates automatically after CRUD operations

## API Endpoints

- `GET /api/events` - Get all events (with optional date range filtering)
- `GET /api/events/{id}` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/{id}` - Update an event
- `DELETE /api/events/{id}` - Delete an event

## Troubleshooting

### Backend not starting

- Make sure Python dependencies are installed: `pip install -r backend/requirements.txt`
- Check if port 8000 is available
- Verify Python version: `python --version` (should be 3.8+)

### Frontend not connecting to backend

- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify API_BASE_URL in `src/lib/api.ts` is set to `http://localhost:8000`

### Database errors

- Delete `calendar.db` file and restart the backend to recreate the database
- Check file permissions for the database file
