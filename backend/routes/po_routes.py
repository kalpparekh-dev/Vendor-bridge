from flask import Blueprint, request, jsonify
from models.po_model import generate_po, get_all_pos
from models.activity_model import add_activity

po_bp = Blueprint("po", __name__)

@po_bp.route("/purchase-orders", methods=["POST"])
def create_purchase_order():
    data = request.json

    quotation_id = data.get("quotation_id")
    user_id = data.get("user_id", 1)

    if not quotation_id:
        return jsonify({"error": "quotation_id is required"}), 400

    result = generate_po(quotation_id)

    if result is None:
        return jsonify({"error": "Quotation not found"}), 404

    if result == "NOT_APPROVED":
        return jsonify({"error": "Quotation must be approved before PO generation"}), 400

    add_activity(user_id, "GENERATE", "PURCHASE ORDER", f"PO generated for quotation {quotation_id}")

    return jsonify({
        "message": "Purchase Order generated successfully",
        "po_number": result
    }), 201

@po_bp.route("/purchase-orders", methods=["GET"])
def list_purchase_orders():
    pos = get_all_pos()

    po_list = []
    for po in pos:
        po_list.append({
            "id": po["id"],
            "po_number": po["po_number"],
            "quotation_id": po["quotation_id"],
            "rfq_id": po["rfq_id"],
            "vendor_id": po["vendor_id"],
            "vendor_name": po["vendor_name"],
            "total_amount": po["total_amount"],
            "tax_amount": po["tax_amount"],
            "grand_total": po["grand_total"],
            "status": po["status"],
            "created_at": po["created_at"]
        })

    return jsonify(po_list), 200