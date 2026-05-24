from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from datetime import datetime, timedelta

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/matches", tags=["matches"])


@router.get("/", response_model=list[schemas.MatchResponse])
def get_matches(
    status: Optional[str] = None,
    group: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Match).options(
        joinedload(models.Match.home_team),
        joinedload(models.Match.away_team),
    )
    if status:
        query = query.filter(models.Match.status == status)
    if group:
        query = query.filter(models.Match.group == group)
    if search:
        query = query.filter(
            models.Match.home_team.has(models.Team.name.ilike(f"%{search}%")) |
            models.Match.home_team.has(models.Team.name_cn.ilike(f"%{search}%")) |
            models.Match.away_team.has(models.Team.name.ilike(f"%{search}%")) |
            models.Match.away_team.has(models.Team.name_cn.ilike(f"%{search}%"))
        )
    return query.order_by(models.Match.match_date).all()


@router.get("/{match_id}", response_model=schemas.MatchResponse)
def get_match(match_id: int, db: Session = Depends(get_db)):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match


@router.get("/{match_id}/detail", response_model=schemas.MatchDetailResponse)
def get_match_detail(match_id: int, db: Session = Depends(get_db)):
    match = db.query(models.Match).options(
        joinedload(models.Match.home_team),
        joinedload(models.Match.away_team),
    ).filter(models.Match.id == match_id).first()

    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    home_team_detail = db.query(models.Team).options(
        joinedload(models.Team.players),
    ).filter(models.Team.id == match.home_team_id).first()

    away_team_detail = db.query(models.Team).options(
        joinedload(models.Team.players),
    ).filter(models.Team.id == match.away_team_id).first()

    one_year_ago = datetime.utcnow() - timedelta(days=365)

    def get_recent_form(team_id: int, opponent_id: int) -> list[schemas.RecentMatchResponse]:
        recent = (
            db.query(models.Match)
            .options(joinedload(models.Match.home_team), joinedload(models.Match.away_team))
            .filter(
                models.Match.status == models.MatchStatus.FINISHED,
                models.Match.match_date >= one_year_ago,
                ((models.Match.home_team_id == team_id) | (models.Match.away_team_id == team_id)),
            )
            .order_by(models.Match.match_date.desc())
            .limit(8)
            .all()
        )

        result = []
        for m in recent:
            is_home = m.home_team_id == team_id
            goals_for = m.home_score if is_home else m.away_score
            goals_against = m.away_score if is_home else m.home_score

            if goals_for is not None and goals_against is not None:
                if goals_for > goals_against:
                    res_label = "胜"
                elif goals_for < goals_against:
                    res_label = "负"
                else:
                    res_label = "平"
            else:
                res_label = None

            opponent = m.away_team if is_home else m.home_team

            result.append(schemas.RecentMatchResponse(
                id=m.id,
                opponent_name_cn=opponent.name_cn,
                match_date=m.match_date,
                is_home=is_home,
                goals_for=goals_for,
                goals_against=goals_against,
                result=res_label,
                competition=m.competition,
            ))
        return result

    home_form = get_recent_form(match.home_team_id, match.away_team_id)
    away_form = get_recent_form(match.away_team_id, match.home_team_id)

    return schemas.MatchDetailResponse(
        match=schemas.MatchResponse.model_validate(match),
        home_team_detail=schemas.TeamDetailResponse(
            id=home_team_detail.id,
            name=home_team_detail.name,
            name_cn=home_team_detail.name_cn,
            country_code=home_team_detail.country_code,
            fifa_ranking=home_team_detail.fifa_ranking,
            elo_rating=home_team_detail.elo_rating,
            group=home_team_detail.group,
            created_at=home_team_detail.created_at,
            players=[schemas.PlayerResponse.model_validate(p) for p in home_team_detail.players],
        ),
        away_team_detail=schemas.TeamDetailResponse(
            id=away_team_detail.id,
            name=away_team_detail.name,
            name_cn=away_team_detail.name_cn,
            country_code=away_team_detail.country_code,
            fifa_ranking=away_team_detail.fifa_ranking,
            elo_rating=away_team_detail.elo_rating,
            group=away_team_detail.group,
            created_at=away_team_detail.created_at,
            players=[schemas.PlayerResponse.model_validate(p) for p in away_team_detail.players],
        ),
        home_recent_form=home_form,
        away_recent_form=away_form,
    )


@router.post("/", response_model=schemas.MatchResponse)
def create_match(match: schemas.MatchCreate, db: Session = Depends(get_db)):
    db_match = models.Match(**match.model_dump())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match


@router.patch("/{match_id}", response_model=schemas.MatchResponse)
def update_match(match_id: int, match_update: schemas.MatchUpdate, db: Session = Depends(get_db)):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    update_data = match_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(match, key, value)

    db.commit()
    db.refresh(match)
    return match


@router.get("/{match_id}/odds", response_model=list[schemas.OddsResponse])
def get_match_odds(match_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Odds)
        .filter(models.Odds.match_id == match_id)
        .order_by(models.Odds.timestamp.desc())
        .all()
    )


@router.post("/{match_id}/odds", response_model=schemas.OddsResponse)
def create_match_odds(match_id: int, odds: schemas.OddsCreate, db: Session = Depends(get_db)):
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    db_odds = models.Odds(**odds.model_dump())
    db.add(db_odds)
    db.commit()
    db.refresh(db_odds)
    return db_odds
