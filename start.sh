#!/bin/bash

echo "===================================="
echo "  Dark Haven - Локальный запуск"
echo "===================================="
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "[ОШИБКА] Node.js не установлен!"
    echo "Скачайте с https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js найден"
echo ""

# Проверка зависимостей
if [ ! -d "node_modules" ]; then
    echo "[1/2] Устанавливаю зависимости..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ОШИБКА] Не удалось установить зависимости"
        exit 1
    fi
else
    echo "[OK] Зависимости уже установлены"
fi

echo ""
echo "[2/2] Запускаю сервер разработки..."
echo ""
echo "===================================="
echo " Сайт будет доступен по адресу:"
echo " http://localhost:5173"
echo "===================================="
echo ""
echo "Нажмите Ctrl+C чтобы остановить сервер"
echo ""

npm run dev
