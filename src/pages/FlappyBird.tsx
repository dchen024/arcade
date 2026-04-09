import { Iframe } from "../components/Iframe"

const game = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Shadow Flappy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #0a0a0a;
            font-family: 'Orbitron', sans-serif;
            touch-action: manipulation;
        }

        #game-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }

        canvas {
            display: block;
            background: linear-gradient(to bottom, #1a1a2e 0%, #16213e 100%);
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
            max-width: 100%;
            max-height: 100%;
        }

        #ui-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            pointer-events: none;
            color: #e0e0e0;
        }

        .score-display {
            position: absolute;
            top: 40px;
            font-size: 3rem;
            font-weight: 700;
            text-shadow: 0 0 10px #4cc9f0;
            z-index: 10;
        }

        .menu-card {
            background: rgba(15, 15, 15, 0.9);
            border: 2px solid #4cc9f0;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            pointer-events: auto;
            backdrop-filter: blur(5px);
            box-shadow: 0 0 30px rgba(76, 201, 240, 0.3);
            display: none;
        }

        .btn {
            background: #4cc9f0;
            color: #0a0a0a;
            border: none;
            padding: 0.75rem 2rem;
            font-family: 'Orbitron', sans-serif;
            font-weight: 700;
            font-size: 1.2rem;
            border-radius: 0.5rem;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.2s;
            text-transform: uppercase;
        }

        .btn:hover {
            background: #4895ef;
            transform: scale(1.05);
            box-shadow: 0 0 15px #4cc9f0;
        }

        #start-screen {
            display: block;
        }

        .instructions {
            margin-top: 1rem;
            font-size: 0.8rem;
            color: #888;
        }
    </style>
</head>
<body>

    <div id="game-container">
        <canvas id="gameCanvas"></canvas>
        
        <div id="ui-overlay">
            <div id="score" class="score-display">0</div>
            
            <!-- Start Screen -->
            <div id="start-screen" class="menu-card">
                <h1 class="text-4xl mb-4 font-bold text-[#4cc9f0]">SHADOW FLAPPY</h1>
                <p class="mb-6">Navigate through the neon void.</p>
                <button id="start-btn" class="btn">Start Game</button>
                <p class="instructions">Press SPACE or TAP to fly</p>
            </div>

            <!-- Game Over Screen -->
            <div id="game-over-screen" class="menu-card">
                <h2 class="text-3xl mb-2 font-bold text-[#f72585]">CRASHED</h2>
                <p id="final-score" class="text-xl mb-4">Score: 0</p>
                <p id="high-score" class="text-sm mb-6 text-gray-400">Best: 0</p>
                <button id="restart-btn" class="btn">Try Again</button>
            </div>
        </div>
    </div>

    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const finalScoreElement = document.getElementById('final-score');
        const highScoreElement = document.getElementById('high-score');
        const startScreen = document.getElementById('start-screen');
        const gameOverScreen = document.getElementById('game-over-screen');
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');

        // Game constants - ADJUSTED PHYSICS
        const GAME_WIDTH = 400;
        const GAME_HEIGHT = 600;
        const GRAVITY = 0.098; // Lowered from 0.25
        const JUMP = -4.2;    // Balanced with gravity (from -4.8)
        const PIPE_WIDTH = 60;
        const PIPE_GAP = 160;
        const PIPE_SPEED = 2.5;
        const PIPE_SPAWN_RATE = 100; // frames

        // Game state
        let bird = {
            x: 50,
            y: 300,
            velocity: 0,
            radius: 12,
            rotation: 0
        };

        let pipes = [];
        let score = 0;
        let highScore = localStorage.getItem('flappyHighScore') || 0;
        let gameActive = false;
        let frameCount = 0;

        // Initialize Canvas
        function resizeCanvas() {
            canvas.width = GAME_WIDTH;
            canvas.height = GAME_HEIGHT;
        }

        function initGame() {
            bird.y = GAME_HEIGHT / 2;
            bird.velocity = 0;
            bird.rotation = 0;
            pipes = [];
            score = 0;
            frameCount = 0;
            scoreElement.innerText = '0';
            gameActive = true;
            startScreen.style.display = 'none';
            gameOverScreen.style.display = 'none';
        }

        function spawnPipe() {
            const minHeight = 50;
            const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight;
            const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
            
            pipes.push({
                x: GAME_WIDTH,
                top: height,
                bottom: GAME_HEIGHT - height - PIPE_GAP,
                passed: false
            });
        }

        function flap() {
            if (gameActive) {
                bird.velocity = JUMP;
            } else if (startScreen.style.display !== 'none') {
                initGame();
            } else if (gameOverScreen.style.display !== 'none') {
                initGame();
            }
        }

        // Event Listeners
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') flap();
        });

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            flap();
        }, { passive: false });

        startBtn.onclick = initGame;
        restartBtn.onclick = initGame;

        function checkCollision(bird, pipe) {
            const birdTop = bird.y - bird.radius;
            const birdBottom = bird.y + bird.radius;
            const birdLeft = bird.x - bird.radius;
            const birdRight = bird.x + bird.radius;

            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + PIPE_WIDTH;

            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                if (birdTop < pipe.top || birdBottom > GAME_HEIGHT - pipe.bottom) {
                    return true;
                }
            }

            if (birdBottom > GAME_HEIGHT || birdTop < 0) {
                return true;
            }

            return false;
        }

        function update() {
            if (!gameActive) return;

            frameCount++;
            
            bird.velocity += GRAVITY;
            bird.y += bird.velocity;
            
            bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.1));

            if (frameCount % PIPE_SPAWN_RATE === 0) {
                spawnPipe();
            }

            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].x -= PIPE_SPEED;

                if (checkCollision(bird, pipes[i])) {
                    endGame();
                }

                if (!pipes[i].passed && pipes[i].x + PIPE_WIDTH < bird.x) {
                    pipes[i].passed = true;
                    score++;
                    scoreElement.innerText = score;
                }

                if (pipes[i].x + PIPE_WIDTH < 0) {
                    pipes.splice(i, 1);
                }
            }
        }

        function drawBird() {
            ctx.save();
            ctx.translate(bird.x, bird.y);
            ctx.rotate(bird.rotation);

            ctx.beginPath();
            ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#4cc9f0';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#4cc9f0';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(5, -3, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#0a0a0a';
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }

        function drawPipes() {
            pipes.forEach(pipe => {
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#f72585';
                ctx.fillStyle = '#f72585';
                
                ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
                ctx.fillRect(pipe.x - 5, pipe.top - 10, PIPE_WIDTH + 10, 10);

                ctx.fillRect(pipe.x, GAME_HEIGHT - pipe.bottom, PIPE_WIDTH, pipe.bottom);
                ctx.fillRect(pipe.x - 5, GAME_HEIGHT - pipe.bottom, PIPE_WIDTH + 10, 10);
            });
            ctx.shadowBlur = 0;
        }

        function drawBackground() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            for (let i = 0; i < 50; i++) {
                const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * GAME_WIDTH;
                const y = (Math.cos(i * 543.21) * 0.5 + 0.5) * GAME_HEIGHT;
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function endGame() {
            gameActive = false;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('flappyHighScore', highScore);
            }
            finalScoreElement.innerText = \`Score: \${score}\`;
            highScoreElement.innerText = \`Best: \${highScore}\`;
            gameOverScreen.style.display = 'block';
        }

        function gameLoop() {
            ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            
            drawBackground();
            update();
            drawPipes();
            drawBird();
            
            requestAnimationFrame(gameLoop);
        }

        window.onload = () => {
            resizeCanvas();
            gameLoop();
        };

        window.addEventListener('resize', resizeCanvas);

    </script>
</body>
</html>
`

const FlappyBird = () => {
  return <Iframe html={game} />
}

export default FlappyBird
