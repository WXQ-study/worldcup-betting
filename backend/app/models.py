from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Date
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .database import Base


class MatchStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    LIVE = "live"
    FINISHED = "finished"
    CANCELLED = "cancelled"


class BetType(str, enum.Enum):
    WIN = "win"
    DRAW = "draw"
    LOSS = "loss"
    OVER = "over"
    UNDER = "under"
    HANDICAP = "handicap"


class BetResult(str, enum.Enum):
    PENDING = "pending"
    WIN = "win"
    LOSS = "loss"
    HALF_WIN = "half_win"
    HALF_LOSS = "half_loss"
    VOID = "void"


class PlayerPosition(str, enum.Enum):
    GK = "GK"
    DEF = "DEF"
    MID = "MID"
    FWD = "FWD"


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_cn = Column(String(100), nullable=False)
    country_code = Column(String(10), nullable=False)
    fifa_ranking = Column(Integer, nullable=True)
    elo_rating = Column(Float, default=1500.0)
    group = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    home_matches = relationship("Match", foreign_keys="Match.home_team_id", back_populates="home_team")
    away_matches = relationship("Match", foreign_keys="Match.away_team_id", back_populates="away_team")
    players = relationship("Player", back_populates="team", cascade="all, delete-orphan")


class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    name = Column(String(100), nullable=False)
    name_cn = Column(String(100), nullable=False)
    position = Column(SQLEnum(PlayerPosition), nullable=False)
    jersey_number = Column(Integer, nullable=True)
    age = Column(Integer, nullable=True)
    nationality = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="players")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    home_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    away_team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    match_date = Column(DateTime, nullable=False)
    group = Column(String(10), nullable=True)
    round = Column(String(50), nullable=True)
    status = Column(SQLEnum(MatchStatus), default=MatchStatus.SCHEDULED)
    home_score = Column(Integer, nullable=True)
    away_score = Column(Integer, nullable=True)
    venue = Column(String(100), nullable=True)
    competition = Column(String(100), default="加美墨世界杯")
    created_at = Column(DateTime, default=datetime.utcnow)

    home_team = relationship("Team", foreign_keys=[home_team_id], back_populates="home_matches")
    away_team = relationship("Team", foreign_keys=[away_team_id], back_populates="away_matches")
    odds = relationship("Odds", back_populates="match", cascade="all, delete-orphan")
    bets = relationship("Bet", back_populates="match", cascade="all, delete-orphan")


class Odds(Base):
    __tablename__ = "odds"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    bookmaker = Column(String(50), nullable=False)
    home_odds = Column(Float, nullable=False)
    draw_odds = Column(Float, nullable=False)
    away_odds = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    match = relationship("Match", back_populates="odds")


class Bet(Base):
    __tablename__ = "bets"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    bet_type = Column(SQLEnum(BetType), nullable=False)
    pick = Column(String(50), nullable=False)
    odds = Column(Float, nullable=False)
    stake = Column(Float, nullable=False)
    result = Column(SQLEnum(BetResult), default=BetResult.PENDING)
    profit_loss = Column(Float, default=0.0)
    notes = Column(String(500), nullable=True)
    placed_at = Column(DateTime, default=datetime.utcnow)
    settled_at = Column(DateTime, nullable=True)

    match = relationship("Match", back_populates="bets")


class Bankroll(Base):
    __tablename__ = "bankroll"

    id = Column(Integer, primary_key=True, index=True)
    initial_balance = Column(Float, nullable=False, default=10000.00)
    current_balance = Column(Float, nullable=False, default=10000.00)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
