'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.

angular.module('myApp.services',[]);


angular.module('myApp.services')
  .value('version', '0.1')
  .service('httpCaller', ['$http', httpCaller]);

function httpCaller ($http) {
  var self = this;
  // post to authentication route
  self.auth = function(key){
    return $http({
      method: 'POST',
      url: '/auth',
      data: {key: key}
    });
  };
  //get
  self.getAllTasks = function(token, status) {
    if(status === 'true' || status === 'false'){
      return $http({
        method: 'GET',
        url: '/api/task?token='+token+'&status='+status
      });
    }
    return $http({
      method: 'GET',
      url: '/api/task?token='+token
    });
  };
  //delete
  self.deleteTasks = function(token, parameters) {
    var queryString = '';
    if(parameters.status && parameters.id){
      queryString = '/api/task?status='+parameters.status+'&_id='+parameters.id;
    }else if(parameters.status){
      queryString = '/api/task?status='+parameters.status;
    }else if(parameters.id){
      queryString = '/api/task?_id='+parameters.id;
    }
    queryString += '&token=' + token;

    if(queryString){
      return $http({
        method: 'DELETE',
        url: queryString

      })
    }else{
      return new Error('Delete Task Fail');
    }
  };

  //create
  self.createNewTask = function(token, data){
    if(data !== null && typeof data == 'object'){
      return $http.post('/api/task?token='+token, data);
    }else{
      return new Error('empty task content')
    }
  };

  //update
  self.updateTask = function(token, id, data){
    var queryUrl = "";
    if(id && typeof data === 'object' && typeof data !== 'null'){
      queryUrl = '/api/task?token='+token+'&id='+id;
      return $http.put(queryUrl, data);
    }
  }

}