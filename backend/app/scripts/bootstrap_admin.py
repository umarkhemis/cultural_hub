
from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password
from app.database.db import SessionLocal
from app.models.user import User, UserRole


def run() -> None:
    if not settings.FIRST_ADMIN_EMAIL or not settings.FIRST_ADMIN_PASSWORD:
        raise RuntimeError("FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD must be set in .env")

    db = SessionLocal()
    try:
        existing = db.scalar(select(User).where(User.email == settings.FIRST_ADMIN_EMAIL.lower()))
        if existing:
            print("Admin already exists.")
            return

        admin = User(
            full_name=settings.FIRST_ADMIN_NAME,
            email=settings.FIRST_ADMIN_EMAIL.lower(),
            password_hash=hash_password(settings.FIRST_ADMIN_PASSWORD),
            role=UserRole.admin,
            is_active=True,
            is_verified=True,
        )
        db.add(admin)
        db.commit()
        print("Admin created successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    run()