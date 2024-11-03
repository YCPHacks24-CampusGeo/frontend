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
let marker = null;
let intermission = false;
let isDragging = false;

async function init() {
    await loadToolbar();
    addMapEventListeners();
    const element = document.getElementById("guess");
    if(element) {
        element.remove();
    }
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
        if(!intermission && !isDragging) {
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
                if (!element) {
                    const button = document.createElement("button");
                    button.addEventListener("click", async function (e) {
                        await makeGuess();
                    });
                    button.id = "guess";
                    button.classList.add("button");
                    button.type = "submit";
                    button.innerHTML = "Guess";
                    document.getElementById("guess-button").appendChild(button);
                }
                clickedLatLng = e.latlng;
                console.log("Clicked coordinates: " + clickedLatLng.lat + ", " + clickedLatLng.lng);
            }
        }
    });
}

async function loadLocation(divName){
    async function getImage() {
        let response = await ApiRequest("User", "GetGuessImage", "GET");
        return await response.text();
    }


    curImg = `/locations/${await getImage()}.jpg`;


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
    document.getElementById("score").innerHTML = await (await ApiRequest("User", "GetPlayerScore", "GET")).text();
}

async function swapLocationMap() {
    onCooldown = true;
    setTimeout(() => {
        onCooldown = false;
    }, 2000);
    if(map) {
        map.remove();
    }
    if(viewer) {
        viewer.destroy();
    }
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
            button.addEventListener("click", async function (e) {
                await makeGuess();
            });
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

async function getPlayerData() {
    let response = await ApiRequest("User", "GetPlayerIcon", "GET");
    let body = await response.json();
    playerName = body.name;
    playerIcon = `/icons/${body.icon}.jpg`;
    playerMarker = `/markers/${body.icon}.png`

}

async function makeGuess() {
    let geolocation = {
        latitude: latLng[0],
        longitude: latLng[1]
    }
    await ApiRequest("User", "MakeGuess", "POST", geolocation);
    //document.getElementById("map").classList.add("disabled");
    document.getElementById("guess-button").classList.add("disabled");
    document.getElementById("container").style.pointerEvents = "none";
    document.getElementById("score").innerHTML = await (await ApiRequest("User", "GetPlayerScore", "GET")).text();

}

async function getRoundResult() {
    let response = await ApiRequest("User", "GetPlayerResults", "GET");
    let body = await response.json();
    if(body.guess !== null) {

        let guess = [body.guess.location.latitude, body.guess.location.longitude];
        let correct = [body.correct.latitude, body.correct.longitude];
        let distance = Math.trunc(body.guess.distance * 100) / 100;

        document.getElementById("score").innerHTML = `+${body.guess.points}`;

        L.marker(guess, {icon: marker}).addTo(map);
        L.marker(correct).addTo(map);

        L.polyline([guess, correct], {color: 'red'}).addTo(map);
        var midPoint = L.latLng(
            (guess[0] + correct[0]) / 2,
            (guess[1] + correct[1]) / 2
        );

        L.tooltip()
            .setContent(distance + ' meters')
            .setLatLng(midPoint)
            .addTo(map);

        map.setView(midPoint, 18);

        console.log(`Guess: ${guess}`)
        console.log(`Correct: ${correct}`)
        console.log(`Distance: ${distance}`)
    }
}

async function initializeGuessPeriod() {
    if (map) {
        map.remove();
    }
    if(viewer) {
        viewer.destroy();
    }
    await loadMap("map");
    await loadLocation("panorama");
    document.getElementById("score").innerHTML = await (await ApiRequest("User", "GetPlayerScore", "GET")).text();
}

async function initializeIntermissionPeriod() {
    if(viewer) {
        viewer.destroy();
    }
    await getRoundResult();
}

function addMapEventListeners() {
    const mapDiv = document.getElementById("map");
    mapDiv.addEventListener('mousedown', () => {
        isDragging = false;
    });
    mapDiv.addEventListener('mousemove', () => {
        isDragging = true;
    });
    mapDiv.addEventListener('mouseup', (event) => {
        if(!isDragging) {
            if(!onCooldown) swapLocationMap();
        }
    });
    mapDiv.addEventListener('mouseleave', () => {
        isDragging = false;
    });
}

window.addEventListener('resize', changeMapSize);
document.addEventListener('DOMContentLoaded', init);

window.onload = async function () {
    const params = new URLSearchParams(window.location.search);
    const myParam = params.get('gameid');

    if (myParam) {
        const response = await ApiRequest("User", `JoinGame?gameId=${myParam}`, "GET");
        console.log(response);
        if(response.status !== 200) {
            alert("Invalid Game ID");
            window.location.href = '/';
        }
        window.location.href = '/play'
    } else {
        console.log('Parameter not found');
    }
};

async function stateChange(oldState, newState) {
    console.log(`State Change: ${oldState} to ${newState}`);
    if (newState === GameStates.INTERMISSION) {
        intermission = true;
        initializeIntermissionPeriod()
    } else if (newState === GameStates.GUESS) {
        initializeGuessPeriod()
        document.getElementById("guess-button").classList.remove("disabled");
        document.getElementById("container").style.pointerEvents = "all";
        document.getElementById("wait-message").style.opacity = "0.0";
        intermission = false;
    } else if (newState === GameStates.COMPLETE) {
        document.getElementById("score").innerHTML = await (await ApiRequest("User", "GetPlayerScore", "GET")).text();
        document.getElementById("guess-button").style.opacity = "0";
        document.getElementById("panorama").style.opacity = "0";
        document.getElementById("map").style.opacity = "0";
        document.getElementById("wait-message").innerHTML = "Nice Job!";
        document.getElementById("wait-message").style.opacity = "1";
        intermission = false;
    } else {
        intermission = false;
    }
}

SubscribeGameState(stateChange);
stateChange(null, GameState);