import './listaPublica.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
import routes from './listaPublica.routes';
import ListaPublicaController from './listaPublica.controller';

export default angular.module('app.listaPublica', [angularUiRouter])
  .config(routes)
  .controller('ListaPublicaController', ListaPublicaController)
  .name;
