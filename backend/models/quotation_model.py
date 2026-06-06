from database import get_connection

def create_quotation(rfq_id, vendor_id, price, delivery_days, notes):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO quotations (rfq_id, vendor_id, price, delivery_days, notes)
        VALUES (?, ?, ?, ?, ?)
    """, (rfq_id, vendor_id, price, delivery_days, notes))

    cursor.execute("""
        UPDATE rfqs
        SET status = 'Quotation Received'
        WHERE id = ?
    """, (rfq_id,))

    conn.commit()
    conn.close()

def get_all_quotations():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            quotations.*,
            vendors.vendor_name,
            vendors.rating
        FROM quotations
        JOIN vendors ON quotations.vendor_id = vendors.id
        ORDER BY quotations.created_at DESC
    """)

    quotations = cursor.fetchall()
    conn.close()
    return quotations