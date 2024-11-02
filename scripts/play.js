let mapEnlarged = false;
let swapped = false;
let curImg;
let map;
let onCooldown = false;
let viewer;
let latLng = null;
let currentMarker = null;

async function loadMap(divName) {
    map = L.map(divName).setView([39.946952, -76.727429], 18);

    L.tileLayer('https://map.ycp.campusgeo.com/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 14
    }).addTo(map);

    let clickedLatLng;

    map.on('click', function (e) {
        if (!mapEnlarged) {
            swapLocationMap();
        } else {
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            latLng = [lat, lng];
            currentMarker = L.marker([lat, lng]).addTo(map)
            clickedLatLng = e.latlng;
            console.log("Clicked coordinates: " + clickedLatLng.lat + ", " + clickedLatLng.lng);
        }
    });
}

function loadLocation(image, divName){
    curImg = image;
    viewer = pannellum.viewer(divName, {
        "type": "equirectangular",
        "panorama": image,
        "autoLoad": true,
        "compass": false,
        "showControls": false
    });
}

function swapLocationMap() {
    onCooldown = true;
    setTimeout(() => {
        onCooldown = false;
    }, 2000);
    map.remove();
    viewer.destroy();
    if(swapped) {
        loadMap('map');
        loadLocation(curImg, 'panorama');
    } else {
        loadLocation(curImg, 'map');
        loadMap('panorama');
    }
    currentMarker = null;
    if(latLng != null) {
        currentMarker = L.marker(latLng).addTo(map);
    }
    mapEnlarged = !mapEnlarged;
    swapped = !swapped
}

function changeMapSize() {
    alert(window.visualViewport.width);
    alert(window.innerWidth);
    const map = document.getElementById("map");
    if(window.innerWidth < 600) {
        map.style.width = "50vw";
        map.style.height = "50vw";
    } else {
        map.style.width = "20vw";
        map.style.height = "20vw";
    }
    mapEnlarged = false;
}

window.addEventListener('resize', changeMapSize);