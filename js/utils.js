'use strict'

// Generates a random integer between min (inclusive) and max (inclusive)
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Calculates the elapsed time between the start time and the current time in the format MM:SS
function calculateTimeElapsed(startTime) {
  var currentTime = new Date()

  var timeDiff = Math.abs(currentTime - startTime)

  var minutes = Math.floor(timeDiff / 60000)
  var seconds = Math.floor((timeDiff % 60000) / 1000)

  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

// Calculates the elapsed time in seconds between the start time and the current time
function calculateTimeElapsedInSeconds(startTime) {
  var currentTime = new Date()
  var timeDiff = Math.abs(currentTime - startTime)
  var seconds = Math.floor(timeDiff / 1000)
  return seconds
}
