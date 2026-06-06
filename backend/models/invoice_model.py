from database import get_connection
from datetime import datetime

def generate_invoice(po_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM purchase_orders WHERE id = ?
    """, (po_id,))
    po = cursor.fetchone()

    if not po:
        conn.close()
        return None

    invoice_number = "INV-" + datetime.now().strftime("%Y%m%d%H%M%S")

    cursor.execute("""
        INSERT INTO invoices
        (invoice_number, po_id, vendor_id, amount, tax, grand_total)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        invoice_number,
        po_id,
        po["vendor_id"],
        po["total_amount"],
        po["tax_amount"],
        po["grand_total"]
    ))

    conn.commit()
    conn.close()

    return invoice_number

def get_all_invoices():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            invoices.*,
            vendors.vendor_name,
            purchase_orders.po_number
        FROM invoices
        JOIN vendors ON invoices.vendor_id = vendors.id
        JOIN purchase_orders ON invoices.po_id = purchase_orders.id
        ORDER BY invoices.created_at DESC
    """)

    invoices = cursor.fetchall()
    conn.close()
    return invoices