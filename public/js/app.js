'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ngRoute'
])
.config(function ($routeProvider, $locationProvider) {

  $routeProvider

    .when('/view1', {
      templateUrl: 'templates/partials/partial1.jade',
      controller: 'MyCtrl1'
    })
    .when('/view2', {
      templateUrl: 'templates/partials/partial2.jade',
      controller: 'MyCtrl2'
    })
    .when('/task', {
      templateUrl: 'templates/taskHome.jade',
      controller: 'taskHomeController',
      controllerAs: 'home'
    });
  $locationProvider.html5Mode(true);
});
