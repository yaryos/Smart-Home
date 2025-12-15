from flask import Flask, request, jsonify

app = Flask(__name__)

devices = [
    {"deviceId": "thermo-001", "location": "Living Room", "status": "online"},
    {"deviceId": "thermo-002", "location": "Bedroom", "status": "offline"}
]

configurations = {
    "thermo-001": {"targetTemperature": 22, "mode": "AUTO"},
    "thermo-002": {"targetTemperature": 20, "mode": "MANUAL"}
}


@app.route("/devices", methods=["GET"])
def get_devices():
    return jsonify(devices)


@app.route("/devices/<deviceId>/telemetry", methods=["POST"])
def send_telemetry(deviceId):
    data = request.json
    print(f"Telemetry from {deviceId}: {data}")
    return {"status": "ok"}, 200


@app.route("/devices/<deviceId>/config", methods=["GET"])
def get_config(deviceId):
    return jsonify(configurations.get(deviceId, {}))


@app.route("/devices/<deviceId>/config", methods=["PUT"])
def update_config(deviceId):
    new_config = request.json
    configurations[deviceId] = new_config
    return {"status": "updated"}, 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
