// Store URL
const earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

// load jSON 
// d3.json(earthquakeUrl, function(data) {
    // console.log(data);
// });
// or Perform a GET request to the earthquake URL.
d3.json(earthquakeUrl).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquake) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
   let earthquakes = L.geoJSON(earthquake, {
   onEachFeature: function(feature, layer){}
});

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
};



function createMap(earthquakes) {


// Create the base layer.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

// Create an overlay object to hold our overlay.
let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map
const myMap = L.map("map", {
    center: [20.388,-25.5503],
    zoom: 2,
    layers: [street, earthquakes]
});

// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

// Change markers to circles
const geojsonlayer = L.geoJSON(earthquakes.toGeoJSON(), {
    style: function (feature) {
      return {
        color: feature.geometry.coordinates[1] || "green",
        fillColor: feature.geometry.coordinates[1] || "green",
        fillOpacity: (feature.geometry.coordinates[1] * .01),
      };
    },
    pointToLayer: (feature, latlng) => {
      if (feature.properties.type === "Earthquake") {
        return new L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
        });
      }
    },
    onEachFeature: function (feature, layer) {},



// Loop through the cities array, and create one marker for each city object.
// for (let i = 0; i < cities.length; i++) {
    // L.circle((feature.geometry.coordinates[0], feature.geometry.coordinates[2]) {
    //   fillOpacity: ((feature.geometry.coordinates[1]) * .01),
    //   color: "green",
    //   fillColor: "green",
    //   Setting our circle's radius to equal the output of our markerSize() function:
    //   This will make our marker's size proportionate to its magnitude
    //   radius: markerSize(feature.properties.mag)
    // }).addTo(myMap);
    // .bindPopup(`<h1>${cities[i].name}</h1> <hr> <h3>Magnitude: ${feature.properties.mag.toLocaleString()}</h3>`)
}).addTo(myMap);
};