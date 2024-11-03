const GameStates = Object.freeze({
    SETUP: "SETUP",
    GUESS: "GUESS",
    INTERMISSION: "INTERMISSION",
    COMPLETE: "COMPLETE"
});

let GameState = null;
let TimeLeft = null;

setInterval(CallGetState, 1000);

let GameStateSubscriber;
let TimeLeftSubscriber;

async function CallGetState() {
    let response = await fetch("https://api.ycp.campusgeo.com/game/getgamestate", {
        method: 'GET',
        credentials: 'include'
    });

    if (response.ok) {
        let body = await response.json();

        let oldGameState = GameState;
        let oldTimeLeft = TimeLeft;

        GameState = body.gameState;
        TimeLeft = body.timeLeft;


        if (oldGameState !== GameState) {
            if (GameStateSubscriber) {
                GameStateSubscriber(oldGameState, GameState);
            }
        }

        if (oldTimeLeft !== TimeLeft) {
            if (TimeLeftSubscriber) {
                TimeLeftSubscriber(TimeLeft);
            }
        }

    } else {
        console.log('no game state found');
    }
}


function SubscribeGameState(callback) {
    GameStateSubscriber = callback;
}

function SubscribeTimeLeft(callback) {
    TimeLeftSubscriber = callback;
}