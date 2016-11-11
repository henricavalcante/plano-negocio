import './plano.css';

import angular from 'angular';
import angularUiRouter from 'angular-ui-router';

import routes from './plano.routes';
import PlanoController from './plano.controller';
import FirebaseFactory from '../../services/firebaseFactory.service';

import mask from 'angular-input-masks';
import '../../services/locale.service';


export default angular.module('app.plano', [angularUiRouter, FirebaseFactory, mask])
    .config(routes)
    .controller('PlanoController', PlanoController)
    .name;
