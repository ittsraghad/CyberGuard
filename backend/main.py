
import json
import os
import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.file_integrity import (
    calculate_file_hash,
    check_file_integrity,
    save_baseline,
)
from backend.network_monitor import get_network_connections
from backend.security_checks import check_password_strength
from backend.system_checks import get_system_info
from backend.report_generator import generate_security_report
from backend.database import (
    initialize_database,
    get_security_events,
)


app = FastAPI(title="CyberGuard")

initialize_database()


@app.on_event("startup")
async def start_monitoring():

    asyncio.create_task(
        automatic_file_monitor()
    )


# Allow the frontend dashboard to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PasswordRequest(BaseModel):
    password: str


class FileRequest(BaseModel):
    file_path: str


@app.get("/")
def home():
    return {
        "message": "CyberGuard API is running!"
    }


@app.post("/security/password-check")
def password_check(request: PasswordRequest):
    return check_password_strength(request.password)


@app.get("/security/system-check")
def system_check():
    return get_system_info()


@app.get("/security/cpu")
def cpu_usage():
    from backend.system_checks import get_cpu_usage

    return get_cpu_usage()


@app.get("/security/memory")
def memory_usage():
    from backend.system_checks import get_memory_usage

    return get_memory_usage()


@app.get("/security/disk")
def disk_usage():
    from backend.system_checks import get_disk_usage

    return get_disk_usage()


@app.get("/security/network-monitor")
def network_monitor():
    return get_network_connections()


@app.post("/security/file-hash")
def file_hash(request: FileRequest):
    file_hash = calculate_file_hash(request.file_path)

    return {
        "file": request.file_path,
        "sha256": file_hash
    }


@app.post("/security/file-baseline")
def file_baseline(request: FileRequest):
    file_hash = calculate_file_hash(request.file_path)

    save_baseline(request.file_path, file_hash)

    return {
        "file": request.file_path,
        "status": "BASELINE_CREATED",
        "sha256": file_hash
    }


@app.post("/security/file-integrity")
def file_integrity(request: FileRequest):
    return check_file_integrity(request.file_path)


@app.get("/security/alerts")
def get_alerts():
    alert_file = "data/security_alerts.json"

    if not os.path.exists(alert_file):
        return []

    with open(alert_file, "r") as file:
        content = file.read()

    if not content.strip():
        return []

    return json.loads(content)


@app.get("/security/activity")
def get_security_activity():
    alert_file = "data/security_alerts.json"

    if not os.path.exists(alert_file):
        return []

    with open(alert_file, "r") as file:
        content = file.read()

    if not content.strip():
        return []

    alerts = json.loads(content)

    return alerts


@app.get("/security/database-events")
def get_database_events():

    events = get_security_events()

    return [
        {
            "id": event[0],
            "type": event[1],
            "file": event[2],
            "status": event[3],
            "severity": event[4],
            "timestamp": event[5]
        }
        for event in events
    ]


@app.post("/security/generate-report")
def generate_report():
    report_path = generate_security_report()

    return {
        "status": "REPORT_GENERATED",
        "report": report_path
    }


async def automatic_file_monitor():

    file_path = "test_file.txt"

    if not os.path.exists(file_path):
        return

    last_hash = calculate_file_hash(file_path)

    while True:

        await asyncio.sleep(30)

        current_hash = calculate_file_hash(file_path)

        if current_hash != last_hash:

            from backend.alerts import create_alert

            create_alert(
                file_path,
                "MODIFIED"
            )

            last_hash = current_hash
