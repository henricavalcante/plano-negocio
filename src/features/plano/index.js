import './plano.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';

import routes from './plano.routes';
import PlanoController from './plano.controller';
export default angular.module('app.plano', [angularUiRouter])
    .config(routes)
    .controller('PlanoController', PlanoController)
    .name;
