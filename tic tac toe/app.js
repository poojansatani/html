const screens = document.querySelectorAll(".screen");
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const winLine = document.getElementById("win-line");
const celebration = document.getElementById("celebration");
const resultText = document.getElementById("resultText");
const confirmBox = document.getElementById("confirmExit");
const boardEl = document.querySelector(".board");

let board = Array(9).fill("");
let mode = "", turn = "X", difficulty = "easy";
let p1 = "You", p2 = "Computer";
let gameEnded = false;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach((c,i)=> c.onclick = () => makeMove(i));

function show(id){
  screens.forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
function go(m){ mode = m; show(m); }

function startComputer(){
  difficulty = document.getElementById("difficulty").value;
  turn = document.getElementById("firstTurn").value;
  p1 = "You"; p2 = "Computer";
  resetBoard(); show("game"); updateStatus();
  if(turn==="O") setTimeout(aiMove,400);
}

function startMulti(){
  p1 = document.getElementById("p1").value || "Player 1";
  p2 = document.getElementById("p2").value || "Player 2";
  turn = document.getElementById("multiTurn").value;
  resetBoard(); show("game"); updateStatus();
}

function makeMove(i){
  if(board[i] || gameEnded) return;
  board[i] = turn;
  cells[i].textContent = turn;
  cells[i].classList.add(turn);

  if(checkWin()){ endGame(turn); return; }
  if(!board.includes("")){ endGame("DRAW"); return; }

  turn = turn==="X" ? "O" : "X";
  updateStatus();
  if(mode==="computer" && turn==="O") setTimeout(aiMove,400);
}

function aiMove(){
  if(gameEnded) return;
  let empty = board.map((v,i)=> v==="" ? i : null).filter(v=>v!==null);
  let m = empty[Math.floor(Math.random()*empty.length)];
  makeMove(m);
}

function checkWin(){
  for(let p of winPatterns){
    if(p.every(i=>board[i]===turn)){
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
  winLine.style.left = x1+"px";
  winLine.style.top = y1+"px";
  winLine.style.width = Math.hypot(x2-x1,y2-y1)+"px";
  winLine.style.transform = `rotate(${Math.atan2(y2-y1,x2-x1)*180/Math.PI}deg)`;
}

function endGame(w){
  gameEnded = true;
  celebration.classList.add("show");
  resultText.textContent =
    w==="DRAW" ? "⚡ DRAW ⚡" : `🔥 ${w==="X"?p1:p2} WINS 🔥`;
}

function continueGame(){
  celebration.classList.remove("show");
  resetBoard(); show("game"); updateStatus();
}

function resetBoard(){
  gameEnded = false;
  board.fill("");
  cells.forEach(c=>{
    c.textContent="";
    c.className="cell";
  });
  winLine.style.width="0";
}

function updateStatus(){
  status.textContent = (turn==="X"?p1:p2) + "'s turn ("+turn+")";
}

function goHome(){
  if(!gameEnded && board.some(v=>v!=="")){
    confirmBox.classList.add("show");
  } else location.reload();
}

function confirmExit(y){
  confirmBox.classList.remove("show");
  if(y) location.reload();
}
