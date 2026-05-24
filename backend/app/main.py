from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import bets, matches, teams, predictions

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="加美墨世界杯投注系统",
    description="2026 加美墨世界杯智能投注管理系统",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bets.router)
app.include_router(matches.router)
app.include_router(teams.router)
app.include_router(predictions.router)


@app.get("/")
def root():
    return {
        "name": "加美墨世界杯投注系统",
        "version": "1.0.0",
        "docs": "/docs",
    }
