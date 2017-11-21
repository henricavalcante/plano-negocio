import './lista.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
import routes from './lista.routes';
import ListaController from './lista.controller';

export default angular.module('app.lista', [angularUiRouter])
  .config(routes)
  .controller('ListaController', ListaController)
  .name;
