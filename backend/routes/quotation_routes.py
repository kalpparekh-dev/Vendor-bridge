from flask import Blueprint, request, jsonify
from models.quotation_model import create_quotation, get_all_quotations
from models.activity_model import add_activity

quotation_bp = Blueprint("quotation", __name__)

@quotation_bp.route("/quotations", methods=["POST"])
def add_quotation():
    data = request.json

    rfq_id = data.get("rfq_id")
    vendor_id = data.get("vendor_id")
    price = data.get("price")
    delivery_days = data.get("delivery_days")
    notes = data.get("notes")

    if not rfq_id or not vendor_id or not price or not delivery_days:
        return jsonify({"error": "rfq_id, vendor_id, price and delivery_days are required"}), 400

    create_quotation(rfq_id, vendor_id, price, delivery_days, notes)
    add_activity(vendor_id, "SUBMIT", "QUOTATION", f"Quotation submitted for RFQ {rfq_id}")

    return jsonify({"message": "Quotation submitted successfully"}), 201

@quotation_bp.route("/quotations", methods=["GET"])
def list_quotations():
    quotations = get_all_quotations()

    quotation_list = []
    for q in quotations:
        quotation_list.append({
            "id": q["id"],
            "rfq_id": q["rfq_id"],
            "vendor_id": q["vendor_id"],
            "vendor_name": q["vendor_name"],
            "rating": q["rating"],
            "price": q["price"],
            "delivery_days": q["delivery_days"],
            "notes": q["notes"],
            "status": q["status"],
            "created_at": q["created_at"]
        })

    return jsonify(quotation_list), 200

@quotation_bp.route("/quotations/compare/<int:rfq_id>", methods=["GET"])
def compare_quotations(rfq_id):
    quotations = get_all_quotations()

    filtered = []

    for q in quotations:
        if q["rfq_id"] == rfq_id:
            filtered.append({
                "quotation_id": q["id"],
                "vendor_id": q["vendor_id"],
                "vendor_name": q["vendor_name"],
                "rating": q["rating"],
                "price": q["price"],
                "delivery_days": q["delivery_days"],
                "notes": q["notes"],
                "status": q["status"]
            })

    if len(filtered) == 0:
        return jsonify({"message": "No quotations found"}), 404

    lowest_price = min(filtered, key=lambda x: x["price"])
    fastest_delivery = min(filtered, key=lambda x: x["delivery_days"])

    recommended = min(
        filtered,
        key=lambda x: (x["price"], x["delivery_days"], -x["rating"])
    )

    return jsonify({
        "quotations": filtered,
        "best_price": lowest_price,
        "fastest_delivery": fastest_delivery,
        "recommended": recommended
    }), 200