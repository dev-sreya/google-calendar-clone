# Google Calendar Clone

A modern, feature-rich calendar application inspired by Google Calendar, built with React, TypeScript, and FastAPI. This application provides a seamless calendar experience with month, week, and day views, event management, and intelligent event overlap handling.

![Calendar Application](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green) ![Vite](https://img.shields.io/badge/Vite-5.4-purple)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [Architecture Overview](#architecture-overview)
- [Business Logic & Edge Cases](#business-logic--edge-cases)
- [Animations & Interactions](#animations--interactions)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

---

## ✨ Features

### Core Functionality
- **Multiple View Modes**: Seamless switching between Month, Week, and Day views
- **Event Management**: Create, edit, and delete calendar events
- **Smart Event Display**: Automatic split-column layout for overlapping events
- **Quick Event Preview**: Click events to see details in a quick view popup
- **Recurrence Options**: Support for recurring events (daily, weekly, monthly, annually, weekdays)
- **All-Day Events**: Toggle events to span entire days
- **Real-time Updates**: Instant UI updates using React Query cache management

### User Experience
- **Intuitive Navigation**:
  - Scroll-based month navigation in month view
  - Mini calendar for quick date selection
  - Click dates to switch to day view, click again to return
- **Current Time Indicator**: Red line showing current time in week/day views
- **Responsive Scrolling**: Synchronized scrolling in week/day views with hidden time column
- **Smooth Animations**: Fade transitions between view changes

### Design
- **Google Calendar-Inspired UI**: Clean, modern interface matching Google Calendar aesthetics
- **Accessible Controls**: Keyboard navigation and screen reader support
- **Timezone Support**: Display and handle different timezones
- **Collapsible Sidebar**: Maximize screen space with a collapsible left sidebar

---

## 🛠 Technology Stack

### Frontend
- **React 18.3**: Modern React with hooks for component state management
- **TypeScript 5.5**: Type-safe development with improved DX
- **Vite 5.4**: Lightning-fast build tool and dev server
- **TanStack Query (React Query)**: Server state management and caching
- **React Router**: Client-side routing
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components built on Radix UI
- **Lucide React**: Modern icon library

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database for development
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for production-ready deployment

### Development Tools
- **ESLint**: Code linting and quality checks
- **Concurrently**: Run multiple npm scripts simultaneously
- **TypeScript**: Static type checking

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js**: v18 or higher
- **Python**: v3.8 or higher
- **npm**: v9 or higher
- **pip**: Latest version

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd exact-view-calendar-main
```

#### 2. Install Root Dependencies
```bash
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

#### 4. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Running the Application

#### Option 1: Run Everything (Recommended)
```bash
npm run dev
```
This starts both frontend (http://localhost:8080) and backend (http://localhost:8000) concurrently.

#### Option 2: Run Separately

**Frontend only:**
```bash
npm run dev:frontend
# OR
cd frontend && npm run dev
```

**Backend only:**
```bash
npm run dev:backend
# OR
cd backend && python run.py
```

### Build for Production
```bash
npm run build
```
This creates an optimized production build in `frontend/dist`.

### Code Quality
```bash
npm run lint
```
Runs ESLint to check code quality and style.

---

## 🏗 Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Pages     │  │ Components  │  │   Hooks     │ │
│  │  Index.tsx  │  │ CalendarHdr │  │ React Query │ │
│  │ NotFound    │  │ MonthView   │  │ Custom Hook │ │
│  └─────────────┘  │ WeekView    │  └─────────────┘ │
│                   │ DayView     │                   │
│                   │ EventModal  │                   │
│                   └─────────────┘                   │
│                         │                           │
│                   ┌─────▼─────┐                     │
│                   │  API Layer│                     │
│                   │ (api.ts)  │                     │
│                   └─────┬─────┘                     │
└─────────────────────────┼───────────────────────────┘
                          │ HTTP/REST
                          │
┌─────────────────────────▼───────────────────────────┐
│                Backend (FastAPI)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Routes    │  │  Schemas    │  │   Models    │ │
│  │ /api/events │  │  Pydantic   │  │ SQLAlchemy  │ │
│  │ GET/POST    │  │ Validation  │  │   Event     │ │
│  │ PUT/DELETE  │  └─────────────┘  └─────┬───────┘ │
│  └─────────────┘                          │         │
│                                            │         │
│                                    ┌───────▼──────┐  │
│                                    │   Database   │  │
│                                    │   SQLite     │  │
│                                    │ calendar.db  │  │
│                                    └──────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Frontend Architecture

#### Component Hierarchy
```
App (React Router)
└── Index (Main Page)
    ├── Sidebar (Left)
    │   ├── Create Button
    │   └── MiniCalendar
    ├── Main Content
    │   ├── CalendarHeader (Navigation)
    │   └── Views (Conditional)
    │       ├── MonthView
    │       ├── WeekView
    │       └── DayView
    ├── RightSidebar
    ├── EventModal (Create/Edit)
    └── EventQuickView (Preview)
```

#### State Management Strategy

**Component-Level State** (useState):
- UI state (modals open/closed, view mode, selected date)
- Form inputs (event title, description, times)
- Temporary UI flags (sidebar collapsed, search open)

**Server State** (React Query):
- Event data fetching and caching
- Automatic background refetching
- Optimistic updates
- Cache invalidation on mutations

**Why This Approach?**
- **React Query** handles server state complexity (loading, error states, caching)
- **useState** keeps UI interactions simple and local
- No need for Redux/MobX for this use case
- Clear separation between server and UI state

#### Data Flow

1. **User Action** → Component event handler
2. **State Update** → React Query mutation/query
3. **API Call** → Backend endpoint
4. **Database Operation** → SQLAlchemy ORM
5. **Response** → React Query cache update
6. **Re-render** → Components using the data

### Backend Architecture

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Fetch all events (with optional filtering) |
| GET | `/api/events/{id}` | Fetch specific event |
| POST | `/api/events` | Create new event |
| PUT | `/api/events/{id}` | Update existing event |
| DELETE | `/api/events/{id}` | Delete event |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger API documentation |

#### Database Schema

```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Technology Choices Explained

**FastAPI** was chosen for:
- **Performance**: ASGI-based, async support
- **Auto-documentation**: OpenAPI/Swagger out of the box
- **Type Safety**: Pydantic integration for validation
- **Modern Python**: Leverages Python 3.8+ features

**SQLAlchemy** provides:
- **ORM**: Object-relational mapping for clean code
- **Database Agnostic**: Easy to switch from SQLite to PostgreSQL
- **Migration Support**: Alembic integration ready

**SQLite** is ideal for:
- **Development**: Zero configuration, file-based
- **Portability**: Single file database
- **Production-Ready**: Can handle thousands of events efficiently

---

## 🧠 Business Logic & Edge Cases

### Event Overlap Handling

#### Problem
When multiple events occur at the same time, they need to be displayed side-by-side without overlapping.

#### Solution: Column-Based Layout Algorithm

```typescript
// Pseudocode
function calculateEventPositions(events) {
  1. Sort events by start time
  2. Initialize empty columns array
  3. For each event:
     a. Find first column without overlapping events
     b. If no column found, create new column
     c. Add event to column
  4. Calculate position for each event:
     - width = 100% / totalColumns
     - left = (columnIndex / totalColumns) * 100%
  5. Return events with position data
}
```

**Example:**
- **Event A**: 2:00 PM - 3:00 PM → Column 0, Width 50%
- **Event B**: 2:00 PM - 3:00 PM → Column 1, Width 50%
- **Event C**: 2:30 PM - 3:30 PM → Column 0, Width 50% (overlaps B only)

#### Edge Cases Handled
1. **Multiple overlaps**: Up to N events can overlap, each gets 1/N width
2. **Partial overlaps**: Events starting mid-way are correctly positioned
3. **Zero-duration events**: Minimum height enforced (24-32px)
4. **All-day events**: Future feature, UI prepared

### Time Zone Handling

**Current Implementation:**
- Events stored in ISO 8601 format with UTC offset
- Display uses browser's local timezone
- Timezone selector in UI (prepared for future enhancement)

**Edge Cases:**
- **DST transitions**: Handled by JavaScript Date API
- **Cross-timezone events**: Displayed in user's local time

### Recurring Events

**UI Ready:**
- Dropdown with options: Daily, Weekly, Monthly, Annually, Weekdays
- State management in place

**Backend Implementation (Future):**
- Store recurrence rules in separate table
- Generate event instances on-demand
- Handle exceptions (deleted/modified instances)

### Date Navigation Edge Cases

1. **Month boundaries**: Correctly handles months with different days (28-31)
2. **Leap years**: February 29th handled correctly
3. **Year transitions**: December → January navigation works seamlessly
4. **Week spanning months**: Week view shows dates from adjacent months

### Event Validation

**Frontend Validation:**
- Title required (minimum 1 character)
- End time must be after start time
- Maximum title length: 200 characters

**Backend Validation (Pydantic):**
```python
class EventCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime

    @validator('end_time')
    def end_after_start(cls, v, values):
        if 'start_time' in values and v <= values['start_time']:
            raise ValueError('end_time must be after start_time')
        return v
```

### Data Consistency

**React Query Strategy:**
- **Optimistic Updates**: UI updates immediately, rolls back on error
- **Cache Invalidation**: After mutations, cache is refetched
- **Stale-While-Revalidate**: Shows cached data while fetching updates

**Handled Scenarios:**
1. **Concurrent edits**: Last write wins (basic implementation)
2. **Delete during edit**: Modal closes, shows error if save attempted
3. **Network failures**: Error messages, retry options
4. **Partial updates**: Full object required, prevents partial state

---

## 🎨 Animations & Interactions

### View Transitions

**Fade-In Animation:**
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-in-out;
}
```

Applied when switching between Month/Week/Day views for smooth transitions.

### Modal Animations

**Scale-In Effect:**
```css
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.15s ease-out;
}
```

Used for:
- EventModal appearance
- EventQuickView popup
- Dropdown menus

### Scroll Synchronization

**Implementation:**
```typescript
useEffect(() => {
  const dayColumns = dayColumnsRef.current;
  const timeColumn = timeColumnRef.current;

  const handleScroll = () => {
    if (timeColumn) {
      timeColumn.scrollTop = dayColumns.scrollTop;
    }
  };

  dayColumns.addEventListener('scroll', handleScroll);
  return () => dayColumns.removeEventListener('scroll', handleScroll);
}, []);
```

**Benefits:**
- Time labels stay aligned with hours
- Smoother scrolling experience
- Reduced visual clutter (one scrollbar)

### Hover Effects

**Subtle Interactions:**
- Time slots: `hover:bg-blue-50/30` - Light blue tint
- Events: `hover:bg-blue-700` - Darker shade
- Buttons: `hover:shadow-xl` - Enhanced shadow
- Calendar cells: `hover:bg-calendar-hover` - Light gray

### Current Time Indicator

**Red Line Animation:**
```tsx
const currentTimePosition = useMemo(() => {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  return (hours * 48) + (minutes / 60 * 48);
}, [currentTime]);

// Updates every minute
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000);
  return () => clearInterval(timer);
}, []);
```

**Visual Components:**
- Red dot (12px circle) at start
- Red line extending across day
- High z-index for visibility
- Only shown on current day

### Month Scroll Navigation

**Debounced Wheel Events:**
```typescript
const handleWheel = (e: WheelEvent) => {
  if (scrollTimeoutRef.current) {
    clearTimeout(scrollTimeoutRef.current);
  }

  scrollTimeoutRef.current = setTimeout(() => {
    if (e.deltaY > 0) {
      onMonthChange('next');
    } else if (e.deltaY < 0) {
      onMonthChange('prev');
    }
  }, 150); // Debounce delay
};
```

**Why Debounce?**
- Prevents rapid month changes
- Smoother user experience
- Works with trackpads and mouse wheels


---

## 🚀 Future Enhancements

### High Priority

#### 1. **User Authentication & Multi-Tenancy**
- User registration and login
- Personal calendar spaces
- OAuth integration (Google, Microsoft)
- Calendar sharing and permissions

**Estimated Effort:** 2-3 weeks  
**Technology:** JWT tokens, OAuth 2.0, User roles

#### 2. **Recurring Events (Backend)**
- Store recurrence rules (RFC 5545 format)
- Generate event instances dynamically
- Handle exceptions and modifications
- "Edit this event" vs "Edit series" options

**Estimated Effort:** 1-2 weeks  
**Technology:** `dateutil.rrule`, custom recurrence logic

#### 3. **Event Categories/Calendars**
- Multiple calendars per user
- Color coding by category
- Toggle calendar visibility
- Import/Export calendars (iCal format)

**Estimated Effort:** 1 week  
**Technology:** iCalendar parsing, color picker

#### 4. **Drag-and-Drop Event Editing**
- Drag events to change time/date
- Resize events to change duration
- Visual feedback during drag
- Snap to time intervals

**Estimated Effort:** 1 week  
**Technology:** react-dnd or custom implementation

### Medium Priority

#### 5. **Event Reminders & Notifications**
- Email notifications
- Browser push notifications
- Customizable reminder times
- Snooze functionality

**Estimated Effort:** 2 weeks  
**Technology:** Web Push API, Email service (SendGrid)

#### 6. **Search & Filtering**
- Full-text search across events
- Filter by date range, calendar, category
- Advanced search (attendees, location)
- Search history

**Estimated Effort:** 1 week  
**Technology:** PostgreSQL full-text search or Elasticsearch

#### 7. **Event Attendees**
- Add/remove attendees
- RSVP status tracking
- Send invitations via email
- Attendee availability checking

**Estimated Effort:** 2 weeks  
**Technology:** Email integration, calendar conflict detection

#### 8. **Timezone Management**
- Set default timezone
- Per-event timezone
- Automatic DST handling
- Multi-timezone display option

**Estimated Effort:** 1 week  
**Technology:** `pytz`, timezone database

### Low Priority / Nice-to-Have

#### 9. **Mobile Responsive Design**
- Touch-friendly interactions
- Mobile-optimized layouts
- Swipe gestures for navigation
- Progressive Web App (PWA)

**Estimated Effort:** 2-3 weeks  
**Technology:** Responsive CSS, Service Workers

#### 10. **Event Attachments**
- File uploads (PDFs, images, docs)
- Google Drive integration
- Inline image preview
- File size limits and validation

**Estimated Effort:** 1 week  
**Technology:** AWS S3 or local storage, file upload libraries

#### 11. **Calendar Printing/Export**
- Print-friendly views
- PDF export
- iCal export (.ics files)
- CSV export for analysis

**Estimated Effort:** 1 week  
**Technology:** `jsPDF`, iCalendar generation

#### 12. **Dark Mode**
- Toggle dark/light theme
- Respect system preferences
- Persistent theme choice
- Smooth theme transitions

**Estimated Effort:** 3-4 days  
**Technology:** CSS variables, `prefers-color-scheme`

#### 13. **Performance Optimizations**
- Virtual scrolling for large date ranges
- Lazy loading of events
- Service Worker caching
- Code splitting

**Estimated Effort:** 1 week  
**Technology:** react-window, Service Workers, React.lazy

#### 14. **Analytics & Insights**
- Time tracking by category
- Event statistics dashboard
- Productivity insights
- Export reports

**Estimated Effort:** 2 weeks  
**Technology:** Chart.js, data aggregation

#### 15. **Accessibility Improvements**
- ARIA labels for all interactive elements
- Keyboard navigation enhancements
- Screen reader optimization
- High contrast mode

**Estimated Effort:** 1 week  
**Technology:** WAI-ARIA, accessibility testing tools

### Database Migration Path

When scaling to production:

1. **SQLite → PostgreSQL**
   ```bash
   # Using Alembic migrations
   alembic init alembic
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

2. **Add Indexes:**
   ```sql
   CREATE INDEX idx_events_start_time ON events(start_time);
   CREATE INDEX idx_events_user_id ON events(user_id);
   CREATE INDEX idx_events_calendar_id ON events(calendar_id);
   ```

3. **Partitioning** (for large datasets):
   - Partition events by year or month
   - Archive old events to separate tables

### Deployment Recommendations

**Frontend:**
- Vercel, Netlify, or AWS S3 + CloudFront
- Environment variables for API endpoints
- CDN for static assets

**Backend:**
- AWS EC2, Google Cloud Run, or Heroku
- Docker containerization
- PostgreSQL managed database (RDS, Cloud SQL)
- Redis for caching (optional)

**CI/CD:**
- GitHub Actions for automated testing
- Automated deployments on merge to main
- Separate staging and production environments

---

## 📝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests:** `npm run lint` (extend with unit tests)
5. **Commit your changes:** `git commit -m 'Add amazing feature'`
6. **Push to branch:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style Guidelines

- **TypeScript:** Use strict type checking
- **React:** Functional components with hooks
- **Naming:** camelCase for variables/functions, PascalCase for components
- **Comments:** JSDoc for functions, inline for complex logic
- **Formatting:** Prettier with 2-space indentation

### Testing (Future)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

**Recommended Tools:**
- **Vitest**: Unit testing (Vite-native)
- **React Testing Library**: Component testing
- **Playwright**: E2E testing

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Google Calendar** for design inspiration
- **shadcn/ui** for beautiful component primitives
- **Lovable.dev** for initial project scaffolding
- **FastAPI** community for excellent documentation
- **React** team for modern web development tools

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review API docs at `http://localhost:8000/docs` when backend is running

---

**Built with ❤️ using React, TypeScript, and FastAPI**
