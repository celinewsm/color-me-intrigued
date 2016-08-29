var level = 1;

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

    if (difficultyLevel[i]["lowestLvl"] >= level && difficultyLevel[i]["highestLvl"] <= level){

      var hue = Math.round(Math.random()*310);
      hueAdd = difficultyLevel[i]["hueAdd"];
      lightAdd = difficultyLevel[i]["lightAdd"];
      var light = 30;

      var randomPosArray = [];
      for (var k = 0; k < (level + 3); k++) {
        randomPosArray.push(k);
      }
      randomPosArray = shuffle(randomPosArray)

      // creating individual shades (color, pos, randomPos)
      var positionLog = [];
      for (var j = 0; j < (level + 3); j++) {
        // increasing lightness
        light = light + (lightAdd*[j]);
        // increasing hue;
        hue = hue + (hueADD*[j]);
        // creating color
        var color = "hsl( " + hue + " , " + 75 + "%" + " , " + light + "% )";
        colorHolder[j] = new shade(color,[j],randomPosArray[j]);
      }
    }
  }
}
