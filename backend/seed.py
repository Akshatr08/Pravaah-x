import json
from .database import SessionLocal, engine
from . import models

models.Base.metadata.create_all(bind=engine)

demo_events = [
    {
        "id": "PRV-1042",
        "title": "Emerging atmospheric event",
        "corridor": "Panipat → Delhi NCR",
        "origin_name": "Panipat",
        "origin_x": 196,
        "origin_y": 186,
        "target_name": "Delhi NCR",
        "target_x": 214,
        "target_y": 220,
        "current_measurement": 181.0,
        "projected_6h": 224.0,
        "movement": "↘ Southeast",
        "bearing": 135.0,
        "severity": "high",
        "confidence": 0.82,
        "signals": [
            {"label": "Sensor anomaly", "detail": "4 stations, +38% PM2.5", "strength": 0.86},
            {"label": "Citizen reports", "detail": "17 reports in 40 min", "strength": 0.64},
            {"label": "Satellite signal", "detail": "Aerosol depth elevated", "strength": 0.71},
            {"label": "Wind alignment", "detail": "312° at 11 km/h", "strength": 0.78},
        ]
    },
    {
        "id": "PRV-1038",
        "title": "Sustained corridor loading",
        "corridor": "Ludhiana Corridor",
        "origin_name": "Ludhiana",
        "origin_x": 162,
        "origin_y": 152,
        "target_name": "Karnal",
        "target_x": 190,
        "target_y": 182,
        "current_measurement": 146.0,
        "projected_6h": 168.0,
        "movement": "→ East",
        "bearing": 95.0,
        "severity": "moderate",
        "confidence": 0.69,
        "signals": [
            {"label": "Sensor anomaly", "detail": "2 stations, +19% PM10", "strength": 0.52},
            {"label": "Citizen reports", "detail": "6 reports in 2 h", "strength": 0.38},
            {"label": "Satellite signal", "detail": "Thin plume signature", "strength": 0.44},
            {"label": "Wind alignment", "detail": "268° at 7 km/h", "strength": 0.61},
        ]
    },
    {
        "id": "PRV-1027",
        "title": "Localised industrial signature",
        "corridor": "Gurugram",
        "origin_name": "Gurugram",
        "origin_x": 206,
        "origin_y": 226,
        "target_name": "Faridabad",
        "target_x": 228,
        "target_y": 244,
        "current_measurement": 122.0,
        "projected_6h": 118.0,
        "movement": "↓ South",
        "bearing": 170.0,
        "severity": "watch",
        "confidence": 0.54,
        "signals": [
            {"label": "Sensor anomaly", "detail": "1 station, +11% NO₂", "strength": 0.33},
            {"label": "Citizen reports", "detail": "3 reports overnight", "strength": 0.22},
            {"label": "Satellite signal", "detail": "Below threshold", "strength": 0.18},
            {"label": "Wind alignment", "detail": "Calm, 3 km/h", "strength": 0.30},
        ]
    }
]

def seed_db():
    db = SessionLocal()
    # Check if we already have data
    if db.query(models.Event).count() > 0:
        print("Database already seeded.")
        return
        
    for event_data in demo_events:
        signals_data = event_data.pop("signals")
        
        event = models.Event(**event_data)
        db.add(event)
        db.commit()
        
        for sig in signals_data:
            signal = models.EventSignal(
                event_id=event.id,
                label=sig["label"],
                detail=sig["detail"],
                strength=sig["strength"]
            )
            db.add(signal)
            
    db.commit()
    db.close()
    print("Database successfully seeded with demo events!")

if __name__ == "__main__":
    seed_db()
