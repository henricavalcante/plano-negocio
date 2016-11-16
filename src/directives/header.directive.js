'use strict';
import angular from 'angular';
import Plano from '../services/plano.service';

function header() {
  const controller = function($scope, $rootScope, $location, Plano) {
    $scope.$location = $location;

    $scope.enviarParaCorrecao = function() {
      const projeto = $rootScope.projeto;
      const uid = $rootScope.currentUser.uid;

      Plano
        .enviarParaCorrecao(projeto, uid);
    }

  };

  return {
    restrict: 'E',
    controller,
    template: require('./header.html')
  };
}

export default angular.module('directives.header', [Plano])
  .directive('header', header)
  .name;


