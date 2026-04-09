import { Iframe } from "../components/Iframe"

const game = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tic Tac Toe</title>
    <style>
        :root {
            --bg-color: #0f172a;        /* Deep slate background */
            --board-bg: #1e293b;        /* Lighter slate for board */
            --cell-bg: #334155;         /* Cell background */
            --cell-hover: #475569;      /* Cell hover state */
            --text-color: #f8fafc;      /* Off-white text */
            --x-color: #ef4444;         /* Red for X */
            --x-shadow: rgba(239, 68, 68, 0.4);
            --o-color: #3b82f6;         /* Blue for O */
            --o-shadow: rgba(59, 130, 246, 0.4);
            --win-bg: #10b981;          /* Green for winning cells */
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }

        h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }

        .status {
            font-size: 1.5rem;
            margin-bottom: 30px;
            font-weight: 600;
            height: 35px; /* Fixed height to prevent layout shifts */
            transition: color 0.3s ease;
        }

        .board {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            background-color: var(--board-bg);
            padding: 15px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            width: 100%;
            max-width: 400px;
        }

        .cell {
            aspect-ratio: 1;
            background-color: var(--cell-bg);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
            box-shadow: inset 0 0 0 rgba(0,0,0,0);
        }

        .cell:hover {
            background-color: var(--cell-hover);
        }

        .cell.x {
            color: var(--x-color);
            text-shadow: 0 0 15px var(--x-shadow);
        }

        .cell.o {
            color: var(--o-color);
            text-shadow: 0 0 15px var(--o-shadow);
        }

        .cell.win {
            background-color: var(--win-bg);
            color: var(--text-color);
            text-shadow: none;
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
            z-index: 10;
        }
        
        .cell.disabled {
            cursor: not-allowed;
        }

        .btn-restart {
            margin-top: 40px;
            padding: 12px 30px;
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--text-color);
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-restart:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
        }

        .btn-restart:active {
            transform: translateY(1px);
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
            h1 { font-size: 2.5rem; }
            .board { gap: 10px; padding: 10px; max-width: 320px; }
            .cell { font-size: 3rem; border-radius: 8px; }
            .status { font-size: 1.2rem; }
        }
    </style>
</head>
<body>

    <h1>Tic Tac Toe</h1>
    <div class="status" id="status">Player X's Turn</div>
    
    <div class="board" id="board">
        <div class="cell" data-index="0"></div>
        <div class="cell" data-index="1"></div>
        <div class="cell" data-index="2"></div>
        <div class="cell" data-index="3"></div>
        <div class="cell" data-index="4"></div>
        <div class="cell" data-index="5"></div>
        <div class="cell" data-index="6"></div>
        <div class="cell" data-index="7"></div>
        <div class="cell" data-index="8"></div>
    </div>

    <button class="btn-restart" id="restart">Restart Game</button>

    <script>
        const cells = document.querySelectorAll('.cell');
        const statusText = document.getElementById('status');
        const restartBtn = document.getElementById('restart');
        const board = document.getElementById('board');

        // Game State Variables
        let options = ["", "", "", "", "", "", "", "", ""];
        let currentPlayer = "X";
        let running = false;

        // All possible winning combinations (indices)
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        // Initialize Game
        function initializeGame() {
            cells.forEach(cell => cell.addEventListener('click', cellClicked));
            restartBtn.addEventListener('click', restartGame);
            statusText.textContent = \`Player \${currentPlayer}'s Turn\`;
            updateStatusColor();
            running = true;
        }

        // Handle Cell Click
        function cellClicked() {
            const cellIndex = this.getAttribute('data-index');

            // If cell is already filled or game is over, do nothing
            if (options[cellIndex] !== "" || !running) {
                return;
            }

            updateCell(this, cellIndex);
            checkWinner();
        }

        // Update Cell UI and State
        function updateCell(cell, index) {
            options[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase());
            cell.classList.add('disabled');
        }

        // Change Turn
        function changePlayer() {
            currentPlayer = (currentPlayer === "X") ? "O" : "X";
            statusText.textContent = \`Player \${currentPlayer}'s Turn\`;
            updateStatusColor();
        }

        // Update status text color to match the current player
        function updateStatusColor() {
            if (currentPlayer === "X") {
                statusText.style.color = "var(--x-color)";
                statusText.style.textShadow = "0 0 10px var(--x-shadow)";
            } else {
                statusText.style.color = "var(--o-color)";
                statusText.style.textShadow = "0 0 10px var(--o-shadow)";
            }
        }

        // Check for Winner or Draw
        function checkWinner() {
            let roundWon = false;
            let winningCells = [];

            for (let i = 0; i < winConditions.length; i++) {
                const condition = winConditions[i];
                const cellA = options[condition[0]];
                const cellB = options[condition[1]];
                const cellC = options[condition[2]];

                if (cellA === "" || cellB === "" || cellC === "") {
                    continue; // Skip if any cell in the combination is empty
                }
                
                if (cellA === cellB && cellB === cellC) {
                    roundWon = true;
                    winningCells = condition;
                    break;
                }
            }

            if (roundWon) {
                statusText.textContent = \`Player \${currentPlayer} Wins!\`;
                statusText.style.color = "var(--win-bg)";
                statusText.style.textShadow = "0 0 15px rgba(16, 185, 129, 0.6)";
                running = false;
                
                // Highlight winning cells
                winningCells.forEach(index => {
                    cells[index].classList.add('win');
                });
                
                // Disable all empty cells
                cells.forEach(cell => cell.classList.add('disabled'));
            } 
            else if (!options.includes("")) {
                // If no empty spots and no winner, it's a draw
                statusText.textContent = "It's a Draw!";
                statusText.style.color = "var(--text-color)";
                statusText.style.textShadow = "none";
                running = false;
            } 
            else {
                changePlayer();
            }
        }

        // Restart the Game
        function restartGame() {
            currentPlayer = "X";
            options = ["", "", "", "", "", "", "", "", ""];
            statusText.textContent = \`Player \${currentPlayer}'s Turn\`;
            updateStatusColor();
            
            cells.forEach(cell => {
                cell.textContent = "";
                cell.classList.remove('x', 'o', 'win', 'disabled');
            });
            
            running = true;
        }

        // Start the engine
        initializeGame();

    </script>
</body>
</html>
`

const Tictactoe = () => {
  return <Iframe html={game} />
}

export default Tictactoe
