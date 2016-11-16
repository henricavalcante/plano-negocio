'use strict';
import angular from 'angular';

function confirmClick() {
  const link = function (scope, element, attrs) {
    element.bind('click', function (e) {
      var message = attrs.confirmClickMessage ? attrs.confirmClickMessage : 'Você tem certeza?';
      if (confirm(message)) {
        scope.confirmFunction();
      }
    });
  };

  return {
    priority: -1,
    restrict: 'A',
    scope: {
      confirmFunction: '&confirmClick'
    },
    link
  }
}

export default angular.module('directives.confirmClick', [])
  .directive('confirmClick', confirmClick)
  .name;
