from flask import Blueprint, request, jsonify
from models.vendor_model import add_vendor, get_all_vendors
from models.activity_model import add_activity

vendor_bp = Blueprint("vendor", __name__)

@vendor_bp.route("/vendors", methods=["POST"])
def create_vendor():
    data = request.json

    vendor_name = data.get("vendor_name")
    category = data.get("category")
    gst_number = data.get("gst_number")
    email = data.get("email")
    phone = data.get("phone")
    status = data.get("status", "Active")
    rating = data.get("rating", 4)

    if not vendor_name or not category or not email:
        return jsonify({"error": "Vendor name, category and email are required"}), 400

    add_vendor(vendor_name, category, gst_number, email, phone, status, rating)
    add_activity(1, "CREATE", "VENDOR", f"Vendor added: {vendor_name}")

    return jsonify({"message": "Vendor added successfully"}), 201

@vendor_bp.route("/vendors", methods=["GET"])
def list_vendors():
    vendors = get_all_vendors()

    vendor_list = []
    for vendor in vendors:
        vendor_list.append({
            "id": vendor["id"],
            "vendor_name": vendor["vendor_name"],
            "category": vendor["category"],
            "gst_number": vendor["gst_number"],
            "email": vendor["email"],
            "phone": vendor["phone"],
            "status": vendor["status"],
            "rating": vendor["rating"]
        })

    return jsonify(vendor_list), 200