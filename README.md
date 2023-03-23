# Project-4  
## Off Street Car Park around Business Establishments in Melbourne CBD

## Navigation prompts
Open file 'run.sh' in code editor   
Run code  

## Team members
- Javier Gausachs
- Timo Nugraha
- Lachlan D'Souza
- Zakia Afrin Aziz

## Project description
Data is collected from the City of Melbourne's Census of Land Use and Employment (CLUE).  
Two Datasets are used to analyse available off street parking in Melbourne CBD.  
Parking data covers the period 2002-2020.  
The number of off-street car parking spaces per property is recorded in CLUE. 
Car parking can be classified as:
- Commercial: Car parking in a publicly accessible, paid parking facility
- Residential: Car parking in a residential building or property
- Private: Car parking in a non-residential building that is provided for use by staff, customers or visitors 

## Data source  
https://data.melbourne.vic.gov.au/explore/dataset/off-street-car-parks-with-capacity-and-type/table/?sort=census_year  
https://data.melbourne.vic.gov.au/explore/dataset/business-establishments-with-address-and-industry-classification/table/?refine.census_year=2021&location=13,-37.80666,144.97207&basemap=mbs-7a7333  

## Project pipeline
Our project pipeline is as follows: 
![Untitled](https://user-images.githubusercontent.com/73529437/227135361-53d5c711-4bb3-411c-9c3a-2ab809401a93.jpg)
![Pipe](https://user-images.githubusercontent.com/73529437/227135867-5965630f-a7b4-4f63-8259-78e22b87ceca.jpg)

## Sample output
### Plotly is used for the following analysis:   
<img width="497" alt="image" src="https://user-images.githubusercontent.com/73529437/227124438-ef835c04-b4cd-4b66-a868-0294768bf5d5.png">  
<img width="949" alt="image" src="https://user-images.githubusercontent.com/73529437/227124635-6ebb9cdf-6f13-4170-b237-4bd024ba6398.png">  

#### Growth by Census Year - Parking Spaces  
<img width="653" alt="image" src="https://user-images.githubusercontent.com/73529437/227126714-7b59fd3f-6de8-44c3-9baa-d4b3588c8bf7.png">  

#### Growth by Census Year - New Businesses  
<img width="463" alt="image" src="https://user-images.githubusercontent.com/73529437/227126866-64c959df-7eb5-4a15-9f81-d62325082af7.png"> 

### Leaflet is used for the following analysis:     
<img width="1404" alt="image" src="https://user-images.githubusercontent.com/73529437/227131608-5e6a176c-bfa2-47b1-b33f-7bdc4a3f340e.png">  

## Challenges  
1. Flask: Cross-Origin Resources needed to be enabled. Few steps to fix the issue: ºº
- Step 1: pip install flask-cors
- Step 2: from flask_cors import CORS
- Step 3: from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
2. Interactive Dashboard: Large Data set takes time to load, Drawing relationship between two different datasets

