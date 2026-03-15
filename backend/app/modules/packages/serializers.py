
from app.models.booking import Booking
from app.models.package import Package


def serialize_package(package: Package) -> dict:
    provider = package.provider
    return {
        "id": str(package.id),
        "package_name": package.package_name,
        "description": package.description,
        "price": float(package.price),
        "duration": package.duration,
        "event_date": package.event_date,
        "includes_text": package.includes_text,
        "status": package.status.value,
        "created_at": package.created_at,
        "updated_at": package.updated_at,
        "provider": {
            "id": str(provider.id),
            "site_name": provider.site_name,
            "logo_url": provider.logo_url,
            "location": provider.location,
        },
        "media_items": [
            {
                "id": str(media.id),
                "media_url": media.media_url,
                "thumbnail_url": media.thumbnail_url,
                "media_order": media.media_order,
            }
            for media in package.media_items
        ],
    }


def serialize_booking(booking: Booking) -> dict:
    return {
        "id": str(booking.id),
        "tourist_id": str(booking.tourist_id),
        "package_id": str(booking.package_id),
        "booking_status": booking.booking_status.value,
        "payment_status": booking.payment_status.value,
        "participants_count": booking.participants_count,
        "total_price": float(booking.total_price),
        "booking_date": booking.booking_date,
        "package_title_snapshot": booking.package_title_snapshot,
        "provider_name_snapshot": booking.provider_name_snapshot,
        "event_date_snapshot": booking.event_date_snapshot,
        "participants": [
            {
                "id": str(participant.id),
                "participant_name": participant.participant_name,
                "participant_email": participant.participant_email,
                "participant_phone": participant.participant_phone,
                "special_requests": participant.special_requests,
            }
            for participant in booking.participants
        ],
    }