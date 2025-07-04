
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import analyze_risk

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json.get("employees")
    if not data:
        return jsonify({"error": "No data provided"}), 400
    results = analyze_risk(data)
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
