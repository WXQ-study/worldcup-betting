import math
import numpy as np
from scipy import stats
from sqlalchemy.orm import Session
from typing import Dict, Tuple

from .. import models, schemas


ELO_K = 32
HOME_ADVANTAGE = 100
GOAL_EXPECTANCY_BASE = 1.3


def _probability_from_elo(home_elo: float, away_elo: float) -> Tuple[float, float, float]:
    effective_home_elo = home_elo + HOME_ADVANTAGE
    elo_diff = effective_home_elo - away_elo

    win_expectancy = 1.0 / (1.0 + math.pow(10, -elo_diff / 400))

    draw_max = 0.28
    draw_scale = 500.0
    draw_prob = draw_max * math.exp(-(elo_diff ** 2) / (2 * draw_scale ** 2))

    home_win_prob = win_expectancy * (1 - draw_prob)
    away_win_prob = (1 - win_expectancy) * (1 - draw_prob)

    return home_win_prob, draw_prob, away_win_prob


def _poisson_xg(home_elo: float, away_elo: float) -> Tuple[float, float]:
    effective_home_elo = home_elo + HOME_ADVANTAGE
    home_xg = GOAL_EXPECTANCY_BASE * math.pow(10, (effective_home_elo - 1500) / 400)
    away_xg = GOAL_EXPECTANCY_BASE * math.pow(10, (away_elo - 1500) / 400)
    return home_xg, away_xg


def _match_probabilities(home_xg: float, away_xg: float, max_goals: int = 10) -> Tuple[float, float, float]:
    home_win_prob = 0
    draw_prob = 0
    away_win_prob = 0

    for i in range(max_goals):
        for j in range(max_goals):
            prob = stats.poisson.pmf(i, home_xg) * stats.poisson.pmf(j, away_xg)
            if i > j:
                home_win_prob += prob
            elif i == j:
                draw_prob += prob
            else:
                away_win_prob += prob

    return home_win_prob, draw_prob, away_win_prob


def predict_match(db: Session, match_id: int) -> schemas.PredictionResponse:
    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not match:
        raise ValueError(f"Match {match_id} not found")

    home_team = match.home_team
    away_team = match.away_team

    home_elo = home_team.elo_rating if home_team.elo_rating else 1500
    away_elo = away_team.elo_rating if away_team.elo_rating else 1500

    home_win_prob, draw_prob, away_win_prob = _probability_from_elo(home_elo, away_elo)

    probs = {
        "home_win": home_win_prob,
        "draw": draw_prob,
        "away_win": away_win_prob,
    }

    best_pick = max(probs, key=probs.get)
    best_prob = probs[best_pick]

    if best_prob > 0.5:
        confidence = "高"
    elif best_prob > 0.4:
        confidence = "中"
    else:
        confidence = "低"

    recommendation_map = {
        "home_win": home_team.name_cn + " 胜",
        "draw": "平局",
        "away_win": away_team.name_cn + " 胜",
    }

    latest_odds = (
        db.query(models.Odds)
        .filter(models.Odds.match_id == match_id)
        .order_by(models.Odds.timestamp.desc())
        .first()
    )

    expected_value = None
    recommended_odds = None

    if latest_odds:
        if best_pick == "home_win":
            fair_odds = 1.0 / home_win_prob
            recommended_odds = latest_odds.home_odds
        elif best_pick == "draw":
            fair_odds = 1.0 / draw_prob
            recommended_odds = latest_odds.draw_odds
        else:
            fair_odds = 1.0 / away_win_prob
            recommended_odds = latest_odds.away_odds

        expected_value = (best_prob * recommended_odds - 1) * 100

    return schemas.PredictionResponse(
        match_id=match_id,
        home_team=home_team.name_cn,
        away_team=away_team.name_cn,
        match_date=match.match_date,
        venue=match.venue,
        round=match.round,
        home_win_prob=round(home_win_prob * 100, 1),
        draw_prob=round(draw_prob * 100, 1),
        away_win_prob=round(away_win_prob * 100, 1),
        recommendation=recommendation_map[best_pick],
        confidence=confidence,
        expected_value=round(expected_value, 2) if expected_value else None,
        recommended_odds=recommended_odds,
    )


def predict_all_upcoming(db: Session) -> list[schemas.PredictionResponse]:
    upcoming_matches = (
        db.query(models.Match)
        .filter(models.Match.status == models.MatchStatus.SCHEDULED)
        .order_by(models.Match.match_date)
        .all()
    )

    predictions = []
    for match in upcoming_matches:
        try:
            pred = predict_match(db, match.id)
            predictions.append(pred)
        except Exception:
            continue

    return predictions
