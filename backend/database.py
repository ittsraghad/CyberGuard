
import sqlite3


DATABASE_FILE = "data/security_events.db"


def get_connection():
    return sqlite3.connect(DATABASE_FILE)


def initialize_database():
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            file TEXT,
            status TEXT,
            severity TEXT,
            timestamp TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


def add_security_event(
    event_type,
    file_path,
    status,
    severity,
    timestamp
):
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO security_events
        (type, file, status, severity, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (
        event_type,
        file_path,
        status,
        severity,
        timestamp
    ))

    connection.commit()
    connection.close()


def get_security_events():
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            id,
            type,
            file,
            status,
            severity,
            timestamp
        FROM security_events
        ORDER BY id DESC
    """)

    events = cursor.fetchall()

    connection.close()

    return events
