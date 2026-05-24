from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .models import MatchStatus, BetType, BetResult, PlayerPosition


class TeamBase(BaseModel):
    name: str
    name_cn: str
    country_code: str
    fifa_ranking: Optional[int] = None
    elo_rating: float = 1500.0
    group: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class TeamResponse(TeamBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PlayerBase(BaseModel):
    name: str
    name_cn: str
    position: PlayerPosition
    jersey_number: Optional[int] = None
    age: Optional[int] = None
    nationality: Optional[str] = None


class PlayerResponse(PlayerBase):
    id: int
    team_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TeamDetailResponse(TeamResponse):
    players: list[PlayerResponse] = []

    class Config:
        from_attributes = True


class MatchBase(BaseModel):
    home_team_id: int
    away_team_id: int
    match_date: datetime
    group: Optional[str] = None
    round: Optional[str] = None
    status: MatchStatus = MatchStatus.SCHEDULED
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    venue: Optional[str] = None


class MatchCreate(MatchBase):
    pass


class MatchUpdate(BaseModel):
    status: Optional[MatchStatus] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None


class MatchResponse(MatchBase):
    id: int
    home_team: TeamResponse
    away_team: TeamResponse
    competition: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class RecentMatchResponse(BaseModel):
    id: int
    opponent_name_cn: str
    match_date: datetime
    is_home: bool
    goals_for: Optional[int] = None
    goals_against: Optional[int] = None
    result: Optional[str] = None
    competition: Optional[str] = None

    class Config:
        from_attributes = True


class MatchDetailResponse(BaseModel):
    match: MatchResponse
    home_team_detail: TeamDetailResponse
    away_team_detail: TeamDetailResponse
    home_recent_form: list[RecentMatchResponse]
    away_recent_form: list[RecentMatchResponse]


class OddsBase(BaseModel):
    match_id: int
    bookmaker: str
    home_odds: float
    draw_odds: float
    away_odds: float


class OddsCreate(OddsBase):
    pass


class OddsResponse(OddsBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class BetBase(BaseModel):
    match_id: int
    bet_type: BetType
    pick: str
    odds: float
    stake: float
    notes: Optional[str] = None


class BetCreate(BetBase):
    pass


class BetUpdate(BaseModel):
    result: Optional[BetResult] = None
    profit_loss: Optional[float] = None


class BetResponse(BetBase):
    id: int
    result: BetResult
    profit_loss: float
    placed_at: datetime
    settled_at: Optional[datetime] = None
    match: Optional[MatchResponse] = None

    class Config:
        from_attributes = True


class BankrollResponse(BaseModel):
    id: int
    initial_balance: float
    current_balance: float
    total_profit: float
    total_bets: int
    win_rate: float
    roi: float
    updated_at: datetime

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_bets: int
    wins: int
    losses: int
    win_rate: float
    total_staked: float
    total_profit: float
    roi: float
    avg_odds: float


class PredictionRequest(BaseModel):
    match_id: int


class PredictionResponse(BaseModel):
    match_id: int
    home_team: str
    away_team: str
    match_date: Optional[datetime] = None
    venue: Optional[str] = None
    round: Optional[str] = None
    home_win_prob: float
    draw_prob: float
    away_win_prob: float
    recommendation: str
    confidence: str
    expected_value: Optional[float] = None
    recommended_odds: Optional[float] = None
