import './login.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';

import routes from './login.routes';
import LoginController from './login.controller';
export default angular.module('app.login', [angularUiRouter])
    .config(routes)
    .controller('LoginController', LoginController)
    .name;
