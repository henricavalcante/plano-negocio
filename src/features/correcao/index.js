import './correcao.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
import routes from './correcao.routes';
import CorrecaoController from './correcao.controller';

export default angular.module('app.correcao', [angularUiRouter])
  .config(routes)
  .controller('CorrecaoController', CorrecaoController)
  .name;
