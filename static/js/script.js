/* global $ */
// move global variables into DOMContentLoaded in final version
var level = 1
var numOfShades
var colorHolder = []
var timeNow = 120
document.addEventListener('DOMContentLoaded', function () {
  // creating landing page
  function landingPage () {
    createOverlay()
    randomRainbow()
    checkWindow()
  }
  landingPage()

  // creates landing page rainbow div
  function randomRainbow () {
    var rainbowHex = ['#9400D3', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FF7F00', '#FF0000']
    rainbowHex = shuffle(rainbowHex)
    numOfShades = rainbowHex.length
    for (var z = 0; z < rainbowHex.length; z++) {
      var temp = $('<div>')
      temp.addClass('row')
      temp.attr('id', 'shade' + [z])
      $('#sortable').append(temp)
      // attaching colour
      $('#shade' + [z]).css('background-color', rainbowHex[z])
    }

    // create welcome pop up
    var temp2 = $('<div>')
    var headlineInput = $('<h1>').text('Color Me Intrigued')
    var subHeadInput = $('<p>').text('Drag and rearrange the color strips from the darkest to lightest (or vice versa) to level up.')
    var copyInput = $('<p>').text('You have ' + timeNow + ' seconds to hit the higest level possible!')
    var button = $('<button>').attr('id', 'reset').text('Ready?')
    temp2.attr('id', 'popUp').append($('<div>').attr('id', 'popUpText').append(headlineInput).append(subHeadInput).append(copyInput).append(button))
    $('#insertOverlays').append(temp2)
    // insert reset button for start game
    $('#reset').click(function () {
      reset()
    })
  }

  function createOverlay () {
    var temp = $('<div>')
    temp.attr('id', 'gameOver')
    $('#insertOverlays').append(temp)
  }

  function checkWindow () {
    var rowThickness = 100 / numOfShades + '%'
    var windowHeight = $(window).height()
    var windowWidth = $(window).width()
    if ((windowHeight / windowWidth) < 1) {
      $('.row').css({'height': '100%', 'width': rowThickness, 'display': 'inline-block'})
    } else {
      $('.row').css({'height': rowThickness, 'width': '100%', 'display': 'block'})
    }
    $('#popUp').css('top', ($(window).height() - $('#popUp').height()) / 2)
    $('#timer').css('left', ($(window).width() - $('#timer').width()) / 2)
    $('#level').css('left', ($(window).width() - $('#level').width()) / 2)
  }

  function reset () {
    // remove pop up
    $('#insertOverlays').empty()
    // remove shades
    $('#sortable').empty()
    // set back to level 1
    level = 1
    // create and draw shades
    newLevel()
    // reset time + interval
    timeNow = 120
    intervalManager(true, countDown, 1000)
  }

  var intervalID
  function intervalManager (flag, triggerFunction, time) {
    if (flag) {
      intervalID = setInterval(triggerFunction, time)
    } else {
      clearInterval(intervalID)
    }
  }

  // to shuffle order
  function shuffle (array) {
    var i = array.length
    var j = 0
    var temp
    while (i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }

  // create object
  function Shade (color, pos, randomPos) {
    this.color = color
    this.pos = pos
    this.randomPos = randomPos
  }

  var difficultyLevel = [
    { difficulty: 'easy',
      lowestLvl: 1,
      highestLvl: 3,
      hueAdd: 0,
      lightAdd: (10 - level)
    },
    { difficulty: 'med',
      lowestLvl: 4,
      highestLvl: 10,
      hueAdd: 3,
      lightAdd: 1
    },
    { difficulty: 'hard',
      lowestLvl: 11,
      highestLvl: 70,
      hueAdd: 1,
      lightAdd: 1
    }
  ]

  function createShades () {
    numOfShades = level + 3 // will start with 4 shades
    colorHolder = []
    var randomPosArray
    var hueAdd
    var lightAdd
    for (var i = 0; i < difficultyLevel.length; i++) {
      // find out difficulty level
      if (difficultyLevel[i]['lowestLvl'] <= level && difficultyLevel[i]['highestLvl'] >= level) {
        var hue = Math.round(Math.random() * 210) // 310 for higher difficulty (higher chance of blue)
        hueAdd = difficultyLevel[i]['hueAdd']
        lightAdd = difficultyLevel[i]['lightAdd']
        var light = 30
        var match = numOfShades
        var matchToo = numOfShades
        while (match === numOfShades || matchToo === numOfShades) {
          randomPosArray = []
          match = 0
          matchToo = 0
          for (var n = 0; n < numOfShades; n++) {
            randomPosArray.push(n)
          }
          var checkPosRand = randomPosArray.slice(0)
          var checkPosRandToo = checkPosRand.slice(0)
          checkPosRandToo.reverse()

          randomPosArray = shuffle(randomPosArray)

          // checking if tiles are shuffled properly both ways
          for (var k = 0; k < numOfShades; k++) {
            if (checkPosRand[k] === randomPosArray[k]) {
              match++
            }
          }
          for (var m = 0; m < numOfShades; m++) {
            if (checkPosRandToo[m] === randomPosArray[m]) {
              matchToo++
            }
          }
        }
        // creating and storing individual shades as objects (color, pos, randomPos)
        for (var j = 0; j < numOfShades; j++) {
          // increasing lightness
          light = light + (lightAdd)
          // increasing hue
          hue = hue + (hueAdd)
          // creating color
          var color = 'hsl( ' + hue + ' , ' + 75 + '%' + ' , ' + light + '% )'
          colorHolder[j] = new Shade(color, j, randomPosArray[j])
        }
      }
    }
  }

  // input shades in dom -> define rowthickness
  function newLevel () {
    var levelUp = document.getElementById('levelUp')
    levelUp.play()
    createShades()
    $('#level').text('Level ' + level)
    // duplicate colorHolder array before sorting new array by randomPos
    var sortedColorHolder = colorHolder.slice(0)

    function sortByKey (array, key) {
      return array.sort(function (a, b) {
        var x = a[key]
        var y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
    }

    // sort sortedColorHolder array by randomPos
    sortedColorHolder = sortByKey(sortedColorHolder, 'randomPos')

    // inserting colors into the array in order of randomPos
    for (var i = 0; i < sortedColorHolder.length; i++) {
      var temp = $('<div>')
      temp.addClass('row ui-state-default')
      temp.attr('id', 'shade' + [i])
      $('#sortable').append(temp)
      // attaching colour
      $('#shade' + [i]).css('background-color', sortedColorHolder[i]['color'])
    }
    // defining styles for rows if both vertical or horizontal
    checkWindow()
  }

  function gameOver () {
    intervalManager(false)
    createOverlay()
    var currentHighscores
    $.ajax({
    url: window.location.href+'highscores',
    type: 'GET',
    dataType: 'json'
    }).done(function (highscores) {
      currentHighscores = highscores
      if (level > highscores[highscores.length-1].level){

        $('#insertOverlays').append("<div id='popUp'><div id='popUpText'><h1>New Highscore</h1><p>You've reached level " + level + " and made it into the wall of fame!</p><input id='nameForHighscore' class='inputField' type='text' placeholder='Enter Your Name'></input><br/><button id='submitHighscore' class='genericButton'>Submit</button><br/><button id='reset'>Try again</button></div></div>")
       checkWindow()

       $('#submitHighscore').click(function () {
         $.ajax({
         url: window.location.href+'highscore/new',
         type: 'POST',
         dataType: 'json',
         data: {name: $('#nameForHighscore').val(),
                level: level}
         }).done(function (highscores) {
           drawHighscoreTable(highscores)

         })
       })

       $('#reset').click(function () {
         reset()
       })


      } else {

          var temp2 = $('<div>')
          var headlineInput = $('<h1>').text('Score')
          var subHeadInput = $('<p>').text("You've reached level " + level + '!')
          var button = $('<button>').attr('id', 'reset').text('Try again')
          var buttonHighscore = $('<button>').attr('id', 'viewHighscore').attr('class', 'genericButton').text('View Highscore')
          var feedback
           // generate feedback according to level
           if (level <= 3) {
             feedback = 'Seriously?! You either need to get your eyes checked or TRY HARDER!'
           } else if (level <= 7) {
             feedback = 'Not too bad. But you can do better.'
           } else if (level <= 12) {
             feedback = "You're really good at this. Think you can beat your score?"
           } else if (level === 15) {
             // easter egg for annabel
             feedback = 'Anna and/or Denise you have made it so far... PRESS ON. LEVEL 16 IS WITHIN REACH.'
           } else if (level === 16) {
             // easter egg for annabel
             feedback = "WHAT?! YOU MADE IT TO LEVEL 16?! Are you sure you aren't cheating? Cause this is OUT OF THIS WORLD! Now... on to level 17!!!"
           } else {
             feedback = "YOU HAVE X-RAY VISION AND LIFE ISN'T FAIR."
           }
           var copyInput = $('<p>').text(feedback)
           // inserting declared variables into popup
           temp2.attr('id', 'popUp').append($('<div>').attr('id', 'popUpText').append(headlineInput).append(subHeadInput).append(copyInput).append(button).append(buttonHighscore))
           // inserting popup into DOM
           $('#insertOverlays').append(temp2)
           checkWindow()
           $('#reset').click(function () {
             reset()
           })
           $('#viewHighscore').click(function () {
             drawHighscoreTable(currentHighscores)
           })

          }
          }).fail(function () {
            console.log("ajax failed")

             var temp2 = $('<div>')
             var headlineInput = $('<h1>').text('Score')
             var subHeadInput = $('<p>').text("You've reached level " + level + '!')
             var button = $('<button>').attr('id', 'reset').text('Try again')
             var feedback
             // generate feedback according to level
             if (level <= 3) {
               feedback = 'Seriously?! You either need to get your eyes checked or TRY HARDER!'
             } else if (level <= 7) {
               feedback = 'Not too bad. But you can do better.'
             } else if (level <= 12) {
               feedback = "You're really good at this. Think you can beat your score?"
             } else if (level === 15) {
               // easter egg for annabel
               feedback = 'Anna and/or Denise you have made it so far... PRESS ON. LEVEL 16 IS WITHIN REACH.'
             } else if (level === 16) {
               // easter egg for annabel
               feedback = "WHAT?! YOU MADE IT TO LEVEL 16?! Are you sure you aren't cheating? Cause this is OUT OF THIS WORLD! Now... on to level 17!!!"
             } else {
               feedback = "YOU HAVE X-RAY VISION AND LIFE ISN'T FAIR."
             }
             var copyInput = $('<p>').text(feedback)
             // inserting declared variables into popup
             temp2.attr('id', 'popUp').append($('<div>').attr('id', 'popUpText').append(headlineInput).append(subHeadInput).append(copyInput).append(button))
             // inserting popup into DOM
             $('#insertOverlays').append(temp2)
             checkWindow()
             $('#reset').click(function () {
               console.log('Reset button clicked')
               reset()
             })

          })

        }

  // change timeNow at reset as well
  var jaws = document.getElementById('jaws')
  var jawsVol
  var countDown = function () {
    if (timeNow <= 0) {
      $('#timer').text('Time Out!')
      gameOver()
    } else if (timeNow === 20) {
      clockTick()
      jaws.play()
      jawsVol = 0
      jaws.volume = jawsVol
    } else if (timeNow < 20) {
      clockTick()
      jawsVol += 1 / 20
      jaws.volume = jawsVol
    } else {
      clockTick()
    }
    checkWindow()
  }

  function clockTick () {
    var tick_1s = document.getElementById('tick_1s')
    tick_1s.play()
    $('#timer').text('Time left: ' + timeNow)
    timeNow -= 1
  }


  function drawHighscoreTable(highscores){

    var start = "<div id='popUp'><div id='popUpText'><h1>Highscore</h1><div class='highscoreContainer'>"
    var end = "<button id='reset'>New game</button></div></div>"
    var inbetween = ""
    for (var i = 0 ; i < highscores.length ; i++){
      inbetween = inbetween + "<div class='indexCol'>"+(i+1)+"</div><div class='nameCol'>"+highscores[i].name+"</div><div class='levelCol'>Lv."+highscores[i].level+"</div>"
    }
    $('#insertOverlays').empty()
    createOverlay()
    $('#insertOverlays').append(start + inbetween + end)
    checkWindow()
    $('#reset').click(function () {
      reset()
    })


  }




  // to make divs draggable
  $(function () {
    $('#sortable').sortable({
      update: function checkWin (event, ui) {
        var forChecking = []
        var forCheckingToo = []
        var checkWin = []
        var checkWinToo = []
        var valueToPush
        // create an array to check win
        for (var l = 0; l < colorHolder.length; l++) {
          valueToPush = colorHolder[l]['randomPos']
          forChecking.push('shade' + valueToPush)
        }
        forCheckingToo = forChecking.slice(0)
        forChecking.reverse()

        for (var i = 0; i < forChecking.length; i++) {
          if ($('.row')[i].id === forChecking[i]) {
            checkWin.push('x')
          }
        }

        for (var j = 0; j < forCheckingToo.length; j++) {
          if ($('.row')[j].id === forCheckingToo[j]) {
            checkWinToo.push('y')
          }
        }
        if (checkWin.length === forChecking.length || checkWinToo.length === forCheckingToo.length) {
          // won
          console.log('Level won')
          $('#sortable').empty()
          level = level + 1
          newLevel()
        } else {
          console.log("player hasn't won")
        }
      }
    })
  })

  $(window).resize(function () {
    checkWindow()
  })
})
