let currentTarget = 20;

// Fetch telemetry from backend
async function fetchTelemetry() {
    try {
        const res = await fetch("/devices/thermo-001/telemetry");

        if (!res.ok) {
            console.log("No telemetry yet");
            return;
        }

        const data = await res.json();

        document.getElementById("temp").textContent = data.temperature ?? "--";
        document.getElementById("hum").textContent = data.humidity ?? "--";
        document.getElementById("press").textContent = data.pressure ?? "--";

        document.getElementById("heat").textContent = data.heating ? "ON" : "OFF";
        document.getElementById("cool").textContent = data.cooling ? "ON" : "OFF";

        currentTarget = data.targetTemperature ?? 20;
        document.getElementById("target").textContent = currentTarget;
        document.getElementById("adjustValue").textContent = currentTarget;

    } catch (err) {
        console.error("Telemetry error:", err);
    }
}

// Send updated temperature to backend
async function updateTargetTemperature(newTemp) {
    currentTarget = newTemp;

    document.getElementById("adjustValue").textContent = newTemp;
    document.getElementById("target").textContent = newTemp;

    await fetch("/devices/thermo-001/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            targetTemperature: newTemp,
            mode: "MANUAL"
        })
    });
}

// Buttons
document.getElementById("minusBtn").onclick = () => updateTargetTemperature(currentTarget - 1);
document.getElementById("plusBtn").onclick = () => updateTargetTemperature(currentTarget + 1);

// Refresh every 2 sec
setInterval(fetchTelemetry, 2000);
fetchTelemetry();
