/* ================== ELEMENTS ================== */
const screens = document.querySelectorAll(".screen");
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const winLine = document.getElementById("win-line");
const celebration = document.getElementById("celebration");
const resultText = document.getElementById("resultText");
const confirmBox = document.getElementById("confirmExit");
const boardEl = document.querySelector(".board");

/* ================== GAME STATE ================== */
let board = Array(9).fill("");
let mode = "";              // "computer" | "multi"
let difficulty = "easy";    // "easy" | "hard"
let turn = "X";             // "X" | "O"
let p1 = "You";
let p2 = "Computer";
let gameEnded = false;

const HUMAN = "X";
const AI = "O";

/* ================== WIN PATTERNS ================== */
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/* ================== EVENT BIND ================== */
cells.forEach((c, i) => {
  c.addEventListener("click", () => makeMove(i));
});

/* ================== SCREEN NAV ================== */
function show(id){
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
function go(m){
  mode = m;
  show(m);
}

/* ================== START MODES ================== */
function startComputer(){
  difficulty = document.getElementById("difficulty").value;
  turn = document.getElementById("firstTurn").value;
  p1 = "You";
  p2 = "Computer";

  resetBoard();
  show("game");
  updateStatus();

  if(turn === AI){
    setTimeout(aiMove, 400);
  }
}

function startMulti(){
  p1 = document.getElementById("p1").value || "Player 1";
  p2 = document.getElementById("p2").value || "Player 2";
  turn = document.getElementById("multiTurn").value;

  resetBoard();
  show("game");
  updateStatus();
}

/* ================== PLAYER MOVE ================== */
function makeMove(i){
  if(board[i] !== "" || gameEnded) return;

  board[i] = turn;
  cells[i].textContent = turn;
  cells[i].classList.add(turn);

  if(checkWin(turn)){
    endGame(turn);
    return;
  }

  if(!board.includes("")){
    endGame("DRAW");
    return;
  }

  turn = turn === HUMAN ? AI : HUMAN;
  updateStatus();

  if(mode === "computer" && turn === AI){
    setTimeout(aiMove, 400);
  }
}

/* ================== AI MOVE ================== */
function aiMove(){
  if(gameEnded) return;

  let move;
  if(difficulty === "easy"){
    move = randomMove();
  } else {
    move = bestMove();   // 🔥 UNBEATABLE
  }

  makeMove(move);
}

function randomMove(){
  const empty = board
    .map((v,i) => v === "" ? i : null)
    .filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

/* ================== UNBEATABLE MINIMAX ================== */
function bestMove(){
  let bestScore = -Infinity;
  let move = -1;

  for(let i=0;i<9;i++){
    if(board[i] === ""){
      board[i] = AI;
      let score = minimax(board, 0, false);
      board[i] = "";

      if(score > bestScore){
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing){
  const result = evaluate(boardState);
  if(result !== null){
    return result;
  }

  if(isMaximizing){
    let best = -Infinity;
    for(let i=0;i<9;i++){
      if(boardState[i] === ""){
        boardState[i] = AI;
        best = Math.max(best, minimax(boardState, depth+1, false));
        boardState[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for(let i=0;i<9;i++){
      if(boardState[i] === ""){
        boardState[i] = HUMAN;
        best = Math.min(best, minimax(boardState, depth+1, true));
        boardState[i] = "";
      }
    }
    return best;
  }
}

function evaluate(b){
  for(let p of winPatterns){
    if(p.every(i => b[i] === AI)) return 10;
    if(p.every(i => b[i] === HUMAN)) return -10;
  }
  if(!b.includes("")) return 0; // draw
  return null;
}

/* ================== CHECK WIN + LINE ================== */
function checkWin(player){
  for(let p of winPatterns){
    if(p.every(i => board[i] === player)){
      drawLine(p);
      return true;
    }
  }
  return false;
}

function drawLine(p){
  const a = cells[p[0]].getBoundingClientRect();
  const b = cells[p[2]].getBoundingClientRect();
  const r = boardEl.getBoundingClientRect();

  const x1 = a.left + a.width/2 - r.left;
  const y1 = a.top + a.height/2 - r.top;
  const x2 = b.left + b.width/2 - r.left;
  const y2 = b.top + b.height/2 - r.top;

  winLine.style.left = x1 + "px";
  winLine.style.top = y1 + "px";
  winLine.style.width = Math.hypot(x2-x1, y2-y1) + "px";
  winLine.style.transform =
    `rotate(${Math.atan2(y2-y1, x2-x1) * 180 / Math.PI}deg)`;
}

/* ================== END GAME ================== */
function endGame(winner){
  gameEnded = true;
  celebration.classList.add("show");

  if(winner === "DRAW"){
    resultText.textContent = "⚡ DRAW ⚡";
  } else {
    resultText.textContent =
      `🔥 ${(winner === HUMAN ? p1 : p2)} WINS 🔥`;
  }
}

/* ================== RESET / CONTINUE ================== */
function continueGame(){
  celebration.classList.remove("show");
  resetBoard();
  show("game");
  updateStatus();
}

function resetBoard(){
  gameEnded = false;
  board.fill("");
  cells.forEach(c => {
    c.textContent = "";
    c.className = "cell";
  });
  winLine.style.width = "0";
}

/* ================== STATUS ================== */
function updateStatus(){
  status.textContent =
    `${turn === HUMAN ? p1 : p2}'s turn (${turn})`;
}

/* ================== HOME / EXIT ================== */
function goHome(){
  if(!gameEnded && board.some(v => v !== "")){
    confirmBox.classList.add("show");
  } else {
    location.reload();
  }
}

function confirmExit(yes){
  confirmBox.classList.remove("show");
  if(yes) location.reload();
}
