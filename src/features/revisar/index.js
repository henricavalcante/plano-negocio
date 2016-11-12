import './revisar.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
import routes from './revisar.routes';
import RevisarController from './revisar.controller';

export default angular.module('app.revisao', [angularUiRouter])
  .config(routes)
  .controller('RevisarController', RevisarController)
  .name;
