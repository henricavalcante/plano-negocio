'use strict';
import angular from 'angular';
import Plano from '../services/plano.service';
import FirebaseFactory from '../services/FirebaseFactory.service';
import Session from '../services/sessionStorage.service';

function header() {
  const controller = function($scope, $rootScope, $location, $state, Plano, FirebaseFactory, Session) {
    $scope.$location = $location;
    $scope.isNotIframe = self==top;
    $scope.displayName = 'Ferramenta de plano de negócios';
    
    FirebaseFactory.firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        $scope.displayName = currentUser.displayName;
      } else {
        $scope.displayName = 'Ferramenta de plano de negócios';
      }
    });

    $scope.enviarParaCorrecao = function() {
      const projeto = Session.get('projeto');
      const uid = FirebaseFactory.getAuth().uid;

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

export default angular.module('directives.header', [Plano, FirebaseFactory, Session])
  .directive('header', header)
  .name;
