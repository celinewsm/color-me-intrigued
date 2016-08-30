var level = 1;
///////////////////// creating shades /////////////////////
var numOfShades;
var colorHolder = [];
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
newLevel();

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


// function checkWin(){
//   var forChecking = [];
//   var checkWin = [];
//   // create an array to check win
//   for (var l = 0; l < colorHolder.length; l++) {
//     var valueToPush = colorHolder[l]["randomPos"];
//     forChecking.push("shade" + valueToPush);
//   }
//   console.log("forChecking array: " + forChecking)
//
//   for (var i = 0; i < forChecking.length; i++) {
//     if ( $(".row")[i].id === forChecking[i] ){
//       checkWin.push("x");
//     }
//   }
//
//   if (checkWin.length === forChecking.length){
//     // won
//     console.log("Level won")
//   }
//   else {
//     console.log("player hasn't won")
//   }
// }

function gameOver(){
  intervalManager(false);
  var temp = $("<div>");
  // var classesToAdd = " "
  temp.attr("id", "gameOver");
  $("#insertOverlays").append(temp);

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
    timeNow = 10;
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
var timeNow = 10;
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

intervalManager(true, countDown, 1000);


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
        //  var forChecking = [];
        //  var forCheckingToo = [];
        //  var checkWin = [];
        //  var checkWinToo = [];
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
