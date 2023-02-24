const gameContainer = document.querySelector('#game-container');
const startContainer = document.querySelector('#start-container');
const canvas = document.querySelector('#draw-board');
const image = document.querySelector('.figure-img');
const playButton = document.querySelector('#play');
const playAgainButton = document.querySelector('#playAgain');

gameContainer.style.display = 'none';
playAgainButton.style.display = 'none';

playButton.addEventListener('click', () => {
    gameContainer.style.display = 'block';
    startContainer.style.display = 'none';
    playButton.style.display = 'none';
    canvas.width = image.width;
    canvas.height = image.height;
    play();
});

playAgainButton.addEventListener('click', () => {
    play();
});

let bestScore = 0;

function play() {
    playAgainButton.style.display = 'none';
    const ctx = canvas.getContext('2d');
    const blockSize = 10;
    const snake = [{ x: 4, y: 4 }, { x: 3, y: 4 }, { x: 2, y: 4 }, { x: 1, y: 4 }, { x: 0, y: 4 }];
    let dx = 1;
    let dy = 0;
    let score = 0;
    let interval = 100;
    let food = generateFood();
    document.addEventListener("keydown", changeDirection);

    function generateFood() {
        return {
            x: Math.floor(Math.random() * canvas.width / blockSize),
            y: Math.floor(Math.random() * canvas.height / blockSize),
        };
    }

    function changeDirection(event) {
        if (event.keyCode === 37 && dx !== 1) {
            dx = -1;
            dy = 0;
        } else if (event.keyCode === 38 && dy !== 1) {
            dx = 0;
            dy = -1;
        } else if (event.keyCode === 39 && dx !== -1) {
            dx = 1;
            dy = 0;
        } else if (event.keyCode === 40 && dy !== -1) {
            dx = 0;
            dy = 1;
        }
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            ++score;
            interval -= 5;
            food = generateFood();
        } else {
            snake.pop();
        }
    }

    function gameLoop() {
        if (checkCollision()) {
            gameOver();
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        drawSnake();
        moveSnake();
        document.getElementById("score").innerHTML = "Score : " + score + " x 🍎";
        setTimeout(gameLoop, interval);
    }

    function drawBlock(ctx, position) {
        const x = position.x * blockSize;
        const y = position.y * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function drawFood() {
        ctx.fillStyle = "red";
        drawBlock(ctx, food);
    }

    function drawSnake() {
        ctx.fillStyle = "green";
        snake.forEach((position) => {
            drawBlock(ctx, position);
        });
    }

    function checkCollision() {
        const head = snake[0];
        if (head.x < 0 || head.x >= canvas.width / blockSize || head.y < 0 ||  head.y >= canvas.height / blockSize) {
            checkBestScore();
            return true;
        }
        for (let i = 1; i < snake.length; ++i) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                checkBestScore();
                return true;
            }
        }
        return false;
    }

    function checkBestScore() {
        if (score > bestScore) {
            bestScore = score;
            document.getElementById("best-score").innerHTML = "🏆 Best Score : " + bestScore + " x 🍎";
        }
    }

    function gameOver() {
        ctx.font = "40px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Game Over !", canvas.width / 2 - 110, canvas.height / 2);
        playAgainButton.style.display = 'block';
    }
    gameLoop();
}