import hashlib
import json
import os

from backend.alerts import create_alert


def calculate_file_hash(file_path: str) -> str:
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:
        while True:
            chunk = file.read(4096)

            if not chunk:
                break

            sha256.update(chunk)

    return sha256.hexdigest()


def save_baseline(file_path: str, file_hash: str) -> None:
    baseline_file = "data/integrity_baseline.json"

    if os.path.exists(baseline_file):
        with open(baseline_file, "r") as file:
            content = file.read()

        if content.strip():
            baseline = json.loads(content)
        else:
            baseline = {}
    else:
        baseline = {}

    baseline[file_path] = file_hash

    with open(baseline_file, "w") as file:
        json.dump(baseline, file, indent=4)


def check_file_integrity(file_path: str) -> dict:
    baseline_file = "data/integrity_baseline.json"

    if not os.path.exists(baseline_file):
        return {
            "status": "NO_BASELINE",
            "message": "No baseline exists for this file."
        }

    with open(baseline_file, "r") as file:
        content = file.read()

    if not content.strip():
        return {
            "status": "NO_BASELINE",
            "message": "Baseline file is empty."
        }

    baseline = json.loads(content)

    if file_path not in baseline:
        return {
            "status": "NOT_MONITORED",
            "message": "This file is not being monitored yet."
        }

    current_hash = calculate_file_hash(file_path)
    original_hash = baseline[file_path]

    if current_hash == original_hash:
        status = "UNCHANGED"
    else:
        status = "MODIFIED"
        create_alert(file_path, status)

    return {
        "file": file_path,
        "status": status,
        "original_hash": original_hash,
        "current_hash": current_hash
    }