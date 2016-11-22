import angular from 'angular';
import './revisao.css'

function revisao() {
  const controller = function($scope, $rootScope, $location) {
    Object.assign(this, {$scope, $rootScope});
  }

  return {
    restrict: 'E',
    controller,
    template: require('./revisao.html'),
    scope: {text: '='}
  };
}

export default angular.module('directives.revisao', [])
.directive('revisao', revisao)
.name;
