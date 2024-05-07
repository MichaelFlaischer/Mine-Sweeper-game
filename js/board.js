'use strict'

// Function to build the game board
function buildBoard() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    gBoard.push([])
    for (var j = 0; j < gLevel.SIZE; j++) {
      // Initialize each cell with default properties
      gBoard[i].push({ minesAroundCount: 0, isShown: false, isMine: false, isMarked: false })
    }
  }
}

// Function to set the number of mines adjacent to each cell
function setMinesNegsCount(board) {
  var cells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!board[i][j].isMine) board[i][j].minesAroundCount = isNegsMines(i, j)
    }
  }
}

// Function to count the number of neighboring mines for a given cell
function isNegsMines(iPos, jPos) {
  var countMines = 0
  for (var i = Math.max(iPos - 1, 0); i <= Math.min(iPos + 1, gBoard.length - 1); i++) {
    for (var j = Math.max(jPos - 1, 0); j <= Math.min(jPos + 1, gBoard.length - 1); j++) {
      if (gBoard[i][j].isMine) countMines++
    }
  }
  return countMines
}

// Function to expand shown cells recursively
function expandShown(board, iPos, jPos) {
  if (board[iPos][jPos].isShown || board[iPos][jPos].isMarked) return
  board[iPos][jPos].isShown = true
  if (board[iPos][jPos].minesAroundCount > 0) return

  for (var i = iPos - 1; i <= iPos + 1; i++) {
    for (var j = jPos - 1; j <= jPos + 1; j++) {
      if (i >= 0 && i < board.length && j >= 0 && j < board.length && (i - iPos) * (j - jPos) === 0 && (i !== iPos || j !== jPos)) {
        if (board[i][j].minesAroundCount == false) expandShown(board, i, j)
        else if (board[i][j].minesAroundCount > 0) {
          board[i][j].isShown = true
        }
      }
    }
  }
}

// Function to place mines on the board
function setMinesOnBoard(board, iPos, jPos) {
  var cells = findEmptyCells(iPos, jPos)
  for (var i = 0; i < gLevel.MINES; i++) {
    const rndCell = getRandomIntInclusive(0, cells.length - 1)
    const minePos = cells[rndCell]
    board[minePos.i][minePos.j].isMine = true
    board[minePos.i][minePos.j].minesAroundCount = -1
    cells.splice(rndCell, 1)
  }
}

// Function to find empty cells for mine placement
function findEmptyCells(iPos, jPos) {
  var cells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (i > iPos + 1 || i < iPos - 1 || j > jPos + 1 || j < jPos - 1) cells.push({ i: i, j: j })
    }
  }
  return cells
}
