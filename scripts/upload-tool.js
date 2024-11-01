function loadMap() {
    var map = L.map('map').setView([39.946952, -76.727429], 18);

    L.tileLayer('https://map.ycp.campusgeo.com/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

    document.getElementById('submit').addEventListener('click', function () {
        if (clickedLatLng) {
            console.log("Submitted coordinates: " + clickedLatLng.lat + ", " + clickedLatLng.lng);
        } else {
            console.log("No coordinates clicked yet.");
        }
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            const file = input.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                pannellum.viewer('panorama', {
                    "type": "equirectangular",
                    "panorama": url,
                    "autoLoad": true
                });
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}