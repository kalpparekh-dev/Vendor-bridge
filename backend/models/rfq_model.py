from database import get_connection

def create_rfq(title, description, quantity, deadline, created_by):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO rfqs (title, description, quantity, deadline, created_by)
        VALUES (?, ?, ?, ?, ?)
    """, (title, description, quantity, deadline, created_by))

    conn.commit()
    conn.close()


def get_all_rfqs():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM rfqs ORDER BY created_at DESC")
    rfqs = cursor.fetchall()

    conn.close()
    return rfqs