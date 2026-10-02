

import platform
import sys
import psutil


def get_system_info() -> dict:
    return {
        "operating_system": platform.system(),
        "os_version": platform.version(),
        "machine": platform.machine(),
        "python_version": sys.version.split()[0]
    }


def get_cpu_usage() -> dict:
    cpu_usage = psutil.cpu_percent(interval=1)

    return {
        "cpu_usage": cpu_usage
    }


def get_memory_usage() -> dict:
    memory = psutil.virtual_memory()

    return {
        "memory_usage": memory.percent
    }


def get_disk_usage() -> dict:
    disk = psutil.disk_usage("/")

    return {
        "disk_usage": disk.percent
    }
