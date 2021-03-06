/*
 * Serve JSON to our AngularJS client
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var _ = require('lodash');

/**
 * API define here
 * **/
router.use(function(req, res, next){
  if(req.body.token || req.query.token){
    var token = req.body.token || req.query.token;
    jwt.verify(token, req.app.get('secret'), function(err, decoded){
      if(err){
        res.status(403).send('Forbidden! Token is incorrect');
      }
      next();
    });
  }else{
    res.status(403).send('Forbidden! Token missing');
  }
});

router.use(function(req, res, next){
  if(req.task_db){
    next();
  }else{
    next(new Error('No Database Instance'));
  }
});

/**
 * Some general functions for query db
 * **/

function getAll (req, res) {
  req.task_db.find({}, function(err, data){
    if(err) next(new Error(err));
    data = data.reverse();
    res.json(data);
  });
}

/**
 * Preprocess the params from route
 * **/

router.param('status', function(req, res, next, status){
  req.taskStatus = status;
  next();
});

router.param('id', function(req, res, next, id){
  req.taskId = id;
  next();
});

/**
 * url: /api/task
 * method: get
 * behaviour: Display all tasks or filter by status
 * **/

router.get('/', function(req, res, next){
  if(_.isEmpty(req.query)){
    getAll(req, res);
  }else{
    if(req.query.status == 'false' || req.query.status == 'true' ){
      req.task_db.find(req.query, function(err, data){
        if(err) next(new Error(err));
        res.json(data);
      })
    }else{
      getAll(req, res);
    }
  }
});

/**
 * url: /api/task/create
 * method: create
 * behaviour: create a new task, the name can not be duplicate,
 * then fetch all the tasks
 * **/

router.post('/', function(req, res, next){
  if(!_.isEmpty(req.body)){
  //  todo check post data, should have a test function to check req.body data
  //  todo before instance new document
    req.task_db.find({name: req.body.name}, function (err, data) {
      if(!data.length){
        var temp = req.task_db(req.body);
        temp.save(function (err) {
          if(err) next(new Error(err));
          getAll(req, res);
        });
      }else{
        next(new Error("Can not create same task again"));
      }
    });
  }else{
    next(new Error("Create Fail, body is empty"));
  }
});

/**
 * url: /api/task
 * method: delate
 * behaviour: Delete one task by Id or delete all tasks by status
 * if query object is empty, fetch all tasks;
 * **/

router.delete('/', function(req, res, next){
  if(!_.isEmpty(req.query)){
    // delete token before pass it to db query
    delete req.query.token;
    req.task_db.find(req.query, function(err, data){
      if(err) next(new Error(err));
      if(data.length){
        req.task_db.deleteMany(req.query).then(function () {
          getAll(req, res);
        });
      }else{
        next(new Error('Can not find match task to delete'));
      }
    })
  }else{
    getAll(req, res);
  }
});

/**
 * url: /api/task
 * method: update
 * behaviour: update one task
 * if query object is empty, fetch all tasks;
 * **/

router.put('/', function(req, res, next){
  if(!_.isEmpty(req.body) && !_.isEmpty(req.query.id)){
    req.task_db.findByIdAndUpdate(req.query.id, req.body, function(err){
      if(err) next(new Error(err));
      getAll(req, res);
    })
  }else{
    next(new Error('Can not find target to update'));
  }
});

exports.task = router;