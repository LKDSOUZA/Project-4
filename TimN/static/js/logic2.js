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
  for (let i = 0; i < 500; i++) {
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
    newMarker.addLayer(L.marker([parking.latitude, parking.longitude], {
      icon: icons[parkingStatusCode]
    }).bindPopup(`<h3>parking space available: ${parking.parking_spaces}</h3> <hr>
        <h3>${parking.building_address}</h3> <hr> 
        <h3> <button onclick="print()">start</button> <button onclick="print()">kesini</button> </h3>`));
    // Add the new marker to the appropriate layer.
    newMarker.addTo(layers[parkingStatusCode]);
  }

  // Call the updateLegend function, which will update the legend!
  updateLegend(parkingTypeCount);
});

//iterate Business API to display Business map
d3.json(url).then(function(response) {

  // console.log(response);
  let bisnis = response;
  let test = L.markerClusterGroup();
  // const ul = document.querySelector('.list');
  console.log(bisnis);
  // let test;
  for (let index = 0; index < 500; index++) {

    let location = Object.assign({},bisnis[index]);
    if (location.trading_name!= "Vacant" ) {
        // console.log(location.latitude);
        parkingStatusCode = "BUSINESSE";
        // console.log(parkingStatusCode);
        // test = L.marker([location.fields.location[0], location.fields.location[1]]); 
    }
    parkingTypeCount[parkingStatusCode]++;
    test.addLayer(L.marker([location.latitude, location.longitude]).bindPopup(`<div><h3>${location.trading_name}</h3> <hr> <h4>${location.business_address}</h4> <hr> <p> <button onclick="print()">start</button> <button onclick="return keSini(location)">ke sini</button> </p><div>`));
    test.addTo(layers[parkingStatusCode]);
      
  }
  updateLegend(parkingTypeCount);
  
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

function populateOffice() {
  d3.json(url).then(function(response) {
  let bisnis = response;  
  const ul = document.querySelector('.list');

    for (let index = 0; index < 150; index++) {
        let location = Object.assign({},bisnis[index]);
        const li = document.createElement('li');
        const div = document.createElement('div');
        const a = document.createElement('a');
        const p = document.createElement('p');
        a.addEventListener('click', () =>{
            flyToOffice(location);
        });

        div.classList.add('office-item');
        a.innerText = location.trading_name;
        a.href = '#';
        p.innerText = location.business_address;

        div.appendChild(a);
        div.appendChild(p);
        li.appendChild(div);
        ul.appendChild(li);
      
    }}
  );
}
populateOffice();

function flyToOffice(location){
  const lat = location.latitude;
  const lng = location.longitude;
  myMap.flyTo([lat,lng], 18, {
    duration: 3
  });
  setTimeout(() => {
    L.popup({closeButton: true, offset: L.point (0, -8)})
        .setLatLng([lat,lng])
        .setContent((`<div><h3>${location.trading_name}</h3> <hr> <h4>${location.business_address}</h4> <hr> <p> <button onclick="print()">start</button> <button onclick="return keSini(location)">ke sini</button> </p><div>`))
        .openOn(myMap)
  }, 3000);
}

// let marker = L.marker([-37.810140000000004, 144.98433]);
// marker.addTo(myMap);

myMap.on('click', function (e) {
  console.log(e)
  L.marker([e.latlng.lat, e.latlng.lng]).addTo(myMap);

var control = L.Routing.control({
    waypoints: [
      L.latLng(-37.8209, 144.9572),
      L.latLng(e.latlng.lat, e.latlng.lng)
    ]
});
control.addTo(myMap); 
});

function keSini(location){
  var latLng = L.latLng(location.latitude,location.longitude);
  control.spliceWaypoints(control.getWaypoints().length -1, 1, latLng);
}
