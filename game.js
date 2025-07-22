const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 변수
let bird = { x: 50, y: 150, w: 30, h: 30, gravity: 0.25, lift: -4.5, velocity: 0 };
let pipes = [];
let score = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
}

function drawPipes() {
    ctx.fillStyle = '#388e3c';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.w, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.w, canvas.height - pipe.bottom);
    });
}

function drawScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    drawScore();
}

function update() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 새
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    if (bird.y + bird.h > canvas.height) {
        bird.y = canvas.height - bird.h;
        gameOver = true;
    }
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
    drawBird();

    // 파이프
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 150) {
        let top = Math.random() * 200 + 20;
        let gap = 110;
        pipes.push({
            x: canvas.width,
            w: 50,
            top: top,
            bottom: top + gap,
            passed: false
        });
    }
    pipes.forEach(pipe => {
        pipe.x -= 2;
        // 점수 체크
        if (!pipe.passed && pipe.x + pipe.w < bird.x) {
            score++;
            pipe.passed = true;
            drawScore();
        }
        // 충돌 체크
        if (
            bird.x < pipe.x + pipe.w &&
            bird.x + bird.w > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.h > pipe.bottom)
        ) {
            gameOver = true;
        }
    });
    // 파이프 삭제
    pipes = pipes.filter(pipe => pipe.x + pipe.w > 0);
    drawPipes();

    // 게임 오버
    if (gameOver) {
        ctx.font = '32px Arial';
        ctx.fillStyle = '#d32f2f';
        ctx.fillText('Game Over!', 70, 240);
        ctx.font = '20px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('Space/클릭: 재시작', 75, 270);
    }
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        if (gameOver) {
            resetGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});
canvas.addEventListener('mousedown', () => {
    if (gameOver) {
        resetGame();
    } else {
        bird.velocity = bird.lift;
    }
});

resetGame();
gameLoop();
