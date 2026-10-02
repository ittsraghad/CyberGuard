

const API_URL = window.location.origin;

async function loadSystemInfo() {
    try {
        const response = await fetch(
            `${API_URL}/security/system-check`
        );

        const data = await response.json();

        document.getElementById("system-status").textContent =
            data.operating_system;

        document.getElementById("system-info").innerHTML = `
            <div><strong>Operating System:</strong> ${data.operating_system}</div>
            <div><strong>OS Version:</strong> ${data.os_version}</div>
            <div><strong>Machine:</strong> ${data.machine}</div>
            <div><strong>Python Version:</strong> ${data.python_version}</div>
        `;

    } catch (error) {
        document.getElementById("system-status").textContent =
            "Unavailable";

        document.getElementById("system-info").textContent =
            "Unable to connect to CyberGuard API.";
    }
}


async function loadNetworkConnections() {
    try {
        const response = await fetch(
            `${API_URL}/security/network-monitor`
        );

        const data = await response.json();

        const summary = data.summary;
        const connections = data.connections;

        document.getElementById("network-count").textContent =
            `${summary.total} connections`;

        const container =
            document.getElementById("network-connections");

        const importantConnections = connections
            .filter(connection =>
                connection.status === "ESTABLISHED" ||
                connection.status === "LISTEN"
            )
            .slice(0, 10);

        container.innerHTML = `
            <div class="network-summary">

                <div class="network-stat">
                    <span>Total</span>
                    <strong>${summary.total}</strong>
                </div>

                <div class="network-stat">
                    <span>Active</span>
                    <strong>${summary.active}</strong>
                </div>

                <div class="network-stat">
                    <span>Listening</span>
                    <strong>${summary.listening}</strong>
                </div>

                <div class="network-stat">
                    <span>Other</span>
                    <strong>${summary.other}</strong>
                </div>

            </div>

            <h3 class="network-subtitle">
                Active & Listening Connections
            </h3>

            <div class="network-table-wrapper">

                <table class="network-table">

                    <thead>
                        <tr>
                            <th>Process</th>
                            <th>PID</th>
                            <th>Protocol</th>
                            <th>Connection</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${importantConnections.map(connection => `
                            <tr>
                                <td>${connection.process}</td>
                                <td>${connection.pid}</td>
                                <td>${connection.protocol}</td>
                                <td>${connection.connection}</td>
                                <td>${connection.status}</td>
                            </tr>
                        `).join("")}

                    </tbody>

                </table>

            </div>

            <p class="network-note">
                Showing the 10 most relevant active or listening connections.
            </p>
        `;

    } catch (error) {
        document.getElementById("network-count").textContent =
            "Unavailable";

        document.getElementById("network-connections").textContent =
            "Unable to load network connections.";
    }
}


async function loadAlerts() {
    try {
        const response = await fetch(
            `${API_URL}/security/alerts`
        );

        const alerts = await response.json();

        const alertText =
            alerts.length === 1 ? "alert" : "alerts";

        document.getElementById("alert-count").textContent =
            `${alerts.length} ${alertText}`;

        const container =
            document.getElementById("alerts-container");

        if (alerts.length === 0) {
            container.innerHTML = `
                <p>No security alerts detected.</p>
            `;
            return;
        }

        container.innerHTML = alerts.map(alert => `
            <div class="alert">

                <strong>
                    ${alert.severity} - ${alert.type}
                </strong>

                <p>
                    <strong>File:</strong> ${alert.file}
                </p>

                <p>
                    <strong>Status:</strong> ${alert.status}
                </p>

                <p>
                    <strong>Time:</strong> ${alert.timestamp}
                </p>

            </div>
        `).join("");

    } catch (error) {
        document.getElementById("alert-count").textContent =
            "Unavailable";

        document.getElementById("alerts-container").textContent =
            "Unable to load security alerts.";
    }
}


async function createBaseline() {
    const filePath = "test_file.txt";

    try {
        const response = await fetch(
            `${API_URL}/security/file-baseline`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    file_path: filePath
                })
            }
        );

        const data = await response.json();

        document.getElementById("file-result").innerHTML = `
            <strong>File:</strong> ${data.file}<br>
            <strong>Status:</strong> ${data.status}<br>
            <strong>SHA-256:</strong> ${data.sha256}
        `;

    } catch (error) {
        document.getElementById("file-result").textContent =
            "Unable to create file baseline.";
    }
}


async function checkFileIntegrity() {
    const filePath = "test_file.txt";

    try {
        const response = await fetch(
            `${API_URL}/security/file-integrity`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    file_path: filePath
                })
            }
        );

        const data = await response.json();

        document.getElementById("file-result").innerHTML = `
            <strong>File:</strong> ${data.file}<br>
            <strong>Status:</strong> ${data.status}<br>
            <strong>Original Hash:</strong> ${data.original_hash}<br>
            <strong>Current Hash:</strong> ${data.current_hash}
        `;

        await loadAlerts();
        await loadSecurityActivity();
        await loadSecuritySummary();
        await loadDatabaseEvents();
        await loadRiskIndicators();

    } catch (error) {
        document.getElementById("file-result").textContent =
            "Unable to check file integrity.";
    }
}


/* Password Strength Checker */

async function checkPasswordStrength() {
    const password =
        document.getElementById("password-input").value;

    const resultContainer =
        document.getElementById("password-result");

    if (!password) {
        resultContainer.innerHTML = `
            <strong>Please enter a password to check.</strong>
        `;
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/security/password-check`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    password: password
                })
            }
        );

        const data = await response.json();

        resultContainer.innerHTML = `
            <div>
                <strong>Strength:</strong> ${data.strength}
            </div>

            <div>
                <strong>Score:</strong> ${data.score}/5
            </div>

            <br>

            <div>
                <strong>Minimum Length:</strong>
                ${data.checks.minimum_length
                    ? "✓ Passed"
                    : "✗ Failed"}
            </div>

            <div>
                <strong>Uppercase:</strong>
                ${data.checks.uppercase
                    ? "✓ Passed"
                    : "✗ Failed"}
            </div>

            <div>
                <strong>Lowercase:</strong>
                ${data.checks.lowercase
                    ? "✓ Passed"
                    : "✗ Failed"}
            </div>

            <div>
                <strong>Number:</strong>
                ${data.checks.number
                    ? "✓ Passed"
                    : "✗ Failed"}
            </div>

            <div>
                <strong>Special Character:</strong>
                ${data.checks.special_character
                    ? "✓ Passed"
                    : "✗ Failed"}
            </div>
        `;

        /*
         * Clear the password from the input after checking.
         * The password is not stored by CyberGuard.
         */

        document.getElementById("password-input").value = "";

    } catch (error) {
        resultContainer.textContent =
            "Unable to check password strength.";
    }
}


/* Security Dashboard Summary */

async function loadSecuritySummary() {
    try {
        const [
            systemResponse,
            networkResponse,
            alertsResponse,
            cpuResponse,
            memoryResponse,
            diskResponse
        ] = await Promise.all([

            fetch(`${API_URL}/security/system-check`),

            fetch(`${API_URL}/security/network-monitor`),

            fetch(`${API_URL}/security/alerts`),

            fetch(`${API_URL}/security/cpu`),

            fetch(`${API_URL}/security/memory`),

            fetch(`${API_URL}/security/disk`)
        ]);

        const systemData =
            await systemResponse.json();

        const networkData =
            await networkResponse.json();

        const alerts =
            await alertsResponse.json();

        const cpuData =
            await cpuResponse.json();

        const memoryData =
            await memoryResponse.json();

        const diskData =
            await diskResponse.json();


        document.getElementById("summary-system").textContent =
            systemData.operating_system;


        document.getElementById("summary-network").textContent =
            `${networkData.summary.active} active`;


        document.getElementById("summary-file").textContent =
            "Manual Check";


        document.getElementById("summary-alerts").textContent =
            `${alerts.length} alerts`;


        document.getElementById("summary-cpu").textContent =
            `${cpuData.cpu_usage}%`;


        document.getElementById("summary-memory").textContent =
            `${memoryData.memory_usage}%`;


        document.getElementById("summary-disk").textContent =
            `${diskData.disk_usage}%`;


        if (alerts.length === 0) {

            document.getElementById(
                "overall-security-status"
            ).textContent =
                "Monitoring Active — No security alerts detected.";

        } else {

            document.getElementById(
                "overall-security-status"
            ).textContent =
                `${alerts.length} security alert(s) detected. Review required.`;
        }

    } catch (error) {

        document.getElementById(
            "overall-security-status"
        ).textContent =
            "Unable to evaluate security status.";
    }
}


/* Security Risk Indicators */

async function loadRiskIndicators() {

    try {

        const [
            networkResponse,
            alertsResponse,
            cpuResponse,
            memoryResponse,
            diskResponse
        ] = await Promise.all([

            fetch(`${API_URL}/security/network-monitor`),

            fetch(`${API_URL}/security/alerts`),

            fetch(`${API_URL}/security/cpu`),

            fetch(`${API_URL}/security/memory`),

            fetch(`${API_URL}/security/disk`)
        ]);


        const networkData =
            await networkResponse.json();

        const alerts =
            await alertsResponse.json();

        const cpuData =
            await cpuResponse.json();

        const memoryData =
            await memoryResponse.json();

        const diskData =
            await diskResponse.json();


        const cpu =
            cpuData.cpu_usage;

        const memory =
            memoryData.memory_usage;

        const disk =
            diskData.disk_usage;

        const activeConnections =
            networkData.summary.active;


        /*
         * Security Risk Rules
         *
         * These are project-defined monitoring indicators.
         * They do not represent a complete security assessment.
         */

        const hasAlerts =
            alerts.length > 0;

        const highResources =
            cpu >= 90 ||
            memory >= 90 ||
            disk >= 90;

        const highNetworkActivity =
            activeConnections >= 100;


        let overallRisk = "NORMAL";


        if (hasAlerts) {

            overallRisk = "HIGH";

        } else if (
            highResources ||
            highNetworkActivity
        ) {

            overallRisk = "MEDIUM";
        }


        /*
         * Overall Risk
         */

        document.getElementById(
            "risk-overall"
        ).textContent = overallRisk;


        /*
         * Security Alerts
         */

        document.getElementById(
            "risk-alerts"
        ).textContent =
            hasAlerts
                ? "HIGH"
                : "NORMAL";


        /*
         * System Resources
         */

        document.getElementById(
            "risk-resources"
        ).textContent =
            highResources
                ? "MEDIUM"
                : "NORMAL";


        /*
         * Network Activity
         */

        document.getElementById(
            "risk-network"
        ).textContent =
            highNetworkActivity
                ? "MEDIUM"
                : "NORMAL";


        /*
         * Explanation
         */

        const message =
            document.getElementById(
                "risk-message"
            );


        if (overallRisk === "HIGH") {

            message.innerHTML = `
                <p>
                    <strong>High Risk Indicator:</strong>
                    Security alerts have been detected.
                    Review the Security Alerts and Security Activity sections.
                </p>
            `;

        } else if (overallRisk === "MEDIUM") {

            message.innerHTML = `
                <p>
                    <strong>Medium Risk Indicator:</strong>
                    Elevated system or network activity has been detected.
                </p>
            `;

        } else {

            message.innerHTML = `
                <p>
                    <strong>Normal:</strong>
                    No configured high-risk indicators were detected.
                </p>
            `;
        }


    } catch (error) {

        document.getElementById(
            "risk-overall"
        ).textContent =
            "Unavailable";

        document.getElementById(
            "risk-message"
        ).textContent =
            "Unable to evaluate security risk indicators.";
    }
}


/* Security Activity */

async function loadSecurityActivity() {

    try {

        const response = await fetch(
            `${API_URL}/security/activity`
        );

        const activities = await response.json();

        const container =
            document.getElementById("security-activity");


        if (activities.length === 0) {

            container.innerHTML = `
                <p>No security activity recorded.</p>
            `;

            return;
        }


        container.innerHTML = activities.map(activity => `
            <div class="alert">

                <strong>
                    ${activity.severity} - ${activity.type}
                </strong>

                <p>
                    <strong>File:</strong>
                    ${activity.file}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${activity.status}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${activity.timestamp}
                </p>

            </div>
        `).join("");


    } catch (error) {

        document.getElementById(
            "security-activity"
        ).textContent =
            "Unable to load security activity.";
    }
}


/* SQLite Database Security Events */

async function loadDatabaseEvents() {

    try {

        const response = await fetch(
            `${API_URL}/security/database-events`
        );

        const events = await response.json();

        const container =
            document.getElementById("database-events");


        if (events.length === 0) {

            container.innerHTML = `
                <p>No database security events recorded.</p>
            `;

            return;
        }


        container.innerHTML = `
            <div class="network-table-wrapper">

                <table class="network-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>File</th>
                            <th>Status</th>
                            <th>Severity</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${events.map(event => `
                            <tr>
                                <td>${event.id}</td>
                                <td>${event.type}</td>
                                <td>${event.file}</td>
                                <td>${event.status}</td>
                                <td>${event.severity}</td>
                                <td>${event.timestamp}</td>
                            </tr>
                        `).join("")}

                    </tbody>

                </table>

            </div>
        `;

    } catch (error) {

        document.getElementById(
            "database-events"
        ).textContent =
            "Unable to load database security events.";
    }
}


/* Security Report Generator */

async function generateSecurityReport() {

    const resultContainer =
        document.getElementById("report-result");

    resultContainer.textContent =
        "Generating security report...";

    try {

        const response = await fetch(
            `${API_URL}/security/generate-report`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (data.status === "REPORT_GENERATED") {

            resultContainer.innerHTML = `
                <strong>Report generated successfully.</strong>
                <br><br>
                <strong>File:</strong>
                ${data.report}
            `;

        } else {

            resultContainer.textContent =
                "Unable to generate security report.";

        }

    } catch (error) {

        resultContainer.textContent =
            "Unable to connect to CyberGuard API.";

    }
}


/* Load dashboard data */

loadSystemInfo();

loadNetworkConnections();

loadAlerts();

loadSecuritySummary();

loadSecurityActivity();

loadDatabaseEvents();

loadRiskIndicators();
