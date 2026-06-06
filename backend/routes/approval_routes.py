from flask import Blueprint, request, jsonify
from models.approval_model import create_approval, get_all_approvals
from models.activity_model import add_activity

approval_bp = Blueprint("approval", __name__)

@approval_bp.route("/approvals", methods=["POST"])
def add_approval():
    data = request.json

    quotation_id = data.get("quotation_id")
    manager_id = data.get("manager_id", 1)
    status = data.get("status")
    remarks = data.get("remarks", "")

    if not quotation_id or not status:
        return jsonify({"error": "quotation_id and status are required"}), 400

    if status not in ["Approved", "Rejected"]:
        return jsonify({"error": "Status must be Approved or Rejected"}), 400

    create_approval(quotation_id, manager_id, status, remarks)
    add_activity(manager_id, status.upper(), "APPROVAL", f"Quotation {quotation_id} has been {status}")

    return jsonify({"message": f"Quotation {status} successfully"}), 201

@approval_bp.route("/approvals", methods=["GET"])
def list_approvals():
    approvals = get_all_approvals()

    approval_list = []
    for a in approvals:
        approval_list.append({
            "id": a["id"],
            "quotation_id": a["quotation_id"],
            "rfq_id": a["rfq_id"],
            "vendor_id": a["vendor_id"],
            "vendor_name": a["vendor_name"],
            "price": a["price"],
            "delivery_days": a["delivery_days"],
            "manager_id": a["manager_id"],
            "status": a["status"],
            "remarks": a["remarks"],
            "approved_at": a["approved_at"]
        })

    return jsonify(approval_list), 200