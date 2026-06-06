import os
import smtplib
from email.message import EmailMessage

def send_invoice_email(to_email, invoice):
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")

    if not smtp_email or not smtp_password:
        return {
            "success": True,
            "demo": True,
            "message": "Email simulated successfully. Add SMTP_EMAIL and SMTP_PASSWORD in .env for real email."
        }

    msg = EmailMessage()
    msg["Subject"] = f"Invoice {invoice['invoice_number']} - VendorBridge"
    msg["From"] = smtp_email
    msg["To"] = to_email

    msg.set_content(f"""
Dear Vendor,

Please find invoice details below:

Invoice Number: {invoice['invoice_number']}
PO Number: {invoice['po_number']}
Vendor: {invoice['vendor_name']}
Amount: Rs. {invoice['amount']}
GST: Rs. {invoice['tax']}
Grand Total: Rs. {invoice['grand_total']}

Regards,
VendorBridge ERP Team
""")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(smtp_email, smtp_password)
        smtp.send_message(msg)

    return {
        "success": True,
        "demo": False,
        "message": "Invoice email sent successfully"
    }