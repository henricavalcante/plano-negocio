'use strict';

import './messages.css';
import angular from 'angular';

function messages($rootScope, $timeout) {
  $rootScope.mensagens = [];

  $rootScope.addMensagem = (text, type = 'info', delay = 6) => {
    let mensagem = {
      id: $rootScope.mensagens.length,
      text: text,
      type: `alert-${type}`
    };

    $rootScope.mensagens.push(mensagem);

    $timeout(function () {
      $rootScope.removerMensagem(mensagem);
    }, delay * 1000);
  };

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
