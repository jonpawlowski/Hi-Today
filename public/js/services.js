'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

angular.module('myApp.services', [])
  .value('version', '0.1')
  .service('httpCaller', ['$http', httpCaller]);

function httpCaller ($http) {
  var self = this;
  //get
  self.getAllTasks = function(status) {
    if(status === 'true' || status === 'false'){
      return $http({
        method: 'GET',
        url: '/api/task?status='+status
      });
    }
    return $http({
      method: 'GET',
      url: '/api/task'
    });
  };
  //delete
  self.deleteTasks = function(parameters) {
    var queryString = '';
    if(parameters.status && parameters.id){
      queryString = '/api/task?status='+parameters.status+'&_id='+parameters.id;
    }else if(parameters.status){
      queryString = '/api/task?status='+parameters.status;
    }else if(parameters.id){
      queryString = '/api/task?_id='+parameters.id;
    }
    if(queryString){
      return $http({
        method: 'DELETE',
        url: queryString
      })
    }else{
      return new Error('Delete Task Fail');
    }
  }
}