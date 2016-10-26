'use strict';
import angular from 'angular';

function header() {
  const headerController = function($scope, $rootScope, $location) {
    $scope.$location = $location;
  };

  return {
    restrict: 'E',
    controller: headerController,
    template: require('./header.html')
  };
}

export default angular.module('directives.header', [])
  .directive('header', header)
  .name;
