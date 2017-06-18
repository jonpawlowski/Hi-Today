'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ngRoute',
  'ngMaterial',
  'ngMessages'
])
.config(function ($routeProvider, $locationProvider) {

  $routeProvider

    .when('/view1', {
      templateUrl: 'build-templates/partials/partial1.html',
      controller: 'MyCtrl1'
    })
    .when('/view2', {
      templateUrl: 'build-templates/partials/partial2.html',
      controller: 'MyCtrl2'
    })
    .when('/task', {
      templateUrl: 'build-templates/taskHome.html',
      controller: 'taskHomeController',
      controllerAs: 'home'
    })
    .when('/auth', {
      templateUrl: 'build-templates/authentication.html',
      controller: 'authController',
      controllerAs: 'auth'
    })
    .when('/', {
      templateUrl: 'build-templates/welcome.html',
      controller: 'welcomeController',
      controllerAs: 'wel'
    });

  $locationProvider
    .html5Mode({enable: true});
});
