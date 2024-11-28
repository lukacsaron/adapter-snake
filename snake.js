const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const introBackgroundImage = new Image();
introBackgroundImage.src = 'intro-placeholder.jpg';


let snake = [{ x: 450, y: 600 }];
let dx = 20;
let dy = 0;
const obstacleWidth = 113;
const obstacleHeight = 143;  // Adjust height as needed
let obstacles = [];
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'gameOver'
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
        { x: 28, y: 74, width: 120, height: 143 },
        { x: 194, y: 74, width: 113, height: 143 },
        { x: 357, y: 74, width: 113, height: 143 },
        { x: 590, y: 74, width: 113, height: 143 },
        { x: 815, y: 74, width: 113, height: 143 },
        { x: 1047, y: 74, width: 113, height: 143 },
        { x: 1274, y: 74, width: 113, height: 143 }, 
        { x: 28, y: 385, width: 113, height: 143 },
        { x: 194, y: 385, width: 113, height: 143 },
        { x: 357, y: 385, width: 113, height: 143 },
        { x: 590, y: 385, width: 113, height: 143 },
        { x: 815, y: 385, width: 113, height: 143 },
        { x: 1047, y: 385, width: 113, height: 143 },
        { x: 1274, y: 385, width: 113, height: 143 }, 
        { x: 28, y: 676, width: 113, height: 143 },
        { x: 194, y: 676, width: 113, height: 143 },
        { x: 357, y: 676, width: 113, height: 143 },
        { x: 590, y: 676, width: 113, height: 143 },
        { x: 815, y: 676, width: 113, height: 143 },
        { x: 1047, y: 676, width: 113, height: 143 },
        { x: 1274, y: 676, width: 113, height: 143 }, 
    ];
}

function getRandomFoodPosition() {
    let newPosition;
    do {
        newPosition = {
            x: Math.floor(Math.random() * ((canvas.width - 20) / 20)) * 20,
            y: Math.floor(Math.random() * ((canvas.height - 20) / 20)) * 20
        };
    } while (checkCollisionWithObstacles(newPosition) || isTooCloseToObstacles(newPosition));
    return newPosition;
}

function isTooCloseToObstacles(position) {
    return obstacles.some(obstacle =>
        position.x < obstacle.x + obstacle.width &&
        position.x + 20 > obstacle.x &&
        position.y < obstacle.y + obstacle.height + 60 &&
        position.y + 20 > obstacle.y - 60
    );
}


function checkCollisionWithObstacles(position) {
    return obstacles.some(obstacle => 
        position.x < obstacle.x + obstacle.width &&
        position.x + 20 > obstacle.x &&
        position.y < obstacle.y + obstacle.height &&
        position.y + 20 > obstacle.y
    );
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4; // Ensure a consistent border width
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20);
    ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
}


function drawSnake() {
    snake.forEach(drawSnakePart);
}


function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'black';
        if (obstacle.type === 'arch') {
            // Draw the arch part of the obstacle
            ctx.beginPath();
            ctx.moveTo(obstacle.x, obstacle.y + obstacle.height / 2);
            ctx.arcTo(obstacle.x, obstacle.y, obstacle.x + obstacle.width, obstacle.y, obstacle.width / 2);
            ctx.arcTo(obstacle.x + obstacle.width, obstacle.y, obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2, obstacle.width / 2);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();
            
            // Draw the rectangular part of the obstacle if needed to fill the bottom
            ctx.fillRect(obstacle.x, obstacle.y + obstacle.height / 2, obstacle.width, obstacle.height / 2);
        } else {
            // Draw the square obstacle
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    });
}

function drawFood() {
    // Set style for food
    ctx.fillStyle = '#FFF716'; // Yellow fill
    ctx.strokeStyle = 'black'; // Black border
    ctx.lineWidth = 4; // Thin border
    // Draw filled food
    ctx.fillRect(food.x, food.y, 20, 20);
    // Draw food border
    ctx.strokeRect(food.x, food.y, 20, 20);
}



function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wrap the snake position if it goes off the canvas edges
    if (head.x < 0) {
        head.x = canvas.width - 20;
    } else if (head.x >= canvas.width) {
        head.x = 0;
    }

    if (head.y < 0) {
        head.y = canvas.height - 20;
    } else if (head.y >= canvas.height) {
        head.y = 0;
    }

    snake.unshift(head);

    // Check collision with food based on the size of the snake part and the food
    if (head.x < food.x + 20 && head.x + 20 > food.x &&
        head.y < food.y + 20 && head.y + 20 > food.y) {
        score += 100;
        food = getRandomFoodPosition(); // Generate new food position that does not collide with obstacles
    } else {
        snake.pop(); // Move the snake by removing the tail
    }

    // Check collision with obstacles using the updated logic
    if (checkCollisionWithObstacles(head)) {
        gameState = 'gameOver';
        setTimeout(() => {
            gameState = 'start';
            blinkStartText();
        }, 4000);
        return;
    }
}


function changeDirection(event) {
    const LEFT_KEY = 37;
    const A_KEY = 65;
    const RIGHT_KEY = 39;
    const D_KEY = 68;
    const UP_KEY = 38;
    const W_KEY = 87;
    const DOWN_KEY = 40;
    const S_KEY = 83;

    const keyPressed = event.keyCode;
    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if ((keyPressed === LEFT_KEY || keyPressed === A_KEY) && !goingRight) {
        dx = -20;
        dy = 0;
    }
    if ((keyPressed === UP_KEY || keyPressed === W_KEY) && !goingDown) {
        dx = 0;
        dy = -20;
    }
    if ((keyPressed === RIGHT_KEY || keyPressed === D_KEY) && !goingLeft) {
        dx = 20;
        dy = 0;
    }
    if ((keyPressed === DOWN_KEY || keyPressed === S_KEY) && !goingUp) {
        dx = 0;
        dy = 20;
    }
}

function gameLoop() {
    if (gameState === 'playing') {
        setTimeout(function onTick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //drawBackground();
            drawObstacles();
            drawFood();
            moveSnake();
            drawSnake();
            drawScore();
            gameLoop();
        }, 130);
    } else if (gameState === 'gameOver') {
        drawGameOverText();
    }
}

function drawScore() {
    // Set text style for score
    ctx.font = '30px Arial Black';
    ctx.fillStyle = '#FFF716';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.textAlign = 'left'; // Align text to the left
    ctx.textBaseline = 'top'; // Align text to the top
    // Draw filled text
    ctx.fillText(`${score} PONT`, 20, 30);
    // Draw text border
    ctx.strokeText(`${score} PONT`, 20, 30);
}

function drawGameOverText() {
    // Set text style for game over
    ctx.font = '100px Arial Black';
    ctx.fillStyle = '#FFF716';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center'; // Center text horizontally
    ctx.textBaseline = 'middle'; // Center text vertically
    // Draw filled text
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 3);
    // Draw text border
    ctx.strokeText('GAME OVER', canvas.width / 2, canvas.height / 3);
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
        // Draw the intro background image
        if (introBackgroundImage.complete) { // Make sure the image is loaded before drawing
            ctx.drawImage(introBackgroundImage, 0, 0, canvas.width, canvas.height);
        }
        if (startTextVisible) {
            // Set text style for start text
            ctx.font = '60px Arial Black';
            ctx.fillStyle = '#FFF716';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center'; // Center text horizontally
            ctx.textBaseline = 'middle'; // Center text vertically
            // Draw filled text
            ctx.fillText('NYOMJ EGY GOMBOT A STARTHOZ', canvas.width / 2, canvas.height / 2);
            // Draw text border
            ctx.strokeText('NYOMJ EGY GOMBOT A STARTHOZ', canvas.width / 2, canvas.height / 2);
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
