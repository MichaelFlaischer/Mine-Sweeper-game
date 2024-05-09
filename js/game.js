'use strict'

// Defines the game board
var gBoard = []

// Represents the current game level and state
var gLevel
var gGame

// Stores the interval for the timer
var gIntervalTime

// Stores the best scores for each level
var gBestScore = { begginer: 0, medium: 0, expert: 0 }

// Stores previous game states for undo functionality
var gPreSteps = { preBoard: [], preGame: [] }

// Stores information about the Mega Hint feature
var gMegaHint = { isOn: false, startPoint: { i: null, j: null }, countMegaHint: 1 }

// Initializes the game with default settings
function onInit() {
  setLevel(8, 14, 'Medium')
}

// Starts a new game at the specified position
function startGame(i, j) {
  var gBackGroundAudio = new Audio('sound/click.mp3')
  gBackGroundAudio.play()
  // Resets Mega Hint and previous steps
  gMegaHint = { isOn: false, startPoint: { i: null, j: null }, countMegaHint: 1 }
  gPreSteps = { preBoard: [], preGame: [] }

  // Initializes game state
  gGame = { isOn: true, shownCount: 0, markedCount: 0, timeStart: new Date(), lifeLeft: 3, countHint: 3, isHintOn: false, countSafe: 3, countExterminator: 1 }

  // Sets up the board
  setEmptyCell(i, j)
  setMinesOnBoard(gBoard, i, j)
  setMinesNegsCount(gBoard)
  setEmptyCell(i, j)
  expandShown(gBoard, i, j)
  renderBoard(gBoard)

  // Starts the timer
  gIntervalTime = setInterval(setTimeLeft, 1000)
  renderGameButtons()
}

// Sets an empty cell at the specified position
function setEmptyCell(i, j) {
  gBoard[i][j].minesAroundCount = 0
}

// Sets the game level with the specified board size, mine count, and difficulty level
function setLevel(sizeBoard, countMines, level) {
  gLevel = { SIZE: sizeBoard, MINES: countMines, level: level, score: 100000 }
  resetGame()
  renderLevelButtens(gLevel.level)
}

// Resets the game state
function resetGame() {
  // Stops the timer
  clearInterval(gIntervalTime)

  // Resets the board
  gBoard = []
  buildBoard()
  renderStartBoard()

  // Resets the score and displays the smiley face
  gLevel.score = 100000
  const elSmilly = document.querySelector('.smile')
  elSmilly.textContent = '😀'
  elSmilly.classList.remove('hide')
}

// Checks if the game is over
function checkGameOver() {
  if (gGame.shownCount !== gBoard.length * gBoard.length - gLevel.MINES) return
  // Stops the timer and calculates the final score
  clearInterval(gIntervalTime)
  gLevel.score = gLevel.score - 100 * calculateTimeElapsedInSeconds(gGame.timeStart)
  setInfo(`You Won!! Congratulations 😎 you Scored ` + gLevel.score)
  const elSmilly = document.querySelector('.smile')
  elSmilly.textContent = '😎'
  gGame.isOn = false
  exposeMines()
  renderBoard(gBoard)
  var gBackGroundAudio = new Audio('sound/winning.mp3')
  gBackGroundAudio.play()
  setScore()
}

// Handles the click event on a cell
function onClicked(i, j) {
  // Checks if the hint mode is activated
  if (gGame.isHintOn) {
    useHint(i, j)
    return
  }

  // Executes game logic if the game is active
  if (gGame.isOn) {
    // Saves the current state for possible undo action
    gPreSteps.preBoard.push(JSON.parse(JSON.stringify(gBoard)))
    gPreSteps.preGame.push(JSON.parse(JSON.stringify(gGame)))

    // Activates Mega Hint mode if enabled
    if (gMegaHint.isOn) {
      if (gMegaHint.startPoint.i === null) {
        useMegaHint({ i: i, j: j })
      } else useMegaHint(gMegaHint.startPoint, { i: i, j: j })
      return
    }

    // Handles mine click
    if (gBoard[i][j].isMine) {
      var gBackGroundAudio = new Audio('sound/explosion.mp3')
      gBackGroundAudio.play()
      gGame.lifeLeft--
      setLifeLeft()
      renderCell(i, j)
      setTimeout(() => {
        if (gGame.isOn && !gBoard[i][j].isMarked) renderCell(i, j, true)
      }, 1500)
      setInfo(`you hit mine 💥 left with ${gGame.lifeLeft} lives 💗`)
      gLevel.score -= 2000
      if (gGame.lifeLeft === 0) {
        gameOver()
        renderBoard(gBoard)
      }
      return
    }
    var gBackGroundAudio = new Audio('sound/click.mp3')
    gBackGroundAudio.play()

    // Expands the shown area on the board
    expandShown(gBoard, i, j)

    // Checks if the game is over
    checkGameOver()
  }
  renderBoard(gBoard)
}

// Handles the cell marking event
function onCellMarked(i, j) {
  // Executes logic if the game is active
  if (gGame.isOn) {
    // Updates the marked count
    if (gBoard[i][j].isMarked) {
      gGame.markedCount--
    }
    if (gGame.markedCount === gLevel.MINES) return
    if (!gBoard[i][j].isMarked) {
      gGame.markedCount++
    }
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked

    // Checks if the game is over
    checkGameOver()
    renderBoard(gBoard)
    setFlagsLeft()
  }
}

// Exposes all mines on the board
function exposeMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) gBoard[i][j].isShown = true
    }
  }
}

// Handles game over event
function gameOver() {
  // Resets the score and displays a message
  gLevel.score = 0
  setInfo(`Game Over 🤯 you Scored ` + gLevel.score)
  const elSmilly = document.querySelector('.smile')
  elSmilly.textContent = '🤯'
  var gBackGroundAudio = new Audio('sound/gameOver.mp3')
  gBackGroundAudio.play()
  // Exposes all mines and stops the game
  exposeMines()
  gGame.isOn = false
  clearInterval(gIntervalTime)
}

// Toggles the hint mode on or off
function runHint() {
  if (!gGame.isOn && gGame.isHintOn) {
    setInfo(`you turned off hint mode`)
    gGame.isHintOn = false
    gGame.countHint++
    gGame.isOn = true
  } else {
    if (gGame.countHint > 0 && gGame.isOn) {
      setInfo(`you turned on hint mode`)
      gGame.isHintOn = true
      gGame.countHint--
      gGame.isOn = false
    }
  }
  setHintsLeft()
}

// Uses a hint to reveal neighboring cells
function useHint(iPos, jPos) {
  // Reveals neighboring cells
  for (var i = iPos - 1; i <= iPos + 1; i++) {
    for (var j = jPos - 1; j <= jPos + 1; j++) {
      if (i >= 0 && j >= 0 && i < gBoard.length && j < gBoard.length) renderCell(i, j)
    }
  }

  // Updates game state and score
  gGame.isHintOn = false
  setTimeout(() => {
    gGame.isOn = true
    renderBoard(gBoard)
    setInfo(`you left with ${gGame.countHint} hints 💡`)
    gLevel.score -= 1000
  }, 1000)
}

// Undoes the previous step
function undoStep() {
  if (gGame.isOn) {
    if (gPreSteps.preGame.length === 0) setInfo('Sorry, you cant to undo mroe ♻️')
    else {
      var timeStart = gGame.timeStart
      gGame = gPreSteps.preGame.pop()
      gGame.timeStart = timeStart
      gBoard = gPreSteps.preBoard.pop()
      renderBoard(gBoard)
      renderGameButtons()
    }
  }
}

// Shows a safe cell on the board
function showSafeCell() {
  if (gGame.isOn && gGame.countSafe > 0) {
    var cells = []
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
        if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) cells.push({ i: i, j: j })
      }
    }
    var randCell = cells[getRandomIntInclusive(0, cells.length - 1)]
    const elCell = document.querySelector(`.cell-${randCell.i}-${randCell.j}`)
    elCell.classList.toggle('green')
    setTimeout(() => {
      elCell.classList.toggle('green')
    }, 3000)
    gGame.countSafe--
    setInfo(`you left with ${gGame.countSafe} safes 🛡️`)
    setSafeLeft()
  }
}

// Uses a mine exterminator to remove mines from the board
function mineExterminator() {
  if (gGame.isOn) {
    if (gGame.countExterminator > 0) {
      var mines = []
      for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
          if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) mines.push({ i: i, j: j })
        }
      }
      for (var n = 0; n < 3 && gLevel.MINES > 0; n++) {
        var randCell = mines[getRandomIntInclusive(0, mines.length - 1)]
        gBoard[randCell.i][randCell.j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        gLevel.MINES--
      }

      // Recalculates neighboring mine counts and updates the board
      setMinesNegsCount(gBoard)
      renderBoard(gBoard)
      setFlagsLeft()
      gGame.countExterminator--
      setInfo(`you left with ${gGame.countExterminator} mine exterminators 💣`)
      setMineExtermintorBtn()
    }
  }
}

// Activates or deactivates the Mega Hint mode
function useMegaHint(startPos = null, endPos = null) {
  if (gGame.isOn) {
    if (!gMegaHint.isOn && gMegaHint.countMegaHint > 0 && startPos === null) {
      gMegaHint = { isOn: true, startPoint: { i: null, j: null }, countMegaHint: gMegaHint.countMegaHint - 1 }
      setMegaHintBtn()
      renderBoard(gBoard)
      setInfo(`you turned on mega hint mode🔎`)
    } else if (startPos === null && gMegaHint.isOn) {
      gMegaHint = { isOn: false, startPoint: { i: null, j: null }, countMegaHint: gMegaHint.countMegaHint + 1 }
      setMegaHintBtn()
      renderBoard(gBoard)
      setInfo(`you turned off mega hint mode🔎`)
    } else if (endPos === null && gMegaHint.isOn) {
      const elCell = document.querySelector(`.cell-${startPos.i}-${startPos.j}`)
      elCell.classList.toggle('green')
      gMegaHint.startPoint = startPos
    } else if (gMegaHint.isOn) {
      if (startPos.i === endPos.i && startPos.j === endPos.j) {
        gMegaHint = { isOn: true, startPoint: { i: null, j: null }, countMegaHint: gMegaHint.countMegaHint }
        renderBoard(gBoard)
      }

      gMegaHint = { isOn: false, startPoint: { i: null, j: null }, countMegaHint: gMegaHint.countMegaHint }
      setMegaHintBtn()
      renderBoard(gBoard)
      for (var i = Math.min(startPos.i, endPos.i); i <= Math.max(startPos.i, endPos.i); i++) {
        for (var j = Math.min(startPos.j, endPos.j); j <= Math.max(startPos.j, endPos.j); j++) {
          renderCell(i, j)
        }
      }
      setTimeout(() => {
        renderBoard(gBoard)
        setInfo(`you left with ${gMegaHint.countMegaHint} mega hints 🔎`)
      }, 1000)
    }
  }
}
