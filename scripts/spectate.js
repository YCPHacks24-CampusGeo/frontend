async function getLeaderboard() {
    document.getElementById("guesses").classList.add("disabled");
    const response = await ApiRequest("test", "getscores", "GET");
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
    if(second == null) {
        document.getElementById("second").classList.add("disabled");
    } else {
        document.getElementById("second").classList.remove("disabled");
        let secondImg = document.getElementById("secondImg");
        let secondName = document.getElementById("secondName");
        let secondScore = document.getElementById("secondScore");
        secondImg.src = `/icons/${second.icon}.jpg`;
        secondName.innerHTML = second.name;
        secondScore.innerHTML = second.score;
    }
    if(third == null) {
        document.getElementById("third").classList.add("disabled");
    } else {
        document.getElementById("third").classList.remove("disabled");
        let thirdImg = document.getElementById("thirdImg");
        let thirdName = document.getElementById("thirdName");
        let thirdScore = document.getElementById("thirdScore");
        thirdImg.src = `/icons/${third.icon}.jpg`;
        thirdName.innerHTML = third.name;
        thirdScore.innerHTML = third.score;
    }
}

async function displayAndPopulateMap() {
    document.getElementById("title").classList.add("disabled");
    map = L.map("map").setView([39.946952, -76.727429], 18);

    L.tileLayer('https://map.ycp.campusgeo.com/{z}/{x}/{y}.png', {
        maxZoom: 20,
        minZoom: 14
    }).addTo(map);

    const response = await ApiRequest("test", "getguesses", "GET");
    const body = await response.json();

    body.guesses.forEach(function(item, index, array){
       const iconFile = `/markers/${item.icon}.png`

        marker = L.icon({
            iconUrl: iconFile,
            iconAnchor: [17, 47],
            iconSize: [33, 47]
        });

        const lat = item.guess.latitude;
        const lng = item.guess.longitude;
        L.marker([lat, lng], {icon: marker}).addTo(map);
    });
    L.marker([body.correct.geoLocation.latitude, body.correct.geoLocation.longitude]).addTo(map);
}

document.addEventListener('DOMContentLoaded', getLeaderboard);