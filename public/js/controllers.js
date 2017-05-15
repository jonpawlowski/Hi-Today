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
			self.serviceIsBusy = false;
			self.cleanData();
			self.getAllTasks();
		};

		self.cleanData = function(){
			self.newTask = {
				status: 'false',
				name: '',
				description: '',
				createdBy: ''
			};
			/**
			 * store all the errors
			 * **/
			self.errorMessage = [];
			self.showForm = false;
			self.isUpdating = false;
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
						self.cleanData();
					}, function(err){
						if(err){
							self.errorMessage.push(err);
              self.serviceIsBusy = false;
						}
					})
			}else{
				self.errorMessage.push('Status and name are missing');
				self.serviceIsBusy = false;
			}
		};

		self.updateTask = function(){
			self.serviceIsBusy = true;
			if(self.newTask.id && self.newTask !== null && typeof self.newTask == 'object'){
				httpCaller
					.updateTask(self.newTask.id, self.newTask)
					.then(function(data){
						self.taskLists = data;
						self.serviceIsBusy = false;
						self.cleanData();
					}, function(err){
						if(err){
							self.errorMessage.push(err);
							self.serviceIsBusy = false;
						}
					})
			}else{
				self.errorMessage.push('Can not update task');
				self.serviceIsBusy = false;
			}
		};

		self.completeTask = function (id) {
			console.log(id);
			_.forEach(self.taskLists.data, function(value, key){
				if(value['_id'] == id){
					self.newTask.status = 'true';
					self.newTask.id = value._id;
					self.updateTask();
				}
			});
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

		self.showCreateForm = function(){
			self.cleanData();
			self.showForm = true;
			self.isUpdating = false;
		};

		self.showUpdateForm= function(id){
			//control submit button type
			self.showForm = true;
			self.isUpdating = true;
			_.forEach(self.taskLists.data, function(value, key){
				if(value['_id'] == id){
					self.newTask.createdBy = value.createdBy;
					self.newTask.id = value._id;
					self.newTask.name = value.name;
					self.newTask.status = value.status;
					self.newTask.description = value.description;
				}
			});
		};

		self.initHomepage();

  })

  .controller('MyCtrl1', function ($scope) {
	// write Ctrl here

  })

  .controller('MyCtrl2', function ($scope) {
	// write Ctrl here

  });
