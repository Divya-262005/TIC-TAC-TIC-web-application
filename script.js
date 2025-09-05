const board = document.getElementById("board");
const status = document.getElementById("status");
let cells = Array(9).fill(null);
let gameOver = false;

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.addEventListener("click", () => playerMove(i));
    board.appendChild(div);
  });
}

function playerMove(index) {
  if (cells[index] || gameOver) return;
  cells[index] = "X";
  renderBoard();
  if (checkWin("X")) return endGame("You win!");
  if (cells.every(cell => cell)) return endGame("It's a draw!");

  status.textContent = "AI is thinking...";
  setTimeout(() => {
    aiMove();
    status.textContent = "";
  }, 1000); // 1 second delay
}

function aiMove() {
  const move = minimax(cells, "O").index;
  cells[move] = "O";
  renderBoard();
  if (checkWin("O")) return endGame("AI wins!");
  if (cells.every(cell => cell)) return endGame("It's a draw!");
}

function checkWin(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => combo.every(i => cells[i] === player));
}

function endGame(message) {
  gameOver = true;
  status.textContent = message;
}

function resetGame() {
  cells = Array(9).fill(null);
  gameOver = false;
  status.textContent = "";
  renderBoard();
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);

  if (checkWin("X")) return { score: -10 };
  if (checkWin("O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === "O") {
      const result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      const result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[availSpots[i]] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

renderBoard();