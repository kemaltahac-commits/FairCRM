@echo off
title FairCRM

echo ============================
echo          FairCRM
echo ============================
echo.

echo Starting backend...
start "FairCRM Backend" cmd /k "cd /d %~dp0backend && py -m uvicorn main:app --reload"

echo Starting frontend...
start "FairCRM Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo Waiting for servers...
timeout /t 4 /nobreak >nul

echo Opening FairCRM...
start http://localhost:5173

echo.
echo FairCRM started successfully.
echo.
pause