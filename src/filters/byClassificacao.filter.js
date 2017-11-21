'use strict';

import angular from 'angular';

function byClassificacao() {

  return (objs, param) => {

    if (!param) return objs;

    return objs.filter((obj) => {
      if (obj.classificacao) {
        return obj.classificacao[param] == true;
      }
    });
  }
}

export default angular.module('filter.byClassificacao', [])
  .filter('byClassificacao', byClassificacao)
  .name;
