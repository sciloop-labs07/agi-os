@echo off
setlocal
cd /d "%~dp0"

set "AGI_PORT=3003"
set "TARGET_URL=http://localhost:%AGI_PORT%/explorer"

netstat -ano | findstr /R /C:":%AGI_PORT% .*LISTENING" >nul 2>nul
if errorlevel 1 (
  start "AGI Research OS Server" /D "%~dp0" cmd /k "npm run dev -- -p %AGI_PORT%"
  timeout /t 8 /nobreak >nul
) 

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%TARGET_URL%"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%TARGET_URL%"
) else (
  start "" "%TARGET_URL%"
)
endlocal
