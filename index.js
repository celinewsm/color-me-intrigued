var express = require('express')
var bodyParser = require('body-parser')
var db = require('./models')
var app = express()

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname + '/static/'))


app.get('/', function (req, res) {
  res.render('index.html')
})

app.get('/highscores', function(req, res, next) {
  db.leaderboard.findAll({
    limit: 10,
    order: 'level DESC'
  }).then(function(highscores) {
    res.json(highscores)
  });
});


app.post('/highscore/new', function(req, res) {
  db.leaderboard.findOrCreate({
  where: {
    name: req.body.name
  },
  defaults: { level: req.body.level }
}).spread(function(score, created) {
    if(created){
      res.redirect('/highscores')
      // update highscore if new highscore > old highscore
    } else if (score.level < req.body.level) {
      db.leaderboard.update({
        level: req.body.level
      }, {
        where: {
          name: req.body.name
        }
      }).then(function(score) {
        res.redirect('/highscores')
      });
    } else {
      res.redirect('/highscores')
    }
  });
});
