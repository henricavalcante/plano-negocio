'use strict';
import angular from 'angular';

function messages($rootScope) {
  $rootScope.mensagens = [];

  $rootScope.removerMensagem = (mensagem) => {
    $rootScope.mensagens = $rootScope.mensagens.filter((_mensagem) => {
      return _mensagem.id != mensagem.id;
    });
  };

  return {
    restrict: 'E',
    template: require('./messages.html')
  };
}

export default angular.module('directives.messages', [])
  .directive('messages', messages)
  .name;
