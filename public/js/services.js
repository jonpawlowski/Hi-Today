'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

angular.module('myApp.services', [])
  .value('version', '0.1')
  .service('httpCaller', ['$http', httpCaller]);

function httpCaller ($http) {
  var self = this;
  self.getAllTasks = function() {
      return $http({
          method: 'GET',
          url: '/api/task'
        });
    }
  }