from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True) # e.g. PRV-1042
    title = Column(String, index=True)
    corridor = Column(String)
    origin_name = Column(String)
    origin_x = Column(Float)
    origin_y = Column(Float)
    target_name = Column(String)
    target_x = Column(Float)
    target_y = Column(Float)
    detected_at = Column(DateTime, default=datetime.utcnow)
    current_measurement = Column(Float)
    projected_6h = Column(Float)
    movement = Column(String)
    bearing = Column(Float)
    severity = Column(String) # high, moderate, watch
    confidence = Column(Float)
    
    signals = relationship("EventSignal", back_populates="event")
    reports = relationship("CitizenReport", back_populates="event")

class EventSignal(Base):
    __tablename__ = "event_signals"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, ForeignKey("events.id"))
    label = Column(String)
    detail = Column(String)
    strength = Column(Float)

    event = relationship("Event", back_populates="signals")

class CitizenReport(Base):
    __tablename__ = "citizen_reports"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    location_name = Column(String)
    report_type = Column(String) # photo, voice, text, sensor
    text_content = Column(String, nullable=True)
    sensor_value = Column(Float, nullable=True)
    event_id = Column(String, ForeignKey("events.id"), nullable=True)

    event = relationship("Event", back_populates="reports")
