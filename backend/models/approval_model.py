from database import get_connection

def create_approval(quotation_id, manager_id, status, remarks):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO approvals (quotation_id, manager_id, status, remarks)
        VALUES (?, ?, ?, ?)
    """, (quotation_id, manager_id, status, remarks))

    cursor.execute("""
        UPDATE quotations
        SET status = ?
        WHERE id = ?
    """, (status, quotation_id))

    conn.commit()
    conn.close()

def get_all_approvals():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            approvals.*,
            quotations.rfq_id,
            quotations.vendor_id,
            quotations.price,
            quotations.delivery_days,
            vendors.vendor_name
        FROM approvals
        JOIN quotations ON approvals.quotation_id = quotations.id
        JOIN vendors ON quotations.vendor_id = vendors.id
        ORDER BY approvals.approved_at DESC
    """)

    approvals = cursor.fetchall()
    conn.close()
    return approvals