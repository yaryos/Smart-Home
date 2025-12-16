let currentDevice = "thermo-001";
let currentTarget = 20;

// Chart.js setup
const ctx = document.getElementById("tempChart");
let tempChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Temperature (°C)",
            data: [],
            borderColor: "#ff6f00",
            backgroundColor: "rgba(255,111,0,0.2)",
            borderWidth: 2
        }]
    }
});

// Fetch telemetry
async function fetchTelemetry() {
    try {
        const res = await fetch(`/devices/${currentDevice}/telemetry`);
        if (!res.ok) return;

        const data = await res.json();

        document.getElementById("deviceName").textContent = currentDevice;
        document.getElementById("temp").textContent = data.temperature ?? "--";
        document.getElementById("hum").textContent = data.humidity ?? "--";
        document.getElementById("press").textContent = data.pressure ?? "--";

        // Indicators
        const heat = document.getElementById("heat");
        const cool = document.getElementById("cool");

        heat.textContent = data.heating ? "ON" : "OFF";
        cool.textContent = data.cooling ? "ON" : "OFF";

        heat.className = data.heating ? "status-dot heating-on" : "status-dot";
        cool.className = data.cooling ? "status-dot cooling-on" : "status-dot";

        currentTarget = data.targetTemperature ?? 20;
        document.getElementById("target").textContent = currentTarget;
        document.getElementById("adjustValue").textContent = currentTarget;

        // Push to graph
        updateGraph(data.temperature);

    } catch (err) {
        console.error("Telemetry error:", err);
    }
}

// Update temperature graph
function updateGraph(temp) {
    if (temp === undefined) return;
    tempChart.data.labels.push("");
    tempChart.data.datasets[0].data.push(temp);
    tempChart.update();
}

// Update target temperature
async function updateTargetTemperature(newTemp) {
    currentTarget = newTemp;

    document.getElementById("adjustValue").textContent = newTemp;
    document.getElementById("target").textContent = newTemp;

    await fetch(`/devices/${currentDevice}/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTemperature: newTemp })
    });
}

// Button actions
document.getElementById("minusBtn").onclick = () => updateTargetTemperature(currentTarget - 1);
document.getElementById("plusBtn").onclick = () => updateTargetTemperature(currentTarget + 1);

// Device selector
document.getElementById("deviceSelect").onchange = (e) => {
    currentDevice = e.target.value;
};

// Refresh every 2 seconds
setInterval(fetchTelemetry, 2000);
fetchTelemetry();
