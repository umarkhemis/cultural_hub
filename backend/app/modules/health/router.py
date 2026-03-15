
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.cache.redis import redis_client
from app.database.dependencies import get_db
from app.utils.responses import success_response

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/live")
def liveness():
    return success_response(
        message="Service is live.",
        data={
            "status": "live",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@router.get("/ready")
def readiness(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    redis_client.ping()

    return success_response(
        message="Service is ready.",
        data={
            "status": "ready",
            "database": "connected",
            "redis": "connected",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )















