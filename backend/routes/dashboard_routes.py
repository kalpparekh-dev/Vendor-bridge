from flask import Blueprint, jsonify
from database import get_connection
from models.activity_model import get_activities

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total FROM vendors")
    total_vendors = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as total FROM rfqs")
    total_rfqs = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as total FROM rfqs WHERE status = 'Open'")
    active_rfqs = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as total FROM quotations")
    total_quotations = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as total FROM approvals WHERE status = 'Approved'")
    approved_quotations = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as total FROM purchase_orders")
    total_purchase_orders = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as total FROM invoices")
    total_invoices = cursor.fetchone()["total"]

    cursor.execute("SELECT IFNULL(SUM(grand_total), 0) as total FROM invoices")
    total_spend = cursor.fetchone()["total"]

    conn.close()

    return jsonify({
        "total_vendors": total_vendors,
        "total_rfqs": total_rfqs,
        "active_rfqs": active_rfqs,
        "total_quotations": total_quotations,
        "approved_quotations": approved_quotations,
        "total_purchase_orders": total_purchase_orders,
        "total_invoices": total_invoices,
        "total_spend": total_spend
    }), 200

@dashboard_bp.route("/activities", methods=["GET"])
def activities():
    logs = get_activities()

    activity_list = []
    for log in logs:
        activity_list.append({
            "id": log["id"],
            "user_id": log["user_id"],
            "action": log["action"],
            "module": log["module"],
            "description": log["description"],
            "created_at": log["created_at"]
        })

    return jsonify(activity_list), 200