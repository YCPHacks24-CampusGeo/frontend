async function loadMap() {
    var map = L.map('map').setView([39.946952, -76.727429], 18);

    L.tileLayer('https://map.ycp.campusgeo.com/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 14
    }).addTo(map);

    var clickedLatLng;
    var currentMarker = null;

    map.on('click', function (e) {
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        currentMarker = L.marker([lat, lng]).addTo(map)
        clickedLatLng = e.latlng;
        console.log("Clicked coordinates: " + clickedLatLng.lat + ", " + clickedLatLng.lng);
    });
}

function loadLocation(image){
    pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": image,
        "autoLoad": true
    });
}

function enlargeMap() {
    var map = document.getElementById("map");
    map.style.width = "80vh";
    map.style.height = "80vh";
}

function shrinkMap() {
    var map = document.getElementById("map");
    map.style.width = "40vh";
    map.style.height = "40vh";
}