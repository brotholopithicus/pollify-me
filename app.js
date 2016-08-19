var express = require('express');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// mongodb connection
mongoose.connect("mongodb://107.180.101.201:27017/polls");
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking logins
app.use(session({
    secret: 'james loves you',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Handle Errors gracefully
app.use(function(err, req, res, next) {
    if (!err) return next();
    console.log(err.stack);
    res.json({
        error: true
    });
});

// Main App Page
app.get('/', routes.index);
app.get('/home', routes.home);
// MongoDB API Routes
app.get('/polls/polls', routes.list);
app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);
app.post('/vote', routes.vote);

io.sockets.on('connection', routes.vote);

server.listen(8080, function() {
    console.log('server listening at port 8080');
});
