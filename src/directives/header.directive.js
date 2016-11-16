'use strict';
import angular from 'angular';
import Plano from '../services/plano.service';

function header() {
  const controller = function($scope, $rootScope, $location, $state, Plano) {
    $scope.$location = $location;

    $scope.enviarParaCorrecao = function() {
      const projeto = $rootScope.projeto;
      const uid = $rootScope.currentUser.uid;

      Plano
        .enviarParaCorrecao(projeto, uid)
        .then(() => {
          $rootScope.mensagens.push({
            id: $rootScope.mensagens.length,
            text: 'Seu plano de negócio acaba de ser enviado para a revisão dos especialistas. A ferramenta continuará disponível para visualização, mas ficará bloqueada para edição até que a revisão seja finalizada. Isso poderá levar 7 dias úteis.'
          });

          $scope.$apply();

          $state.go('visualizar');
        })
        .catch((e) => {
          $rootScope.mensagens.push({
            id: $rootScope.mensagens.length,
            text: 'Você deve concluir todas as etapas do plano antes de enviar para correção.'
          });

          $scope.$apply();
        });
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


