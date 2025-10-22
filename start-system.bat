@echo off
title AITA招新笔面试系统

echo ==========================================
echo   AITA招新笔面试系统启动脚本
echo ==========================================
echo.

REM 检查Node.js是否已安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm是否可用
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到npm，请检查Node.js安装
    pause
    exit /b 1
)

REM 检查项目目录是否存在
if not exist "aita-recruitment-system" (
    echo 错误: 未找到aita-recruitment-system项目目录
    echo 请确保在正确的目录下运行此脚本
    pause
    exit /b 1
)

echo 检测到Node.js版本: 
node --version
echo 检测到npm版本: 
npm --version
echo.

echo 正在进入项目目录...
cd aita-recruitment-system

echo.
echo 正在检查项目依赖...
if not exist "node_modules" (
    echo 未找到node_modules目录，正在安装项目依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 依赖安装失败
        pause
        exit /b 1
    )
    echo 依赖安装完成!
    echo.
)

echo 正在启动AITA招新笔面试系统...
echo 访问地址: http://localhost:8080
echo 按 Ctrl+C 停止服务
echo.

npm run serve

echo.
echo 系统已停止运行
pause