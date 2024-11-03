function generateQRCode() {
    var qrcode = new QRCode("qrcode",
        "https://ycp.campusgeo.com/play?gameid=123456");
    //get actual game code from api
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

document.addEventListener('DOMContentLoaded', addCopyListeners);