// Initialise all the LayerGroups that we'll use.
let layers = {
  PRIVATE: new L.LayerGroup(),
  RESIDENTIAL: new L.LayerGroup(),
  COMMERCIAL: new L.LayerGroup(),
};

// Creating the map object
let myMap = L.map("map-id", {
  center: [-37.814, 144.96332],
  zoom: 12,
  layers: [layers.PRIVATE, layers.RESIDENTIAL,layers.COMMERCIAL]
});

// Adding the tile layer
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}); //.addTo(myMap);

// Add our "streetmap" tile layer to the map.
streetmap.addTo(myMap);

// Create an overlays object to add to the layer control.
let overlays = {
  "Private Parking": layers.PRIVATE,
  "Residential Parking": layers.RESIDENTIAL,
  "Commercial Parking": layers.COMMERCIAL
};

// Create a control for our layers, and add our overlays to it.
L.control.layers(null, overlays).addTo(myMap);

// Create a legend to display information about our map.
let info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend".
info.onAdd = function() {
  let div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map.
info.addTo(myMap);

// Initialise an object that contains icons for each layer group.
let icons = {
  PRIVATE: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  COMMERCIAL: L.ExtraMarkers.icon({
    icon: "ion-android-car",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  RESIDENTIAL: L.ExtraMarkers.icon({
    icon: "ion-android-home",
    iconColor: "white",
    markerColor: "blue-dark",
    shape: "penta"
  })
};

// Store the API query variables.
let CP_URL = "https://data.melbourne.vic.gov.au/api/records/1.0/search/?dataset=off-street-car-parks-with-capacity-and-type&q=&rows=7158&sort=census_year&facet=census_year&facet=clue_small_area&facet=parking_type&refine.census_year=2021"

d3.json(CP_URL).then(function(response) {
  console.log(response);
  
  let records = response.records;
  console.log(records);
  // let stationStatus = statusRes.data.stations;
  // let stationInfo = infoRes.data.stations;

  // Create an object to keep the number of markers in each layer.
  let parkingTypeCount = {
    PRIVATE: 0,
    COMMERCIAL: 0,
    RESIDENTIAL: 0
  };
  
  // Initialise stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for the layer group.
  let parkingStatusCode;

  let newMarker = L.markerClusterGroup();

  // Loop through the data.
  for (let i = 0; i < 400; i++) {
    // Set the data location property to a variable.
    // let location = records[i].fields.location;
    // Create a new station object with properties of both station objects.
    let parking = Object.assign({}, records[i]);
    // If a parking is residentials, it's residential.
    if (parking.fields.parking_type == "Residential") {
      parkingStatusCode = "RESIDENTIAL";
    }
    // If parking is commercials, it's commercial.
    else if (parking.fields.parking_type == "Commercial") {
      parkingStatusCode = "COMMERCIAL";
    }
    // If a station is private, it's private.
    else if (parking.fields.parking_type == "Private") {
      parkingStatusCode = "PRIVATE";
    }

    // Update the station count.
    parkingTypeCount[parkingStatusCode]++;

    // Create a new marker with the appropriate icon and coordinates.
    newMarker = L.marker([parking.fields.location[0], parking.fields.location[1]], {
      icon: icons[parkingStatusCode]
    });

    // Add the new marker to the appropriate layer.
    newMarker.addTo(layers[parkingStatusCode]);

    // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
    // newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
    newMarker.bindPopup(parking.fields.building_address); 


    
    // console.log(location);
    // // Check for the location property.
    // if (location) {

    //   // Add a new marker to the cluster group, and bind a popup.
    //   markers.addLayer(L.marker([location[0], location[1]]).bindPopup(records[i].fields.building_address));
    // }

  }
  myMap.addLayer(newMarker);

  // Call the updateLegend function, which will update the legend!
  updateLegend(parkingTypeCount);
});

// Update the legend's innerHTML with the last updated time and station count.
function updateLegend(parkingTypeCount) {
  document.querySelector(".legend").innerHTML = [
    // "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='out-of-order'>Residential Parking: " + parkingTypeCount.RESIDENTIAL + "</p>",
    "<p class='coming-soon'>Commercial Parking: " + parkingTypeCount.COMMERCIAL + "</p>",
    "<p class='healthy'>Private Parking: " + parkingTypeCount.PRIVATE + "</p>"
  ].join("");
}
