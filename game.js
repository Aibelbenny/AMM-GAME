import { saveScore, loadLeaderboard } from "./leaderboard.js";


// =====================================================
// CANVAS
// =====================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 700;


// =====================================================
// FRIEND IMAGE
// =====================================================

const friend = new Image();
friend.src = "images/friend.png";


// =====================================================
// SOUNDS
// =====================================================

const eggSound = new Audio("sounds/egg.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const music = new Audio("sounds/music.mp3");

music.loop = true;
music.volume = 0.3;


// =====================================================
// PLAYER
// =====================================================

const player = {
    x: 150,
    y: 570,
    width: 100,
    height: 120,
    speed: 8
};


// =====================================================
// GAME VARIABLES
// =====================================================

let objects = [];

let score = 0;

let lives = 3;

let fallSpeed = 3;

let gameStarted = false;

let gameOver = false;


// =====================================================
// SPAWN SETTINGS
// =====================================================

let spawnTime = 900;

let spawnTimer = null;


// Difficulty milestones

let nextSpeedScore = 10;

let nextSpawnScore = 20;


// =====================================================
// EFFECTS
// =====================================================

let particles = [];

let texts = [];

let shake = 0;

let flash = 0;


// =====================================================
// CONTROLS
// =====================================================

const keys = {};


// =====================================================
// KEYBOARD DOWN
// =====================================================

document.addEventListener("keydown", e => {

    keys[e.key] = true;

    if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === " "
    ) {

        e.preventDefault();

    }

});


// =====================================================
// KEYBOARD UP
// =====================================================

document.addEventListener("keyup", e => {

    keys[e.key] = false;

});


// =====================================================
// START MUSIC
// =====================================================

function startMusic() {

    music.play().catch(() => {});

}


// =====================================================
// CREATE FALLING OBJECT
// =====================================================

function createObject() {

    if (!gameStarted || gameOver) {
        return;
    }


    objects.push({

        x: Math.random() * 360,

        y: -40,

        size: 35,

        type:
            Math.random() < 0.75
                ? "egg"
                : "bomb",

        caught: false

    });

}


// =====================================================
// START OBJECT SPAWNING
// =====================================================

function startSpawning() {

    clearInterval(spawnTimer);


    spawnTimer = setInterval(
        createObject,
        spawnTime
    );

}


// =====================================================
// CREATE EFFECT
// =====================================================

function createEffect(x, y, text) {

    for (let i = 0; i < 10; i++) {

        particles.push({

            x: x,

            y: y,

            size:
                Math.random() * 5 + 2,

            speedX:
                (Math.random() - 0.5) * 5,

            speedY:
                (Math.random() - 0.5) * 5,

            life: 30

        });

    }


    texts.push({

        x: x,

        y: y,

        text: text,

        life: 50

    });

}


// =====================================================
// START SCREEN
// =====================================================

function showStartScreen() {

    const oldScreen =
        document.getElementById(
            "startScreen"
        );


    if (oldScreen) {

        oldScreen.remove();

    }


    const screen =
        document.createElement("div");


    screen.id = "startScreen";


    screen.innerHTML = `

        <div class="start-box">

            <div class="start-emoji">
                🥚 💣
            </div>

            <h2>
                Egg Catcher Battle
            </h2>

            <p>
                🧺 Catch the eggs!
            </p>

            <p>
                💣 Avoid the bombs!
            </p>

            <p>
                ❤️ You have 3 lives
            </p>

            <button id="startGame">
                ▶ START GAME
            </button>

        </div>

    `;


    document.body.appendChild(screen);


    document
        .getElementById("startGame")
        .addEventListener(
            "click",
            startGame
        );

}


// =====================================================
// START GAME
// =====================================================

function startGame() {

    gameStarted = true;

    gameOver = false;


    // Reset score

    score = 0;


    // Reset lives

    lives = 3;


    // Reset speed

    fallSpeed = 3;


    // Reset spawn speed

    spawnTime = 900;


    // Reset difficulty milestones

    nextSpeedScore = 10;

    nextSpawnScore = 20;


    // Clear objects

    objects = [];


    // Clear effects

    particles = [];

    texts = [];

    shake = 0;

    flash = 0;


    // Reset player

    player.x = 150;


    // Remove start screen

    const startScreen =
        document.getElementById(
            "startScreen"
        );


    if (startScreen) {

        startScreen.remove();

    }


    // Start music

    startMusic();


    // Start falling objects

    startSpawning();

}


// =====================================================
// UPDATE GAME
// =====================================================

function update() {

    if (!gameStarted || gameOver) {
        return;
    }


    // =================================================
    // PLAYER MOVEMENT
    // =================================================

    if (keys["ArrowLeft"]) {

        player.x -= player.speed;

    }


    if (keys["ArrowRight"]) {

        player.x += player.speed;

    }


    // Keep player inside canvas

    if (player.x < 0) {

        player.x = 0;

    }


    if (
        player.x + player.width >
        canvas.width
    ) {

        player.x =
            canvas.width -
            player.width;

    }


    // =================================================
    // BASKET
    // =================================================

    const basket = {

        x: player.x + 10,

        y: player.y - 20,

        width: 80,

        height: 30

    };


    // =================================================
    // UPDATE FALLING OBJECTS
    // =================================================

    objects.forEach(obj => {

        obj.y += fallSpeed;


        // =================================================
        // COLLISION
        // =================================================

        if (

            obj.x <
                basket.x +
                basket.width

            &&

            obj.x +
                obj.size >
                basket.x

            &&

            obj.y <
                basket.y +
                basket.height

            &&

            obj.y +
                obj.size >
                basket.y

        ) {


            // =============================================
            // EGG CAUGHT
            // =============================================

            if (obj.type === "egg") {

                score++;


                eggSound.currentTime = 0;

                eggSound
                    .play()
                    .catch(() => {});


                createEffect(
                    obj.x,
                    obj.y,
                    "+1"
                );

            }


            // =============================================
            // BOMB CAUGHT
            // =============================================

            if (obj.type === "bomb") {

                lives--;

                shake = 15;

                flash = 10;


                createEffect(
                    obj.x,
                    obj.y,
                    "💥"
                );

            }


            obj.caught = true;

        }


        // =================================================
        // OBJECT REACHED BOTTOM
        // =================================================

        if (
            obj.y > canvas.height
        ) {


            // Missing an egg = lose life

            if (obj.type === "egg") {

                lives--;

                shake = 15;

                flash = 10;

            }


            // Missing a bomb = nothing


            obj.caught = true;

        }

    });


    // Remove caught objects

    objects =
        objects.filter(
            obj => !obj.caught
        );


    // =================================================
    // SPEED INCREASE EVERY 10 SCORE
    // =================================================

    if (
        score >= nextSpeedScore
    ) {

        // Increase speed by 1.2

        fallSpeed += 1.2;


        // Next speed milestone

        nextSpeedScore += 10;

    }


    // =================================================
    // SPAWN FASTER EVERY 20 SCORE
    // =================================================

    if (
        score >= nextSpawnScore
    ) {

        spawnTime -= 100;


        // Minimum spawn interval

        if (spawnTime < 300) {

            spawnTime = 300;

        }


        // Next spawn milestone

        nextSpawnScore += 20;


        // Restart spawning timer ONCE

        startSpawning();

    }


    // =================================================
    // PARTICLES
    // =================================================

    particles.forEach(p => {

        p.x += p.speedX;

        p.y += p.speedY;

        p.life--;

    });


    particles =
        particles.filter(
            p => p.life > 0
        );


    // =================================================
    // FLOATING TEXT
    // =================================================

    texts.forEach(t => {

        t.y -= 1;

        t.life--;

    });


    texts =
        texts.filter(
            t => t.life > 0
        );


    // =================================================
    // SCREEN EFFECTS
    // =================================================

    if (shake > 0) {

        shake--;

    }


    if (flash > 0) {

        flash--;

    }


    // =================================================
    // GAME OVER
    // =================================================

    if (lives <= 0) {

        endGame();

    }

}


// =====================================================
// GAME OVER
// =====================================================

function endGame() {

    if (gameOver) {

        return;

    }


    gameOver = true;


    clearInterval(
        spawnTimer
    );


    gameOverSound.currentTime = 0;

    gameOverSound
        .play()
        .catch(() => {});


    showGameOverPanel();

}


// =====================================================
// DRAW
// =====================================================

function draw() {

    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =================================================
    // SCREEN SHAKE
    // =================================================

    if (shake > 0) {

        ctx.translate(

            Math.random() * 10 - 5,

            Math.random() * 10 - 5

        );

    }


    // =================================================
    // SCORE
    // =================================================

    ctx.fillStyle = "black";

    ctx.font = "25px Arial";

    ctx.fillText(
        "🥚 " + score,
        20,
        40
    );


    // =================================================
    // LIVES
    // =================================================

    ctx.fillText(
        "❤️ " + lives,
        280,
        40
    );


    // =================================================
    // FALLING OBJECTS
    // =================================================

    objects.forEach(obj => {

        ctx.font = "40px Arial";


        ctx.fillText(

            obj.type === "egg"
                ? "🥚"
                : "💣",

            obj.x,

            obj.y

        );

    });


    // =================================================
    // BASKET
    // =================================================

    ctx.font = "50px Arial";

    ctx.fillText(
        "🧺",
        player.x + 20,
        player.y - 15
    );


    // =================================================
    // FRIEND
    // =================================================

    if (friend.complete) {

        ctx.drawImage(

            friend,

            player.x,

            player.y,

            player.width,

            player.height

        );

    }


    // =================================================
    // PARTICLES
    // =================================================

    particles.forEach(p => {

        ctx.fillStyle = "yellow";

        ctx.fillRect(

            p.x,

            p.y,

            p.size,

            p.size

        );

    });


    // =================================================
    // FLOATING TEXT
    // =================================================

    texts.forEach(t => {

        ctx.fillStyle = "green";

        ctx.font = "30px Arial";

        ctx.fillText(

            t.text,

            t.x,

            t.y

        );

    });


    // =================================================
    // DAMAGE FLASH
    // =================================================

    if (flash > 0) {

        ctx.fillStyle =
            "rgba(255,0,0,0.3)";


        ctx.fillRect(

            0,

            0,

            canvas.width,

            canvas.height

        );

    }


    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );

}


// =====================================================
// GAME OVER PANEL
// =====================================================

function showGameOverPanel() {

    const oldPanel =
        document.getElementById(
            "gameOverPanel"
        );


    if (oldPanel) {

        oldPanel.remove();

    }


    const panel =
        document.createElement("div");


    panel.id = "gameOverPanel";


    panel.innerHTML = `

        <div class="game-over-box">

            <h2>
                💥 GAME OVER 💥
            </h2>


            <p>

                Score:

                <strong>
                    ${score}
                </strong>

            </p>


            <input
                id="playerName"
                type="text"
                maxlength="20"
                placeholder="Enter your name"
                autocomplete="off"
            >


            <button id="saveScore">

                💾 SAVE SCORE

            </button>


            <button id="retryGame">

                🔄 RETRY

            </button>

        </div>

    `;


    document.body.appendChild(panel);


    // =================================================
    // SAVE SCORE
    // =================================================

    document
        .getElementById("saveScore")
        .addEventListener(
            "click",
            async () => {

                const input =
                    document.getElementById(
                        "playerName"
                    );


                const name =
                    input.value.trim();


                if (!name) {

                    alert(
                        "Please enter your name!"
                    );

                    input.focus();

                    return;

                }


                const button =
                    document.getElementById(
                        "saveScore"
                    );


                button.disabled = true;

                button.textContent =
                    "Saving...";


                try {

                    await saveScore(
                        name,
                        score
                    );


                    button.textContent =
                        "✅ SAVED";

                }

                catch (error) {

                    console.error(
                        error
                    );


                    button.disabled =
                        false;


                    button.textContent =
                        "💾 SAVE SCORE";

                }

            }
        );


    // =================================================
    // RETRY
    // =================================================

    document
        .getElementById("retryGame")
        .addEventListener(
            "click",
            () => {

                panel.remove();

                restart();

            }
        );

}


// =====================================================
// RESTART
// =====================================================

function restart() {

    clearInterval(
        spawnTimer
    );


    gameStarted = false;

    gameOver = false;


    score = 0;

    lives = 3;

    fallSpeed = 3;

    spawnTime = 900;


    // Reset difficulty

    nextSpeedScore = 10;

    nextSpawnScore = 20;


    objects = [];

    particles = [];

    texts = [];

    shake = 0;

    flash = 0;


    player.x = 150;


    gameOverSound.pause();

    gameOverSound.currentTime = 0;


    showStartScreen();

}


// =====================================================
// MOBILE CONTROLS
// =====================================================

const left =
    document.getElementById("left");

const right =
    document.getElementById("right");


if (left && right) {


    // =================================================
    // LEFT TOUCH
    // =================================================

    left.addEventListener(
        "touchstart",
        e => {

            e.preventDefault();

            keys["ArrowLeft"] = true;

        },
        {
            passive: false
        }
    );


    left.addEventListener(
        "touchend",
        e => {

            e.preventDefault();

            keys["ArrowLeft"] = false;

        },
        {
            passive: false
        }
    );


    left.addEventListener(
        "touchcancel",
        e => {

            e.preventDefault();

            keys["ArrowLeft"] = false;

        },
        {
            passive: false
        }
    );


    // =================================================
    // RIGHT TOUCH
    // =================================================

    right.addEventListener(
        "touchstart",
        e => {

            e.preventDefault();

            keys["ArrowRight"] = true;

        },
        {
            passive: false
        }
    );


    right.addEventListener(
        "touchend",
        e => {

            e.preventDefault();

            keys["ArrowRight"] = false;

        },
        {
            passive: false
        }
    );


    right.addEventListener(
        "touchcancel",
        e => {

            e.preventDefault();

            keys["ArrowRight"] = false;

        },
        {
            passive: false
        }
    );


    // =================================================
    // LEFT MOUSE
    // =================================================

    left.addEventListener(
        "mousedown",
        () => {

            keys["ArrowLeft"] = true;

        }
    );


    left.addEventListener(
        "mouseup",
        () => {

            keys["ArrowLeft"] = false;

        }
    );


    left.addEventListener(
        "mouseleave",
        () => {

            keys["ArrowLeft"] = false;

        }
    );


    // =================================================
    // RIGHT MOUSE
    // =================================================

    right.addEventListener(
        "mousedown",
        () => {

            keys["ArrowRight"] = true;

        }
    );


    right.addEventListener(
        "mouseup",
        () => {

            keys["ArrowRight"] = false;

        }
    );


    right.addEventListener(
        "mouseleave",
        () => {

            keys["ArrowRight"] = false;

        }
    );

}


// =====================================================
// LOAD LEADERBOARD
// =====================================================

loadLeaderboard();


// =====================================================
// SHOW START SCREEN
// =====================================================

showStartScreen();


// =====================================================
// GAME LOOP
// =====================================================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


gameLoop();