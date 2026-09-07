#!/bin/bash
# 双击此文件即可在本地预览网站（macOS）。关闭窗口即停止。
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
    echo ""
    echo "  没有找到 Node.js。请先从 https://nodejs.org 安装（选 LTS 版）。"
    echo ""
    read -r -p "  按回车关闭..."
    exit 1
fi

node scripts/preview.js
read -r -p "  按回车关闭..."
