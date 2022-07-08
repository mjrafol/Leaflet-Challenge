// Define variables for our tile layers (boiler plate)
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create the base map
var baseMaps = {
    Street: street,
    Topography: topo
  };



// Create the map object, set default layers
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3,
    layers: [street, topo]
  });

// Add layer control to the map
L.control.layers(baseMaps).addTo(myMap)

// Add the tile layer (boiler plate)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Link to the GeoJSON data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab GeoJSON data
d3.json(link).then( function(data){


    // Create a style
    function mapStyle(feature) {
        return {
            opacity: 0.8,
            fillOpacity: 0.8,
            color: "white",
            fillColor: markerColor(feature.properties.mag),
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 1.5,
        }
    }
    
    // Create a function for marker size 
    function markerSize(mag) {
        return mag * 3;
    };

    // Create a function for marker color
    function markerColor(mag) {

        if (mag >= 7) return "#e93e3a"
        else if (mag >= 6) return "#ed683c"
        else if (mag >= 5) return "#f3903f"
        else if (mag >= 2) return "#fdc70c"
        else if (mag >= 1) return "#fff33b"
        else return "#1b8a5a"
    }


    // Population the map
    L.geoJson(data, {

        // Set circles
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },

        // Pass n the style object
        style: mapStyle,

        // Pop-up
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h1>" + "Magnitude: " + feature.properties.mag + "</h1> <hr> <h4>" + "Location: " + feature.properties.place + "<hr>" + "Coordinates: " + feature.geometry.coordinates[0] + ", " + feature.geometry.coordinates[1] + "</h4>");

        }

    }).addTo(myMap);

    // Create a legend
    var legend = L.control({
        position: "bottomright"
    });

    // Create legend colors based on markerColor
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var magnitude = [0, 1, 2, 5, 6, 7];
        var colors = [
            "#1b8a5a", 
            "#fff33b", 
            "#fdc70c",
            "#f3903f", 
            "#ed683c", 
            "#e93e3a"];
        var labels = [];

        var legendInfo = "<h3>Earthquake Magnitude<h3>" + 
            "<div class=\"labels\">" +
                "<div class=\"max\">7+</div>" +
                "<div class=\"fourth\">6-7</div>" +
                "<div class=\"third\">5-6</div>" +
                "<div class=\"second\">2-5</div>" +
                "<div class=\"first\">1-2</div>" +
                "<div class=\"min\">0-1</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        colors.forEach(function(color) {
            labels.push("<li style=\"background-color: " + color + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Add label to the map
    legend.addTo(myMap)

})







