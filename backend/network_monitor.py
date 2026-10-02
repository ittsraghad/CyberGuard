
import subprocess


def get_network_connections() -> dict:
    result = subprocess.run(
        ["lsof", "-i", "-n", "-P"],
        capture_output=True,
        text=True
    )

    connections = []

    lines = result.stdout.splitlines()

    for line in lines[1:]:
        parts = line.split()

        if len(parts) < 9:
            continue

        process = parts[0]
        pid = parts[1]
        protocol = parts[7]

        connection = " ".join(parts[8:])

        status = "UNKNOWN"

        if "(ESTABLISHED)" in connection:
            status = "ESTABLISHED"
        elif "(LISTEN)" in connection:
            status = "LISTEN"
        elif "(CLOSED)" in connection:
            status = "CLOSED"

        connections.append({
            "process": process,
            "pid": pid,
            "protocol": protocol,
            "connection": connection,
            "status": status
        })

    # Remove duplicate connections
    unique_connections = []
    seen = set()

    for connection in connections:
        connection_key = (
            connection["process"],
            connection["pid"],
            connection["protocol"],
            connection["connection"],
            connection["status"]
        )

        if connection_key not in seen:
            seen.add(connection_key)
            unique_connections.append(connection)

    connections = unique_connections

    total = len(connections)

    active = sum(
        1
        for connection in connections
        if connection["status"] == "ESTABLISHED"
    )

    listening = sum(
        1
        for connection in connections
        if connection["status"] == "LISTEN"
    )

    other = total - active - listening

    return {
        "summary": {
            "total": total,
            "active": active,
            "listening": listening,
            "other": other
        },
        "connections": connections
    }
