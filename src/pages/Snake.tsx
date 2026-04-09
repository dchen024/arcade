import { Iframe } from "../components/Iframe"

const game = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Neon Snake</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --panel-color: #1e293b;
            --accent-color: #22d3ee;
            --snake-head: #06b6d4;
            --snake-body: #0891b2;
            --food-color: #f43f5e;
            --text-color: #f1f5f9;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            touch-action: none; /* Prevents scrolling while playing */
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow: hidden;
        }

        #game-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            padding: 20px;
            width: 100%;
            max-width: 500px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 10px 20px;
            background: var(--panel-color);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .stat-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            opacity: 0.7;
        }

        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--accent-color);
        }

        #game-board-wrapper {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 30px rgba(34, 211, 238, 0.1);
            background: #000;
        }

        canvas {
            display: block;
            background-color: #020617;
        }

        /* Overlay for Start/Game Over */
        #overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(4px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
            transition: opacity 0.3s ease;
        }

        #overlay.hidden {
            display: none;
        }

        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--accent-color);
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }

        .btn {
            background: var(--accent-color);
            color: var(--bg-color);
            border: none;
            padding: 12px 32px;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
            box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);
        }

        .btn:hover {
            transform: scale(1.05);
            background: #67e8f9;
        }

        .btn:active {
            transform: scale(0.95);
        }

        /* Controls for Mobile */
        #mobile-controls {
            display: grid;
            grid-template-areas: 
                ". up ."
                "left down right";
            gap: 10px;
            margin-top: 10px;
        }

        .control-btn {
            width: 60px;
            height: 60px;
            background: var(--panel-color);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            user-select: none;
        }

        .control-btn:active {
            background: var(--accent-color);
            color: var(--bg-color);
        }

        .up { grid-area: up; }
        .down { grid-area: down; }
        .left { grid-area: left; }
        .right { grid-area: right; }

        @media (min-width: 768px) {
            #mobile-controls {
                display: none;
            }
        }
    </style>
</head>
<body>

    <div id="game-container">
        <div class="header">
            <div class="stat">
                <span class="stat-label">Score</span>
                <span id="score" class="stat-value">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">High Score</span>
                <span id="high-score" class="stat-value">0</span>
            </div>
        </div>

        <div id="game-board-wrapper">
            <canvas id="gameCanvas" width="400" height="400"></canvas>
            
            <div id="overlay">
                <h1 id="overlay-title">NEON SNAKE</h1>
                <p id="final-score-msg" style="margin-bottom: 20px; display: none;">Final Score: <span id="final-score">0</span></p>
                <button id="start-btn" class="btn">START GAME</button>
            </div>
        </div>

        <div id="mobile-controls">
            <div class="control-btn up" id="ctrl-up">↑</div>
            <div class="control-btn left" id="ctrl-left">←</div>
            <div class="control-btn down" id="ctrl-down">↓</div>
            <div class="control-btn right" id="ctrl-right">→</div>
        </div>
    </div>

    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const highScoreElement = document.getElementById('high-score');
        const overlay = document.getElementById('overlay');
        const overlayTitle = document.getElementById('overlay-title');
        const startBtn = document.getElementById('start-btn');
        const finalScoreMsg = document.getElementById('final-score-msg');
        const finalScoreVal = document.getElementById('final-score');

        // Game Constants
        const gridSize = 20;
        const tileCount = canvas.width / gridSize;
        
        // Game Variables
        let snake = [];
        let food = { x: 5, y: 5 };
        let dx = 0;
        let dy = 0;
        let nextDx = 0;
        let nextDy = 0;
        let score = 0;
        let highScore = localStorage.getItem('snake-high-score') || 0;
        let gameLoop;
        let isPaused = true;
        let speed = 100;

        highScoreElement.textContent = highScore;

        function initGame() {
            snake = [
                { x: 10, y: 10 },
                { x: 10, y: 11 },
                { x: 10, y: 12 }
            ];
            dx = 0;
            dy = -1;
            nextDx = 0;
            nextDy = -1;
            score = 0;
            speed = 100;
            scoreElement.textContent = score;
            createFood();
        }

        function createFood() {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            // Ensure food doesn't spawn on snake
            for (let part of snake) {
                if (part.x === food.x && part.y === food.y) {
                    createFood();
                    break;
                }
            }
        }

        function draw() {
            // Update direction from buffer
            dx = nextDx;
            dy = nextDy;

            // Move snake
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };

            // Check walls
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                return gameOver();
            }

            // Check self-collision
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === head.x && snake[i].y === head.y) {
                    return gameOver();
                }
            }

            snake.unshift(head);

            // Check food
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreElement.textContent = score;
                if (score > highScore) {
                    highScore = score;
                    highScoreElement.textContent = highScore;
                    localStorage.setItem('snake-high-score', highScore);
                }
                createFood();
            } else {
                snake.pop();
            }

            // Clear canvas
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Grid (Subtle)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= tileCount; i++) {
                ctx.beginPath();
                ctx.moveTo(i * gridSize, 0);
                ctx.lineTo(i * gridSize, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * gridSize);
                ctx.lineTo(canvas.width, i * gridSize);
                ctx.stroke();
            }

            // Draw Food
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#f43f5e';
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(
                food.x * gridSize + gridSize / 2,
                food.y * gridSize + gridSize / 2,
                gridSize / 2 - 2,
                0, Math.PI * 2
            );
            ctx.fill();

            // Draw Snake
            ctx.shadowBlur = 10;
            snake.forEach((part, index) => {
                const isHead = index === 0;
                ctx.shadowColor = isHead ? '#22d3ee' : '#0891b2';
                ctx.fillStyle = isHead ? '#22d3ee' : '#0891b2';
                
                // Rounded rectangles for snake parts
                const r = isHead ? 6 : 4;
                const x = part.x * gridSize + 1;
                const y = part.y * gridSize + 1;
                const w = gridSize - 2;
                const h = gridSize - 2;
                
                ctx.beginPath();
                ctx.roundRect(x, y, w, h, r);
                ctx.fill();

                // Add eyes to head
                if (isHead) {
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = 'white';
                    const eyeSize = 3;
                    // Position eyes based on direction
                    if (dx === 1) { // Right
                        ctx.fillRect(x + w - 6, y + 4, eyeSize, eyeSize);
                        ctx.fillRect(x + w - 6, y + h - 7, eyeSize, eyeSize);
                    } else if (dx === -1) { // Left
                        ctx.fillRect(x + 3, y + 4, eyeSize, eyeSize);
                        ctx.fillRect(x + 3, y + h - 7, eyeSize, eyeSize);
                    } else if (dy === -1) { // Up
                        ctx.fillRect(x + 4, y + 3, eyeSize, eyeSize);
                        ctx.fillRect(x + w - 7, y + 3, eyeSize, eyeSize);
                    } else { // Down
                        ctx.fillRect(x + 4, y + h - 6, eyeSize, eyeSize);
                        ctx.fillRect(x + w - 7, y + h - 6, eyeSize, eyeSize);
                    }
                }
            });

            if (!isPaused) {
                setTimeout(draw, speed);
            }
        }

        function gameOver() {
            isPaused = true;
            overlayTitle.textContent = "GAME OVER";
            finalScoreVal.textContent = score;
            finalScoreMsg.style.display = "block";
            startBtn.textContent = "TRY AGAIN";
            overlay.classList.remove('hidden');
        }

        function startGame() {
            initGame();
            overlay.classList.add('hidden');
            isPaused = false;
            draw();
        }

        // Input Handling
        function handleInput(key) {
            if (isPaused) return;

            switch (key) {
                case 'ArrowUp':
                case 'w':
                    if (dy !== 1) { nextDx = 0; nextDy = -1; }
                    break;
                case 'ArrowDown':
                case 's':
                    if (dy !== -1) { nextDx = 0; nextDy = 1; }
                    break;
                case 'ArrowLeft':
                case 'a':
                    if (dx !== 1) { nextDx = -1; nextDy = 0; }
                    break;
                case 'ArrowRight':
                case 'd':
                    if (dx !== -1) { nextDx = 1; nextDy = 0; }
                    break;
            }
        }

        window.addEventListener('keydown', (e) => handleInput(e.key));
        
        startBtn.addEventListener('click', startGame);

        // Mobile Controls
        document.getElementById('ctrl-up').addEventListener('pointerdown', () => handleInput('ArrowUp'));
        document.getElementById('ctrl-down').addEventListener('pointerdown', () => handleInput('ArrowDown'));
        document.getElementById('ctrl-left').addEventListener('pointerdown', () => handleInput('ArrowLeft'));
        document.getElementById('ctrl-right').addEventListener('pointerdown', () => handleInput('ArrowRight'));

        // Prevent space bar from scrolling
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                if (overlay.classList.contains('hidden')) {
                    // Could add pause logic here
                } else {
                    startGame();
                }
            }
        });

    </script>
</body>
</html>
`

const Snake = () => {
  return <Iframe html={game} />
}

export default Snake
