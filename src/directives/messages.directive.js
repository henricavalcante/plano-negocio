'use strict';
import angular from 'angular';

function messages() {
  return {
    restrict: 'E',
    template: require('./messages.html')
  };
}

export default angular.module('directives.messages', [])
  .directive('messages', messages)
  .name;
