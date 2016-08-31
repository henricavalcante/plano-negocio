
import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
import routes from './logout.routes';
import LogoutController from './logout.controller';

export default angular.module('app.logout', [angularUiRouter])
  .config(routes)
  .controller('LogoutController', LogoutController)
  .name;
