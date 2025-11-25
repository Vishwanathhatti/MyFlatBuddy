@echo off
echo ================================================
echo    Testing Nexus Docker Registry Ports
echo ================================================
echo.

echo Testing port 8082...
docker login nexus.imcc.com:8082 -u student -p Imcc@2025 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Port 8082 works!
    docker logout nexus.imcc.com:8082
    goto :found
)

echo Testing port 8083...
docker login nexus.imcc.com:8083 -u student -p Imcc@2025 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Port 8083 works!
    docker logout nexus.imcc.com:8083
    goto :found
)

echo Testing port 5000...
docker login nexus.imcc.com:5000 -u student -p Imcc@2025 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Port 5000 works!
    docker logout nexus.imcc.com:5000
    goto :found
)

echo.
echo ❌ No Docker registry found on common ports.
echo.
echo Please check the Nexus web interface at http://nexus.imcc.com/
echo or ask your instructor for the correct Docker registry port.
goto :end

:found
echo.
echo Use this port for pushing Docker images to Nexus.

:end
