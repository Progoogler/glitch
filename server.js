// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var timestamp = require('unix-timestamp');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

app.get('*', function (request, response) {
  var res = {};
  var dateString = '';
  var year = '';
  var month = '';
  var day = '';
  var route = request.originalUrl.slice(1);
  if (!isNaN(parseInt(route))) {
    res.unix = parseInt(route);
    var date = timestamp.toDate(res.unix) + '';
    for (let i = 0; i < 15; i++) {
      if (i >= 11) year += date[i];
      if (i === 4 || i === 5 || i === 6) {
        month += date[i];
      }
      if (i === 8 || i === 9) {
        if (i === 8 && date[i] === '0') {
          continue;
        } else {
          day += date[i];
        }
      }
    }
    dateString = getMonth(month) + ' ' + day + ', ' + year;
    res.natural = dateString;
  } else if (findMonth(route)) {
    month = findMonth(route);
    for (let i = 0; i < route.length; i++) {
      if (!isNaN(route[i])) {
        if (!isNaN(route[i+2]) && !isNaN(route[i+1])) {
          year += route[i] + route[i+1] + route[i+2] + route[i+3];
          i += 3;
          continue;
        } else {
          if (route[i] === '0') {
            day += route[i+1];
            i += 1;
            continue;
          } else {
            if (!isNaN(route[i+1])) {
              day += route[i] + route[i+1];
              i += 1;
              continue;
            } else {
              day += route[i];
              i += 1;
            }
          }
        }
      }
    }
    dateString = month + ' ' + day + ', ' + year;
    var unix = timestamp.fromDate(dateString);
    res.unix = unix;
    res.natural = dateString;
  } else {
    res.unix = null;
    res.natural = null;
  }
  response.send(res);
});

// could also use the POST instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

var getMonth = function(string) {
  switch (string) {
    case 'Jan':
      return 'January';
    case 'Feb':
      return 'February';
    case 'Mar':
      return 'March';
    case 'Apr':
      return 'April';
    case 'May':
      return 'May';
    case 'Jun':
      return 'June';
    case 'Jul':
      return 'July';
    case 'Aug':
      return 'August';
    case 'Sep':
      return 'September';
    case 'Oct':
      return 'October';
    case 'Nov':
      return 'November';
    case 'Dec':
      return 'December';
    default:
      return;
  }
}

var findMonth = function(string) {
  var jan = /january/i;
  var feb = /february/i;
  var mar = /march/i;
  var apr = /apr/i;
  var may = /may/i;
  var jun = /june/i;
  var jul = /july/i;
  var aug = /august/i;
  var sep = /september/i;
  var oct = /october/i;
  var nov = /november/i;
  var dec = /december/i;
  if (jan.test(string)) return 'January';
  if (feb.test(string)) return 'February';
  if (mar.test(string)) return 'March';
  if (apr.test(string)) return 'April';
  if (may.test(string)) return 'May';
  if (jun.test(string)) return 'June';
  if (jul.test(string)) return 'July';
  if (aug.test(string)) return 'August';
  if (sep.test(string)) return 'September';
  if (oct.test(string)) return 'October';
  if (nov.test(string)) return 'November';
  if (dec.test(string)) return 'December';
  return false;
}


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
