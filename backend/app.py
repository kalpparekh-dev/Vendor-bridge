from flask import Flask
from flask_cors import CORS
from database import create_tables

from routes.auth_routes import auth_bp
from routes.vendor_routes import vendor_bp
from routes.rfq_routes import rfq_bp
from routes.quotation_routes import quotation_bp
from routes.approval_routes import approval_bp
from routes.po_routes import po_bp
from routes.invoice_routes import invoice_bp
from routes.dashboard_routes import dashboard_bp

app = Flask(__name__)
CORS(app)

create_tables()

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(vendor_bp, url_prefix="/api")
app.register_blueprint(rfq_bp, url_prefix="/api")
app.register_blueprint(quotation_bp, url_prefix="/api")
app.register_blueprint(approval_bp, url_prefix="/api")
app.register_blueprint(po_bp, url_prefix="/api")
app.register_blueprint(invoice_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api")

@app.route("/")
def home():
    return "VendorBridge Backend Running"

if __name__ == "__main__":
    app.run(debug=True)