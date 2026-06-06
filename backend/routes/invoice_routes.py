from flask import Blueprint, request, jsonify, send_file
from models.invoice_model import generate_invoice, get_all_invoices, get_invoice_by_id
from models.activity_model import add_activity
from services.invoice_pdf_service import create_invoice_pdf
from services.email_service import send_invoice_email

invoice_bp = Blueprint("invoice", __name__)

@invoice_bp.route("/invoices", methods=["POST"])
def create_invoice():
    data = request.json

    po_id = data.get("po_id")
    user_id = data.get("user_id", 1)

    if not po_id:
        return jsonify({"error": "po_id is required"}), 400

    result = generate_invoice(po_id)

    if result is None:
        return jsonify({"error": "Purchase order not found"}), 404

    add_activity(user_id, "GENERATE", "INVOICE", f"Invoice generated for PO {po_id}")

    return jsonify({
        "message": "Invoice generated successfully",
        "invoice_number": result
    }), 201


@invoice_bp.route("/invoices", methods=["GET"])
def list_invoices():
    invoices = get_all_invoices()

    invoice_list = []
    for invoice in invoices:
        invoice_list.append({
            "id": invoice["id"],
            "invoice_number": invoice["invoice_number"],
            "po_id": invoice["po_id"],
            "po_number": invoice["po_number"],
            "vendor_id": invoice["vendor_id"],
            "vendor_name": invoice["vendor_name"],
            "vendor_email": invoice["vendor_email"],
            "amount": invoice["amount"],
            "tax": invoice["tax"],
            "grand_total": invoice["grand_total"],
            "status": invoice["status"],
            "created_at": invoice["created_at"]
        })

    return jsonify(invoice_list), 200


@invoice_bp.route("/invoices/<int:invoice_id>/pdf", methods=["GET"])
def download_invoice_pdf(invoice_id):
    invoice = get_invoice_by_id(invoice_id)

    if not invoice:
        return jsonify({"error": "Invoice not found"}), 404

    pdf_buffer = create_invoice_pdf(invoice)

    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"{invoice['invoice_number']}.pdf",
        mimetype="application/pdf"
    )


@invoice_bp.route("/invoices/<int:invoice_id>/email", methods=["POST"])
def email_invoice(invoice_id):
    data = request.json
    to_email = data.get("to_email")

    invoice = get_invoice_by_id(invoice_id)

    if not invoice:
        return jsonify({"error": "Invoice not found"}), 404

    if not to_email:
        to_email = invoice["vendor_email"]

    result = send_invoice_email(to_email, invoice)

    add_activity(
        1,
        "EMAIL",
        "INVOICE",
        f"Invoice {invoice['invoice_number']} emailed to {to_email}"
    )

    return jsonify(result), 200