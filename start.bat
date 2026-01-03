@echo off
echo ====================================
echo   Dark Haven - Локальный запуск
echo ====================================
echo.

REM Проверка Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Node.js не установлен!
    echo Скачайте с https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js найден
echo.

REM Проверка зависимостей
if not exist "node_modules" (
    echo [1/2] Устанавливаю зависимости...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ОШИБКА] Не удалось установить зависимости
        pause
        exit /b 1
    )
) else (
    echo [OK] Зависимости уже установлены
)

echo.
echo [2/2] Запускаю сервер разработки...
echo.
echo ====================================
echo  Сайт будет доступен по адресу:
echo  http://localhost:5173
echo ====================================
echo.
echo Нажмите Ctrl+C чтобы остановить сервер
echo.

call npm run dev
