
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.dependencies import get_db
from app.modules.search.service import search_all

router = APIRouter(tags=["search"])


@router.get("/search")
def search(q: str = Query(min_length=1, max_length=100), db: Session = Depends(get_db)):
    results = search_all(db, q)
    return {
        "success": True,
        "message": "Search results",
        "data": results,
        "meta": {},
    }


# @router.get("")
# def search(
#     q: str = Query(min_length=1, max_length=100),
#     db: Session = Depends(get_db),
# ):
#     return {"data": search_all(db, q)}