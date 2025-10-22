#!/bin/bash

echo "=========================================="
echo "  AITA招新笔面试系统启动脚本"
echo "=========================================="
echo

# 检查Node.js是否已安装
if ! command -v node &> /dev/null
then
    echo "错误: 未检测到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否可用
if ! command -v npm &> /dev/null
then
    echo "错误: 未检测到npm，请检查Node.js安装"
    exit 1
fi

# 检查项目目录是否存在
if [ ! -d "aita-recruitment-system" ]; then
    echo "错误: 未找到aita-recruitment-system项目目录"
    echo "请确保在正确的目录下运行此脚本"
    exit 1
fi

echo "检测到Node.js版本: $(node --version)"
echo "检测到npm版本: $(npm --version)"
echo

echo "正在进入项目目录..."
cd aita-recruitment-system

echo
echo "正在检查项目依赖..."

if [ ! -d "node_modules" ]; then
    echo "未找到node_modules目录，正在安装项目依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 依赖安装失败"
        exit 1
    fi
    echo "依赖安装完成!"
    echo
fi

echo "正在启动AITA招新笔面试系统..."
echo "访问地址: http://localhost:8080"
echo "按 Ctrl+C 停止服务"
echo

npm run serve

echo
echo "系统已停止运行"