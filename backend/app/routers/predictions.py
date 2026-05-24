from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas
from ..services import prediction_service

router = APIRouter(prefix="/api/predictions", tags=["predictions"])


@router.get("/match/{match_id}", response_model=schemas.PredictionResponse)
def predict_match(match_id: int, db: Session = Depends(get_db)):
    try:
        return prediction_service.predict_match(db, match_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/upcoming", response_model=list[schemas.PredictionResponse])
def predict_upcoming(db: Session = Depends(get_db)):
    return prediction_service.predict_all_upcoming(db)
