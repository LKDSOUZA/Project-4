from flask import Blueprint, render_template

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("index.html")

@views.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")

@views.route("/api", methods=['GET'])
def api():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/Parking<br/>"
        f"/api/v1.0/Business"
    )

