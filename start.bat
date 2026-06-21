@echo off
title 加美墨世界杯投注系统
echo ====================================
echo   加美墨世界杯投注系统 - 启动中...
echo ====================================
echo.

:: 确保 data 目录存在
if not exist "%~dp0backend\data" mkdir "%~dp0backend\data"

:: 启动后端 (新窗口)
echo [1/3] 启动后端服务...
start "后端服务" cmd /c "cd /d %~dp0backend && echo 正在启动后端... && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 && pause"

:: 等2秒让后端先启动
timeout /t 2 /nobreak >nul

:: 启动前端 (新窗口)
echo [2/3] 启动前端服务...
start "前端服务" cmd /c "cd /d %~dp0frontend && echo 正在启动前端... && npx vite --host 0.0.0.0 && pause"

:: 启动移动端 (可选)
echo [3/3] 提示: 移动端请进入 mobile 目录执行 npx expo start

echo.
echo ====================================
echo   启动完成！
echo   后端: http://localhost:8000
echo   前端: http://localhost:5173
echo   API文档: http://localhost:8000/docs
echo   默认账号: admin / admin123
echo   按任意键关闭此窗口...
echo ====================================
pause
