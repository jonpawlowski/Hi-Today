
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');
  sass = require('node-sass-middleware');
  mongoose = require('mongoose');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());

/**
 * connect db
 * todo: put this code to /config dir
 * **/
mongoose.connect('mongodb://localhost/tasks');

var db = mongoose.connection;
db.on('error', function(err){
  console.log("Error Found while connecting to database: " + err.message);
});
db.once('open', function(){
  console.log("Database Connect Successfully!");
//  todo setup schema here
});

/**
 * compile sass to csss dynamically
 * **/
app.use(sass({
  src : __dirname + '/public/sass',
  des : __dirname + '/public/css',
  debug : true,
  outputStyle : 'compressed'
}));

app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO1
}


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
