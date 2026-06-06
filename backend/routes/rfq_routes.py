
from flask import Blueprint, request, jsonify
from models.rfq_model import create_rfq, get_all_rfqs
from models.activity_model import add_activity

rfq_bp = Blueprint("rfq", __name__)

@rfq_bp.route("/rfqs", methods=["POST"])
def add_rfq():
    data = request.json

    title = data.get("title")
    description = data.get("description")
    quantity = data.get("quantity")
    deadline = data.get("deadline")
    created_by = data.get("created_by", 1)

    if not title or not description or not quantity or not deadline:
        return jsonify({"error": "All RFQ fields are required"}), 400

    create_rfq(title, description, quantity, deadline, created_by)
    add_activity(created_by, "CREATE", "RFQ", f"RFQ created: {title}")

    return jsonify({"message": "RFQ created successfully"}), 201

@rfq_bp.route("/rfqs", methods=["GET"])
def list_rfqs():
    rfqs = get_all_rfqs()

    rfq_list = []
    for rfq in rfqs:
        rfq_list.append({
            "id": rfq["id"],
            "title": rfq["title"],
            "description": rfq["description"],
            "quantity": rfq["quantity"],
            "deadline": rfq["deadline"],
            "status": rfq["status"],
            "created_by": rfq["created_by"],
            "created_at": rfq["created_at"]
        })

    return jsonify(rfq_list), 200