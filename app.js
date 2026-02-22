const COOKIE_QUOTES = [
    "A surprise guest will bring you joy.",
    "Your kindness will open new doors.",
    "A journey of a thousand miles begins with a single step.",
    "Good fortune comes to those who persevere.",
    "An unexpected opportunity is heading your way.",
    "Your creativity will lead to great success.",
    "A wise friend will offer valuable advice soon.",
    "Happiness is a choice you make every day.",
    "Your dreams are closer than they appear.",
    "Kindness repaid will come from an unexpected source."
];

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
        const existing = gameArea.querySelectorAll('.balloon:not(.cookie-revealed)');
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

        const isCookie = Math.random() < 0.15;
        const quote = isCookie ? COOKIE_QUOTES[Math.floor(Math.random() * COOKIE_QUOTES.length)] : null;

        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.position = "absolute";
        balloon.style.left = x + "px";
        balloon.style.bottom = y + "px";
        const pastelHues = [0, 25, 45, 140, 200, 280, 330];
        const hue = pastelHues[Math.floor(Math.random() * pastelHues.length)] + (Math.random() * 15 - 5);
        balloon.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 88%) 0%, hsl(${hue}, 75%, 65%) 100%)`;
        balloon.dataset.quote = quote || '';

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
            if (quote) balloon.dataset.isCookie = 'true';
        });
        balloon.addEventListener("animationend", () => {
            if (balloon.dataset.isCookie === 'true') {
                balloon.classList.remove("popping");
                balloon.classList.add("cookie-revealed");
                balloon.innerHTML = `
                    <div class="cookie-quote">${quote}</div>
                    <button class="continue-btn">Continue</button>
                `;
                balloon.style.background = 'linear-gradient(180deg, #fff8e7 0%, #f5e6c8 100%)';
                balloon.style.width = '220px';
                balloon.style.minHeight = '120px';
                balloon.style.left = (parseFloat(balloon.style.left) || 0) - 82 + 'px';
                balloon.style.bottom = (parseFloat(balloon.style.bottom) || 0) - 30 + 'px';
                balloon.style.borderRadius = '8px';
                balloon.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                balloon.style.padding = '16px';
                balloon.style.display = 'flex';
                balloon.style.flexDirection = 'column';
                balloon.style.alignItems = 'center';
                balloon.style.justifyContent = 'center';
                balloon.style.gap = '12px';
                balloon.style.opacity = '1';

                pauseGame();
                const tadaa = new Audio("img/tadaa.mp3");
                tadaa.play();

                balloon.querySelector('.continue-btn').addEventListener('click', () => {
                    balloon.remove();
                    playGame();
                });
            } else {
                balloon.classList.remove("popping");
                balloon.remove();
            }
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