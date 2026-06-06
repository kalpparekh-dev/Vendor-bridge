from database import get_connection
from datetime import datetime

def generate_po(quotation_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM quotations WHERE id = ?
    """, (quotation_id,))
    quotation = cursor.fetchone()

    if not quotation:
        conn.close()
        return None

    if quotation["status"] != "Approved":
        conn.close()
        return "NOT_APPROVED"

    total_amount = quotation["price"]
    tax_amount = total_amount * 0.18
    grand_total = total_amount + tax_amount

    po_number = "PO-" + datetime.now().strftime("%Y%m%d%H%M%S")

    cursor.execute("""
        INSERT INTO purchase_orders
        (po_number, quotation_id, vendor_id, total_amount, tax_amount, grand_total)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        po_number,
        quotation_id,
        quotation["vendor_id"],
        total_amount,
        tax_amount,
        grand_total
    ))

    cursor.execute("""
        UPDATE rfqs
        SET status = 'PO Generated'
        WHERE id = ?
    """, (quotation["rfq_id"],))

    conn.commit()
    conn.close()

    return po_number

def get_all_pos():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            purchase_orders.*,
            vendors.vendor_name,
            quotations.rfq_id
        FROM purchase_orders
        JOIN vendors ON purchase_orders.vendor_id = vendors.id
        JOIN quotations ON purchase_orders.quotation_id = quotations.id
        ORDER BY purchase_orders.created_at DESC
    """)

    pos = cursor.fetchall()
    conn.close()
    return pos