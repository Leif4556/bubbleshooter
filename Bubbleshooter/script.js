const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bubbles = [];
const bubbleColors = ["red", "blue", "green", "yellow"];
const bubbleRadius = 20;

let shooterAngle = 0;
let shooterX = canvas.width / 2;
let shooterY = canvas.height - 30;
let currentBubble = createBubble(shooterX, shooterY, randomColor());

document.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - shooterX;
    const dy = mouseY - shooterY;
    shooterAngle = Math.atan2(dy, dx);
});

document.addEventListener("click", () => {
    if (!currentBubble.moving) {
        currentBubble.moving = true;
        currentBubble.dx = Math.cos(shooterAngle) * 5;
        currentBubble.dy = Math.sin(shooterAngle) * 5;
    }
});

function randomColor() {
    return bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
}

function createBubble(x, y, color) {
    return { x, y, color, dx: 0, dy: 0, moving: false };
}

function drawBubble(bubble) {
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubbleRadius, 0, Math.PI * 2);
    ctx.fillStyle = bubble.color;
    ctx.fill();
    ctx.closePath();
}

function drawShooter() {
    ctx.save();
    ctx.translate(shooterX, shooterY);
    ctx.rotate(shooterAngle);
    ctx.fillStyle = "white";
    ctx.fillRect(-10, -30, 20, 60);
    ctx.restore();
}

function updateBubble(bubble) {
    if (bubble.moving) {
        bubble.x += bubble.dx;
        bubble.y += bubble.dy;

        if (bubble.x - bubbleRadius < 0 || bubble.x + bubbleRadius > canvas.width) {
            bubble.dx *= -1;
        }
        if (bubble.y - bubbleRadius < 0) {
            bubble.dy *= -1;
        }
        if (bubble.y + bubbleRadius > canvas.height) {
            bubble.moving = false;
            bubbles.push(bubble);
            currentBubble = createBubble(shooterX, shooterY, randomColor());
        }
    }
}

function drawBubbles() {
    bubbles.forEach(drawBubble);
}

function checkCollision(bubble) {
    bubbles.forEach((other) => {
        const dx = bubble.x - other.x;
        const dy = bubble.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bubbleRadius * 2) {
            bubble.moving = false;
            bubbles.push(bubble);
            currentBubble = createBubble(shooterX, shooterY, randomColor());
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawShooter();
    drawBubble(currentBubble);
    drawBubbles();

    updateBubble(currentBubble);
    checkCollision(currentBubble);

    requestAnimationFrame(gameLoop);
}

gameLoop();
