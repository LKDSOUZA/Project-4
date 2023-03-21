// Initialise all the LayerGroups that we'll use.
let layers = {
  PRIVATE: new L.LayerGroup(),
  RESIDENTIAL: new L.LayerGroup(),
  COMMERCIAL: new L.LayerGroup(),
  BUSINESSE: new L.LayerGroup()
};

// Creating the map object
let myMap = L.map("map-id", {
  center: [-37.814, 144.96332],
  zoom: 12,
  layers: [layers.PRIVATE, layers.RESIDENTIAL, layers.COMMERCIAL, layers.BUSINESSE]
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
  "Commercial Parking": layers.COMMERCIAL,
  "Business Establishment": layers.BUSINESSE
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
    markerColor: "green",
    shape: "penta"
  })
};

// Create an object to keep the number of markers in each layer.
let parkingTypeCount = {
  PRIVATE: 0,
  COMMERCIAL: 0,
  RESIDENTIAL: 0,
  BUSINESSE: 0
};

// Initialise stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for the layer group.
let parkingStatusCode;

// Store the API query variables.
let CP_URL = "http://127.0.0.1:5000/api/v1.0/Parking";
let url = "http://127.0.0.1:5000/api/v1.0/Business";

d3.json(CP_URL).then(function(response) {
  console.log(response);
  
  let records = response;

  let newMarker = L.markerClusterGroup();

  // Loop through the data.
  for (let i = 0; i < 2551; i++) {
    // Set the data location property to a variable.
    // let location = records[i].fields.location;

    // Create a new parking object with properties of both parking objects.
    let parking = Object.assign({}, records[i]);
    // If a parking is residentials, it's residential.
    if (parking.parking_type == "Residential") {
      parkingStatusCode = "RESIDENTIAL";
      // console.log(parkingStatusCode);
    }
    // If parking is commercials, it's commercial.
    else if (parking.parking_type == "Commercial") {
      parkingStatusCode = "COMMERCIAL";
      // console.log(parkingStatusCode);
    }
    // If a parking is private, it's private.
    else if (parking.parking_type == "Private") {
      parkingStatusCode = "PRIVATE";
      // console.log(parkingStatusCode);
    }

    // Update the parking count.
    parkingTypeCount[parkingStatusCode]++;

    // Create a new marker with the appropriate icon and coordinates.
    // newMarker = L.marker([parking.fields.location[0], parking.fields.location[1]], {
    //   icon: icons[parkingStatusCode]
    // });
    newMarker.addLayer(L.marker([parking.latitude, parking.longitude], {
      icon: icons[parkingStatusCode]
    }).bindPopup(`<h3>${parking.parking_spaces}</h3> <hr> <h3> <button onclick="print()">start</button> <button onclick="print()">kesini</button> </h3>`));
    

    // Add the new marker to the appropriate layer.
    newMarker.addTo(layers[parkingStatusCode]);

    // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
    // newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
    // newMarker.bindPopup(parking.fields.building_address); 

    // console.log(location);
    // // Check for the location property.
    // if (location) {

    //   // Add a new marker to the cluster group, and bind a popup.
    //   markers.addLayer(L.marker([location[0], location[1]]).bindPopup(records[i].fields.building_address));
    // }

  }
  // myMap.addLayer(newMarker);

  // Call the updateLegend function, which will update the legend!
  updateLegend(parkingTypeCount);
});

d3.json(url).then(function(response) {

  // console.log(response);
  let bisnis = response;
  let test = L.markerClusterGroup();

  console.log(bisnis);
  // let test;
  for (let index = 0; index < 1670; index++) {

    let location = Object.assign({},bisnis[index]);
    if (location.business_address) {
        // console.log(location.latitude);
        parkingStatusCode = "BUSINESSE";
        // console.log(parkingStatusCode);
        // test = L.marker([location.fields.location[0], location.fields.location[1]]);
        
    }
    parkingTypeCount[parkingStatusCode]++;
    test.addLayer(L.marker([location.latitude, location.longitude]).bindPopup(`<h3>${location.business_address}</h3> <hr> <h3> <button onclick="print()">start</button> <button onclick="keSini(latLng)">ke sini</button> </h3>`));
    test.addTo(layers[parkingStatusCode]);
      
  }
  updateLegend(parkingTypeCount);
  // createMap(L.layerGroup(BUSINESSE));
});


// Update the legend's innerHTML with the last updated time and station count.
function updateLegend(parkingTypeCount) {
  document.querySelector(".legend").innerHTML = [
    // "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='residential'>Residential Parking: " + parkingTypeCount.RESIDENTIAL + "</p>",
    "<p class='commercial'>Commercial Parking: " + parkingTypeCount.COMMERCIAL + "</p>",
    "<p class='private'>Private Parking: " + parkingTypeCount.PRIVATE + "</p>",
    "<p class='businesse'>Business Establishment: " + parkingTypeCount.BUSINESSE + "</p>"
  ].join("");
}

// let marker = L.marker([-37.810140000000004, 144.98433]);
// marker.addTo(myMap);

// myMap.on('click', function (e) {
//   console.log(e)
//   L.marker([e.latlng.lat, e.latlng.lng]).addTo(myMap);

//   var control = L.Routing.control({
//     waypoints: [
//       L.latLng(-37.8209, 144.9572),
//       L.latLng(e.latlng.lat, e.latlng.lng)
//     ]
//   })
// control.addTo(myMap); 
// });

// function keSini(latLconrong){
//   var latLng = L.latLng(e.latlng.lat, e.latlng.lng)
//   control.spliceWaypoints(control.getWaypoints().length -1, 1, latLng);
// }
