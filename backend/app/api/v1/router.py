
from fastapi import APIRouter

from app.modules.auth.router import router as auth_router
from app.modules.health.router import router as health_router
from app.modules.experiences.router import router as experiences_router
from app.modules.bookings.router import router as bookings_router
from app.modules.packages.router import router as packages_router
from app.modules.notifications.router import router as notifications_router
from app.modules.payments.router import router as payments_router
from app.modules.sites.router import router as sites_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(experiences_router)
api_router.include_router(packages_router)
api_router.include_router(bookings_router)
api_router.include_router(payments_router)
api_router.include_router(notifications_router)
api_router.include_router(sites_router)