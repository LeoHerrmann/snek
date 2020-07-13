# Removes all entries from the leaderboard

import os
import sqlite3

conn = sqlite3.connect("leaderboard.db")
cursor = conn.cursor()
cursor.execute("DELETE FROM leaderboard")
conn.commit()
conn.close()
