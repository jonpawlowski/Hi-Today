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
		/**
		 * store all the errors
		 * **/
		self.errorMessage = [];
		self.serviceIsBusy = false;
		self.newTask = {
			status: '',
			name: '',
			description: '',
			createdBy: ''
		};
		self.updateTask = {};

		self.initHomepage = function() {
			self.getAllTasks();
		};

		self.getAllTasks = function(status){
			self.serviceIsBusy = true;
			httpCaller
				.getAllTasks(status)
				.then(function(data){
					self.taskLists = data;
					self.serviceIsBusy = false;
				}, function(err){
					self.errorMessage.push(err.message);
					self.serviceIsBusy = false;
				})
		};

		self.createNewTask = function(){
      self.serviceIsBusy = true;
			if(self.newTask.status && self.newTask.name){
				httpCaller
					.createNewTask(self.newTask)
					.then(function(data){
						self.taskLists = data;
            self.serviceIsBusy = false;
					}, function(err){
						if(err){
							self.errorMessage.push(err);
              self.serviceIsBusy = false;
						}
					})
			}
		};

		self.deleteTasks = function(parameters){
			if(parameters === 'false' || parameters === 'true'){
				httpCaller
					.deleteTasks({'status': parameters})
					.then(function (data) {
							self.taskLists = data;
					}, function (err) {
						self.errorMessage.push(err.message);
					});
			}else if(parameters){
				httpCaller
					.deleteTasks({'id': parameters})
					.then(function (data) {
						self.taskLists = data;
					}, function(err){
						self.errorMessage.push(err.message);
					});
			}else{
				self.errorMessage.push('Invalid Delete Parameters');
			}
		};

		self.initHomepage();

  })

  .controller('MyCtrl1', function ($scope) {
	// write Ctrl here

  })

  .controller('MyCtrl2', function ($scope) {
	// write Ctrl here

  });
