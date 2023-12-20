// Store URL
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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
  onEachFeature: function (feature, layer) {
   layer.bindPopup(
      "Magnitude: "
      + feature.properties.mag
      + "<br>Depth: "
      + feature.geometry.coordinates[2]
      + "<br>Location: "
      + feature.properties.place);
  }}) 

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
};
function createMap(earthquakes) {


// Create the base layer.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
// Create the topography layer
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
  function getColor(depth) { 
    switch (true) {
      case depth > 90:
        return "#EA2C2C";
      case depth > 70:
        return "#EA822C";
      case depth > 50:
        return "#EE9C00";
      case depth > 30:
        return "#EECC00";
      case depth > 10:
        return "#D4EE00";
      default:
        return "#98EE00";
    }
  }
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
    }
    

// Change markers to circles
const geojsonlayer = L.geoJSON(earthquakes.toGeoJSON(), {
    style: function (feature) {
      return {
        color: getColor(feature.geometry.coordinates[2]),       
        fillColor: getColor(feature.geometry.coordinates[2]),
        fillOpacity: ((feature.geometry.coordinates[2] * .01))
      };
    },
    pointToLayer: (feature, latlng)=> {
      //if (feature.properties.type === "Earthquake") {         
        return L.circleMarker(latlng, {
          radius: getRadius(feature.properties.mag),            
        });
      }
                               
}).addTo(myMap)
var legend = L.control({position: "bottomright"});
legend.onAdd = function(myMap) {
    let div = L.DomUtil.create("div", "info legend");
    let depthRange = [-10, 10, 30, 50, 70, 90, 110];
    let colors = ["#98EE00", "#D4EE00",  "#EECC00", "#EE9C00", "#EA822C", "#EA2C2C"];
    let labels = []

    let legendInfo = '<i style="background:' + getColor(depthRange[i] + 1) + '"></i> ' + depthRange[i] + (depthRange[i + 1] ? '&ndash;' + depthRange[i + 1] + '<br>' : '+');
    for (var i = 0; i < depthRange.length; i++) {
        div.innerHTML += legendInfo
        depthRange.forEach(function(depthRange, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
           div.innerHTML += "<ul>" + labels.join("") + "</ul>";

           return div;
        };
};
legend.addTo(myMap);
};