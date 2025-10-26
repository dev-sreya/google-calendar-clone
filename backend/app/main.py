from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from . import models, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Calendar API", version="1.0.0")

# Configure CORS - allow all localhost origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|\[::\]):(\d+)",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Calendar API is running"}

@app.get("/api/events", response_model=List[schemas.EventResponse])
def get_events(
    start_date: datetime = None,
    end_date: datetime = None,
    db: Session = Depends(get_db)
):
    """Get all events, optionally filtered by date range"""
    query = db.query(models.Event)

    if start_date:
        query = query.filter(models.Event.start_time >= start_date)
    if end_date:
        query = query.filter(models.Event.end_time <= end_date)

    events = query.order_by(models.Event.start_time).all()
    return events

@app.get("/api/events/{event_id}", response_model=schemas.EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get a specific event by ID"""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.post("/api/events", response_model=schemas.EventResponse, status_code=201)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    """Create a new event"""
    # Validate that end_time is after start_time
    if event.end_time <= event.start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time"
        )

    db_event = models.Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.put("/api/events/{event_id}", response_model=schemas.EventResponse)
def update_event(
    event_id: int,
    event_update: schemas.EventUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing event"""
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Update only provided fields
    update_data = event_update.model_dump(exclude_unset=True)

    # Validate times if both are being updated or one is updated
    start_time = update_data.get("start_time", db_event.start_time)
    end_time = update_data.get("end_time", db_event.end_time)

    if end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time"
        )

    for field, value in update_data.items():
        setattr(db_event, field, value)

    db_event.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_event)
    return db_event

@app.delete("/api/events/{event_id}", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    """Delete an event"""
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(db_event)
    db.commit()
    return None

@app.get("/health")
def health_check():
    return {"status": "healthy"}
