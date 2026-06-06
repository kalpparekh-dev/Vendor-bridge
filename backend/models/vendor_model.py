from database import get_connection

def add_vendor(vendor_name, category, gst_number, email, phone, status):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO vendors (vendor_name, category, gst_number, email, phone, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (vendor_name, category, gst_number, email, phone, status))

    conn.commit()
    conn.close()


def get_all_vendors():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM vendors")
    vendors = cursor.fetchall()

    conn.close()
    return vendors