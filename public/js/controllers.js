'use strict';

/* Controllers */

angular.module('myApp.controllers', ['myApp.services'])

  .controller('AppCtrl', function ($scope, $http, $location) {

	$http({
	  method: 'GET',
	  url: '/api/name'
	})
	.then(function (data, status, headers, config) {
	  $scope.name = data.data.name;
	},function (data, status, headers, config) {
	  $scope.name = 'Error!';
	});

  })

  .controller('taskHomeController', function (httpCaller, $scope) {

  	var self = this;

		self.initHomepage = function() {
			self.getAllTasks();
		};

		self.getAllTasks = function(){
			httpCaller
			.getAllTasks()
			.then(function(data){
				self.taskLists = data;
				console.log(self.taskLists);
			}, function(err){
				console.log(err);
			})
		};

		self.initHomepage();

  })

  .controller('MyCtrl1', function ($scope) {
	// write Ctrl here

  })

  .controller('MyCtrl2', function ($scope) {
	// write Ctrl here

  });
