var level = 1;
var numOfShades;
var colorHolder = [];
var timeNow = 120;

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

      var randomPosArray = [];
      for (var k = 0; k < numOfShades; k++) {
        randomPosArray.push(k);
      }
      randomPosArray = shuffle(randomPosArray)

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
  else {
    var feedback = "YOU HAVE X-RAY VISION AND LIFE ISN'T FAIR."
  }

  var copyInput = $("<p>").text(feedback);
  temp2.attr("id", "popUp").append($("<div>").attr("id", "popUpText").append(headlineInput).append(subHeadInput).append(copyInput).append(button))
  $("#insertOverlays").append(temp2);

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
var countDown = function(){
  if (timeNow <= 0) {
    $("#timer").text("Time Out!");
    gameOver();
  }
  else {
    timeNow -= 1
    $("#timer").text( "Time left: " + timeNow);
  }
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
