const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const characterImage = new Image();
characterImage.src = './img/character.png';

const objectImage = new Image();
objectImage.src = './img/object.png';

let characterX = canvas.width / 2 - 37.5; // 75 / 2
let characterY = canvas.height - 75; // 高さを75に
const characterWidth = 75;
const characterHeight = 75;
const characterSpeed = 5;

let objects = [];
const objectWidth = 50;
const objectHeight = 50;
const objectSpeed = 3;
let score = 0;
let gameInterval;
let objectInterval;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('stopButton').addEventListener('click', stopGame);
document.getElementById('resetButton').addEventListener('click', resetGame);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveLeft = true;
    if (event.key === 'ArrowRight') moveRight = true;
    if (event.key === 'ArrowUp') moveUp = true;
    if (event.key === 'ArrowDown') moveDown = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') moveLeft = false;
    if (event.key === 'ArrowRight') moveRight = false;
    if (event.key === 'ArrowUp') moveUp = false;
    if (event.key === 'ArrowDown') moveDown = false;
});

function moveCharacter() {
    if (moveLeft && characterX > 0) characterX -= characterSpeed;
    if (moveRight && characterX < canvas.width - characterWidth) characterX += characterSpeed;
    if (moveUp && characterY > 0) characterY -= characterSpeed;
    if (moveDown && characterY < canvas.height - characterHeight) characterY += characterSpeed;
}

function drawCharacter() {
    ctx.drawImage(characterImage, characterX, characterY, characterWidth, characterHeight);
}

function createObject() {
    const x = Math.random() * (canvas.width - objectWidth);
    objects.push({ x: x, y: 0 });
}

function drawObjects() {
    objects.forEach(object => {
        ctx.drawImage(objectImage, object.x, object.y, objectWidth, objectHeight);
    });
}

function updateObjects() {
    objects.forEach(object => {
        object.y += objectSpeed;
    });

    objects = objects.filter(object => object.y < canvas.height);
}

function checkCollision() {
    const characterBoundingBox = {
        x: characterX + 10,
        y: characterY + 10,
        width: characterWidth - 20,
        height: characterHeight - 20
    };

    objects.forEach(object => {
        const objectBoundingBox = {
            x: object.x + 5,
            y: object.y + 5,
            width: objectWidth - 10,
            height: objectHeight - 10
        };

        if (
            characterBoundingBox.x < objectBoundingBox.x + objectBoundingBox.width &&
            characterBoundingBox.x + characterBoundingBox.width > objectBoundingBox.x &&
            characterBoundingBox.y < objectBoundingBox.y + objectBoundingBox.height &&
            characterBoundingBox.y + characterBoundingBox.height > objectBoundingBox.y
        ) {
            gameOver();
        }
    });
}

function updateScore() {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveCharacter();
    drawCharacter();
    drawObjects();
    updateObjects();
    checkCollision();
    updateScore();
}

function startGame() {
    if (!gameInterval) {
        gameInterval = setInterval(gameLoop, 1000 / 60);
        objectInterval = setInterval(createObject, 1000);
    }
}

function stopGame() {
    clearInterval(gameInterval);
    clearInterval(objectInterval);
    gameInterval = null;
    objectInterval = null;
}

function resetGame() {
    stopGame();
    score = 0;
    objects = [];
    characterX = canvas.width / 2 - 37.5;
    characterY = canvas.height - 75;
    document.getElementById('score').innerText = 'Score: 0';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCharacter();
}

function gameOver() {
    stopGame();
    const alertDiv = document.createElement('div');
    alertDiv.innerText = `Game Over! Your score: ${score}`;
    alertDiv.style.position = 'absolute';
    alertDiv.style.top = '50%';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translate(-50%, -50%)';
    alertDiv.style.backgroundColor = 'white';
    alertDiv.style.padding = '20px';
    alertDiv.style.border = '2px solid black';
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        document.body.removeChild(alertDiv);
        resetGame();
    }, 5000);
}
