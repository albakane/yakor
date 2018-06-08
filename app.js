let createError = require('http-errors');
let express = require('express');
let path = require('path');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mqtt = require('mqtt');

let app = express();

let http = require('http').Server(app);
let io = require('socket.io')(http);

// connect mqtt broker
let client = mqtt.connect('mqtt://localhost:1883');

// test mqtt
client.on('connect', function() {
  console.log('MQTT Broker connected');
  client.subscribe('receive/yakor');
});

client.on('message', function(topic, messageFromNRF) {

  let message = messageFromNRF.toString('utf8').trim();
  console.log(message);

  let event = parseInt(message.substring(0, 1));
  let doorIdEncrypted = message.substring(1, 16);
  let tagIdEncrypted = message.substring(16);
  let doorId = 0, tagId = 0;

  let Mysql = require(path.join(__dirname, "class/mysql"));
  Mysql.getTagAndDoorFromIds({tagId : tagIdEncrypted, doorId : doorIdEncrypted}, function(results) {
    if (results.length === 0) {
      client.publish("send/yakor", "0");
      console.log('Données fausses : a configurer');
    } else {
      doorId = results[0].ID_DOOR;
      tagId = results[0].ID_TAG;
      if (event === 0) {
        Mysql.closeTheDoor(doorId, function(results) {
          io.emit('MQTTEvent', {state : 0, doorId : doorId});
        });
        client.publish("send/yakor", "0");
      } else {
        Mysql.checkRight({doorId : doorId, tagId : tagId}, function(results) {
          if (results.length === 0) {
            console.log('Aucun droit sur la porte : a configurer');
            client.publish("send/yakor", "0");
          } else {
            Mysql.createDoorOpen({doorId : doorId, tagId : tagId}, function(results) {
              if (results.error === false) {
                Mysql.openTheDoor(doorId, function(results) {
                  io.emit('MQTTEvent', {state : 1, doorId : doorId});
                });
              }
            });
            client.publish("send/yakor", "1");
          }
        });
      }
    }
  });

});

// socket.io configuration
io.on('connection', function(socket) {
  console.log('A user is connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session
app.use(session({
  secret : 'slkjgbazrgzerobgiezsf',
  resave : false,
  saveUninitialized : true,
  cookie : {
    secure : false
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'class')));

app.use('/', require('./routes/connection'));
app.use('/dashboard', require('./routes/dashboard'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

http.listen(2910, function() {
  console.log('Listen on port 2910');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
