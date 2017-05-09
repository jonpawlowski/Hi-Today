/*
 * Serve JSON to our AngularJS client
 */
var express = require('express');
var router = express.Router();

exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};

/**
 * API define here
 * **/
router.use(function(req, res, next){
  if(req.task_db){
    next();
  }else{
    next(new Error('No Database Instance'));
  }
})

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
 * behaviour: Display all tasks
 * **/

router.get('/', function(req, res, next){
  req.task_db.find({}, function(err, data){
    if(err) res.send(err);
    res.json(data);
  })
});

/**
 * url: /api/task/create
 * method: create
 * behaviour: create a new task
 * **/

router.post('/create', function(req, res, next){
  if(req.body){
  //  todo check post data
    var temp = req.task_db(req.body);
    if(req.task_db.find({name: temp.name}, function (err, data) {
      if(!data.length){
        temp.save(function (err) {
          if(err) res.send(err);
          req.task_db.find({}, function(err, data){
            if(err) res.send(err);
            res.send(data);
          })
        })
      }else{
        req.task_db.find({}, function(err, data){
          if(err) res.send(err);
          res.send(data);
        })
      }
    }));
  }else{
    next();
  }
})

/**
 * url: /api/task/:status
 * method: get
 * behaviour: Find or delete all tasks by status
 * **/

router.get('/status/:status', function(req, res, next){
  if(req.taskStatus){
    taskStatus = req.taskStatus;
    req.task_db.find({status: taskStatus}, function(err, data){
      if(err) res.send(err);
      res.json(data);
    })
  }else{
    next();
  }
});

router.delete('/status/:status', function(req, res, next){
  if(req.taskStatus){
    taskStatus = req.taskStatus;
    req.task_db.find({status: taskStatus}, function(err, data){
      if(err) res.send(err);
      if(data){
        req.task_db.deleteMany({status: taskStatus}).then(function(){
          req.task_db.find({}).then(function(err, data){
            if(err) res.send(err);
            res.json(data);
          })
        })
      }
    })
  }else{
    next();
  }
});

exports.task = router;