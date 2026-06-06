from database import get_connection

def add_activity(user_id, action, module, description):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO activity_logs (user_id, action, module, description)
        VALUES (?, ?, ?, ?)
    """, (user_id, action, module, description))

    conn.commit()
    conn.close()

def get_activities():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM activity_logs ORDER BY created_at DESC")
    logs = cursor.fetchall()

    conn.close()
    return logs