'use strict';
import angular from 'angular';
import './subheader.css'

function subheader() {
  return {
    restrict: 'E',
    transclude: true,
    template: require('./subheader.html')
  };
}

export default angular.module('directives.subheader', [])
  .directive('subheader', subheader)
  .name;
