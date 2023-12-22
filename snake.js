const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 200, y: 200 }];
let dx = 20;
let dy = 0;
let obstacles = [];

let score = 0;
let gameRunning = true;
let food = getRandomFoodPosition();
let gameOverVisible = true;

// Initialize obstacles
const obstacleSize = 40; // Changed from 50 to 40

// Initialize obstacles
for (let i = 0; i < 6; i++) {
    obstacles.push({
        x: Math.floor(Math.random() * ((canvas.width - obstacleSize) / 20)) * 20,
        y: Math.floor(Math.random() * ((canvas.height - obstacleSize) / 20)) * 20
    });
}

function getRandomFoodPosition() {
    let newPosition;
    while (true) {
        newPosition = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20
        };

        if (!obstacles.some(obstacle => obstacle.x === newPosition.x && obstacle.y === newPosition.y)) {
            break;
        }
    }
    return newPosition;
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokestyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacleSize, obstacleSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake has eaten food
    if (head.x === food.x && head.y === food.y) {
        score += 100; // Increase score
        food = getRandomFoodPosition(); // Reposition food
    } else {
        snake.pop(); // Remove the tail
    }

    // Check for collision with borders
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameRunning = false;
    }

    // Check for collision with obstacles
    // Check for collision with obstacles
    obstacles.forEach(obstacle => {
        if (head.x < obstacle.x + obstacleSize &&
            head.x + 20 > obstacle.x &&
            head.y < obstacle.y + obstacleSize &&
            head.y + 20 > obstacle.y) {
            gameRunning = false;
        }
    });

    if (!gameRunning) {
        return; // Stop further execution if game over
    }

}


function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -20;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 20;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

function gameLoop() {
    if (gameRunning) {
        setTimeout(function onTick() {
            clearCanvas();
            drawObstacles();
            drawFood();
            moveSnake();
            drawSnake();
            drawScore();
            gameLoop();
        }, 100);
    } else {
        blinkGameOver();
    }
}

function blinkGameOver() {
    if (!gameRunning) {
        gameOverVisible = !gameOverVisible;
        if (gameOverVisible) {
            drawGameOverText();
        } else {
            clearGameOverText();
        }
        setTimeout(blinkGameOver, 500);
    }
}

function drawGameOverText() {
    ctx.font = '50px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}

function clearGameOverText() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green border
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener("keydown", changeDirection);
gameLoop();
