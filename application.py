import os
from flask import Flask, render_template, request
import sqlite3
import json



app = Flask(__name__)

@app.route("/")
def index():
        return render_template("index.html")



@app.route("/service_worker.js")
def serviceWorker():
    return app.send_static_file("service_worker.js")



@app.route("/topten")
def topten():
        conn = sqlite3.connect(os.path.dirname(__file__) + "/leaderboard.db")
        cursor = conn.cursor()
        cursor.execute("SELECT name, score FROM leaderboard ORDER BY score DESC, rowid DESC")
        rows = cursor.fetchall()
        conn.close()

        for i in range(len(rows)):
                rows[i] = list(rows[i])

        return str(rows).replace("\'", "\"")



@app.route("/enterLeaderboard", methods=["POST"])
def enterLeaderboard():
        data = json.loads(str(request.get_data(as_text=True)))
        name = data["name"]
        score = data["score"]
        valid = True
        allowedCharacters = "abcdefghifklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

        if len(name) == 0 or len(name) > 30:
                valid = False

        for letter in name:
                if letter not in allowedCharacters:
                        valid = False

        if int(score) != score:
                valid = False

        if valid:
                conn = sqlite3.connect(os.path.dirname(__file__) + "/leaderboard.db")
                cursor = conn.cursor()
                cursor.execute("INSERT INTO leaderboard (name, score) VALUES (?,?)", (name, score))
                cursor.execute("DELETE FROM leaderboard WHERE rowid NOT IN (SELECT rowid FROM leaderboard ORDER BY score DESC, rowid DESC LIMIT 10)")
                conn.commit()
                conn.close()

        return ("", 204)
