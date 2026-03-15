
def public_feed_key(cursor: str | None, limit: int) -> str:
    cursor_part = cursor or "first"
    return f"feed:public:{cursor_part}:{limit}"


def notifications_key(user_id: str, limit: int) -> str:
    return f"notifications:{user_id}:{limit}"