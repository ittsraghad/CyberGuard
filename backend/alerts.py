
import json
import os
from datetime import datetime

from backend.database import add_security_event


def create_alert(file_path: str, status: str) -> dict:
    alert_file = "data/security_alerts.json"

    if os.path.exists(alert_file):
        with open(alert_file, "r") as file:
            content = file.read()

        if content.strip():
            alerts = json.loads(content)
        else:
            alerts = []
    else:
        alerts = []

    alert = {
        "type": "FILE_INTEGRITY",
        "file": file_path,
        "status": status,
        "severity": "HIGH",
        "timestamp": datetime.now().isoformat()
    }

    # Save the event to SQLite
    add_security_event(
        alert["type"],
        alert["file"],
        alert["status"],
        alert["severity"],
        alert["timestamp"]
    )

    alerts.append(alert)

    with open(alert_file, "w") as file:
        json.dump(alerts, file, indent=4)

    return alert
