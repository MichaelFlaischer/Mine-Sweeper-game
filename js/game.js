'use strict'

var gBoard = []
var gLevel
var gGame

function startGame(i, j) {
  setEmptyCell(i, j)
  setMinesOnBoard(gBoard)
  renderBoard()
}

function setEmptyCell(i, j) {
  gBoard[i][j].minesAroundCount = 0
}

function setLevel(sizeBoard, countMines) {
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
      strHTML += `<td class="${className}" onclick="startGame(${(i, j)})"></td>`
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
      if (!board[i][j].isMine && isNegsMines(i, j)) board[i][j].minesAroundCount = 1
    }
  }
}

function isNegsMines(iPos, jPos) {
  if (iPos === 0) iPos++
  if (jPos === 0) jPos++
  if (iPos === gBoard.length - 1) iPos--
  if (jPos === gBoard.length - 1) jPos--

  for (var i = iPos - 1; i <= iPos + 1; i++) {
    for (var j = jPos - 1; j <= jPos + 1; j++) if (gBoardoard[i][j].isMine) return true
  }
  return false
}

function onClicked(elCell, i, j) {}
function onCellMarked(elCell) {}
function checkGameOver() {}

function expandShown(board, elCell, i, j) {}

function renderBoard(board = null) {
  var strHTML = ''
  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gLevel.SIZE; j++) {
      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className}">${i * j + j}</td>`
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
function setMinesOnBoard(board) {
  for (var i = 0; i < gLevel.MINES; i++) {
    const minePos = getEmptyCell()
    board[minePos.i][minePos.j].isMine = true
    board[minePos.i][minePos.j].minesAroundCount = -1
  }
}

function findEmptyCells(iPos, jPos) {
  var cells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if ((i >= iPos - 1 && i <= iPos + 1) || (j >= jPos - 1 && j <= jPos + 1)) cells.push({ i: i, j: j })
    }
  }
  return cells
}

function getEmptyCell() {
  var cells = findEmptyCells()
  if (cells.length === 0) return
  var randCell = getRandomIntInclusive(0, cells.length)
  return cells[randCell]
}
