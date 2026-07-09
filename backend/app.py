from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

tasks = [
    {
        "id": 1,
        "title": "Study APis",
        "done": False
    }
]

@app.route("/tasks")
def get_tasks():
    return jsonify(tasks)

if __name__ == "__main__":
    app.run(debug=True)