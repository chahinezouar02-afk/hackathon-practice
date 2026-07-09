from flask import Flask, jsonify, request
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

@app.route("/tasks", methods=["POST"])
def add_task():
    new_task = request.json

    tasks.append(new_task)

    return jsonify(new_task), 201

if __name__ == "__main__":
    app.run(debug=True)