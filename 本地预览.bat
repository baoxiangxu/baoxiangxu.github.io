@echo off
chcp 65001 >nul
rem 双击此文件即可在本地预览网站（Windows）。关闭窗口即停止。
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo   没有找到 Node.js。请先从 https://nodejs.org 安装（选 LTS 版）。
    echo.
    pause
    exit /b 1
)

node scripts\preview.js
pause
