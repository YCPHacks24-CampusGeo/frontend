let mapEnlarged = false;
let swapped = false;
let curImg;
let map;
let onCooldown = false;
let viewer;
let latLng = null;
let currentMarker = null;
let playerName = null;
let playerIcon = null;
let playerMarker = null;
let playerScore = "0000";
let marker = null;

async function init() {
    await loadMap('map');
    await loadLocation('panorama');
    await loadToolbar();
}

async function loadMap(divName) {
    map = L.map(divName).setView([39.946952, -76.727429], 18);

    L.tileLayer('https://map.ycp.campusgeo.com/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 14
    }).addTo(map);

    marker = L.icon({
        iconUrl: playerMarker,
        iconAnchor: [17, 47],
        iconSize: [33, 47]
    });

    changeMapSize();

    let clickedLatLng;

    map.on('click', async function (e) {
        if (!mapEnlarged) {
            await swapLocationMap();
        } else {
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            latLng = [lat, lng];
            currentMarker = L.marker([lat, lng], {icon: marker}).addTo(map);
            const element = document.getElementById("guess");
            if(!element) {
                const button = document.createElement("button");
                button.id = "guess";
                button.classList.add("button");
                button.type = "submit";
                button.innerHTML = "Guess";
                document.getElementById("guess-button").appendChild(button);
            }
            clickedLatLng = e.latlng;
            console.log("Clicked coordinates: " + clickedLatLng.lat + ", " + clickedLatLng.lng);
        }
    });
}

async function loadLocation(divName){
    if(curImg == null) {
        curImg = `/locations/${await getImage()}.jpg`;
    }

    viewer = pannellum.viewer(divName, {
        "type": "equirectangular",
        "panorama": curImg,
        "autoLoad": true,
        "compass": false,
        "showControls": false
    });
}

async function loadToolbar() {
    await getPlayerData();
    document.getElementById("icon").src = playerIcon;
    document.getElementById("name").innerHTML = playerName;
    document.getElementById("score").innerHTML = playerScore;
}

async function swapLocationMap() {
    onCooldown = true;
    setTimeout(() => {
        onCooldown = false;
    }, 2000);
    map.remove();
    viewer.destroy();
    const element = document.getElementById("guess");
    if (swapped) {
        if(element) {
            element.style.visibility = "hidden";
            element.style.disabled = true;
        }
        await loadMap('map');
        await loadLocation('panorama');
    } else {
        await loadLocation('map');
        await loadMap('panorama');
        if(currentMarker && !element) {
            const button = document.createElement("button");
            button.id = "guess";
            button.classList.add("button");
            button.type = "submit";
            button.innerHTML = "Guess";
            document.getElementById("guess-button").appendChild(button);
        } else if(element) {
            element.style.visibility = "visible";
            element.style.disabled = false;
        }
    }
    currentMarker = null;
    if (latLng != null) {
        currentMarker = L.marker(latLng, {icon: marker}).addTo(map);
    }
    mapEnlarged = !mapEnlarged;
    swapped = !swapped
}

function changeMapSize() {
    const map = document.getElementById("map");
    if(window.innerWidth < 1000) {
        map.style.width = "40vw";
        map.style.height = "40vw";
        map.style.border = "0.3vh solid green";
    } else {
        map.style.width = "20vw";
        map.style.height = "20vw";
        map.style.border = "0.4vh solid green";
    }
    map.style.borderRadius = "5px";
}

async function getImage() {
    let response = await ApiRequest("test", "getlocation", "GET");
    let body = await response.json();
    return body.imageKey;
}

async function getPlayerData() {
    let response = await ApiRequest("test", "geticon", "GET");
    let body = await response.json();
    playerName = body.name;
    playerIcon = `/icons/${body.icon}.jpg`;
    playerMarker = `/markers/${body.icon}.png`

}

window.addEventListener('resize', changeMapSize);
document.addEventListener('DOMContentLoaded', init);