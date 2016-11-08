var express = require('express')
var bodyParser = require('body-parser')
// var db = require('./models')
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
