@echo off
echo ================================================
echo    FlatBuddy - SonarQube Analysis (Docker)
echo ================================================
echo.
echo Analyzing Backend code only...
echo.

docker run --rm ^
  -v "%CD%:/usr/src" ^
  sonarsource/sonar-scanner-cli ^
  -Dsonar.projectKey=2401066-myFlatBuddy ^
  -Dsonar.sources=backend ^
  -Dsonar.host.url=http://sonarqube.imcc.com ^
  -Dsonar.token=sqp_c571c31452fca404b94ba9986f46a6207007c679 ^
  -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/.git/**,**/.vscode/**,frontend/**

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo    Backend Analysis completed successfully!
    echo ================================================
    echo.
    echo View results at:
    echo http://sonarqube.imcc.com/dashboard?id=2401066-myFlatBuddy
    echo.
    echo Note: Only backend code was analyzed to avoid JavaScript bridge issues.
    echo Frontend analysis can be added later if needed.
) else (
    echo.
    echo Analysis failed! Check the output above.
)
