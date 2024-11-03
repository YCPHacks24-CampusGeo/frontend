let background = null;

function play_button() {
    let gameid = getGameId();
    if (!gameid) return;
    window.location.href = `/play?gameid=${gameid}`;
}

function host_button() {
    window.location.href = '/create';
}

function spectate_button() {
    let gameid = getGameId();
    if (!gameid) return;
    window.location.href = `/spectate?gameid=${gameid}`;
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

document.addEventListener('DOMContentLoaded', setRandomBackground);