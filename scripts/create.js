function updateValue(id, value) {
    document.getElementById(id).textContent = value;
}

async function submitValues() {
    let gameOptions = {
        RoundCount: document.getElementById('roundCountSlider').value,
        GuessTime: document.getElementById('guessTimeSlider').value,
        IntermissionTime: document.getElementById('intermissionTimeSlider').value,
        MaxPlayers  : document.getElementById('maxPlayersSlider').value,
    }

    console.log(gameOptions);

    let result = await ApiRequest("host", "creategame", 'POST', gameOptions);
    if (result.status !== 200) {
        alert(`Failed to Create Game: ${result.statusText}`)
        return;
    }

    console.log(`Match created: ${(await result.json())}`);

    //alert()

    //window.location.replace('/host');
}