var level = 5;
var numOfShades = level + 3;
///////////////////// creating shades /////////////////////
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
  var hueAdd;
  var lightAdd;
  // find out difficulty level
  for (var i = 0; i < difficultyLevel.length; i++) {
    if (difficultyLevel[i]["lowestLvl"] <= level && difficultyLevel[i]["highestLvl"] >= level){
      console.log("difficult level selected: " + difficultyLevel[i]["difficulty"])
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

// creating shades in dom

// define row

// var rowThickness = 100/numOfShades + "%"
// if window width/height > 1 , height = "100%"", width = rowThickness
// else , height = rowThickness, width = "100%"
function newLevel() {
  createShades();
  // sort colorHolder by randomPos
  function sortByKey(array, key) {
      return array.sort(function(a, b) {
          var x = a[key]; var y = b[key];
          ////////////////////////// find out what is the ???? for //////////////////////////
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
  }
  var sortedColorHolder = sortByKey(colorHolder, 'randomPos');
  console.log("sortColorHolder: " + sortedColorHolder)

  // inserting colors into the array in order of randomPos
  for (var i = 0; i < sortedColorHolder.length; i++) {
    var temp = $("<div>");
    temp.addClass("row ui-state-default");
    temp.attr("id", "shade" + [i]);
    $("#sortable").append(temp);
    // attaching colour
    $("#shade"+[i]).css( "background-color", sortedColorHolder[i]["color"])
  }

  // defining styles for rows if both vertical or horizontal
  var rowThickness = 100/numOfShades + "%";
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();
  if ((windowHeight/windowWidth) < 1){
    $(".row").css({"height" : "100%", "width" : rowThickness});
  }
  else {
    $(".row").css({"height": rowThickness, "width": "100%", "display": "block"})
  }



}

$( function() {
   $( "#sortable" ).sortable();
   $( "#sortable").disableSelection();
 } );

newLevel();
