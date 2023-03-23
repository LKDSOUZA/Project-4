import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, and_

from flask import (
    Flask, 
    jsonify,
    request,
    redirect)
from flask_cors import CORS

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///offstreetcarpark.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Parking = Base.classes.parking
Business = Base.classes.business

#################################################
# Flask Setup
#################################################
from app_blueprint import app_blueprint

app = Flask(__name__)
app.register_blueprint(app_blueprint)
CORS(app)


#################################################
# Flask Routes
#################################################

@app.route("/api", methods=['GET'])
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/Parking<br/>"
        f"/api/v1.0/Business"
    )


@app.route("/api/v1.0/Parking", methods=['GET'])
def names():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    # Query all parking data
    results = session.query(Parking.census_year,Parking.block_id,Parking.parking_type,Parking.parking_spaces,Parking.longitude,Parking.latitude,Parking.building_address,Parking.clue_small_area).all()

    session.close()

    
    # Create a dictionary from the row data and append to a list of all_parkings
    all_parkings = []
    for census_year,block_id,parking_type,parking_spaces,longitude,latitude,building_address,clue_small_area in results:
        parking_dict = {}
        parking_dict["census_year"] = census_year
        parking_dict["block_id"] = block_id
        parking_dict["parking_type"] = parking_type
        parking_dict["parking_spaces"] = parking_spaces
        parking_dict["longitude"] = longitude
        parking_dict["latitude"] = latitude
        parking_dict["building_address"] = building_address
        parking_dict["clue_small_area"] = clue_small_area
        all_parkings.append(parking_dict)

    return jsonify(all_parkings)

@app.route("/api/v1.0/Business",methods=['GET'] )
def business():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    # Query all business data
    results = session.query(Business.census_year,Business.block_id,Business.longitude, Business.latitude, Business.business_address, Business.trading_name).all()

    session.close()

    
    # Create a dictionary from the row data and append to a list of all_parkings
    all_business = []
    for census_year,block_id,longitude,latitude, business_address, trading_name in results:
        business_dict = {}
        business_dict["census_year"] = census_year
        business_dict["block_id"] = block_id
        business_dict["longitude"] = longitude
        business_dict["latitude"] = latitude
        business_dict["business_address"]= business_address
        business_dict["trading_name"] = trading_name

        all_business.append(business_dict)

    return jsonify(all_business)
if __name__ == '__main__':
    app.run(debug=True)

