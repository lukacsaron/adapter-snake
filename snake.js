const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 450, y: 600 }];
let dx = 20;
let dy = 0;
const obstacleWidth = 113;
const obstacleHeight = 143;  // Adjust height as needed
let obstacles = [];
let score = 0;
let gameState = 'start'; // 'start', 'playxing', 'gameOver'
let food;
let startTextVisible = true;
let gameOverVisible = true;

const backgroundImage = new Image();
backgroundImage.src = 'windows.jpg'; // Replace with the path to your image file

backgroundImage.onload = function() {
    // Now you can initialize the game
    drawBackground();
    initializeObstacles();
    blinkStartText();
};

function drawBackground() {
    // Set the global alpha (opacity) for the canvas
    ctx.globalAlpha = 0.5;
    // Draw the background image
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // Reset global alpha so it doesn't affect other drawings
    ctx.globalAlpha = 1.0;
}


function initializeObstacles() {
    obstacles = [
        // Row 1
        { x: 28, y: 74 },
        { x: 194, y: 74 },
        { x: 357, y: 74 },
        { x: 590, y: 74 },
        { x: 815, y: 74 },
        { x: 1047, y: 74 },
        { x: 1274, y: 74 }, 
        // Row 2
        { x: 28, y: 385 },
        { x: 194, y: 385 },
        { x: 357, y: 385 },
        { x: 590, y: 385 },
        { x: 815, y: 385 },
        { x: 1047, y: 385 },
        { x: 1274, y: 385 }, 
        // Row 3
        { x: 28, y: 676 },
        { x: 194, y: 676 },
        { x: 357, y: 676 },
        { x: 590, y: 676 },
        { x: 815, y: 676 },
        { x: 1047, y: 676 },
        { x: 1274, y: 676 }, 
    ];
}

function getRandomFoodPosition() {
    let newPosition;
    while (true) {
        newPosition = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20
        };

        let collisionWithObstacle = obstacles.some(obstacle =>
            newPosition.x < obstacle.x + obstacleWidth &&
            newPosition.x + 20 > obstacle.x &&
            newPosition.y < obstacle.y + obstacleHeight &&
            newPosition.y + 20 > obstacle.y);

        if (!collisionWithObstacle) {
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
        ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
}

function drawFood() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(food.x, food.y, 20, 20);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wrap the snake position if it goes off the canvas edges
    if (head.x < 0) {
        head.x = canvas.width - 20; // Subtract the snake part size to avoid any overlap
    } else if (head.x >= canvas.width) {
        head.x = 0;
    }

    if (head.y < 0) {
        head.y = canvas.height - 20; // Subtract the snake part size to avoid any overlap
    } else if (head.y >= canvas.height) {
        head.y = 0;
    }

    snake.unshift(head);

    if (head.x < food.x + 20 && head.x + 20 > food.x && head.y < food.y + 20 && head.y + 20 > food.y) {
        score += 100;
        food = getRandomFoodPosition();
        // Don't remove the last part of the snake to make it grow
    } else {
        snake.pop(); // Move the snake
    }

    // The collision with obstacles and the game over condition remain unchanged
    obstacles.forEach(obstacle => {
        if (head.x < obstacle.x + obstacleWidth &&
            head.x + 20 > obstacle.x &&
            head.y < obstacle.y + obstacleHeight &&
            head.y + 20 > obstacle.y) {
            gameState = 'gameOver';
            setTimeout(() => {
                gameState = 'start';
                blinkStartText();
            }, 4000);
            return;
        }
    });
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
    if (gameState === 'playing') {
        setTimeout(function onTick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground();
            drawObstacles();
            drawFood();
            moveSnake();
            drawSnake();
            drawScore();
            gameLoop();
        }, 100);
    } else if (gameState === 'gameOver') {
        drawGameOverText();
    }
}

function drawGameOverText() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '50px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function blinkStartText() {
    if (gameState === 'start') {
        startTextVisible = !startTextVisible;
        clearCanvas();
        if (startTextVisible) {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'green';
            ctx.textAlign = 'center';
            ctx.fillText('Press any button to start the game', canvas.width / 2, canvas.height / 2);
        }
        setTimeout(blinkStartText, 500);
    }
}

document.addEventListener("keydown", function(event) {
    if (gameState === 'start') {
        gameState = 'playing';
        snake = [{ x: 450, y: 600 }];
        dx = 20;
        dy = 0;
        score = 0;
        food = getRandomFoodPosition();
        gameLoop();
    } else if (gameState === 'playing') {
        changeDirection(event);
    }
});
