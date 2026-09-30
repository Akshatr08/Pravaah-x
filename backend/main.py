from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid

from . import models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="PRAVAAH-X API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "operational", "system": "PRAVAAH-X"}

@app.get("/events", response_model=List[schemas.Event])
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = db.query(models.Event).offset(skip).limit(limit).all()
    return events

@app.get("/events/{event_id}", response_model=schemas.Event)
def get_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.post("/reports", response_model=schemas.CitizenReport)
def create_report(report: schemas.CitizenReportCreate, db: Session = Depends(get_db)):
    report_id = f"REP-{str(uuid.uuid4())[:8].upper()}"
    db_report = models.CitizenReport(
        id=report_id,
        location_name=report.location_name,
        report_type=report.report_type,
        text_content=report.text_content,
        sensor_value=report.sensor_value
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@app.get("/reports", response_model=List[schemas.CitizenReport])
def get_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reports = db.query(models.CitizenReport).offset(skip).limit(limit).all()
    return reports
