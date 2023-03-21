// Creating the map object
let myMap = L.map("map-id", {
  center: [-37.814, 144.96332],
  zoom: 12
  // layers: [streetmap, bikeStations]
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store the API query variables.
let CP_URL = "https://data.melbourne.vic.gov.au/api/records/1.0/search/?dataset=off-street-car-parks-with-capacity-and-type&q=&rows=7158&sort=census_year&facet=census_year&facet=clue_small_area&facet=parking_type&refine.census_year=2021"


d3.json(CP_URL).then(function(response) {

  console.log(response);
  records = response.records;
  console.log(records);
  
  let markers = L.markerClusterGroup();

  // Loop through the data.
  for (let i = 0; i < records.length; i++) {

    // Set the data location property to a variable.
    let location = records[i].fields.location;
    console.log(location);
    // Check for the location property.
    if (location) {

      // Add a new marker to the cluster group, and bind a popup.
      markers.addLayer(L.marker([location[0], location[1]]).bindPopup(records[i].fields.building_address));
    }

  }
  myMap.addLayer(markers);
});

d3.json(CP_URL).then(function(response) {

  console.log(response);
  records = response.records;
  console.log(records);
  
  let markers = L.markerClusterGroup();

  // Loop through the data.
  for (let i = 0; i < records.length; i++) {

    // Set the data location property to a variable.
    let location = records[i].fields.location;
    console.log(location);
    // Check for the location property.
    if (location) {

      // Add a new marker to the cluster group, and bind a popup.
      markers.addLayer(L.marker([location[0], location[1]]).bindPopup(records[i].fields.building_address));
    }

  }
  myMap.addLayer(markers);
});