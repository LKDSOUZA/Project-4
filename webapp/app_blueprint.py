from flask import Blueprint, render_template

app_blueprint = Blueprint('app_blueprint', __name__)

@app_blueprint.route('/')
def home():
    return render_template("index.html")

@app_blueprint.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")

@app_blueprint.route('/leaflet')
def mymap():
    return render_template("leaflet.html")

