// Example live data updater
function updateTelemetry(t) {
    document.getElementById("temp").textContent = t.temperature ?? "--";
    document.getElementById("target").textContent = t.target ?? "--";
    document.getElementById("hum").textContent = t.humidity ?? "--";
    document.getElementById("press").textContent = t.pressure ?? "--";

    document.getElementById("heat").textContent = t.heating ? "ON" : "OFF";
    document.getElementById("cool").textContent = t.cooling ? "ON" : "OFF";

    document.getElementById("heat-dot").className = "dot " + (t.heating ? "on" : "off");
    document.getElementById("cool-dot").className = "dot " + (t.cooling ? "on" : "off");
}
