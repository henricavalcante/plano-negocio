import './reset-password.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
import routes from './reset-password.routes';
import ResetPasswordController from './reset-password.controller';

export default angular.module('app.reset-password', [angularUiRouter])
  .config(routes)
  .controller('ResetPasswordController', ResetPasswordController)
  .name;
