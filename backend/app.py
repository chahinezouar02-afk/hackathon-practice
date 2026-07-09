from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)


def get_db():
    conn = sqlite3.connect("tasks.db")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()


@app.route("/tasks")
def get_tasks():
    conn = get_db()

    tasks = conn.execute(
        "SELECT * FROM tasks"
    ).fetchall()

    conn.close()

    return jsonify([
        {
            "id": task["id"],
            "title": task["title"],
            "done": bool(task["done"])
        }
        for task in tasks
    ])


@app.route("/tasks", methods=["POST"])
def add_task():
    new_task = request.json

    conn = get_db()

    cursor = conn.execute(
        "INSERT INTO tasks (title, done) VALUES (?, ?)",
        (
            new_task["title"],
            new_task["done"]
        )
    )

    conn.commit()

    task_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "id": task_id,
        "title": new_task["title"],
        "done": new_task["done"]
    }), 201

@app.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    data = request.json

    conn = get_db()

    conn.execute(
        """
        UPDATE tasks
        SET title = ?, done = ?
        WHERE id = ?
        """,
        (
            data["title"],
            data["done"],
            id
        )
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Task updated"
    })

@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):

    conn = get_db()

    conn.execute(
        "DELETE FROM tasks WHERE id = ?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message":"Task deleted"
    })

if __name__ == "__main__":
    init_db()
    app.run(debug=True)