
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

import json
import os
from datetime import datetime


def generate_security_report() -> str:
    reports_folder = "reports"

    os.makedirs(reports_folder, exist_ok=True)

    report_time = datetime.now()

    file_name = (
        f"security_report_"
        f"{report_time.strftime('%Y%m%d_%H%M%S')}.pdf"
    )

    report_path = os.path.join(
        reports_folder,
        file_name
    )

    # Load security alerts
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

    # Create PDF
    pdf = canvas.Canvas(
        report_path,
        pagesize=A4
    )

    width, height = A4

    y = height - 50

    # Report title
    pdf.setFont("Helvetica-Bold", 20)

    pdf.drawString(
        50,
        y,
        "CyberGuard Security Report"
    )

    y -= 35

    pdf.setFont("Helvetica", 11)

    pdf.drawString(
        50,
        y,
        f"Generated: {report_time.strftime('%Y-%m-%d %H:%M:%S')}"
    )

    y -= 40

    # Security overview
    pdf.setFont("Helvetica-Bold", 14)

    pdf.drawString(
        50,
        y,
        "Security Overview"
    )

    y -= 25

    pdf.setFont("Helvetica", 11)

    pdf.drawString(
        50,
        y,
        f"Security Alerts: {len(alerts)}"
    )

    y -= 20

    if len(alerts) == 0:

        pdf.drawString(
            50,
            y,
            "No security alerts detected."
        )

        y -= 30

    else:

        pdf.drawString(
            50,
            y,
            "Detected Security Events:"
        )

        y -= 20

        for alert in alerts:

            text = (
                f"- {alert.get('severity', 'UNKNOWN')} | "
                f"{alert.get('type', 'UNKNOWN')} | "
                f"{alert.get('status', 'UNKNOWN')}"
            )

            pdf.drawString(
                60,
                y,
                text
            )

            y -= 18

            pdf.drawString(
                60,
                y,
                f"File: {alert.get('file', 'N/A')}"
            )

            y -= 18

            pdf.drawString(
                60,
                y,
                f"Time: {alert.get('timestamp', 'N/A')}"
            )

            y -= 25

            if y < 70:
                pdf.showPage()
                y = height - 50
                pdf.setFont("Helvetica", 11)

    # File Integrity section
    pdf.setFont("Helvetica-Bold", 14)

    pdf.drawString(
        50,
        y,
        "File Integrity Monitoring"
    )

    y -= 25

    pdf.setFont("Helvetica", 11)

    if alerts:

        pdf.drawString(
            50,
            y,
            "File integrity events are included in the security events above."
        )

    else:

        pdf.drawString(
            50,
            y,
            "No file integrity alerts recorded."
        )

    y -= 35

    # Footer
    pdf.setFont("Helvetica", 9)

    pdf.drawString(
        50,
        40,
        "CyberGuard - Defensive Security Monitoring Dashboard"
    )

    pdf.save()

    return report_path
