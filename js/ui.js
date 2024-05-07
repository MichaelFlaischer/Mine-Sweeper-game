'use strict'

var gIsDark = true

// Renders the game board
function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gLevel.SIZE; j++) {
      var symbol = ''
      if (gBoard[i][j].isMine) {
        symbol = '💣'
      } else if (gBoard[i][j].minesAroundCount > 0) {
        symbol = gBoard[i][j].minesAroundCount.toString()
      }

      const className = `cell cell-${i}-${j}`
      if (board[i][j].isShown && !board[i][j].isMine) {
        strHTML += `<td class="${className} shown">${symbol}</td>`
      } else if (board[i][j].isShown && board[i][j].isMine) {
        strHTML += `<td class="${className} shown bomb">${symbol}</td>`
      } else if (board[i][j].isMarked) {
        strHTML += `<td class="${className}" oncontextmenu="event.preventDefault(); onCellMarked(${i},${j})"  >❌</td>`
      } else {
        strHTML += `<td class="${className}" onclick="onClicked(${i},${j})" oncontextmenu="event.preventDefault(); onCellMarked(${i},${j})"></td>`
      }
    }
    strHTML += '</tr>'
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

// Renders the initial start board
function renderStartBoard(board) {
  var strHTML = ''
  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gLevel.SIZE; j++) {
      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className}" onclick="startGame(${i},${j})"></td>`
    }
    strHTML += '</tr>'
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

// Renders a single cell
function renderCell(i, j, isHide = false) {
  var symbol = ''
  if (isHide) symbol = ''
  else if (gBoard[i][j].isMine) {
    symbol = '💣'
  } else if (gBoard[i][j].minesAroundCount > 0) {
    symbol = gBoard[i][j].minesAroundCount.toString()
  }
  const className = `cell cell-${i}-${j}`
  const htmlCode = `<td class="${className}">${symbol}</td>`
  const elCell = document.querySelector(`.cell-${i}-${j}`)
  elCell.innerHTML = htmlCode
}

// Renders the game control buttons
function renderGameButtons() {
  setFlagsLeft()
  setLifeLeft()
  setHintsLeft()
  setSafeLeft()
  setPreviousMode()
  setMineExtermintorBtn()
  setMegaHintBtn()
}

// Toggles the display of the score window
function toggleScoreWindow() {
  var elWindow = document.querySelector('.scores-table')
  elWindow.classList.toggle('hide')
}

// Toggles the display of the manual window
function toggleManualWindow() {
  var elWindow = document.querySelector('.manual')
  elWindow.classList.toggle('hide')
}

// Updates the time left display
function setTimeLeft() {
  if (gGame.isOn) {
    const elTime = document.querySelector('.time')
    elTime.textContent = '🕰️' + calculateTimeElapsed(gGame.timeStart)
  }
}

// Updates the number of flags left to place
function setFlagsLeft() {
  const elFlags = document.querySelector('.flags')
  elFlags.textContent = '🚩' + (gLevel.MINES - gGame.markedCount)
}

// Updates the number of lives left
function setLifeLeft() {
  const elLife = document.querySelector('.life')
  elLife.textContent = '💗' + gGame.lifeLeft
}

// Updates the number of hints left
function setHintsLeft() {
  const elHint = document.querySelector('.hint')
  elHint.innerHTML = `<td class="hint" onclick="runHint()" title="hints left">💡 ${gGame.countHint}</td>`
}

// Updates the number of safe cells left
function setSafeLeft() {
  const elHint = document.querySelector('.safe-mode')
  elHint.innerHTML = `<td class="safe-mode" onclick="showSafeCell()" title="safe mode left">🛡️ ${gGame.countSafe}</td>`
}

// Updates the button for undoing the previous move
function setPreviousMode() {
  const elHint = document.querySelector('.previous-move')
  elHint.innerHTML = `<td class="previous-move" title="Get to previous move" onclick="undoStep()">♻️</td>`
}

// Updates the button for using the mine exterminator
function setMineExtermintorBtn() {
  const elExterminator = document.querySelector('.mine-exterminator')
  elExterminator.innerHTML = `<td class="mine-exterminator" title="Eliminate 3 of existing mines randomly" onclick="mineExterminator()">💣 ${gGame.countExterminator}</td>`
}

// Updates the button for using the mega hint
function setMegaHintBtn() {
  const elExterminator = document.querySelector('.mega-hint')
  elExterminator.innerHTML = `<td class="mega-hint" title="Reveal an area of the board for 2 seconds" onclick="useMegaHint()">🔎 ${gMegaHint.countMegaHint}</td>`
}

// Displays an info message temporarily
function setInfo(info) {
  const elInfo = document.querySelector(`.info`)
  elInfo.classList.remove('hide')
  elInfo.textContent = info
  setTimeout(() => {
    elInfo.classList.add('hide')
  }, 2000)
}

// Renders the level selection buttons
function renderLevelButtens(levelName = null) {
  var elBtnBegginer = document.querySelector('.begginer')
  var elBtnMedium = document.querySelector('.medium')
  var elBtnExpert = document.querySelector('.expert')
  var elBtnManual = document.querySelector('.manual-mode')

  if (levelName === 'Begginer') {
    elBtnBegginer.classList.add('level-selected')
    elBtnMedium.classList.remove('level-selected')
    elBtnExpert.classList.remove('level-selected')
    elBtnManual.classList.remove('level-selected')
  } else if (levelName === 'Medium') {
    elBtnMedium.classList.add('level-selected')
    elBtnBegginer.classList.remove('level-selected')
    elBtnExpert.classList.remove('level-selected')
    elBtnManual.classList.remove('level-selected')
  } else if (levelName === 'Expert') {
    elBtnExpert.classList.add('level-selected')
    elBtnBegginer.classList.remove('level-selected')
    elBtnMedium.classList.remove('level-selected')
    elBtnManual.classList.remove('level-selected')
  } else {
    elBtnExpert.classList.remove('level-selected')
    elBtnBegginer.classList.remove('level-selected')
    elBtnMedium.classList.remove('level-selected')
    elBtnManual.classList.add('level-selected')
  }
}

// Sets and updates the best score for the current level
function setScore() {
  if (gLevel.level === 'Begginer') {
    if (gBestScore.begginer < gLevel.score) {
      gBestScore.begginer = gLevel.score
      const elScore = document.querySelector(`.begginer-score`)
      elScore.textContent = 'Begginer: ' + gLevel.score
    }
  } else if (gLevel.level === 'Medium') {
    if (gBestScore.medium < gLevel.score) {
      gBestScore.medium = gLevel.score
      const elScore = document.querySelector(`.medium-score`)
      elScore.textContent = 'Medium: ' + gLevel.score
    }
  } else if (gLevel.level === 'Expert') {
    if (gBestScore.expert < gLevel.score) {
      gBestScore.expert = gLevel.score
      const elScore = document.querySelector(`.expert-score`)
      elScore.textContent = 'Expert: ' + gLevel.score
    }
  } else {
    if (gBestScore.expert < gLevel.score) {
      gBestScore.expert = gLevel.score
      const elScore = document.querySelector(`.manual-score`)
      elScore.textContent = 'Manual mode: ' + gLevel.score
    }
  }
  gBestScore
}
// Function to switch to light mode by updating CSS variables
function switchToLightMode() {
  // Set CSS variables for light mode
  document.documentElement.style.setProperty('--background-color', 'white')
  document.documentElement.style.setProperty('--text-color', 'black')
  document.documentElement.style.setProperty('--main-bg-color', 'lightgray')
  document.documentElement.style.setProperty('--cell-bg-color', 'purple')
  document.documentElement.style.setProperty('--cell-border-color', 'black')
  document.documentElement.style.setProperty('--highlighted-bg-color', 'rgba(0, 0, 0, 0.1)')
  document.documentElement.style.setProperty('--bomb-bg-color', 'red')
  document.documentElement.style.setProperty('--info-bg-color', 'lightgray')
  document.documentElement.style.setProperty('--info-border-color', 'black')
  document.documentElement.style.setProperty('--smile-bg-color', 'green')
  document.documentElement.style.setProperty('--manual-bg-color', 'lightblue')
}

// Function to switch to dark mode by updating CSS variables
function switchToDarkMode() {
  // Set CSS variables for dark mode
  document.documentElement.style.setProperty('--background-color', 'black')
  document.documentElement.style.setProperty('--text-color', 'white')
  document.documentElement.style.setProperty('--main-bg-color', 'rgb(49, 47, 47)')
  document.documentElement.style.setProperty('--cell-bg-color', 'gray')
  document.documentElement.style.setProperty('--cell-border-color', 'white')
  document.documentElement.style.setProperty('--highlighted-bg-color', 'rgba(23, 236, 112, 0.1)')
  document.documentElement.style.setProperty('--bomb-bg-color', 'red')
  document.documentElement.style.setProperty('--info-bg-color', 'gray')
  document.documentElement.style.setProperty('--info-border-color', 'white')
  document.documentElement.style.setProperty('--smile-bg-color', 'green')
  document.documentElement.style.setProperty('--manual-bg-color', 'rgb(12, 158, 243)')
}

// Function to toggle between light and dark modes
function toggleColorMode() {
  // Check the current mode and switch to the opposite mode
  if (gIsDark) {
    switchToLightMode() // Switch to light mode
  } else {
    switchToDarkMode() // Switch to dark mode
  }
  gIsDark = !gIsDark
}
