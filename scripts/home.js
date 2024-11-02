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