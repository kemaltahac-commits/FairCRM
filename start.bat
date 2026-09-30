@echo off
title FairCRM Platform Starter
echo ===================================================
echo   FairCRM Full-Stack Platformu Baslatiliyor...
echo ===================================================
echo.

:: 1. Backend'i (FastAPI) yeni pencerede calistir
echo [1/2] FastAPI Backend baslatiliyor (Port 8000)...
start "FairCRM - FastAPI Backend" cmd /k "cd /d %~dp0backend && py -m uvicorn main:app --reload --port 8000"

:: 2. Frontend'i (React/Vite) yeni pencerede calistir
echo [2/2] React Frontend baslatiliyor (Port 5173/5174)...
start "FairCRM - React Frontend" cmd /k "cd /d %~dp0 && npx vite"

echo.
echo ===================================================
echo   Iki servis de tetiklendi! 
echo   Pencerelerin acilmasini bekleyin ve tarayiciya donun.
echo ===================================================