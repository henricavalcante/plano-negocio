import './plano.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';

import routes from './plano.routes';
import PlanoController from './plano.controller';
import FirebaseFactory from '../../services/firebaseFactory.service';

export default angular.module('app.plano', [angularUiRouter, FirebaseFactory])
    .config(routes)
    .controller('PlanoController', PlanoController)
    .name;
