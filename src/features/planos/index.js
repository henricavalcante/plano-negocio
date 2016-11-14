import './planos.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
import routes from './planos.routes';
import CorrecaoController from './planos.controller';

export default angular.module('app.planos', [angularUiRouter])
  .config(routes)
  .controller('PlanosController', CorrecaoController)
  .name;
