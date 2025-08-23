#!/bin/bash

JAR_NAME="example-writer-sb-0.0.1-SNAPSHOT.jar"
PID_FILE="app.pid"
LOG_FILE="app.log"

start_app() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null; then
            echo "Application is already running (PID: $PID)."
            exit 1
        fi
    fi

    echo "Starting $JAR_NAME..."
    nohup java -jar "$JAR_NAME" > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "Started with PID $(cat $PID_FILE). Logs: $LOG_FILE"
}

stop_app() {
    if [ ! -f "$PID_FILE" ]; then
        echo "No PID file found. Application may not be running."
        exit 1
    fi

    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null; then
        echo "Stopping application (PID: $PID)..."
        kill $PID
        rm "$PID_FILE"
        echo "Stopped."
    else
        echo "Process not running but PID file exists. Removing PID file."
        rm "$PID_FILE"
    fi
}

status_app() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null; then
            echo "Application is running (PID: $PID)."
        else
            echo "Application is not running but PID file exists. Cleaning up..."
            rm "$PID_FILE"
        fi
    else
        echo "Application is not running."
    fi
}


case "$1" in
    start)
        start_app
        ;;
    stop)
        stop_app
        ;;
    status)
        status_app
        ;;
    restart)
        stop_app
        start_app
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart}"
        exit 1
        ;;
esac
