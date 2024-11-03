async function generateGameInfo() {
    let result = await ApiRequest("Game", "GetGameId", 'GET');
    let gameid = await result.json();
    new QRCode("qrcode", `https://ycp.campusgeo.com/play/?gameid=${gameid}`);
    document.getElementById('game-id').innerHTML = gameid;
    document.getElementById('game-link').innerHTML = `https://ycp.campusgeo.com/play/?gameid=${gameid}`;
}

function addCopyListeners() {
    document.getElementById('copy-id').addEventListener('click', function() {
        const gameid = document.getElementById('game-id').innerText;
        navigator.clipboard.writeText(gameid).then(() => {
            alert('Text copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    document.getElementById('copy-link').addEventListener('click', function() {
        const gameurl = document.getElementById('game-link').innerText;
        navigator.clipboard.writeText(gameurl).then(() => {
            alert('Text copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
}

async function startGame() {
    await ApiRequest("Host", "StartGame", 'POST');
    document.getElementById('start-button').remove();
}

document.addEventListener('DOMContentLoaded', addCopyListeners);