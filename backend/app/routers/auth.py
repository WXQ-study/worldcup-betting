from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..services import auth_service
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=schemas.TokenResponse)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    # 检查用户名是否已存在
    existing_user = auth_service.get_user_by_username(db, user_data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="用户名已被注册")

    # 检查邮箱是否已存在
    existing_email = auth_service.get_user_by_email(db, user_data.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="邮箱已被注册")

    # 创建用户
    user = auth_service.create_user(db, user_data)

    # 创建该用户的资金池
    bankroll = models.Bankroll(
        user_id=user.id,
        initial_balance=10000.0,
        current_balance=10000.0,
    )
    db.add(bankroll)
    db.commit()

    # 生成 token
    access_token = auth_service.create_access_token(data={"sub": user.id})

    return schemas.TokenResponse(
        access_token=access_token,
        user=schemas.UserResponse.model_validate(user),
    )


@router.post("/login", response_model=schemas.TokenResponse)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    access_token = auth_service.create_access_token(data={"sub": user.id})

    return schemas.TokenResponse(
        access_token=access_token,
        user=schemas.UserResponse.model_validate(user),
    )


@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
