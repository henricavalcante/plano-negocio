import angular from 'angular';
import './navigation.css';
import FirebaseFactory from '../services/firebaseFactory.service';

function navigation() {
  const navigationController = function($scope, $rootScope, FirebaseFactory) {
    $scope.isActive = function () {
      return FirebaseFactory.getAuth() != undefined;
    };

    Object.assign(this, {$rootScope});
  };

  return {
    restrict: 'E',
    controller: navigationController,
    template: require('./navigation.html')
  };
}

export default angular.module('directives.navigation', [FirebaseFactory])
.directive('navigation', navigation)
.name;
