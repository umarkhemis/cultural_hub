
# backend/scripts/create_admin.py
#
# Usage:
#   python -m scripts.create_admin
#
# Run from the backend/ directory:
#   cd backend
#   python -m scripts.create_admin

import getpass
import sys

from sqlalchemy import select

from app.core.security import hash_password
from app.database.db import SessionLocal
from app.models.user import User, UserRole


def create_admin() -> None:
    print("\n═══════════════════════════════════")
    print("   Cultural Hub — Create Admin CLI  ")
    print("═══════════════════════════════════\n")

    # ── Collect input ──────────────────────────────────────────
    full_name = input("Full name:  ").strip()
    if not full_name:
        print(" Full name is required.")
        sys.exit(1)

    email = input("Email:      ").strip().lower()
    if not email or "@" not in email:
        print(" Valid email is required.")
        sys.exit(1)

    password = getpass.getpass("Password:   ")
    if len(password) < 10:
        print(" Password must be at least 10 characters.")
        sys.exit(1)

    confirm = getpass.getpass("Confirm:    ")
    if password != confirm:
        print(" Passwords do not match.")
        sys.exit(1)

    # ── Database ───────────────────────────────────────────────
    db = SessionLocal()

    try:
        existing = db.scalar(select(User).where(User.email == email))

        if existing:
            if existing.role == UserRole.admin:
                print(f"\n Admin with email '{email}' already exists.")
                sys.exit(0)

            # Existing non-admin user — offer to promote
            print(f"\n A {existing.role.value} account with this email already exists.")
            promote = input("Promote to admin? [y/N]: ").strip().lower()
            if promote != "y":
                print("Aborted.")
                sys.exit(0)

            existing.role = UserRole.admin
            existing.is_active = True
            existing.is_verified = True
            db.commit()
            print(f"\n '{existing.full_name}' promoted to admin successfully.")
            return

        # ── Create new admin user ──────────────────────────────
        user = User(
            full_name=full_name,
            email=email,
            password_hash=hash_password(password),
            role=UserRole.admin,
            is_active=True,
            is_verified=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print(f"\n Admin created successfully.")
        print(f"    ID:    {user.id}")
        print(f"    Name:  {user.full_name}")
        print(f"    Email: {user.email}")
        print(f"    Role:  {user.role.value}\n")

    except Exception as exc:
        db.rollback()
        print(f"\n Failed: {exc}")
        sys.exit(1)

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()