'use strict'

var gBoard = []
var gLevel
var gGame

function startGame(i, j) {
  setEmptyCell(i, j)
  setMinesOnBoard(gBoard, i, j)
  setMinesNegsCount(gBoard)
  setEmptyCell(i, j)

  renderBoard(gBoard)
}

function setEmptyCell(i, j) {
  gBoard[i][j].minesAroundCount = 0
}

function setLevel(sizeBoard, countMines) {
  gBoard = []
  gLevel = { SIZE: sizeBoard, MINES: countMines }
  buildBoard()
  renderStartBoard()
}
function buildBoard() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    gBoard.push([])
    for (var j = 0; j < gLevel.SIZE; j++) {
      gBoard[i].push({ minesAroundCount: 0, isShown: false, isMine: false, isMarked: false })
    }
  }
}
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

function setMinesNegsCount(board) {
  var cells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!board[i][j].isMine) board[i][j].minesAroundCount = isNegsMines(i, j)
    }
  }
}

function isNegsMines(iPos, jPos) {
  console.log(gBoard.length)
  for (var i = iPos - 1; i <= iPos + 1; i++) {
    for (var j = jPos - 1; j <= jPos + 1; j++) {
      if (i === -1 || i === gBoard.length || j === -1 || j === gBoard.length) {
      } else if (gBoard[i][j].isMine && (i - iPos) * (j - jPos) === 0) {
        return 1
      } else if (gBoard[i][j].isMine && (i - iPos) * (j - jPos) === 1) {
        return 2
      } else if (gBoard[i][j].minesAroundCount === 2) {
        return 3
      }
    }
  }
  return false
}

function onClicked(elCell, i, j) {}
function onCellMarked(elCell) {}
function checkGameOver() {}

function expandShown(board, elCell, i, j) {}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gLevel.SIZE; j++) {
      var symbol
      if (board[i][j].isMine) symbol = '💣'
      else if (board[i][j].minesAroundCount === 1) symbol = '1'
      else if (board[i][j].minesAroundCount === 2) symbol = '2'
      else if (board[i][j].minesAroundCount === 3) symbol = '3'
      else symbol = ' '

      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className}">${symbol}</td>`
    }
    strHTML += '</tr>'
  }
  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}
function renderCell(location, htmlCode) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = htmlCode
}
function setMinesOnBoard(board, iPos, jPos) {
  for (var i = 0; i < gLevel.MINES; i++) {
    const minePos = getEmptyCell(iPos, jPos)
    board[minePos.i][minePos.j].isMine = true
    board[minePos.i][minePos.j].minesAroundCount = -1
  }
}
function getEmptyCell(iPos, jPos) {
  var cells = findEmptyCells(iPos, jPos)
  if (cells.length === 0) return
  var randCell = getRandomIntInclusive(0, cells.length - 1)
  return cells[randCell]
}

function findEmptyCells(iPos, jPos) {
  var cells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (i > iPos + 1 || i < iPos - 1 || j > jPos + 1 || j < jPos - 1) cells.push({ i: i, j: j })
    }
  }
  return cells
}
