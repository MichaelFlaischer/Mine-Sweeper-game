'use strict'

// Toggles the visibility of the manual mode window
function toggleManualMode() {
  var elManualMode = document.querySelector('.manual')
  elManualMode.classList.toggle('hide')
}

// Sets the game mode to manual based on user input
function setManuallyMode() {
  var size = document.getElementById('boardSizeInput').value
  toggleManualMode()
  gLevel = { SIZE: size, MINES: 0, level: 'manual', score: 100000 }
  gMegaHint = { isOn: false, startPont: { i: null, j: null }, countMegaHint: 1 }
  gBoard = []
  buildBoard()
  renderManualBoard()
  renderLevelButtens(gLevel.level)
}

// Renders the manual mode board
function renderManualBoard() {
  var strHTML = ''
  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gLevel.SIZE; j++) {
      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className}" onclick="setMine(${i},${j})"></td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tr><tr><div onclick="startManualGame()">Start Game</div></tr>'
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

// Toggles a mine at the specified position
function setMine(iPos, jPos) {
  if (gBoard[iPos][jPos].isMine) {
    gBoard[iPos][jPos].isMine = false
    gBoard[iPos][jPos].minesAroundCount = 0
    gLevel.MINES--
    renderCell(iPos, jPos)
  } else {
    gBoard[iPos][jPos].isMine = true
    gBoard[iPos][jPos].minesAroundCount = -1
    gLevel.MINES++
    renderCell(iPos, jPos)
  }
}

// Starts a manual game
function startManualGame() {
  clearInterval(gIntervalTime)
  renderStartManualBoard()
  gLevel.score = 100000
  const elSmilly = document.querySelector('.smile')
  elSmilly.textContent = '😀'
  elSmilly.classList.remove('hide')
}

// Renders the starting board for the manual mode
function renderStartManualBoard(board) {
  var strHTML = ''
  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gLevel.SIZE; j++) {
      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className}" onclick="runManualGame(${i},${j})"></td>`
    }
    strHTML += '</tr>'
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

// Runs the manual game based on user input
function runManualGame(i, j) {
  gPreSteps = { preBoard: [], preGame: [] }
  gGame = { isOn: true, shownCount: 0, markedCount: 0, timeStart: new Date(), lifeLeft: 3, countHint: 3, isHintOn: false, countSafe: 3, countExterminator: 1 }
  setEmptyCell(i, j)
  setMinesNegsCount(gBoard)
  setEmptyCell(i, j)
  expandShown(gBoard, i, j)
  renderBoard(gBoard)
  gIntervalTime = setInterval(setTimeLeft, 1000)
  setTimeLeft()
  setFlagsLeft()
  setLifeLeft()
  setHintsLeft()
  setSafeLeft()
  setPreviousMode()
  setMineExtermintorBtn()
  setMegaHintBtn()
}
