#!/bin/bash

# Prescripto 專案管理腳本
# 使用方式：
#   ./dev.sh install   - 安裝所有專案依賴
#   ./dev.sh start     - 同時啟動後端、前台、後台
#   ./dev.sh clean     - 移除所有 node_modules 和鎖定檔案
#   ./dev.sh help      - 顯示說明

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# 專案路徑
BACKEND_PATH="./backend"
FRONTEND_PATH="./frontend"
ADMIN_PATH="./admin"

# 顯示標題
show_header() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
}

# 檢查 pnpm 是否安裝
check_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        echo -e "${RED}錯誤：未找到 pnpm！${NC}"
        echo -e "${YELLOW}請先安裝 pnpm：npm install -g pnpm${NC}"
        exit 1
    fi
}

# 安裝依賴
install_dependencies() {
    show_header "安裝專案依賴"
    check_pnpm

    echo -e "${GREEN}開始安裝所有專案依賴...${NC}"

    # 後端
    echo -e "\n${YELLOW}[1/3] 安裝後端依賴...${NC}"
    cd "$BACKEND_PATH" || exit 1
    pnpm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}後端依賴安裝失敗！${NC}"
        cd ..
        exit 1
    fi
    cd ..

    # 前台
    echo -e "\n${YELLOW}[2/3] 安裝前台依賴...${NC}"
    cd "$FRONTEND_PATH" || exit 1
    pnpm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}前台依賴安裝失敗！${NC}"
        cd ..
        exit 1
    fi
    cd ..

    # 後台
    echo -e "\n${YELLOW}[3/3] 安裝後台依賴...${NC}"
    cd "$ADMIN_PATH" || exit 1
    pnpm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}後台依賴安裝失敗！${NC}"
        cd ..
        exit 1
    fi
    cd ..

    echo -e "\n${GREEN}✓ 所有依賴安裝完成！${NC}"
}

# 啟動所有服務
start_all_services() {
    show_header "啟動 Prescripto 專案"
    check_pnpm

    echo -e "${GREEN}正在同時啟動三個服務...${NC}"
    echo -e "${CYAN}  - 後端服務 (Backend)${NC}"
    echo -e "${CYAN}  - 前台服務 (Frontend)${NC}"
    echo -e "${CYAN}  - 後台服務 (Admin)${NC}"
    echo ""
    echo -e "${YELLOW}提示：按 Ctrl+C 停止所有服務${NC}"
    echo ""

    # 使用 trap 確保所有子進程在腳本退出時被終止
    trap 'kill $(jobs -p) 2>/dev/null' EXIT

    # 啟動後端
    (
        cd "$BACKEND_PATH" || exit 1
        echo -e "${GREEN}後端服務啟動中...${NC}"
        pnpm run server
    ) &

    sleep 2

    # 啟動前台
    (
        cd "$FRONTEND_PATH" || exit 1
        echo -e "${GREEN}前台服務啟動中...${NC}"
        pnpm run dev
    ) &

    sleep 2

    # 啟動後台
    (
        cd "$ADMIN_PATH" || exit 1
        echo -e "${GREEN}後台服務啟動中...${NC}"
        pnpm run dev
    ) &

    echo -e "\n${GREEN}✓ 所有服務已啟動！${NC}"
    echo ""
    echo -e "${CYAN}服務資訊：${NC}"
    echo -e "  後端 API: http://localhost:4000 (通常)"
    echo -e "  前台: http://localhost:5173 (通常)"
    echo -e "  後台: http://localhost:5174 (通常)"
    echo ""
    echo -e "${YELLOW}請查看上方輸出以獲取確切的連接埠號碼${NC}"
    echo ""

    # 等待所有背景進程
    wait
}

# 清理依賴
clean_dependencies() {
    show_header "清理專案依賴"

    echo -e "${YELLOW}即將刪除所有 node_modules 和鎖定檔案...${NC}"
    echo ""
    read -p "確定要繼續嗎？(y/N) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}已取消清理操作${NC}"
        exit 0
    fi

    echo -e "\n${GREEN}開始清理...${NC}"

    # 後端
    echo -e "\n${YELLOW}[1/3] 清理後端...${NC}"
    if [ -d "$BACKEND_PATH/node_modules" ]; then
        rm -rf "$BACKEND_PATH/node_modules"
        echo -e "${GRAY}  ✓ 已刪除 backend/node_modules${NC}"
    fi
    if [ -f "$BACKEND_PATH/pnpm-lock.yaml" ]; then
        rm -f "$BACKEND_PATH/pnpm-lock.yaml"
        echo -e "${GRAY}  ✓ 已刪除 backend/pnpm-lock.yaml${NC}"
    fi

    # 前台
    echo -e "\n${YELLOW}[2/3] 清理前台...${NC}"
    if [ -d "$FRONTEND_PATH/node_modules" ]; then
        rm -rf "$FRONTEND_PATH/node_modules"
        echo -e "${GRAY}  ✓ 已刪除 frontend/node_modules${NC}"
    fi
    if [ -f "$FRONTEND_PATH/pnpm-lock.yaml" ]; then
        rm -f "$FRONTEND_PATH/pnpm-lock.yaml"
        echo -e "${GRAY}  ✓ 已刪除 frontend/pnpm-lock.yaml${NC}"
    fi

    # 後台
    echo -e "\n${YELLOW}[3/3] 清理後台...${NC}"
    if [ -d "$ADMIN_PATH/node_modules" ]; then
        rm -rf "$ADMIN_PATH/node_modules"
        echo -e "${GRAY}  ✓ 已刪除 admin/node_modules${NC}"
    fi
    if [ -f "$ADMIN_PATH/pnpm-lock.yaml" ]; then
        rm -f "$ADMIN_PATH/pnpm-lock.yaml"
        echo -e "${GRAY}  ✓ 已刪除 admin/pnpm-lock.yaml${NC}"
    fi

    echo -e "\n${GREEN}✓ 清理完成！${NC}"
}

# 顯示說明
show_help() {
    show_header "Prescripto 專案管理腳本"

    echo "使用方式："
    echo ""
    echo -e "${CYAN}  ./dev.sh install${NC}"
    echo "    安裝所有專案依賴（後端、前台、後台）"
    echo ""
    echo -e "${CYAN}  ./dev.sh start${NC}"
    echo "    同時啟動所有服務（後端、前台、後台）"
    echo ""
    echo -e "${CYAN}  ./dev.sh clean${NC}"
    echo "    移除所有 node_modules 和鎖定檔案"
    echo ""
    echo -e "${CYAN}  ./dev.sh help${NC}"
    echo "    顯示此說明訊息"
    echo ""
    echo -e "${YELLOW}範例：${NC}"
    echo "  ./dev.sh install    # 首次設定專案"
    echo "  ./dev.sh start      # 啟動開發環境"
    echo "  ./dev.sh clean      # 清理後重新安裝"
    echo ""
}

# 主程式
case "${1:-help}" in
    install)
        install_dependencies
        ;;
    start|run)
        start_all_services
        ;;
    clean)
        clean_dependencies
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}未知的命令：$1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
