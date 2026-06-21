from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from .. import models, schemas
from ..services import bet_service
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/api/bets", tags=["bets"])


@router.post("/", response_model=schemas.BetResponse)
def create_bet(
    bet: schemas.BetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return bet_service.create_bet(db, bet, current_user.id)


@router.get("/", response_model=list[schemas.BetResponse])
def get_bets(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return bet_service.get_bets(db, skip=skip, limit=limit, status=status, user_id=current_user.id)


@router.get("/{bet_id}", response_model=schemas.BetResponse)
def get_bet(
    bet_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    bet = bet_service.get_bet(db, bet_id, current_user.id)
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")
    return bet


@router.patch("/{bet_id}", response_model=schemas.BetResponse)
def update_bet(
    bet_id: int,
    bet_update: schemas.BetUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    bet = bet_service.update_bet(db, bet_id, bet_update, current_user.id)
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")
    return bet


@router.get("/stats/summary", response_model=schemas.StatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return bet_service.get_stats(db, current_user.id)


@router.get("/bankroll/status", response_model=schemas.BankrollResponse)
def get_bankroll(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    result = bet_service.get_bankroll(db, current_user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Bankroll not found")
    return result
