import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import (
    Flask, 
    jsonify,
    render_template,
    request,
    redirect)
from flask_cors import CORS


#################################################
# Flask Setup
#################################################
def create_app():
    app = Flask(__name__)

    # CORS(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    return app

  

    




#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///instance/offstreetcarpark.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
Parking = Base.classes.parking
Business = Base.classes.business



#################################################
# Flask Routes
#################################################


from .views import views

@views.route("/api/v1.0/Parking", methods=['GET'])
def names():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    # Query all parking data
    results = session.query(Parking.census_year,Parking.block_id,Parking.parking_type,Parking.parking_spaces,Parking.latitude,Parking.latitude).all()

    session.close()

    
    # Create a dictionary from the row data and append to a list of all_parkings
    all_parkings = []
    for census_year,block_id,parking_type,parking_spaces,longitude,latitude in results:
        parking_dict = {}
        parking_dict["census_year"] = census_year
        parking_dict["block_id"] = block_id
        parking_dict["parking_type"] = parking_type
        parking_dict["parking_spaces"] = parking_spaces
        parking_dict["longitude"] = longitude
        parking_dict["latitude"] = latitude
        all_parkings.append(parking_dict)

    return jsonify(all_parkings)

@views.route("/api/v1.0/Business",methods=['GET'] )
def business():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    # Query all business data
    results = session.query(Business.census_year,Business.block_id,Business.longitude, Business.latitude, Business.business_address).all()

    session.close()

    
    # Create a dictionary from the row data and append to a list of all_parkings
    all_business = []
    for census_year,block_id,longitude,latitude, business_address in results:
        business_dict = {}
        business_dict["census_year"] = census_year
        business_dict["block_id"] = block_id
        business_dict["longitude"] = longitude
        business_dict["latitude"] = latitude
        business_dict["business_address"]= business_address

        all_business.append(business_dict)

    return jsonify(all_business)


