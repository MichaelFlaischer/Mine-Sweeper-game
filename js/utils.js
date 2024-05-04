'use strict'

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function calculateTimeElapsed(startTime) {
  var currentTime = new Date()

  var timeDiff = Math.abs(currentTime - startTime)

  var minutes = Math.floor(timeDiff / 60000)
  var seconds = Math.floor((timeDiff % 60000) / 1000)

  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
