# SonarQube Analysis Script for FlatBuddy
# Run this script once to analyze your code

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   FlatBuddy - SonarQube Analysis Script      " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if sonar-scanner is installed
$scannerPath = Get-Command sonar-scanner -ErrorAction SilentlyContinue

if (-not $scannerPath) {
    Write-Host "❌ SonarQube Scanner not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install SonarQube Scanner:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/" -ForegroundColor Yellow
    Write-Host "2. Extract and add to PATH" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use Docker (no installation needed):" -ForegroundColor Green
    Write-Host "docker run --rm -v ${PWD}:/usr/src sonarsource/sonar-scanner-cli \\" -ForegroundColor Green
    Write-Host "  -Dsonar.projectKey=2401066-myFlatBuddy \\" -ForegroundColor Green
    Write-Host "  -Dsonar.sources=. \\" -ForegroundColor Green
    Write-Host "  -Dsonar.host.url=https://sonarqube.imcc.com \\" -ForegroundColor Green
    Write-Host "  -Dsonar.token=sqp_c571c31452fca404b94ba9986f46a6207007c679" -ForegroundColor Green
    exit 1
}

Write-Host "✅ SonarQube Scanner found!" -ForegroundColor Green
Write-Host "Running analysis..." -ForegroundColor Cyan
Write-Host ""

# Run SonarQube analysis
sonar-scanner `
  -Dsonar.projectKey=2401066-myFlatBuddy `
  -Dsonar.projectName="FlatBuddy Application" `
  -Dsonar.sources=. `
  -Dsonar.host.url=https://sonarqube.imcc.com `
  -Dsonar.token=sqp_c571c31452fca404b94ba9986f46a6207007c679 `
  -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/.git/**,**/.vscode/**

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "   ✅ Analysis completed successfully!         " -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 View results at:" -ForegroundColor Cyan
    Write-Host "https://sonarqube.imcc.com/dashboard?id=2401066-myFlatBuddy" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Analysis failed! Check the output above for errors." -ForegroundColor Red
}
