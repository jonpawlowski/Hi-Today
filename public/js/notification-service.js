'use strict';

/**
 *this is a reusable notification system
 * for error, status notifications
 **/

angular
  .module('myApp.services')
  .service('hi', ['$mdToast', hi]);

function hi($mdToast, $scope) {
  /**
   * store the context to self
   * **/
  var self = this;

  self.callToast = function(message){
    if(message){
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .position('top right')
          .hideDelay(6000)
      )
    }
  };

}


