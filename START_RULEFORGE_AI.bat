@echo off
setlocal
cd /d "%~dp0"

echo Starting RuleForge AI portal...

set "AGI_PORT=3003"
set "TARGET_URL=http://localhost:%AGI_PORT%/ruleforge"

netstat -ano | findstr /R /C:":%AGI_PORT% .*LISTENING" >nul 2>nul
if errorlevel 1 (
  echo Local server not found. Starting Next.js on http://localhost:%AGI_PORT% ...
  start "RuleForge AI Server" /D "%~dp0" cmd /k "npm run dev -- -p %AGI_PORT%"
  timeout /t 8 /nobreak >nul
) else (
  echo Local server already running on port %AGI_PORT%.
)

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%TARGET_URL%"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%TARGET_URL%"
) else (
  start "" "%TARGET_URL%"
)

endlocal
