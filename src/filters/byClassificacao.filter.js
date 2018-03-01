'use strict';

import angular from 'angular';

function byClassificacao() {

  return (objs, param) => {

    if (!param) return objs;

    return objs.filter((obj) => {
      if (obj.classificacao) {

        let shouldBeListed;

        if (param === 'SEM_CLASSIFICACAO') {
          let hasClassification = false;

          for (let key in obj.classificacao) {
            if (obj.classificacao.hasOwnProperty(key) && obj.classificacao[key]) {
              hasClassification = true;
            }
          }
          shouldBeListed = !hasClassification;
        }
        else {
          shouldBeListed = obj.classificacao[param];
        }

        return shouldBeListed;
      }
    });
  }
}

export default angular.module('filter.byClassificacao', [])
  .filter('byClassificacao', byClassificacao)
  .name;
