from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from .. import models, schemas


def create_bet(db: Session, bet: schemas.BetCreate) -> models.Bet:
    db_bet = models.Bet(**bet.model_dump())
    db.add(db_bet)
    db.commit()
    db.refresh(db_bet)

    bankroll = db.query(models.Bankroll).first()
    if bankroll:
        bankroll.current_balance -= bet.stake
        db.commit()
    else:
        default = models.Bankroll(initial_balance=10000.0, current_balance=10000.0 - bet.stake)
        db.add(default)
        db.commit()

    return db_bet


def get_bet(db: Session, bet_id: int) -> Optional[models.Bet]:
    return db.query(models.Bet).filter(models.Bet.id == bet_id).first()


def get_bets(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
) -> List[models.Bet]:
    query = db.query(models.Bet)
    if status:
        query = query.filter(models.Bet.result == status)
    return query.order_by(models.Bet.placed_at.desc()).offset(skip).limit(limit).all()


def update_bet(db: Session, bet_id: int, bet_update: schemas.BetUpdate) -> Optional[models.Bet]:
    db_bet = db.query(models.Bet).filter(models.Bet.id == bet_id).first()
    if not db_bet:
        return None

    update_data = bet_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_bet, key, value)

    if bet_update.result is not None and bet_update.profit_loss is not None:
        from datetime import datetime
        db_bet.settled_at = datetime.utcnow()

        bankroll = db.query(models.Bankroll).first()
        if bankroll:
            bankroll.current_balance += db_bet.stake + db_bet.profit_loss
            db.add(bankroll)

    db.commit()
    db.refresh(db_bet)
    return db_bet


def get_stats(db: Session) -> schemas.StatsResponse:
    total_bets = db.query(func.count(models.Bet.id)).scalar()
    wins = db.query(func.count(models.Bet.id)).filter(models.Bet.result == models.BetResult.WIN).scalar()
    losses = db.query(func.count(models.Bet.id)).filter(models.Bet.result == models.BetResult.LOSS).scalar()

    total_staked = db.query(func.sum(models.Bet.stake)).scalar() or 0
    total_profit = db.query(func.sum(models.Bet.profit_loss)).scalar() or 0

    win_rate = (wins / total_bets * 100) if total_bets > 0 else 0
    roi = (total_profit / total_staked * 100) if total_staked > 0 else 0

    avg_odds_result = db.query(func.avg(models.Bet.odds)).scalar()
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


def get_bankroll(db: Session) -> Optional[schemas.BankrollResponse]:
    bankroll = db.query(models.Bankroll).first()
    if not bankroll:
        return None

    stats = get_stats(db)

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
