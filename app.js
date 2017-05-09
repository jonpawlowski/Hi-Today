
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  morgan = require('morgan'),
  chalk = require('chalk'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  sass = require('node-sass-middleware'),
  mongoose = require('mongoose'),
  task = require('./database/task_schema');
  var _ = require('lodash');

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
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/TodoList');

var db = mongoose.connection;

db.on('error', function(err){
  console.log(chalk.red("Error Found while connecting to database: " + err.message));
});

db.once('open', function(){

  console.log(chalk.cyan("Database Connect Successfully!"));

  /**
   * Initialize the test instance
   * **/

  var testTask = new task({
    name: 'testTask',
    status: false,
    description: "Test db connection and schema initializing"
  });

  /**
   * Only save one time
   * **/

  task.find({name: testTask.name}, function(err, data){
    if(err){
      console.log(chalk.red(err));
    }else if(data.length <= 0){
      testTask.save(function(err){
        if(err){
          console.log(chalk.red("Error Found during save test data: "+err.message));
        }else{
          console.log(chalk.cyan('DB Test Pass'));
        }
      })
    }else{
      console.log(chalk.cyan("Test data existing already"));
    }
  });
});

/**
 * Store DB instance in the request object
 * **/

app.use(function(req, res, next){
  if(task){
    req.task_db = task;
    next();
  }else{
    next();
  }
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

//CRUD API for todo-list
app.use('/api/task', api.task);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log(chalk.yellow('Express server listening on port ' + app.get('port')));
});
