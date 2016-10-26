import angular from 'angular';
import './navigation.css';

function navigation() {
  const navigationController = function($scope, $rootScope) {
    $scope.isActive = function () {
      return $scope.currentUser != undefined;
    };

    Object.assign(this, {$rootScope});
  };

  return {
    restrict: 'E',
    controller: navigationController,
    template: require('./navigation.html')
  };
}

export default angular.module('directives.navigation', [])
.directive('navigation', navigation)
.name;
