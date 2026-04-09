import { Iframe } from "../components/Iframe"

const game = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tetris - Dark Theme</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&display=swap');

        body {
            font-family: 'Chakra Petch', sans-serif;
            background-color: #0f172a; 
            color: #f8fafc;
            touch-action: manipulation;
            overflow: hidden;
        }

        .canvas-container {
            position: relative;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.05);
            background-color: #1e293b;
            border-radius: 8px;
            padding: 4px;
        }

        canvas {
            background-color: #020617;
            border-radius: 4px;
            display: block;
        }

        .stat-box {
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(4px);
        }

        .control-btn {
            background: rgba(51, 65, 85, 0.8);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            transition: background 0.1s;
        }

        .control-btn:active {
            background: rgba(71, 85, 105, 1);
            transform: scale(0.95);
        }

        #game-over {
            display: none;
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(2, 6, 23, 0.85);
            backdrop-filter: blur(4px);
            z-index: 10;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .grid-bg {
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 30px 30px;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4">

    <header class="mb-4 text-center">
        <h1 class="text-4xl font-bold tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">TETRIS</h1>
    </header>

    <div class="flex flex-col md:flex-row gap-6 items-start justify-center w-full max-w-3xl">
        
        <div class="flex md:flex-col gap-4 w-full md:w-32 order-2 md:order-1 justify-center">
            <div class="stat-box p-3 rounded-lg flex flex-col items-center shadow-lg">
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Hold (C)</div>
                <canvas id="hold-piece" width="60" height="60"></canvas>
            </div>
            <div class="stat-box p-3 rounded-lg text-center flex-1 md:flex-none shadow-lg">
                <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">Score</div>
                <div id="score" class="text-xl font-bold text-yellow-400">0</div>
            </div>
            <div class="stat-box p-3 rounded-lg text-center flex-1 md:flex-none shadow-lg">
                <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">Level</div>
                <div id="level" class="text-xl font-bold text-green-400">1</div>
            </div>
        </div>

        <div class="canvas-container order-1 md:order-2 mx-auto">
            <div class="relative">
                <canvas id="tetris" width="300" height="600" class="grid-bg"></canvas>
                
                <div id="game-over" class="rounded flex">
                    <h2 class="text-3xl font-bold text-red-500 mb-2 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">GAME OVER</h2>
                    <p class="text-slate-300 mb-6">Final Score: <span id="final-score" class="text-white font-bold">0</span></p>
                    <button id="restart-btn" class="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-[0_0_10px_rgba(6,182,212,0.6)] transition-all">
                        PLAY AGAIN
                    </button>
                </div>

                <div id="start-screen" class="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded">
                    <button id="start-btn" class="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xl shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all transform hover:scale-105">
                        START GAME
                    </button>
                    <p class="mt-6 text-sm text-slate-400 text-center max-w-[200px]">
                        Arrows: Move & Rotate<br>
                        Space: Hard Drop | C: Hold<br>
                        Down: Soft Drop
                    </p>
                </div>
            </div>
        </div>

        <div class="w-full md:w-32 order-3 hidden md:flex flex-col gap-4">
            <div class="stat-box p-4 rounded-lg flex flex-col items-center shadow-lg">
                <div class="text-xs text-slate-400 uppercase tracking-wider mb-3">Next</div>
                <canvas id="next-piece" width="90" height="90"></canvas>
            </div>
            <div class="stat-box p-3 rounded-lg text-center shadow-lg">
                <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">Lines</div>
                <div id="lines" class="text-xl font-bold text-cyan-400">0</div>
            </div>
        </div>
    </div>

    <div class="mt-6 flex flex-col gap-4 w-full max-w-sm md:hidden">
        <div class="flex justify-between px-4">
            <button class="control-btn" id="btn-hold" style="background: rgba(168, 85, 247, 0.3); border-color: rgba(168, 85, 247, 0.5);">
                <span class="text-xs font-bold">HOLD</span>
            </button>
            <button class="control-btn" id="btn-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button class="control-btn" id="btn-rotate">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            </button>
            <button class="control-btn" id="btn-right">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
        </div>
        <div class="flex justify-center gap-8 px-6">
            <button class="control-btn" id="btn-down" style="width: 80px; border-radius: 28px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
            </button>
            <button class="control-btn" id="btn-drop" style="width: 80px; border-radius: 28px; background: rgba(6, 182, 212, 0.3); border-color: rgba(6, 182, 212, 0.5);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m5 15 7 7 7-7"/><path d="M5 9l7 7 7-7"/></svg>
            </button>
        </div>
    </div>

    <script>
        const canvas = document.getElementById('tetris');
        const context = canvas.getContext('2d');
        const nextCanvas = document.getElementById('next-piece');
        const nextContext = nextCanvas.getContext('2d');
        const holdCanvas = document.getElementById('hold-piece');
        const holdContext = holdCanvas.getContext('2d');
        
        const BLOCK_SIZE = 30;
        const NEXT_BLOCK_SIZE = 22.5; 
        const HOLD_BLOCK_SIZE = 15; 
        const COLS = 10;
        const ROWS = 20;

        context.scale(BLOCK_SIZE, BLOCK_SIZE);
        nextContext.scale(NEXT_BLOCK_SIZE, NEXT_BLOCK_SIZE);
        holdContext.scale(HOLD_BLOCK_SIZE, HOLD_BLOCK_SIZE);

        const COLORS = [
            null,
            '#a855f7', // 1: T (Purple)
            '#eab308', // 2: O (Yellow)
            '#f97316', // 3: L (Orange)
            '#3b82f6', // 4: J (Blue)
            '#06b6d4', // 5: I (Cyan)
            '#22c55e', // 6: S (Green)
            '#ef4444'  // 7: Z (Red)
        ];

        const HIGHLIGHTS = [null, '#d8b4fe', '#fef08a', '#fdba74', '#93c5fd', '#67e8f9', '#86efac', '#fca5a5'];
        const SHADOWS = [null, '#7e22ce', '#a16207', '#c2410c', '#1d4ed8', '#0891b2', '#15803d', '#b91c1c'];

        function createPiece(type) {
            switch(type) {
                case 'T': return [[0,0,0], [1,1,1], [0,1,0]];
                case 'O': return [[2,2], [2,2]];
                case 'L': return [[0,3,0], [0,3,0], [0,3,3]];
                case 'J': return [[0,4,0], [0,4,0], [4,4,0]];
                case 'I': return [[0,5,0,0], [0,5,0,0], [0,5,0,0], [0,5,0,0]];
                case 'S': return [[0,6,6], [6,6,0], [0,0,0]];
                case 'Z': return [[7,7,0], [0,7,7], [0,0,0]];
            }
        }

        const PIECES = 'TJLOSZI';

        let arena = createMatrix(COLS, ROWS);
        
        const player = {
            pos: {x: 0, y: 0},
            matrix: null,
            holdMatrix: null,
            canHold: true,
            score: 0,
            level: 1,
            lines: 0
        };

        let nextPieceMatrix = null;
        let dropCounter = 0;
        let dropInterval = 1000;
        let lastTime = 0;
        let isGameOver = false;
        let isRunning = false;
        let animationId = null;

        function createMatrix(w, h) {
            const matrix = [];
            while (h--) matrix.push(new Array(w).fill(0));
            return matrix;
        }

        function drawMatrix(matrix, offset, ctx = context, isGhost = false) {
            matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        if (isGhost) {
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                            ctx.lineWidth = 0.05;
                            ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                            ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
                        } else {
                            ctx.fillStyle = COLORS[value];
                            ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                            ctx.fillStyle = HIGHLIGHTS[value];
                            ctx.fillRect(x + offset.x, y + offset.y, 1, 0.15);
                            ctx.fillRect(x + offset.x, y + offset.y, 0.15, 1);
                            ctx.fillStyle = SHADOWS[value];
                            ctx.fillRect(x + offset.x, y + offset.y + 0.85, 1, 0.15);
                            ctx.fillRect(x + offset.x + 0.85, y + offset.y, 0.15, 1);
                            ctx.strokeStyle = '#020617';
                            ctx.lineWidth = 0.05;
                            ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
                        }
                    }
                });
            });
        }

        function getGhostPos() {
            const ghost = { matrix: player.matrix, pos: { x: player.pos.x, y: player.pos.y } };
            while (!collide(arena, ghost)) ghost.pos.y++;
            ghost.pos.y--;
            return ghost.pos;
        }

        function drawNextPiece() {
            nextContext.fillStyle = '#1e293b';
            nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
            if (nextPieceMatrix) {
                const offsetX = (4 - nextPieceMatrix[0].length) / 2;
                const offsetY = (4 - nextPieceMatrix.length) / 2;
                drawMatrix(nextPieceMatrix, {x: offsetX, y: offsetY}, nextContext);
            }
        }

        function drawHoldPiece() {
            holdContext.fillStyle = '#1e293b';
            holdContext.fillRect(0, 0, holdCanvas.width, holdCanvas.height);
            if (player.holdMatrix) {
                const offsetX = (4 - player.holdMatrix[0].length) / 2;
                const offsetY = (4 - player.holdMatrix.length) / 2;
                drawMatrix(player.holdMatrix, {x: offsetX, y: offsetY}, holdContext);
            }
        }

        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawMatrix(arena, {x: 0, y: 0});
            if (player.matrix && !isGameOver) {
                const ghostPos = getGhostPos();
                drawMatrix(player.matrix, ghostPos, context, true);
                drawMatrix(player.matrix, player.pos);
            }
        }

        function merge(arena, player) {
            player.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
                });
            });
        }

        function collide(arena, player) {
            const [m, o] = [player.matrix, player.pos];
            for (let y = 0; y < m.length; ++y) {
                for (let x = 0; x < m[y].length; ++x) {
                    if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) return true;
                }
            }
            return false;
        }

        function playerHold() {
            if (!player.canHold) return;

            const currentMatrix = JSON.parse(JSON.stringify(player.matrix)); // Deep copy current
            
            if (!player.holdMatrix) {
                player.holdMatrix = currentMatrix;
                playerReset();
            } else {
                const temp = player.holdMatrix;
                player.holdMatrix = currentMatrix;
                player.matrix = temp;
                player.pos.y = 0;
                player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
            }
            
            player.canHold = false;
            drawHoldPiece();
        }

        function playerDrop() {
            player.pos.y++;
            if (collide(arena, player)) {
                player.pos.y--;
                merge(arena, player);
                playerReset();
                arenaSweep();
                updateScore();
                if (collide(arena, player)) gameOver();
            }
            dropCounter = 0;
        }

        function playerHardDrop() {
            while (!collide(arena, player)) {
                player.pos.y++;
                player.score += 2;
            }
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
            updateScore();
            dropCounter = 0;
            if (collide(arena, player)) gameOver();
        }

        function playerMove(offset) {
            player.pos.x += offset;
            if (collide(arena, player)) player.pos.x -= offset;
        }

        function playerReset() {
            if (!nextPieceMatrix) nextPieceMatrix = createPiece(PIECES[Math.floor(Math.random() * PIECES.length)]);
            player.matrix = nextPieceMatrix;
            nextPieceMatrix = createPiece(PIECES[Math.floor(Math.random() * PIECES.length)]);
            drawNextPiece();

            player.pos.y = 0;
            player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
            player.canHold = true;

            if (collide(arena, player)) gameOver();
        }

        function playerRotate(dir) {
            const pos = player.pos.x;
            let offset = 1;
            rotate(player.matrix, dir);
            while (collide(arena, player)) {
                player.pos.x += offset;
                offset = -(offset + (offset > 0 ? 1 : -1));
                if (offset > player.matrix[0].length) {
                    rotate(player.matrix, -dir);
                    player.pos.x = pos;
                    return;
                }
            }
        }

        function rotate(matrix, dir) {
            for (let y = 0; y < matrix.length; ++y) {
                for (let x = 0; x < y; ++x) [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
            if (dir > 0) matrix.forEach(row => row.reverse());
            else matrix.reverse();
        }

        function arenaSweep() {
            let rowCount = 0;
            outer: for (let y = arena.length - 1; y >= 0; --y) {
                for (let x = 0; x < arena[y].length; ++x) if (arena[y][x] === 0) continue outer;
                const row = arena.splice(y, 1)[0].fill(0);
                arena.unshift(row);
                ++y;
                rowCount++;
            }
            if (rowCount > 0) {
                const basePoints = rowCount === 1 ? 40 : rowCount === 2 ? 100 : rowCount === 3 ? 300 : 1200;
                player.score += basePoints * player.level;
                player.lines += rowCount;
                player.level = Math.floor(player.lines / 10) + 1;
                dropInterval = Math.max(100, 1000 - (player.level - 1) * 75);
            }
        }

        function updateScore() {
            document.getElementById('score').innerText = player.score;
            document.getElementById('level').innerText = player.level;
            document.getElementById('lines').innerText = player.lines;
        }

        function gameOver() {
            isGameOver = true;
            isRunning = false;
            cancelAnimationFrame(animationId);
            document.getElementById('final-score').innerText = player.score;
            document.getElementById('game-over').style.display = 'flex';
        }

        function resetGame() {
            arena = createMatrix(COLS, ROWS);
            player.score = 0;
            player.level = 1;
            player.lines = 0;
            player.holdMatrix = null;
            player.canHold = true;
            dropInterval = 1000;
            isGameOver = false;
            updateScore();
            playerReset();
            drawHoldPiece();
            document.getElementById('game-over').style.display = 'none';
            document.getElementById('start-screen').style.display = 'none';
            if (!isRunning) {
                isRunning = true;
                lastTime = performance.now();
                update();
            }
        }

        function update(time = 0) {
            if (!isRunning) return;
            const deltaTime = time - lastTime;
            lastTime = time;
            dropCounter += deltaTime;
            if (dropCounter > dropInterval) playerDrop();
            draw();
            animationId = requestAnimationFrame(update);
        }

        document.addEventListener('keydown', event => {
            if (!isRunning || isGameOver) return;
            switch(event.keyCode) {
                case 37: playerMove(-1); break;
                case 39: playerMove(1); break;
                case 40: playerDrop(); player.score += 1; updateScore(); break;
                case 38: playerRotate(1); break;
                case 32: playerHardDrop(); event.preventDefault(); break;
                case 67: playerHold(); break; // 'C' key
            }
        });

        document.getElementById('start-btn').addEventListener('click', resetGame);
        document.getElementById('restart-btn').addEventListener('click', resetGame);

        const handleTouch = (id, action, repeat = false) => {
            const btn = document.getElementById(id);
            let intervalId = null;
            const startAction = (e) => {
                e.preventDefault();
                if (!isRunning || isGameOver) return;
                action();
                if (repeat) intervalId = setInterval(action, 100);
            };
            const endAction = (e) => {
                e.preventDefault();
                if (intervalId) clearInterval(intervalId);
            };
            btn.addEventListener('touchstart', startAction, { passive: false });
            btn.addEventListener('touchend', endAction, { passive: false });
            btn.addEventListener('mousedown', startAction);
            btn.addEventListener('mouseup', endAction);
            btn.addEventListener('mouseleave', endAction);
        };

        handleTouch('btn-left', () => playerMove(-1), true);
        handleTouch('btn-right', () => playerMove(1), true);
        handleTouch('btn-down', () => { playerDrop(); player.score++; updateScore(); }, true);
        handleTouch('btn-rotate', () => playerRotate(1));
        handleTouch('btn-drop', () => playerHardDrop());
        handleTouch('btn-hold', () => playerHold());

        draw();
    </script>
</body>
</html>
`

const Tetris = () => {
  return <Iframe html={game} />
}

export default Tetris
