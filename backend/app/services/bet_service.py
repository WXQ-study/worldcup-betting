from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime

from .. import models, schemas


def create_bet(db: Session, bet: schemas.BetCreate, user_id: int) -> models.Bet:
    db_bet = models.Bet(**bet.model_dump(), user_id=user_id)
    db.add(db_bet)
    db.commit()
    db.refresh(db_bet)

    bankroll = db.query(models.Bankroll).filter(models.Bankroll.user_id == user_id).first()
    if bankroll:
        bankroll.current_balance -= bet.stake
        db.commit()
    else:
        default = models.Bankroll(
            user_id=user_id,
            initial_balance=10000.0,
            current_balance=10000.0 - bet.stake,
        )
        db.add(default)
        db.commit()

    return db_bet


def get_bet(db: Session, bet_id: int, user_id: int) -> Optional[models.Bet]:
    return (
        db.query(models.Bet)
        .filter(models.Bet.id == bet_id, models.Bet.user_id == user_id)
        .first()
    )


def get_bets(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    user_id: Optional[int] = None,
) -> List[models.Bet]:
    query = db.query(models.Bet)
    if user_id is not None:
        query = query.filter(models.Bet.user_id == user_id)
    if status:
        query = query.filter(models.Bet.result == status)
    return query.order_by(models.Bet.placed_at.desc()).offset(skip).limit(limit).all()


def update_bet(
    db: Session, bet_id: int, bet_update: schemas.BetUpdate, user_id: int
) -> Optional[models.Bet]:
    db_bet = (
        db.query(models.Bet)
        .filter(models.Bet.id == bet_id, models.Bet.user_id == user_id)
        .first()
    )
    if not db_bet:
        return None

    update_data = bet_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_bet, key, value)

    if bet_update.result is not None and bet_update.profit_loss is not None:
        db_bet.settled_at = datetime.utcnow()

        bankroll = db.query(models.Bankroll).filter(models.Bankroll.user_id == user_id).first()
        if bankroll:
            bankroll.current_balance += db_bet.stake + db_bet.profit_loss
            db.add(bankroll)

    db.commit()
    db.refresh(db_bet)
    return db_bet


def get_stats(db: Session, user_id: int) -> schemas.StatsResponse:
    base = db.query(models.Bet).filter(models.Bet.user_id == user_id)

    total_bets = base.count()
    wins = base.filter(models.Bet.result == models.BetResult.WIN).count()
    losses = base.filter(models.Bet.result == models.BetResult.LOSS).count()

    total_staked = db.query(func.sum(models.Bet.stake)).filter(
        models.Bet.user_id == user_id
    ).scalar() or 0
    total_profit = db.query(func.sum(models.Bet.profit_loss)).filter(
        models.Bet.user_id == user_id
    ).scalar() or 0

    win_rate = (wins / total_bets * 100) if total_bets > 0 else 0
    roi = (total_profit / total_staked * 100) if total_staked > 0 else 0

    avg_odds_result = db.query(func.avg(models.Bet.odds)).filter(
        models.Bet.user_id == user_id
    ).scalar()
    avg_odds = round(avg_odds_result, 2) if avg_odds_result else 0

    return schemas.StatsResponse(
        total_bets=total_bets,
        wins=wins,
        losses=losses,
        win_rate=round(win_rate, 2),
        total_staked=round(total_staked, 2),
        total_profit=round(total_profit, 2),
        roi=round(roi, 2),
        avg_odds=avg_odds,
    )


def get_bankroll(db: Session, user_id: int) -> Optional[schemas.BankrollResponse]:
    bankroll = db.query(models.Bankroll).filter(models.Bankroll.user_id == user_id).first()
    if not bankroll:
        return None

    stats = get_stats(db, user_id)

    return schemas.BankrollResponse(
        id=bankroll.id,
        initial_balance=bankroll.initial_balance,
        current_balance=bankroll.current_balance,
        total_profit=bankroll.current_balance - bankroll.initial_balance,
        total_bets=stats.total_bets,
        win_rate=stats.win_rate,
        roi=stats.roi,
        updated_at=bankroll.updated_at,
    )


def add_funds(db: Session, user_id: int, amount: float) -> schemas.BankrollResponse:
    bankroll = db.query(models.Bankroll).filter(models.Bankroll.user_id == user_id).first()

    if not bankroll:
        bankroll = models.Bankroll(
            user_id=user_id,
            initial_balance=amount,
            current_balance=amount,
        )
        db.add(bankroll)
    else:
        bankroll.current_balance += amount

    db.commit()
    db.refresh(bankroll)

    stats = get_stats(db, user_id)

    return schemas.BankrollResponse(
        id=bankroll.id,
        initial_balance=bankroll.initial_balance,
        current_balance=bankroll.current_balance,
        total_profit=bankroll.current_balance - bankroll.initial_balance,
        total_bets=stats.total_bets,
        win_rate=stats.win_rate,
        roi=stats.roi,
        updated_at=bankroll.updated_at,
    )
