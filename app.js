
document.querySelector('#btn').addEventListener("click", () => {
    const header = document.querySelector('header');
    const main = document.querySelector('main');

    header.remove();
    main.remove();

    const gameHeader = document.createElement('div');
    gameHeader.classList.add('game-header');
    gameHeader.innerHTML = `
        <button id="play-btn" class="ctrl-btn">Play</button>
        <button id="pause-btn" class="ctrl-btn">Pause</button>
    `;
    document.body.appendChild(gameHeader);

    createBalloons(addGameArea(), gameHeader);
});

const addGameArea = () => {
    const gameArea = document.createElement('div');
    gameArea.classList.add('gameArea');
    document.body.appendChild(gameArea);
    return gameArea;
}  

const createBalloons = (gameArea, gameHeader) => {
    const size = 55;
    const radius = size / 2;
    let balloonInterval;

    const addBalloon = () => {
        const existing = gameArea.querySelectorAll('.balloon');
        const areaHeight = gameArea.clientHeight;
        const areaWidth = gameArea.clientWidth;

        let x, y;
        let overlapping;
        let attempts = 0;

        do {
            x = Math.random() * (areaWidth - size);
            y = Math.random() * (areaHeight - size);
            overlapping = false;

            for (const el of existing) {
                const bx = parseFloat(el.style.left) || 0;
                const by = parseFloat(el.style.bottom) || 0;
                const dx = (x + radius) - (bx + radius);
                const dy = (y + radius) - (by + radius);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < size * 2) {
                    overlapping = true;
                    break;
                }
            }

            attempts++;
            if (attempts >= 100) break;

        } while (overlapping);

        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.position = "absolute";
        balloon.style.left = x + "px";
        balloon.style.bottom = y + "px";
        const pastelHues = [0, 25, 45, 140, 200, 280, 330];
        const hue = pastelHues[Math.floor(Math.random() * pastelHues.length)] + (Math.random() * 15 - 5);
        balloon.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 88%) 0%, hsl(${hue}, 75%, 65%) 100%)`;

        gameArea.appendChild(balloon);
        balloon.addEventListener("click", () => {
            const audio = new Audio("img/balloon-pop.mp3");
            audio.play();
            const style = getComputedStyle(balloon);
            const transform = style.transform;
            const match = transform.match(/matrix.*,\s*([-\d.]+)\)/);
            const translateY = match ? match[1] + "px" : "0px";
            balloon.style.setProperty("--floatY", translateY);
            balloon.classList.add("popping");
        });
        balloon.addEventListener("animationend", () => {
            balloon.classList.remove("popping");
            balloon.remove();
        });
    };

    const pauseGame = () => {
        clearInterval(balloonInterval);
        gameArea.classList.add('paused');
    };

    const playGame = () => {
        gameArea.classList.remove('paused');
        balloonInterval = setInterval(addBalloon, 500);
    };

    gameHeader.querySelector('#play-btn').addEventListener('click', playGame);
    gameHeader.querySelector('#pause-btn').addEventListener('click', pauseGame);

    for (let i = 0; i < 8; i++) addBalloon();
    balloonInterval = setInterval(addBalloon, 500);
};