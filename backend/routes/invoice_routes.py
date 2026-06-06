from flask import Blueprint, request, jsonify
from models.invoice_model import generate_invoice, get_all_invoices
from models.activity_model import add_activity

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
            "amount": invoice["amount"],
            "tax": invoice["tax"],
            "grand_total": invoice["grand_total"],
            "status": invoice["status"],
            "created_at": invoice["created_at"]
        })

    return jsonify(invoice_list), 200