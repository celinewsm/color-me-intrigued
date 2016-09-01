var level = 1;
var numOfShades;
var colorHolder = [];
var timeNow = 120;




document.addEventListener("DOMContentLoaded", function() {

  // creating starting page
  function landingPage() {
    // create overlay
    createOverlay();
    // create random rainbow
    randomRainbow();
    checkWindow();
  }

  function randomRainbow(){
    $( "#sortable" ).empty();
    var rainbowHex = [ "#9400D3" , "#4B0082" , "#0000FF" , "#00FF00" , "#FFFF00" , "#FF7F00" , "#FF0000" ]
    rainbowHex = shuffle(rainbowHex);
    numOfShades = rainbowHex.length;
    for (var z = 0; z < rainbowHex.length; z++) {
      console.log("creating raindow divs")
      var temp = $("<div>");
      temp.addClass("row");
      temp.attr("id", "shade" + [z]);
      $("#sortable").append(temp);
      // attaching colour
      $("#shade"+[z]).css( "background-color", rainbowHex[z]);
    }

  // create welcome pop up
    var temp2 = $("<div>");
    var headlineInput = $("<h1>").text("Color Me Intrigued");
    var subHeadInput = $("<p>").text("Simply drag and drop the colour strips and arrange them from the darkest to lightest (or vice versa!).");
    var copyInput = $("<p>").text("You have " + timeNow + " seconds to hit the higest level possible!" );
    var button = $("<button>").attr("id", "reset").text("Ready?");
    temp2.attr("id", "popUp").append($("<div>").attr("id", "popUpText").append(headlineInput).append(subHeadInput).append(copyInput).append(button))
    $("#insertOverlays").append(temp2);
    // insert reset button for start game;
    $( "#reset" ).click(function() {
      console.log("Reset button clicked");
      reset();
    });
  }
  landingPage();

  function createOverlay(){
    var temp = $("<div>");
    temp.attr("id", "gameOver");
    $("#insertOverlays").append(temp);
  }

  // create object
  function shade(color, pos, randomPos) {
    this.color = color;
    this.pos = pos;
    this.randomPos = randomPos;
  }

  var difficultyLevel = [
    {  difficulty: "easy",
    lowestLvl: 1,
    highestLvl: 3,
    hueAdd: 0,
    lightAdd: (10 - level)
    },
    {  difficulty: "med",
    lowestLvl: 4,
    highestLvl: 10,
    hueAdd: 3,
    lightAdd: 1
    },
    {  difficulty: "hard",
    lowestLvl: 11,
    highestLvl: 70,
    hueAdd: 1,
    lightAdd: 1
    }
  ]

  function shuffle(array) {
      var i = array.length,
          j = 0,
          temp;
      while (i--) {
          j = Math.floor(Math.random() * (i+1));
          // swap randomly chosen element with current element
          temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }

  function createShades() {
    numOfShades = level + 3; // will start with 4 shades
    colorHolder = [];
    var randomPosArray;
    var hueAdd;
    var lightAdd;
    // find out difficulty level
    for (var i = 0; i < difficultyLevel.length; i++) {
      if (difficultyLevel[i]["lowestLvl"] <= level && difficultyLevel[i]["highestLvl"] >= level){
        console.log("difficulty level selected: " + difficultyLevel[i]["difficulty"])
        var hue = Math.round(Math.random()*310);
        hueAdd = difficultyLevel[i]["hueAdd"];
        console.log("hueAdd: " + hueAdd)
        lightAdd = difficultyLevel[i]["lightAdd"];
        console.log("lightAdd: " + lightAdd)
        var light = 30;
        var match = numOfShades;
        var matchToo = numOfShades;
        // shuffleShades()
        while (match === numOfShades || matchToo === numOfShades) {
          randomPosArray = [];
          match = 0;
          matchToo = 0;
          for (var i = 0; i < numOfShades; i++) {
            randomPosArray.push(i);
          }
          var checkPosRand = randomPosArray.slice(0);
          var checkPosRandToo = []
          for (var l = numOfShades - 1; l >= 0 ; l--) {
            checkPosRandToo.push(checkPosRand[l]);
          }
          randomPosArray = shuffle(randomPosArray)

          // checking if tiles are shuffled
          for  (var k = 0 ; k < numOfShades ; k++){
            if (checkPosRand[k] === randomPosArray[k]){
              match++;
            }
          }
          for  (var m = 0 ; m < numOfShades ; m++){
            if (checkPosRandToo[m] === randomPosArray[m]){
              matchToo++;
            }
          }
        }

        // creating individual shades (color, pos, randomPos)
        var positionLog = [];
        for (var j = 0; j < numOfShades; j++) {
          // increasing lightness
          light = light + (lightAdd);
          // increasing hue;
          hue = hue + (hueAdd);
          // creating color
          var color = "hsl( " + hue + " , " + 75 + "%" + " , " + light + "% )";
          colorHolder[j] = new shade(color,j,randomPosArray[j]);
        }
      }
    }
  }

  // input shades in dom
  // define row
  // var rowThickness = 100/numOfShades + "%"
  // if window width/height > 1 , height = "100%"", width = rowThickness
  // else , height = rowThickness, width = "100%"
  function newLevel() {
    var levelUp = document.getElementById("levelUp");
    levelUp.play();
    createShades();
    $("#level").text( "Level " + level );
    // sort colorHolder by randomPos
    var sortedColorHolder = colorHolder.slice(0);

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            ////////////////////////// find out what is the ???? for //////////////////////////
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
    var sortedColorHolder = sortByKey(sortedColorHolder, 'randomPos');
    console.log("sortColorHolder: " + sortedColorHolder)

    // inserting colors into the array in order of randomPos
    for (var i = 0; i < sortedColorHolder.length; i++) {
      var temp = $("<div>");
      // var classesToAdd = " "
      temp.addClass("row ui-state-default");
      temp.attr("id", "shade" + [i]);
      $("#sortable").append(temp);
      // attaching colour
      $("#shade"+[i]).css( "background-color", sortedColorHolder[i]["color"])
    }

    // defining styles for rows if both vertical or horizontal
    checkWindow();
  }
  // newLevel();

  function checkWindow(){
    var rowThickness = 100/numOfShades + "%";
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    if ((windowHeight/windowWidth) < 1){
      $(".row").css({"height" : "100%", "width" : rowThickness, "display": "inline-block"});
    }
    else {
      $(".row").css({"height": rowThickness, "width": "100%", "display": "block"})
    }
    $('#popUp').css('top', ( $(window).height() - $('#popUp').height() ) / 2 )
  }

  function gameOver(){
    intervalManager(false);
    createOverlay();
    var temp2 = $("<div>");
    var headlineInput = $("<h1>").text("Score");
    var subHeadInput = $("<p>").text("You've reached level " + level + "!");
    var button = $("<button>").attr("id", "reset").text("Try again");
    // generate feedback according to level
    if ( level <= 3 ) {
      var feedback = "Seriously? You either need to get your eyes checked or TRY HARDER!"
    }
    else if (level <= 7) {
      var feedback = "Not too bad. But you can do better."
    }
    else if (level <= 12) {
      var feedback = "You're really good at this. Think you can beat your own score?"
    }
    // easter egg for annabel
    else if (level === 14) {
      var feedback = "YOU MADE IT, ANNA! GOOD JOB! Now on to level 15! (if you're not anna, sorry. You're really awesome too. kthybye.)"
    }
    else {
      var feedback = "YOU HAVE X-RAY VISION AND LIFE ISN'T FAIR."
    }

    var copyInput = $("<p>").text(feedback);
    temp2.attr("id", "popUp").append($("<div>").attr("id", "popUpText").append(headlineInput).append(subHeadInput).append(copyInput).append(button))
    $("#insertOverlays").append(temp2);

    checkWindow();

    $( "#reset" ).click(function() {
      console.log("Reset button clicked");
      reset();
    });
  }


  function reset() {
    // remove pop up
    $( "#insertOverlays" ).empty();
    // remove shades
    $( "#sortable" ).empty();
      level = 1;
      console.log("reset level to: " + level + " (should be 1)")
      // reset level
      newLevel();
      // reset time + interval
      timeNow = 120;
      intervalManager(true, countDown, 1000);
  }

  var intervalID = null;
  function intervalManager(flag, triggerFunction, time) {
     if(flag)
       intervalID =  setInterval(triggerFunction, time);
     else
       clearInterval(intervalID);
  }

  // change timeNow at reset as well
  var jaws = document.getElementById("jaws");
  var jawsVol;

  var countDown = function(){
    if (timeNow <= 0) {
      $("#timer").text("Time Out!");
      gameOver();
    }
    else if (timeNow === 20) {
      clockTick();
      jaws.play();
      jawsVol = 0
      jaws.volume = jawsVol;
    }
    else if (timeNow < 20) {
      clockTick()
      jawsVol += 1/20;
      jaws.volume = jawsVol;
    }
    else {
      clockTick()
    }
  }


  function clockTick () {
    var tick_1s = document.getElementById("tick_1s");
    tick_1s.play();
    $("#timer").text( "Time left: " + timeNow);
    timeNow -= 1
  }

  // to make divs draggable
  $( function() {
     $( "#sortable" ).sortable({
      //  placeholder: "#sortable",
       update: function checkWin(event,ui){
         var forChecking = [];
         var forCheckingToo = [];
         var checkWin = [];
         var checkWinToo = [];
         // create an array to check win
         for (var l = 0; l < colorHolder.length; l++) {
           var valueToPush = colorHolder[l]["randomPos"];
           forChecking.push("shade" + valueToPush);
           console.log("forChecking array: " + forChecking)
         }

         for (var m = colorHolder.length - 1; m >= 0 ; m--) {
           var valueToPush = colorHolder[m]["randomPos"];
           forCheckingToo.push("shade" + valueToPush);
         }
         console.log("forCheckingToo array: " + forCheckingToo)

         for (var i = 0; i < forChecking.length; i++) {
           if ( $(".row")[i].id === forChecking[i] ){
             checkWin.push("x");
           }
         }

         for (var i = 0; i < forCheckingToo.length; i++) {
           if ( $(".row")[i].id === forCheckingToo[i] ){
             checkWinToo.push("y");
           }
         }
         if (checkWin.length === forChecking.length || checkWinToo.length === forCheckingToo.length ){
           // won
           console.log("Level won")
           $( "#sortable" ).empty();
           level = level + 1;
           newLevel();
         }
         else {
           console.log("player hasn't won")
         }
       }
     })

    //  $( "#sortable").disableSelection();
   } );

   $( window ).resize(function() {
    console.log("Window resized");
    checkWindow();
   });




});
