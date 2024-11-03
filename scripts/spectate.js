let spectatorMap = null;

async function getLeaderboard() {
    document.getElementById("wait-message").style.opacity = "0.0";
    document.getElementById("map").style.opacity = "0.0";
    document.getElementById("leaderboard").style.opacity = "1.0";
    document.getElementById("title").style.opacity = "1.0";
    document.getElementById("guesses").style.opacity = "0.0";
    const response = await ApiRequest("Spectate", "GetScores", "GET");
    const body = await response.json();

    let first = null;
    let second = null;
    let third = null;
    body.forEach(function(item, index, array) {
        console.log(item);
        let score = item.score;
        if(first == null || first.score < score) {
            third = second;
            second = first;
            first = item;
        } else if(second == null || second.score < score) {
            third = second;
            second = item;
        } else if(third == null || third.score < score) {
            third = item;
        }
    });

    let firstImg = document.getElementById("firstImg");
    let firstName = document.getElementById("firstName");
    let firstScore = document.getElementById("firstScore");
    firstImg.src = `/icons/${first.icon}.jpg`;
    firstName.innerHTML = first.name;
    firstScore.innerHTML = first.score;
    document.getElementById("first").style.opacity = "1.0";
    if(second == null) {
        document.getElementById("second").style.opacity = "0.0";
    } else {
        let secondImg = document.getElementById("secondImg");
        let secondName = document.getElementById("secondName");
        let secondScore = document.getElementById("secondScore");
        secondImg.src = `/icons/${second.icon}.jpg`;
        secondName.innerHTML = second.name;
        secondScore.innerHTML = second.score;
        document.getElementById("second").style.opacity = "1.0";
    }
    if(third == null) {
        document.getElementById("third").style.opacity = "0.0";
    } else {
        let thirdImg = document.getElementById("thirdImg");
        let thirdName = document.getElementById("thirdName");
        let thirdScore = document.getElementById("thirdScore");
        thirdImg.src = `/icons/${third.icon}.jpg`;
        thirdName.innerHTML = third.name;
        thirdScore.innerHTML = third.score;
        document.getElementById("third").style.opacity = "1.0";
    }
}

async function displayAndPopulateMap() {
    document.getElementById("wait-message").style.opacity = "0.0";
    document.getElementById("map").style.opacity = "1.0";
    document.getElementById("leaderboard").style.opacity = "0.0";
    document.getElementById("title").style.opacity = "0.0";
    document.getElementById("guesses").style.opacity = "1.0";
    spectatorMap = L.map("map").setView([39.946952, -76.727429], 18);

    L.tileLayer('https://map.ycp.campusgeo.com/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 14
    }).addTo(spectatorMap);

    const response = await ApiRequest("Spectate", "GetGuesses", "GET");
    const body = await response.json();

    body.guesses.forEach(function(item, index, array){
       const iconFile = `/markers/${item.icon}.png`

        marker = L.icon({
            iconUrl: iconFile,
            iconAnchor: [17, 47],
            iconSize: [33, 47]
        });

        if(item.guess !== null) {
            const lat = item.guess.latitude;
            const lng = item.guess.longitude;
            L.marker([lat, lng], {icon: marker}).addTo(spectatorMap);
        }
    });
    let correctLat = body.correct.geoLocation.latitude
    let correctLon = body.correct.geoLocation.longitude
    L.marker([correctLat, correctLon]).addTo(spectatorMap);
    spectatorMap.setView([correctLat, correctLon], 17);
}

window.onload = async function () {
    const params = new URLSearchParams(window.location.search);
    const myParam = params.get('gameid');

    if (myParam) {
        const response = await ApiRequest("Spectate", `WatchGame?gameId=${myParam}`, "GET");
        console.log(response);
        if(response.status !== 200) {
            alert("Invalid Game ID");
            window.location.href = '/';
        }
        window.location.href = '/spectate'
    } else {
        console.log('Parameter not found');
    }
};

function stateChange(oldState, newState) {
    console.log(`State Change: ${oldState} to ${newState}`);
    if(newState === GameStates.INTERMISSION) {
        document.getElementById("timer").style.opacity = "1.0";
        displayAndPopulateMap();
    } else if(newState === GameStates.GUESS) {
        document.getElementById("timer").style.opacity = "1.0";
        if(spectatorMap) {
            spectatorMap.remove();
        }
        getLeaderboard();
    } else if(newState === GameStates.COMPLETE) {
        document.getElementById("timer").style.opacity = "0.0";

    }
}

function updateTime(timeLeft) {
    document.getElementById("timer").innerHTML = timeLeft;
    console.log(timeLeft)
}

SubscribeGameState(stateChange);
SubscribeTimeLeft(updateTime);
stateChange(null, GameState);