@echo off
set JAR_NAME=example-writer-sb-0.0.1-SNAPSHOT.jar
set PID_FILE=app.pid

if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="status" goto status
if "%1"=="restart" goto restart

echo Usage: manage-jar.bat {start|stop|status|restart}
goto end

:start
if exist %PID_FILE% (
    set /p PID=<%PID_FILE%
    tasklist /FI "PID eq %PID%" | findstr /I "java.exe" > nul
    if %errorlevel%==0 (
        echo Application is already running (PID: %PID%).
        goto end
    )
)
echo Starting %JAR_NAME%...
start /B java -jar %JAR_NAME%
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq java.exe" /FO CSV ^| findstr /I "java.exe"') do echo %%a > %PID_FILE%
echo Started with PID:
type %PID_FILE%
goto end

:stop
if not exist %PID_FILE% (
    echo No PID file found. Application may not be running.
    goto end
)
set /p PID=<%PID_FILE%
taskkill /PID %PID% /F
del %PID_FILE%
echo Stopped.
goto end

:status
if exist %PID_FILE% (
    set /p PID=<%PID_FILE%
    tasklist /FI "PID eq %PID%" | findstr /I "java.exe" > nul
    if %errorlevel%==0 (
        echo Application is running (PID: %PID%).
    ) else (
        echo Application is not running but PID file exists.
    )
) else (
    echo Application is not running.
)
goto end

:restart
call :stop
call :start
goto end

:end
