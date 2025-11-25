@echo off
echo ================================================
echo    Upload Project to Nexus (excluding node_modules)
echo ================================================
echo.

set NEXUS_URL=https://nexus.imcc.com/repository/2401066
set NEXUS_USER=student
set NEXUS_PASS=Imcc@2025
set TIMESTAMP=%date:~-4%%date:~4,2%%date:~7,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

echo Creating temporary directory structure...
mkdir temp_upload 2>nul
mkdir temp_upload\backend 2>nul
mkdir temp_upload\frontend 2>nul

echo Copying files (excluding node_modules)...
xcopy /E /I /Y /EXCLUDE:exclude.txt backend temp_upload\backend >nul
xcopy /E /I /Y /EXCLUDE:exclude.txt frontend temp_upload\frontend >nul
copy docker-compose.yml temp_upload\ >nul
copy Jenkinsfile temp_upload\ >nul

echo Creating exclude list...
echo node_modules > exclude.txt
echo .git >> exclude.txt

echo Creating archive...
powershell -Command "Compress-Archive -Path temp_upload\* -DestinationPath flatbuddy-source.zip -Force"

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create archive
    goto :cleanup
)

echo ✅ Archive created: flatbuddy-source.zip
echo.
echo Uploading to Nexus...
echo.

curl -k -u %NEXUS_USER%:%NEXUS_PASS% --upload-file flatbuddy-source.zip %NEXUS_URL%/flatbuddy-source-%TIMESTAMP%.zip

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to upload to Nexus
    goto :cleanup
)

echo.
echo ✅ Upload successful!
echo.

:cleanup
echo Cleaning up...
rmdir /S /Q temp_upload 2>nul
del flatbuddy-source.zip 2>nul
del exclude.txt 2>nul

echo.
echo ================================================
echo    Upload Complete!
echo ================================================
echo.
echo View your artifacts at:
echo %NEXUS_URL%/
echo.
echo Uploaded: flatbuddy-source-%TIMESTAMP%.zip
echo.
