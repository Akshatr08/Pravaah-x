from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SignalBase(BaseModel):
    label: str
    detail: str
    strength: float

class Signal(SignalBase):
    id: int
    event_id: str

    class Config:
        from_attributes = True

class EventBase(BaseModel):
    title: str
    corridor: str
    origin_name: str
    origin_x: float
    origin_y: float
    target_name: str
    target_x: float
    target_y: float
    current_measurement: float
    projected_6h: float
    movement: str
    bearing: float
    severity: str
    confidence: float

class EventCreate(EventBase):
    id: str

class Event(EventBase):
    id: str
    detected_at: datetime
    signals: List[Signal] = []

    class Config:
        from_attributes = True

class CitizenReportBase(BaseModel):
    location_name: str
    report_type: str
    text_content: Optional[str] = None
    sensor_value: Optional[float] = None

class CitizenReportCreate(CitizenReportBase):
    pass

class CitizenReport(CitizenReportBase):
    id: str
    timestamp: datetime
    event_id: Optional[str] = None

    class Config:
        from_attributes = True
