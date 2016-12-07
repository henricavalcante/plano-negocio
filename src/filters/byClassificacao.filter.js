'use strict';

import angular from 'angular';

function byClassificacao() {

  return (objs, param) => {

    return objs.filter((obj) => {
      return obj[param] == true || param == null;
    });
  }
}

export default angular.module('filter.byClassificacao', [])
  .filter('byClassificacao', byClassificacao)
  .name;
