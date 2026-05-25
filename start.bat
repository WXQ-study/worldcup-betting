@echo off
title 加美墨世界杯投注系统
echo ====================================
echo   加美墨世界杯投注系统 - 启动中...
echo ====================================
echo.

:: 启动后端 (新窗口)
echo [1/2] 启动后端服务...
start "后端服务" cmd /c "cd /d %~dp0backend && echo 正在启动后端... && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 && pause"

:: 等2秒让后端先启动
timeout /t 2 /nobreak >nul

:: 启动前端 (新窗口)
echo [2/2] 启动前端服务...
start "前端服务" cmd /c "cd /d %~dp0frontend && echo 正在启动前端... && npx vite --host 0.0.0.0 && pause"

echo.
echo ====================================
echo   启动完成！
echo   后端: http://localhost:8000
echo   前端: http://localhost:3000
echo   按任意键关闭此窗口...
echo ====================================
pause
