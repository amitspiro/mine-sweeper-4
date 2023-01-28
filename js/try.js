var gBoard;
var gSize = 4;
var gMine = 2;
var gClicked = { i: null, j: null };
var gNegMines = 0;
var gFirsTime = true;
var gLives = 3;
var gTotalEmpty = 14;
var gFlag = false;
var gTotalFlagged = 0;
var gDark =false

const HEART = `<span class="HEART"></span>`;
var COVER = `<span class="COVER"><img src="img/0.gif"></span>`;
var EMPTY = `<span class="EMPTY"> . </span>`;
const FLAG = `<span class="FLAG">🚩</span>`;
const MINE = "💣";
const HAPPY = "😃";
const SAD = "🤒";
const VERY_SAD = "🤕";
const WIN = "🥳";
const DEAD = "😵";
var gSmileyBtn;
var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function onInit() {
  if (gGame.isOn) {
    gBoard = buildBoard();
    renderBoard(gBoard);
    gSmileyBtn = HAPPY;
    // multiMines(gMine);
    addMine();
    addMine();
    addMine();
    addMine();
    // mineDevelop();
    changeSmile(HAPPY);
    boardMinesCount(gBoard);
    gGame.isOn = true;
    // updateScore(gMine)
  } else return;
}
function mineDevelop() {
  gBoard[1][1].isMine = true;
  gBoard[2][2].isMine = true;
}
// function multiMines(amount) {
//   for (var i = 1; i <= amount.length; i++) {
//     addMine();
//   }
//   return;
// }
function addMine() {
  var emptyLocation = getEmptyLocation(gBoard);
  if (!emptyLocation) return;
  // Update Model
  gBoard[emptyLocation.i][emptyLocation.j].isMine = true;
  // Update DOM
  renderBoard(gBoard);
  // renderCell(emptyLocation, MINE);
}
function buildBoard() {
  const board = [];

  for (var i = 0; i < gSize; i++) {
    board.push([]);
    for (var j = 0; j < gSize; j++) {
      board[i][j] = {
        type: COVER,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}
function getEmptyLocation(board) {
  var emptyLocations = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].isShown === false) {
        emptyLocations.push({ i, j });
      }
    }
  }
  if (!emptyLocations.length) return null;
  var randIdx = getRandomIntInclusive(0, emptyLocations.length - 1);
  return emptyLocations[randIdx];
}

function renderBoard(board) {
  var strHTML = "<table><tbody>";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j].isMine ? MINE : board[i][j].minesAroundCount;
      // console.log("amount?", gBoard[i][j].minesAroundCount);

      //   var clickCount = board[i][j].minesAroundCount;
      const className = `cell cell-${i}-${j}`;

      strHTML += `<td id="noContextMenu" class="${className}"
      onclick="onCellClicked(${i}, ${j},event)" oncontextmenu="onCellMarked=(${i},${j})"><div class="box">${
        board[i][j].isShown ? cell : COVER
      }</div></td>`;
    }

    strHTML += "</tr>";
  }

  strHTML += "</tbody></table>";
  const elContainer = document.querySelector(".board-container");
  elContainer.innerHTML = strHTML;
}
function boardMinesCount(board) {
  var mineLocations = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j] === MINE || board[i][j].isMine === true) {
        mineLocations.push({ i, j });
      }
    }
  }
  document.querySelector("h4 span").innerText = mineLocations.length;
  if (!mineLocations.length) return;
}

function onCellClicked(i, j) {
  setMinesNegsCount({ i, j });
  // console.log("amount?", gBoard[i][j].minesAroundCount);
  // onCellMarked(evevnt, gBoard[i][j])
  if (gBoard[i][j].isMine) {
  }

  if (gBoard[i][j].minesAroundCount === 0) {
    expandByOne(i, j);
  }

  if (!gGame.isOn) return;
  // console.log(gBoard[i][j]);
  if (gBoard[i][j].isMine) {
    const elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerText = `${MINE}`;
  }
  if (gBoard[i][j].isShown === true || gBoard[i][j].isMarked === true) return;
  if (gFirsTime) {
    startTimer();
    gFirsTime = false;
  }
  if (!gBoard[i][j].isShown) {
    gBoard[i][j].isShown = true;
    gBoard[i][j].type = EMPTY;
    gGame.shownCount++;
    // console.log("amount?", gBoard[i][j].minesAroundCount);
    
    if (gBoard[i][j].isMine === true && gLives !== 0) {
      gLives--;
      if (gLives === 2) {
        document.querySelector("h2 span").innerText = "❤❤";
        changeSmile(SAD);
      }
      if (gLives === 1) {
        document.querySelector("h2 span").innerText = "❤";
        changeSmile(VERY_SAD);
      }
      if (gLives === 0) {
        document.querySelector("h2 span").innerText = "0";
        changeSmile(DEAD);
      }
      checkGameOver();
    }
    gClicked.i = i;
    gClicked.j = j;
    
    // const elScore = document.querySelector(".score");
    // elScore.innerText = `${gGame.shownCount}`;
    renderBoard(gBoard);
  }
}

function expandByOne(rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= gBoard[i].length) continue;
      if (gBoard[i][j].isMine) {
        continue
      } else {
        gBoard[i][j].isShown = true;
        // if(gBoard[i][j].isShown && !gBoard[i][j].isMine===ture && gBoard[i][j].minesAroundCount===0){
          // expandByOne(i, j)
          renderBoard(gBoard);
      }
      
    }
  }
  renderBoard(gBoard);
}
function setMinesNegsCount(gClicked) {
  for (var i = gClicked.i - 1; i <= gClicked.i + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = gClicked.j - 1; j <= gClicked.j + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      if (i === gClicked.i && j === gClicked.j) continue;
      var currCell = gBoard[i][j];

      if (currCell.isMine === true || currCell === MINE) {
        gBoard[gClicked.i][gClicked.j].minesAroundCount++;
      }
    }
  }
}

function changeSmile(mood) {
  var elSmile = document.querySelector(".smileyBtn");
  elSmile.innerText = `${mood}`;
}

function restart() {
  document.querySelector("h2 span").innerText = "❤❤❤";
  resetTime();
  onInit();
}

function changeLevel(mat, mines) {
  gSize = mat;
  gMine = mines;
  onInit();
  gTotalEmpty = mat ** 2 - mines;
}

function checkGameOver() {
  if (gLives === 0) {
    gGame.isOn = false;
    gameLost();
  }
}
function resetTime() {
  var elH3 = document.querySelector(".time");
  elH3.innerText = "0.000";
}

function startTimer() {
  gStartTime = Date.now();
  gInterval = setInterval(() => {
    const seconds = (Date.now() - gStartTime) / 1000;
    var elH3 = document.querySelector(".time");
    elH3.innerText = seconds.toFixed(3);
  }, 1);
}

function gameLost() {
  var elresult = document.querySelector(".result");
  elresult.style.display = "block";
  elresult.innerText = "You L🤕st!";
  changeSmile(DEAD)
}

function onCellMarked(ev, elCell) {
  ev.preventDefault();
  if (!elCell.isShown) {
    if (!elCell.isMarked) {
      elCell.isMarked = true;
      elCell.innerText = FLAG;
      gTotalFlagged++;
    } else {
      elCell.isMarked = false;
      elCell.innerText = EMPTY;
      gTotalFlagged--;
    }
    renderBoard(gBoard)
  }
}
// function rightClickCell(i,j){
//   var cellId =`cell-${i}-${j}`
//   var elCell = document.getElementById(cellId)
//   elCell.addEventListener("contextmenu", function (event){
//     event.preventDefault()
//     cell.classList.add("flag")
//   })
// }


// oncontextmenu="onCellMarked=(ev, this, ${i},${j})"

// const specificDiv = document.getElementById(".cell-${i}-${j}")
// specificDiv.innerText= `${FLAG}`

function darkMode(){
  if (!gDark){
  var elBody= document.querySelector("body")
  elBody.style.backgroundImage =`url("../img/4.gif")`
  gDark=true
}else{
  var elBody= document.querySelector("body")
  elBody.style.backgroundImage =`url("../img/1.gif")`
  gDark=false
}
}