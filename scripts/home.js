let background = null;
let splashtexts = ["Now with more cookies :)", "[Insert cool text here]",
    "No bugs here!", "Built in 48 hours!", "Better than the original!",
    "We only broke a few rules!", "Dr. Burns approved!", "H-O-T-T-O-G-O", "\"UwU\"",
    "No sanity was lost!", "Mark saved the project!", "Bye, bye, bye!"]

function play_button() {
    let gameid = getGameId();
    if (!gameid) return;
    window.location.href = `/frontend/play/?gameid=${gameid}`;
}

function host_button() {
    window.location.href = '/create';
}

function spectate_button() {
    let gameid = getGameId();
    if (!gameid) return;
    window.location.href = `/spectate/?gameid=${gameid}`;
}


function getGameId() {
    return prompt("Enter Game Id");
}

async function setRandomBackground() {
    let response = await ApiRequest("test", "getlocation", "GET");
    let body = await response.json();
    background = pannellum.viewer('menu-panorama', {
        "type": "equirectangular",
        "panorama": `/locations/${body.imageKey}.jpg`,
        "autoLoad": true,
        "autoRotate": 2,
        "compass": false,
        "showControls": false
    });
}

function chooseSplashText() {
    let text = splashtexts[Math.floor(Math.random() * splashtexts.length)];
    document.getElementById("splash-text").innerHTML = text;
    document.getElementById("splash-text-shadow").innerHTML = text;
}

document.addEventListener('DOMContentLoaded', setRandomBackground);
document.addEventListener('DOMContentLoaded', chooseSplashText);