# 🛡️ CyberGuard

**Defensive Security Monitoring Dashboard**

CyberGuard is a Python-based defensive security monitoring dashboard that provides a centralized view of system security information, network activity, file integrity, security alerts, and security events.

## 🚀 Features

- 🖥️ System information monitoring
- 📊 CPU, memory, and disk usage monitoring
- 🌐 Network connection monitoring
- 🔐 Password strength checking
- 🛡️ File integrity monitoring using SHA-256
- 🚨 Security alert generation
- ⚡ Automatic file modification monitoring
- 📋 Security activity tracking
- 🗄️ SQLite security event database
- 📄 PDF security report generation
- 📈 Rule-based security risk indicators
- 🌐 Web-based security dashboard

## 🛠️ Technologies

- Python
- FastAPI
- Uvicorn
- HTML
- CSS
- JavaScript
- SQLite
- ReportLab
- psutil
- SHA-256

## 🏗️ Architecture

```text
Web Dashboard
      ↓
FastAPI REST API
      ↓
Security Monitoring
      ↓
System Checks
Network Monitoring
File Integrity
Security Alerts
Risk Indicators
      ↓
SQLite Database
      ↓
PDF Security Report

🔍 File Integrity Monitoring
CyberGuard uses SHA-256 hashing to detect changes to monitored files.
File
 ↓
SHA-256 Hash
 ↓
Baseline
 ↓
Periodic Check
 ↓
Hash Comparison
 ↓
UNCHANGED / MODIFIED
 ↓
Security Alert
 ↓
SQLite Event
📊 Security Risk Indicators
CyberGuard provides rule-based monitoring indicators based on current system security data.
Current project-defined rules include:
- Security alerts detected → High Risk Indicator
- CPU, memory, or disk usage ≥ 90% → Medium Risk Indicator
- 100 or more active network connections → Medium Risk Indicator
- No configured high-risk indicators → Normal
These indicators are monitoring signals and do not represent a complete security assessment or proof of compromise.
🗄️ Security Event Database
Detected security events can be stored in SQLite with:
- Event ID
- Event type
- File
- Status
- Severity
- Timestamp
📄 Security Reports
CyberGuard can generate PDF security reports containing:
- Report generation time
- Security alert count
- Detected security events
- File integrity information
📁 Project Structure
CyberGuard/
├── backend/
│   ├── alerts.py
│   ├── database.py
│   ├── file_integrity.py
│   ├── main.py
│   ├── network_monitor.py
│   ├── report_generator.py
│   ├── security_checks.py
│   └── system_checks.py
│
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── data/
├── reports/
├── test_file.txt
├── .gitignore
└── README.md

▶️ Run Locally
1. Clone the repository
git clone https://github.com/ittsraghad/CyberGuard.git
cd CyberGuard

2. Create a virtual environment
python3 -m venv venv

3. Activate the virtual environment
macOS / Linux:
source venv/bin/activate

4. Install dependencies
pip install fastapi uvicorn psutil reportlab

5. Start the backend
uvicorn backend.main:app --reload

The API will be available at:
http://127.0.0.1:8000

6. Start the frontend
Open another terminal:
python3 -m http.server 5500 --directory frontend

Then open:
http://127.0.0.1:5500/

🔐 Defensive Security Scope
CyberGuard is a defensive security monitoring project focused on:
- Monitoring
- Detection
- File integrity
- Security event logging
- System visibility
- Rule-based security indicators
It does not perform offensive security operations or unauthorized access.
⚠️ Limitations
CyberGuard is an educational portfolio project. It is not a replacement for a production SIEM, EDR, antivirus, or professional security monitoring platform.
The risk indicators are project-defined monitoring rules and should not be interpreted as proof of compromise.
🎯 Project Goal
The goal of CyberGuard is to demonstrate how Python, APIs, system monitoring, file integrity checking, databases, and web technologies can be combined to build a practical defensive security monitoring application.
👩‍💻 Author
Raghad
GitHub: https://github.com/ittsraghad