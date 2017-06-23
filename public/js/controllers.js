"use strict";

/* Controllers */
var angular = angular;

angular.module('myApp.controllers', ['myApp.services'])

.controller('AppCtrl', function ($scope, $http, $location) {
	$scope.hideWelcomeBox = false;
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

.controller('welcomeController', function ($location) {
	var self = this;
	this.gotoAuth = function(){
		$location.path('/auth');
	};
})

.controller('authController', function($rootScope, $scope, $location, hi, httpCaller){
	var self = this;
	self.authForm = {
		key: ''
	};
	self.submitKey = function(){
		httpCaller
			.auth(self.authForm.key)
			.then(function(token){
				$rootScope.token = token;
				$rootScope.auth = true;
				$location.path('/task');
			}, function(err){
				if(err) hi.callToast(err.data);
			});
	};
})

.controller('taskHomeController', function (httpCaller, $scope, hi, $location, $rootScope) {

	var self = this;
	self.taskStatus = {};
	self.auth = $rootScope.auth;
	if($rootScope.token){
		self.token = $rootScope.token.data;
	}

	self.gotoWelcome = function () {
		$location.path('/');
	};

	self.initHomepage = function() {
		self.serviceIsBusy = false;
		self.cleanData();
		self.getAllTasks(self.token);
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
	};

	self.scrollTop = function(){
		window.scrollTo(0, 0);
	};

	self.cleanForm = function () {
		self.showForm = false;
		self.isUpdating = false;
	};

	self.getAllTaskStatus = function(data){
		_.forEach(data, function (value, key) {
			self.taskStatus[value._id] = value.status;
		});
	};

	self.getAllTasks = function(token, status){
		self.serviceIsBusy = true;
		//for tab active status
		self.all = false;
		self.pending = false;
		self.completed = false;
		if(status === undefined){
			self.all = true;
		}else if(status == 'true'){
			self.completed = true;
		}else{
			self.pending = true;
		}
		httpCaller
			.getAllTasks(token, status)
			.then(function(data){
				self.taskLists = data;
				//push all the task status to an object
				self.getAllTaskStatus(data.data);
				self.serviceIsBusy = false;
			}, function(err){
				hi.callToast(err.message);
				self.errorMessage.push(err.message);
				self.serviceIsBusy = false;
			})
	};
	/**
	 * @valid
	 * this is parameter is pass from the frontend code
	 * if the frontend check is pass this will be true,
	 * otherwise false
	 * **/
	self.createNewTask = function(valid){
		self.serviceIsBusy = true;
		if(self.newTask.status && self.newTask.name && valid){
			httpCaller
				.createNewTask(self.token, self.newTask)
				.then(function(data){
					hi.callToast("Create Task Successfully!");
					self.taskLists = data;
					self.serviceIsBusy = false;
					self.cleanData();
					self.cleanForm();
				}, function(err){
					if(err){
						hi.callToast("Create Task Fail");
						self.errorMessage.push(err);
						self.serviceIsBusy = false;
					}
				})
		}else{
			hi.callToast('Please input required information');
			self.errorMessage.push('Please input required information');
			self.serviceIsBusy = false;
		}
	};

	self.showUpdateForm= function(id){
		self.scrollTop();
		//control submit button type
		self.showForm = true;
		self.isUpdating = true;
		_.forEach(self.taskLists.data, function(value, key){
			if(value['_id'] == id){
				/**
				 * Pre-input already existing value
				 * **/
				self.newTask.createdBy = value.createdBy;
				self.newTask.id = value._id;
				self.newTask.name = value.name;
				self.newTask.status = value.status;
				self.newTask.description = value.description;
				self.replace = function(){
					return new Promise(function(resolve, reject){
						if(this.value.indexOf('today')){
							resolve(data);
						}else{
							return self.reject(error);
						}
					})
				}
			}
		});
	};

	/**
	 * @valid
	 * this is parameter is pass from the frontend code
	 * if the frontend check is pass this will be true,
	 * otherwise false
	 * **/
	self.updateTask = function(valid){
		self.serviceIsBusy = true;
		/**
		 * according the newTask object to update the whole task
		 * **/
		if(self.newTask.id && self.newTask !== null && typeof self.newTask == 'object' && valid){
			httpCaller
				.updateTask(self.token, self.newTask.id, self.newTask)
				.then(function(data){
					hi.callToast("Update Task Successfully!");
					self.taskLists = data;
					self.serviceIsBusy = false;
					self.cleanForm();
					self.cleanData();
				}, function(err){
					if(err){
						hi.callToast("Update task fail");
						self.errorMessage.push(err);
						self.serviceIsBusy = false;
					}
				})
		}else{
			hi.callToast('Can not update task, please input required data');
			self.errorMessage.push('Can not update task');
			self.serviceIsBusy = false;
		}
	};

	/**
	 * Logic for complete a task
	 * get the taskId from the template,
	 * according the task list status table to check the task status,
	 * update the status to reverse one,
	 * after fetch data update both tasklist and taskstatus
	 * **/

	self.completeTask = function(taskId){
		_.forEach(self.taskLists.data, function(value, key){
			if(value['_id'] == taskId){
				if(value['status']){
					httpCaller
						.updateTask(self.token, value['_id'], {status: false})
						.then(function(data){
							self.taskLists = data;
							self.taskStatus[value['_id']] = false;
							self.serviceIsBusy = false;
							self.cleanData();
							hi.callToast("Task Reset");
						}, function(err){
							if(err){
								hi.callToast(err);
								self.errorMessage.push(err);
								self.serviceIsBusy = false;
							}
						})
				}else{
					httpCaller
						.updateTask(self.token, value['_id'], {status: true})
						.then(function(data){
							self.taskLists = data;
							self.taskStatus[value['_id']] = true;
							self.serviceIsBusy = false;
							self.cleanData();
							hi.callToast("Task Finished");
						}, function(err){
							if(err){
								hi.callToast(err);
								self.errorMessage.push(err);
								self.serviceIsBusy = false;
							}
						})
				}
			}
		})
	};

	self.deleteTasks = function(parameters){
		self.scrollTop();
		if(parameters === 'false' || parameters === 'true'){
			httpCaller
				.deleteTasks(self.token, {'status': parameters})
				.then(function (data) {
					hi.callToast('Successfully Delete Task!');
					self.taskLists = data;
				}, function (err) {
					hi.callToast(err.message);
					self.errorMessage.push(err.message);
				});
		}else if(parameters){
			httpCaller
				.deleteTasks(self.token, {'id': parameters})
				.then(function (data) {
					hi.callToast('Successfully Delete Task!');
					self.taskLists = data;
				}, function(err){
					hi.callToast(err.message);
					self.errorMessage.push(err.message);
				});
		}else{
			hi.callToast('Invalid Delete Parameters');
			self.errorMessage.push('Invalid Delete Parameters');
		}
	};

	self.showCreateForm = function(){
		self.cleanData();
		self.showForm = true;
		self.isUpdating = false;
	};

	self.initHomepage();

  })

  .controller('MyCtrl1', function ($scope) {
	// write Ctrl here

  })

  .controller('MyCtrl2', function ($scope) {
	// write Ctrl here

  });
