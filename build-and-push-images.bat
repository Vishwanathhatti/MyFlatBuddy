@echo off
echo ================================================
echo   Building and Pushing Docker Images Locally
echo ================================================
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

echo Step 1: Building Backend Image...
echo ================================================
docker build -t vishwanath30/flatbuddy-backend:latest ./backend
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend build failed!
    pause
    exit /b 1
)
echo ✅ Backend image built successfully!
echo.

echo Step 2: Building Frontend Image...
echo ================================================
docker build -t vishwanath30/flatbuddy-frontend:latest ./frontend
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend image built successfully!
echo.

echo Step 3: Logging into Docker Hub...
echo ================================================
docker login
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker login failed!
    pause
    exit /b 1
)
echo ✅ Logged in successfully!
echo.

echo Step 4: Pushing Backend Image to Docker Hub...
echo ================================================
docker push vishwanath30/flatbuddy-backend:latest
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend push failed!
    pause
    exit /b 1
)
echo ✅ Backend image pushed successfully!
echo.

echo Step 5: Pushing Frontend Image to Docker Hub...
echo ================================================
docker push vishwanath30/flatbuddy-frontend:latest
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend push failed!
    pause
    exit /b 1
)
echo ✅ Frontend image pushed successfully!
echo.

echo ================================================
echo   ✅ All Images Built and Pushed Successfully!
echo ================================================
echo.
echo Images available at:
echo   - https://hub.docker.com/r/vishwanath30/flatbuddy-backend
echo   - https://hub.docker.com/r/vishwanath30/flatbuddy-frontend
echo.
echo Next: Update Jenkinsfile to use these pre-built images
echo.
pause
