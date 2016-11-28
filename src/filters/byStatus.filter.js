'use strict';

import angular from 'angular';

function byStatus() {

  return (objs, param) => {

    return objs.filter((obj) => {
      return obj.statusKey == param || param == null;
    });
  }
}

export default angular.module('filter.byStatus', [])
  .filter('byStatus', byStatus)
  .name;
