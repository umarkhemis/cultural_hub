
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy import select

from app.core.security import hash_password
from app.database.db import SessionLocal
from app.models.cultural_site import CulturalSite, VerificationStatus
from app.models.experience import Experience, ExperienceStatus
from app.models.experience_media import ExperienceMedia, MediaType
from app.models.package import Package, PackageStatus
from app.models.package_media import PackageMedia
from app.models.user import User, UserRole


DEMO_PASSWORD = "DemoPass123!"
NOW = datetime.now(timezone.utc)


PROVIDERS = [
    {
        "full_name": "Grace Karungi",
        "email": "demo.provider1@culturalhub.test",
        "phone": "+256700100001",
        "site_name": "Kigezi Heritage Circle",
        "description": "A community-led cultural destination sharing Bakiga dance, storytelling, food, and traditional village experiences.",
        "location": "Kabale, Uganda",
        "contact_email": "kigeziheritage@example.com",
        "contact_phone": "+256700100101",
        "logo_url": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200&auto=format&fit=crop",
    },
    {
        "full_name": "John Tumusiime",
        "email": "demo.provider2@culturalhub.test",
        "phone": "+256700100002",
        "site_name": "Lake Bunyonyi Cultural Tours",
        "description": "A tourism and culture hub combining lake experiences, local storytelling, crafts, and performance events.",
        "location": "Lake Bunyonyi, Uganda",
        "contact_email": "bunyonyiculture@example.com",
        "contact_phone": "+256700100102",
        "logo_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    },
    {
        "full_name": "Sarah Mutesi",
        "email": "demo.provider3@culturalhub.test",
        "phone": "+256700100003",
        "site_name": "Bakiga Living Traditions Centre",
        "description": "A living culture space focused on performance, food, crafts, oral history, and community cultural exchange.",
        "location": "Kisoro, Uganda",
        "contact_email": "livingtraditions@example.com",
        "contact_phone": "+256700100103",
        "logo_url": "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200&auto=format&fit=crop",
    },
    {
        "full_name": "Peter Ainomugisha",
        "email": "demo.provider4@culturalhub.test",
        "phone": "+256700100004",
        "site_name": "Rwenzori Roots Cultural Hub",
        "description": "A culture-focused community initiative sharing music, movement, local cuisine, and guided heritage experiences.",
        "location": "Kasese, Uganda",
        "contact_email": "rwenzoriroots@example.com",
        "contact_phone": "+256700100104",
        "logo_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
    },
]


EXPERIENCE_TEMPLATES = [
    {
        "caption": "An evening of Bakiga dance, drumming, and community celebration under the open sky.",
        "location": "Kabale Cultural Grounds",
        "media_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop",
    },
    {
        "caption": "Traditional storytelling and fireside oral history shared by local elders and youth performers.",
        "location": "Village Story Circle",
        "media_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    },
    {
        "caption": "Visitors joining a guided craft-making session featuring weaving, carving, and cultural symbolism.",
        "location": "Community Craft House",
        "media_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop",
    },
    {
        "caption": "A cultural food tasting experience celebrating local dishes, preparation techniques, and hospitality.",
        "location": "Heritage Kitchen",
        "media_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop",
    },
]


PACKAGE_TEMPLATES = [
    {
        "package_name": "Bakiga Dance & Storytelling Night",
        "description": "A guided evening featuring live dance, drumming, oral storytelling, and a cultural welcome experience.",
        "price": Decimal("45000"),
        "duration": "3 hours",
        "days_ahead": 7,
        "includes_text": "Entrance, live performance, storytelling session, and refreshments.",
        "media_url": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1400&auto=format&fit=crop",
    },
    {
        "package_name": "Cultural Food & Village Experience",
        "description": "A hands-on local food session combined with village interaction and guided cultural interpretation.",
        "price": Decimal("65000"),
        "duration": "5 hours",
        "days_ahead": 10,
        "includes_text": "Food tasting, local guide, cultural interaction, and photo moments.",
        "media_url": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1400&auto=format&fit=crop",
    },
    {
        "package_name": "Crafts, Music, and Heritage Tour",
        "description": "An immersive package covering crafts, performance, cultural explanation, and local heritage spaces.",
        "price": Decimal("80000"),
        "duration": "Full day",
        "days_ahead": 14,
        "includes_text": "Guided experience, performance access, crafts session, and refreshments.",
        "media_url": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1400&auto=format&fit=crop",
    },
]


def get_or_create_provider_user(db, provider_data):
    user = db.scalar(select(User).where(User.email == provider_data["email"]))
    if user:
        return user

    user = User(
        full_name=provider_data["full_name"],
        email=provider_data["email"],
        phone=provider_data["phone"],
        password_hash=hash_password(DEMO_PASSWORD),
        role=UserRole.provider,
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.flush()
    return user


def get_or_create_site(db, user, provider_data):
    site = db.scalar(select(CulturalSite).where(CulturalSite.user_id == user.id))
    if site:
        return site

    site = CulturalSite(
        user_id=user.id,
        site_name=provider_data["site_name"],
        description=provider_data["description"],
        location=provider_data["location"],
        logo_url=provider_data["logo_url"],
        contact_email=provider_data["contact_email"],
        contact_phone=provider_data["contact_phone"],
        verification_status=VerificationStatus.approved,
        is_active=True,
    )
    db.add(site)
    db.flush()
    return site


def seed_experiences(db, site):
    existing = db.scalar(select(Experience).where(Experience.provider_id == site.id))
    if existing:
        return

    for idx, template in enumerate(EXPERIENCE_TEMPLATES, start=1):
        experience = Experience(
            provider_id=site.id,
            caption=template["caption"],
            location=template["location"],
            status=ExperienceStatus.published,
        )
        db.add(experience)
        db.flush()

        media = ExperienceMedia(
            experience_id=experience.id,
            media_url=template["media_url"],
            media_type=MediaType.image,
            thumbnail_url=template["media_url"],
            media_order=0,
        )
        db.add(media)


def seed_packages(db, site):
    existing = db.scalar(select(Package).where(Package.provider_id == site.id))
    if existing:
        return

    for idx, template in enumerate(PACKAGE_TEMPLATES, start=1):
        event_date = NOW + timedelta(days=template["days_ahead"] + idx)

        package = Package(
            provider_id=site.id,
            package_name=template["package_name"],
            description=template["description"],
            price=template["price"],
            duration=template["duration"],
            event_date=event_date,
            includes_text=template["includes_text"],
            status=PackageStatus.published,
        )
        db.add(package)
        db.flush()

        media = PackageMedia(
            package_id=package.id,
            media_url=template["media_url"],
            thumbnail_url=template["media_url"],
            media_order=0,
        )
        db.add(media)


def run():
    db = SessionLocal()
    try:
        for provider_data in PROVIDERS:
            user = get_or_create_provider_user(db, provider_data)
            site = get_or_create_site(db, user, provider_data)
            seed_experiences(db, site)
            seed_packages(db, site)

        db.commit()
        print("Demo content seeded successfully.")
        print(f"Demo provider password: {DEMO_PASSWORD}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()